import { AuthenticationLevel } from "./+types";

export function authLevelMatcherFactory(level: AuthenticationLevel) {
  return (toMatch: AuthenticationLevel) => {
    return (level & toMatch) === toMatch;
  };
}

export const toBase64 = globalThis.btoa
  ? globalThis.btoa.bind(globalThis)
  : (data: string) => Buffer.from(data).toString("base64");
export const fromBase64 = globalThis.atob
  ? globalThis.atob.bind(globalThis)
  : (data: string) => Buffer.from(data, "base64").toString();
