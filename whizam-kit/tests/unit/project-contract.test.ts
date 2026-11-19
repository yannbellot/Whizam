import { describe, expect, test } from 'vitest'
import { projectInputSchema } from '../../app/features/projects/project-contract'
import {
  assertLocalRequest,
  parseProjectId,
  readProjectForm,
} from '../../app/features/projects/project-http.server'

const url = 'http://127.0.0.1:3456/projects/new'
const request = (body: string, headers: Record<string, string> = {}, method = 'POST') =>
  new Request(url, {
    method,
    headers: {
      Origin: 'http://127.0.0.1:3456',
      'Content-Type': 'application/x-www-form-urlencoded',
      ...headers,
    },
    body: method === 'GET' ? undefined : body,
  })

describe('project input and HTTP boundaries', () => {
  test('trims text and preserves literal markup', () =>
    expect(
      projectInputSchema.parse({ name: '  Essai  ', description: ' <script>text</script> ' }),
    ).toEqual({ name: 'Essai', description: '<script>text</script>' }))
  test.each([
    { name: ' ', description: '' },
    { name: 'x'.repeat(101), description: '' },
    { name: 'Valid', description: 'x'.repeat(2001) },
    { name: 'Valid', description: '', id: 'untrusted' },
  ])('rejects invalid or extra input', (input) =>
    expect(projectInputSchema.safeParse(input).success).toBe(false),
  )
  test('refuses invalid identifiers and foreign hosts before database use', () => {
    expect(() => parseProjectId('invalid')).toThrow(Response)
    expect(() => assertLocalRequest(new Request('http://foreign.invalid/projects'))).toThrow(
      Response,
    )
  })
  test('returns submitted values and field errors for a normal invalid form', async () => {
    const result = await readProjectForm(request('name=+++&description=retained'))
    expect(result.parsed.success).toBe(false)
    expect(result.errors.name).toBe('Saisissez un nom.')
    expect(result.values.description).toBe('retained')
  })
  test.each([
    ['name=Valid', { Origin: 'http://foreign.invalid' }, 'POST', 403],
    ['name=Valid', { Origin: '' }, 'POST', 403],
    ['name=Valid', { 'Sec-Fetch-Site': 'cross-site' }, 'POST', 403],
    ['name=Valid', { 'Content-Type': 'application/json' }, 'POST', 415],
    ['name=A&name=B', {}, 'POST', 400],
    ['name=A&id=forged', {}, 'POST', 400],
    ['', {}, 'GET', 405],
    ['name=' + 'x'.repeat(17000), {}, 'POST', 413],
  ] as const)('rejects unsafe requests', async (body, headers, method, status) => {
    await expect(readProjectForm(request(body, headers, method))).rejects.toMatchObject({ status })
  })
})
