import test from "node:test";
import assert from "node:assert/strict";
import { readJson } from "../lib/http.js";
const request = (body) =>
  new Request("http://localhost/api/groups", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body,
  });
test("JSON parser handles valid, malformed, and oversized requests", async () => {
  assert.deepEqual((await readJson(request('{"name":"Trip"}'))).data, {
    name: "Trip",
  });
  assert.equal((await readJson(request("{"))).response.status, 400);
  assert.equal(
    (await readJson(request("x".repeat(16385)))).response.status,
    413,
  );
  assert.equal(
    (
      await readJson(
        new Request("http://localhost", { method: "POST", body: "hello" }),
      )
    ).response.status,
    415,
  );
});
