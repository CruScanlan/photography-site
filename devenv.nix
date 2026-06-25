{ pkgs, ... }:

{
  # Dev dependencies for the photography site (Next.js + TypeScript).

  languages.javascript = {
    enable = true;
    package = pkgs.nodejs_22;

    # Yarn classic (lockfile v1) is used to manage node deps.
    yarn = {
      enable = true;
      install.enable = true; # run `yarn install` on shell entry
    };
  };

  packages = [
    pkgs.stripe-cli # for `yarn stripe-litsen` webhook forwarding
  ];

  # `sharp` and `plaiceholder` build against libvips.
  env.SHARP_IGNORE_GLOBAL_LIBVIPS = "1";

  scripts.dev.exec = "yarn dev";

  enterShell = ''
    echo "node $(node --version) | yarn $(yarn --version)"
  '';
}
