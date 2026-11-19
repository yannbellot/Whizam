export function synchronize(
  root: string,
  options?: { check?: boolean },
): Promise<{ count: number; outputs: number }>
export function recoverGeneration(root: string): Promise<{ count: number; outputs: number }>
