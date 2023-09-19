{
  description = "";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
    rust-overlay.url = "github:oxalica/rust-overlay";
  };

  outputs = { self, nixpkgs, flake-utils, rust-overlay }:
    flake-utils.lib.eachDefaultSystem(system:
      let
        overlays = [ (import rust-overlay) ];
        pkgs = import nixpkgs {
          inherit system overlays;
        };
        common = with pkgs; [
          webkitgtk
          gtk3
          glib
          dbus
          openssl_3
          librsvg
        ];
        libraries = with pkgs; [
          cairo
          gdk-pixbuf
        ] ++ common;
        packages = with pkgs; [
          curl
          wget
          pkg-config
          libsoup
        ] ++ common;
      in
      with pkgs;
      {
        devShells.default = pkgs.mkShell rec {
          buildInputs = [
            (rust-bin.stable.latest.default.override {
              extensions = [ "rust-src" ];
            })
            nodejs_20
            nodePackages.pnpm
          ] ++ packages;

          LD_LIBRARY_PATH = pkgs.lib.makeLibraryPath libraries;

          WEBKIT_DISABLE_COMPOSITING_MODE = 1;
          GDK_BACKEND="x11";
          RUST_BACKTRACE = "full";
        };
      }
    );
}
