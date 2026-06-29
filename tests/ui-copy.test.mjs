import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("initial feedback label says start", () => {
  const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");

  assert.match(html, /<div class="feedback" id="feedback">开始<\/div>/);
  assert.doesNotMatch(html, /等待开始/);
});
