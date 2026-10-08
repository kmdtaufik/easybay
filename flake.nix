{
  description = "EasyCMS Monorepo Environment (Tauri v2 + Bun + Hono)";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils = {
      url = "github:numtide/flake-utils";
    };
    antigravity-nix = {
      url = "github:jacopone/antigravity-nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = {
    self,
    nixpkgs,
    flake-utils,
    antigravity-nix,
  }:
    flake-utils.lib.eachDefaultSystem (
      system: let
        pkgs = import nixpkgs {
          inherit system;
          config.allowUnfree = true;
        };
      in {
        devShells.default = pkgs.mkShell {
          # nativeBuildInputs are tools executed on the host machine during the build
          nativeBuildInputs = with pkgs; [
            pkg-config
            wrapGAppsHook4
            cargo
            rustc
            rustup
            # cargo-tauri
            bun
            nodejs # Required by Tauri's internal build scripts even when using Bun
            antigravity-nix.packages.${system}.google-antigravity-ide
          ];

          # buildInputs are libraries linked against the final binary
          buildInputs = with pkgs; [
            librsvg
            webkitgtk_4_1
            openssl
            libayatana-appindicator
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
