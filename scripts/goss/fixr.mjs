#!/usr/bin/env zx
import { spinner } from "zx/experimental";
import { log } from "zx/core";

let cmdCount = 0;

$.log = (entry) => {
  switch (entry.kind) {
    case "cmd":
      // for example, apply custom data masker for cmd printing
      cmdCount += 1;
      break;
    default:
      log(entry);
  }
};
$.prefix = "set -euo pipefail; direnv exec /home/jmccown ";
try {
  let p;
  await spinner("Running tests", () => {
    p = $`s goss run-in-order-vanilla ~/.config/goss`;
    return p;
  });
  // TODO: need to parse output to determine if fixes needed
  // await spinner("Running fixes", () => p.pipe($`s goss autofix-input`));
} catch (err) {
  echo(`Got error: ${err}`);
  $`s goss fixr.mjs`;
}

// testresults=$(cat /dev/stdin)
// # NOTE how do I fix files? since the exists check fails first, I don't know if I can just make a symlink here
// cmdz=$(
// 	(
// 		jq -r '.results
//    		| map(select(.successful | not))
// 		| map(select(.meta!=null))
// 		| map(.meta)
// 		| map(select(.fix!=null))
// 		| .[]
// 		| if (.fix | type)=="array" then .fix else [.fix] end
// 		| .[]' <<<"$testresults"
// 		# autofix missing pkgs
// 		jq -r '.results | map(select((.successful | not) and ."resource-type" == "Package" and .property == "installed"))[]."resource-id"' <<<"$testresults" | rg -v '^\s*$' | xargs --no-run-if-empty -n 1 printf "s util syspkg-install %s\n"
// 		# autofix groups
// 		jq -r '.results
//    		| map(select((.successful | not) and ."resource-type" == "User" and .property == "groups"))[]
// 		| "\(.expected | first | fromjson | join(",")) \(."resource-id")"' <<<"$testresults" | xargs --no-run-if-empty -d $'\n' -n 1 printf "sudo usermod --append --groups %s\n"
// 		# autofix services
// 		jq -r '.results | map(select((.successful | not) and ."resource-type" == "Service" and .property == "running"))[]."resource-id"' <<<"$testresults" | xargs --no-run-if-empty -n 1 printf "sudo systemctl restart %s.service\n"
// 	) | rg -v '^\s*$' | uniq
// )

// if [[ -z "$cmdz" ]]; then
// 	echo "nothing to fix"
// 	exit 2
// fi

// echo "Running..."
// echo $cmdz
// bash -l <(echo "$cmdz")

// Local Variables:
// mode: js2
// End:
