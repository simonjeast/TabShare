import { randomBytes } from "node:crypto";

// A group URL is a bearer credential. 192 random bits prevent enumeration.
export function createGroupSlug() {
  return `g-${randomBytes(24).toString("base64url")}`;
}
export function isPrivateGroupSlug(slug) {
  return typeof slug === "string" && /^g-[A-Za-z0-9_-]{32}$/.test(slug);
}
