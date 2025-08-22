import { describe, it, expect } from "vitest";
import type { IncomingHttpHeaders } from "http";
import { getAPIKey } from "../api/auth"; // <-- update path if needed

const headers = (authorization?: string | string[]): IncomingHttpHeaders =>
  authorization !== undefined ? { authorization } : {};

describe("getAPIKey", () => {
  it('returns the key when scheme is "ApiKey" and token is present', () => {
    const h = headers("ApiKey abc123");
    expect(getAPIKey(h)).toBe("abc123");
  });

  it("returns null when authorization header is missing", () => {
    const h = headers();
    expect(getAPIKey(h)).toBeNull();
  });

  it('returns null when scheme is not "ApiKey"', () => {
    const h = headers("Bearer abc123");
    expect(getAPIKey(h)).toBeNull();
  });

  it('returns null when "ApiKey" has no token', () => {
    const h = headers("ApiKey");
    expect(getAPIKey(h)).toBeNull();
  });

  it('is case-sensitive for the scheme (lowercase "apikey" returns null)', () => {
    const h = headers("apikey abc123");
    expect(getAPIKey(h)).toBeNull();
  });

  it("returns empty string if multiple spaces cause an empty token slot (current behavior)", () => {
    const h = headers("ApiKey    abc123");
    // split(" ") produces ["ApiKey", "", "", "", "abc123"]; function returns splitAuth[1] === ""
    expect(getAPIKey(h)).toBe("");
  });

  // Optional: document current behavior if authorization is provided as an array.
  // Node's IncomingHttpHeaders allows string | string[]. The current implementation
  // does not handle arrays and would throw at runtime if an array is passed.
  it("does not support array-valued authorization headers (documented behavior)", () => {
    const h = headers(["ApiKey abc123", "ApiKey def456"]);
    // Accessing .split on a string[] would throw; ensure the function does not crash silently.
    expect(() => getAPIKey(h)).toThrow();
  });
});
