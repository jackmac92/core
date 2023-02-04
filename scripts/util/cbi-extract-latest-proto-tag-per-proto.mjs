#!/usr/bin/env zx
import _ from "lodash";

const allTags = await $`git tag --list`.quiet();

const tags = allTags
  .toString()
  .split("\n")
  .filter((t) => t.includes("/"))
  .filter((t) => !t.includes("beta"))
  .filter((t) => !t.endsWith("-dev"))
  .filter((t) => !t.endsWith("-stg"))
  .filter((t) => {
    const [_, version] = t.split("/");
    return version.split(".").length === 3;
  });

const x = _.groupBy(tags, (t) => t.split("/")[0]);
Object.keys(x).forEach((k) => {
  x[k] = _.max(x[k], (t) => t.split("/")[1]).split("/")[1];
});

const latestProtos = Object.keys(x).map((k) => `${k}/${x[k]}`);

latestProtos.map((t) => {
  $`lab ci create ${t}`;
});

// Local Variables:
// mode: js2
// End:
