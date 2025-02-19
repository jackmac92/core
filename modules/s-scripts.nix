{ config, lib, pkgs, ... }:

with lib;

let
  scriptsPath = config.sScripts.scriptsPath;
in
{
  options.sScripts = {
    enable = mkEnableOption "Enable integration with s-scripts";
    scriptsPath = mkOption {
      type = types.str;
      default = "${pkgs.stdenv.mkPath "/home/your-username/.local/s-scripts"}";
      description = "Path to the s-scripts directory.";
    };
    runScripts = mkOption {
      type = types.listOf types.str;
      default = [];
      description = "List of s-scripts to run during configuration build.";
    };
  };

  config = mkIf config.sScripts.enable {
    environment.systemPackages = [ (pkgs.callPackage "${scriptsPath}/bin/s" {}) ];

    home.activation.sScripts = lib.hm.dag.entryAfter [ "environment" ] "sScripts" ''
      for script in ${lib.concatMapStringsSep " " config.sScripts.runScripts}; do
        ${scriptsPath}/bin/s "$script"
      done
    '';
  };
}
