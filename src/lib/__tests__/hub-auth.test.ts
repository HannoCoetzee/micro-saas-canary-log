import { describe, it, expect } from "vitest";
import { readHubCookie, planIncludesProduct } from "../hub-auth";

describe("readHubCookie", () => {
  it("reads a cookie value from a header string", () => {
    expect(readHubCookie("foo=bar; hub_session=abc123", "hub_session")).toBe("abc123");
  });

  it("returns null when the cookie is absent", () => {
    expect(readHubCookie("foo=bar", "hub_session")).toBeNull();
  });

  it("preserves '=' characters inside the value", () => {
    expect(readHubCookie("hub_session=a=b=c", "hub_session")).toBe("a=b=c");
  });
});

describe("planIncludesProduct", () => {
  const tiers = { free: ["canary"], pro: ["canary", "snapshot"] };

  it("returns true when the product is in the tier", () => {
    expect(planIncludesProduct("pro", "snapshot", tiers)).toBe(true);
  });

  it("returns false when the product is not in the tier", () => {
    expect(planIncludesProduct("free", "snapshot", tiers)).toBe(false);
  });

  it("is case-insensitive on the plan name", () => {
    expect(planIncludesProduct("PRO", "snapshot", tiers)).toBe(true);
  });

  it("returns false for unknown plans", () => {
    expect(planIncludesProduct("enterprise", "canary", tiers)).toBe(false);
  });
});
