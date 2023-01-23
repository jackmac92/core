#!/usr/bin/env zx
import { retry, expBackoff } from "zx/experimental";

const p = $`s goss run-in-order ~/.config/goss`;

const gossAutoFix = (resultSet) => {};

p.catch((errs) => {
  echo("Found some problems");
  $`s goss autofix-input <<<${errs}`;
});

// await spinner('working...', () => $`sleep 99`)

// if [[ $o -ne 0 ]]; then
//     # TODO check if any of the errors have an autofix
//     # if none do then exit non 0
//     echo "Something borked, trying to fix and then rerunning goss fixer (unless fixing fails)"
//     s goss autofix-input <<<"$errs" && s goss fix-all-in-order
//     sleep 1
//     tput rc
//     tput ed
// fi

const testResults = await stdin();
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
