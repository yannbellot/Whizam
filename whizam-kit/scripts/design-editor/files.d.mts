export function privateDir(directory: string): Promise<void>
export function readSafe(
  root: string,
  file: string,
  limit?: number,
): Promise<{ bytes: Buffer; hash: string; dev: number; ino: number; mode: number }>
export function durableReplace(
  root: string,
  file: string,
  bytes: Buffer,
  mode?: number,
): Promise<void>
export function syncDir(directory: string): Promise<void>
export function checkParents(root: string, file: string): Promise<void>
export function hash(bytes: string | Buffer): string
export function identity(stat: { dev: number; ino: number; mode: number }): {
  dev: number
  ino: number
  mode: number
}
export function sameIdentity(
  a: { dev: number; ino: number; mode: number },
  b: { dev: number; ino: number; mode: number },
): boolean
