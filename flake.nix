{
  description = "EasyCMS Monorepo Environment (Tauri v2 + Bun + Hono)";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils = {
      url = "github:numtide/flake-utils";
    };
  };

  outputs = {
    self,
    nixpkgs,
    flake-utils,
  }:
    flake-utils.lib.eachDefaultSystem (
      system: let
        pkgs = import nixpkgs {
          inherit system;
          config.allowUnfree = true;
        };
      in {
        devShells.default = pkgs.mkShell {
          nativeBuildInputs = with pkgs; [
            bun
            nodejs # Required by Tauri's internal build scripts even when using Bun
          ];

          shellHook = ''
            # Needed on Wayland/Hyprland to report the correct display scale and prevent rendering crashes
            export XDG_DATA_DIRS="$GSETTINGS_SCHEMAS_PATH"

            echo "🚀 EasyCMS Nix Environment Loaded!"
            echo "🥟 Bun, 🦀 Rust, and 🖥️ Tauri v2 dependencies are ready."
          '';
        };
      }
    );
}
