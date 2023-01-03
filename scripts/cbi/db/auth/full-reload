#!/usr/bin/env zx

await Promise.all(
  ["dev", "stg", "prd"].reduce(
    (acc, env) =>
      acc.concat(
        ["main", "auth", "table"].map(
          (db) => $`s cbi db auth regen-if-expired "${env}" "${db}"`
        )
      ),
    []
  )
);

await $`bw sync`
