{ config, lib, pkgs, ... }:

with lib;

let
  scriptsPaths = config.sScripts.scriptsPaths;
  getScriptPath = scriptName: lib.head (lib.filter (path: lib.fileExists (path + "/bin/" + scriptName)) scriptsPaths);
in
{
  options.sScripts = {
    enable = mkEnableOption "Enable integration with s-scripts";
    scriptsPaths = mkOption {
      type = types.listOf types.str;
      default = lib.mkDefault (builtins.splitString ":" (builtins.getEnv "S_SCRIPTS_PATH"));
      description = "List of paths to s-scripts directories, read from the S_SCRIPTS_PATH environment variable.";
    };
    runScripts = mkOption {
      type = types.listOf types.str;
      default = [];
      description = "List of s-scripts to run during configuration build.";
    };
  };

  config = mkIf config.sScripts.enable {
    environment.systemPackages = lib.concatMap (path: [ (pkgs.callPackage (path + "/bin/s") {}) ]) scriptsPaths;

    home.activation.sScripts = lib.hm.dag.entryAfter [ "environment" ] "sScripts" ''
      for script in ${lib.concatMapStringsSep " " config.sScripts.runScripts}; do
        ${scriptsPaths}/bin/s "$script"
      done
    '';
  };
      getScriptPath = scriptName: lib.head (lib.filter (path: lib.fileExists (path + "/bin/" + scriptName)) scriptsPaths);
}
