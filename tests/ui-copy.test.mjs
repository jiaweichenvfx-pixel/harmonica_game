import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("initial feedback label says start", () => {
  const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");

  assert.match(html, /<div class="feedback" id="feedback">开始<\/div>/);
  assert.doesNotMatch(html, /等待开始/);
});

test("score stylesheet lays out four bars per desktop row", () => {
  const css = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");

  assert.match(css, /\.score-row\s*\{[^}]*grid-template-columns:\s*repeat\(4,\s*minmax\(140px,\s*1fr\)\)/s);
  assert.match(css, /@media \(max-width:\s*640px\)[\s\S]*?\.score-row\s*\{[^}]*repeat\(2,\s*minmax\(150px,\s*1fr\)\)/s);
  assert.match(css, /@media \(max-width:\s*420px\)[\s\S]*?\.score-row\s*\{[^}]*grid-template-columns:\s*1fr/s);
});
