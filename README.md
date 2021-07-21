# `s` scripts

## what it is
Hopefully a way to make small scripts easier to share/discover. It was [inspired by this blog post](https://ianthehenry.com/posts/sd-my-script-directory/), with a few important upgrades

## features
#### dumb easy completion help
If a script has a sibling with the same name and a `.help` extension. The help file will be read as text and the contents written as a help message for tab completion

#### quickly create a script from the last executed command

``` sh
docker exec important-container | xargs oh-wow-i-wanna-remember-this | awk "?"
>>> ...output
s new misc impt-dcker-cmd -- !:q
```
`new` will accept everything after `--` as the script body. And `!:q` will perfectly quote the previous command so it is not executed, but passed to `new`

#### multiple script dirs

#### meta scripts
- `s meta last-invoked`
- `s meta last-completed`
- `s meta has-never-run`
- `s meta dangling-docs` shows `.help` files without a script

## installation
1. put the main `s` script somewhere in your `PATH` and make it executable
2. Put the completion script `_s`... somewhere. [Read below](#how-to-setup-shell-completion)


### dependencies
- jq
- yq
- fd
- rg
- fzf
- sd
- grpcurl
- moreutils # (vipe, sponge)

### how to setup shell completion
shell completion provides most of the benefit of using this, and it can be a little tricky to setup correctly.

1. Copy zsh-completions/_cbisd to /usr/share/zsh/vendor-completions/_cbisd
2. In your zsh config, set the following before zsh runs `compinit` (which means just put it at the top of your `.zshrc`)

``` sh
fpath=($fpath /usr/share/zsh/vendor-completions)
```

3. After making the above change to .zshrc, open a *new* shell. And run `rm -f ~/.zcompdump; compinit`
4. To test that it worked correctly, run `cat ~/.zcompdump | grep _cbisd`, you should be all set if that exits 0
