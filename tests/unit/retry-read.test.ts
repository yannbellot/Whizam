import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { retryRead } from '../../src/design-system/editor/snapshot'
beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())
test('temporary failures recover silently', async () => {
  const read = vi.fn().mockRejectedValueOnce(new Error('503')).mockResolvedValue('valid')
  const result = retryRead(read)
  await vi.advanceTimersByTimeAsync(1000)
  expect(await result).toBe('valid')
  expect(read).toHaveBeenCalledTimes(2)
})
test('persistent failure requires five seconds and multiple attempts', async () => {
  const read = vi.fn().mockRejectedValue(new Error('unavailable'))
  const result = expect(retryRead(read)).rejects.toThrow('unavailable')
  await vi.advanceTimersByTimeAsync(4999)
  expect(read).toHaveBeenCalledTimes(5)
  await vi.advanceTimersByTimeAsync(1)
  await result
  expect(read).toHaveBeenCalledTimes(6)
})
test('superseded response never publishes', async () => {
  let finish: (value: string) => void = () => {},
    current = true
  const pending = retryRead(
    () =>
      new Promise<string>((resolve) => {
        finish = resolve
      }),
    () => current,
  )
  current = false
  const rejected = expect(pending).rejects.toMatchObject({ name: 'AbortError' })
  finish('obsolete')
  await rejected
})
