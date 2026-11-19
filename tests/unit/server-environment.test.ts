import { describe, expect, it, vi } from 'vitest'
import { readDatabaseUrl, readServerEnvironment, readServerHost } from '../../app/server/env.server'
import { loader } from '../../app/routes/health'

describe('server configuration boundary', () => {
  it('binds to loopback unless an explicit container context is provided', () => {
    expect(readServerHost({})).toBe('127.0.0.1')
    expect(readServerHost({ HOST: '0.0.0.0', ADL_CONTAINER: '1' })).toBe('0.0.0.0')
    expect(() => readServerHost({ HOST: '0.0.0.0' })).toThrow('HOST')
    expect(() => readServerHost({ HOST: 'example.invalid' })).toThrow('HOST')
  })
  it('requires a PostgreSQL URL without including an invalid value in its diagnostic', () => {
    expect(() => readDatabaseUrl({})).toThrow('DATABASE_URL')
    expect(() => readDatabaseUrl({ DATABASE_URL: 'fixture-private-text' })).toThrow(
      'DATABASE_URL manquante ou invalide',
    )
    expect(() => readDatabaseUrl({ DATABASE_URL: 'https://example.invalid' })).toThrow(
      'DATABASE_URL',
    )
    expect(() => readDatabaseUrl({ DATABASE_URL: 'postgresql://127.0.0.1/fixture' })).toThrow(
      'DATABASE_URL',
    )
    // Synthetic parser fixture only; no connection is made with this value.
    expect(
      readDatabaseUrl({ DATABASE_URL: 'postgresql://fixture:synthetic-only@127.0.0.1/fixture' }),
    ).toBe('postgresql://fixture:synthetic-only@127.0.0.1/fixture')
  })
  it('uses documented local defaults', () => {
    expect(readServerEnvironment({})).toEqual({ NODE_ENV: 'development', PORT: 3000 })
  })

  it('accepts a valid production configuration', () => {
    expect(readServerEnvironment({ NODE_ENV: 'production', PORT: '4187' })).toEqual({
      NODE_ENV: 'production',
      PORT: 4187,
    })
  })

  it.each(['', '0', '65536', '-1', '3.5', 'invalid'])('rejects invalid port %j', (PORT) => {
    expect(() => readServerEnvironment({ PORT })).toThrow('PORT')
  })

  it('rejects unknown environments without including the submitted value', () => {
    expect(() => readServerEnvironment({ NODE_ENV: 'fixture-private-text' })).toThrow(
      'Configuration serveur invalide : NODE_ENV',
    )
    try {
      readServerEnvironment({ NODE_ENV: 'fixture-private-text' })
    } catch (error) {
      expect(String(error)).not.toContain('fixture-private-text')
    }
  })

  it('returns only liveness with no cache, without environment values', async () => {
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('PORT', '4187')
    const response = loader()
    expect(response.status).toBe(200)
    expect(response.headers.get('Cache-Control')).toBe('no-store')
    expect(await response.json()).toEqual({ status: 'ok' })
  })

  it('fails closed when the server environment is invalid', () => {
    vi.stubEnv('NODE_ENV', 'invalid')
    expect(() => loader()).toThrow('Configuration serveur invalide : NODE_ENV')
  })
})
