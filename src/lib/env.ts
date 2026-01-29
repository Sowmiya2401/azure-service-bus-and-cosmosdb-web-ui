export function getEnv(...names: string[]): string | undefined {
  for (const name of names) {
    const v = process.env[name];
    if (v !== undefined && v !== "") return v;
  }
  return undefined;
}

export function getEnvRequired(...names: string[]): string {
  const v = getEnv(...names);
  if (v === undefined) {
    throw new Error(`Missing required environment variable. Set one of: ${names.join(", ")}`);
  }
  return v;
}
