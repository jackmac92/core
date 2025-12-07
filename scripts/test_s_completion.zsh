#!/usr/bin/env zsh
# Usage: ./scripts/test_s_completion.zsh "<command-line-prefix>"
autoload -U compinit
compinit -u
source completion/_s

if (( $# != 1 )); then
  echo "Usage: $0 \"<prefix>\""
  exit 1
fi

# split the given prefix into words the way zsh would
words=(${(@z)1})
# the cursor is always at the end, so CURRENT == number of words + 1
(( CURRENT = ${#words} + 1 ))

# clear any prior completions
reply=()

# invoke the _s completer
_s

# print each returned completion
printf "%s\n" "${reply[@]}"
