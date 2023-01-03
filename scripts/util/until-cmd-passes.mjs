#!/usr/bin/env zx
import getArgs from "/home/jmccown/.local/libs/zx/args.mjs";

const cmd = getArgs(__filename);

const MAX_TRIES_N = 10000;
const INTER_ATTEMPT_WAIT_MS = 1500;

const numTries = process.argv["max-times"] || MAX_TRIES_N;

let final;
let i = 0;
while (true) {
  if (i >= MAX_TRIES_N) {
    throw Error("Too many attempts!");
  }
  i += 1;
  try {
    let p = $`${cmd}`;
    if (process.argv.quiet) {
      p.quiet();
    }
    await p;
    break;
  } catch (e) {
    if (process.argv.showErrors || process.env.UNTIL_CMD_LOG_ERRORS) {
      console.log(`err[${i}]... retrying in ${INTER_ATTEMPT_WAIT_MS}ms`);
    }
    await sleep(INTER_ATTEMPT_WAIT_MS);
  }
}

try {
  for (const chunk of p.stdout) {
    echo(chunk);
  }
} catch (e2) {
  // echo`ignored error printing the final output`
}

// Local Variables:
// mode: js2
// End:
