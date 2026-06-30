import assert from "node:assert/strict";
import test from "node:test";

import { BLUES_SHUFFLE_RIFF } from "../src/freestyle/blues-shuffle.js";
import { getScoreRows } from "../src/ui/render-freestyle.js";

test("groups freestyle score bars into four-bar display rows", () => {
  const rows = getScoreRows(BLUES_SHUFFLE_RIFF, 4);

  assert.equal(rows.length, 1);
  assert.deepEqual(
    rows[0].map((bar) => bar.chord),
    ["C7", "F7", "C7", "G7"],
  );
});
