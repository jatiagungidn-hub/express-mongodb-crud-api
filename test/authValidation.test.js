const test = require("node:test");
const assert = require("node:assert/strict");
const { registerSchema } = require("../validators/userValidator");

test("register schema should reject a client-supplied role value", () => {
  assert.throws(
    () =>
      registerSchema.parse({
        name: "Alice Example",
        username: "alice",
        email: "alice@example.com",
        password: "password123",
        role: "admin",
      }),
    (error) => {
      return (
        error instanceof Error &&
        "issues" in error &&
        Array.isArray(error.issues) &&
        error.issues.some(
          (issue) =>
            issue.code === "unrecognized_keys" &&
            Array.isArray(issue.keys) &&
            issue.keys.includes("role"),
        )
      );
    },
  );
});
