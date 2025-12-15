---
title: Install on NixOS
seo:
  title: Install on NixOS
---

## Home Manager Module

1. Add clrsync to your flake inputs

```nix
{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    home-manager.url = "github:nix-community/home-manager";
    
    clrsync.url = "github:obsqrbtz/clrsync";
  };
}
```

2. Add clrsync to flake outputs

```nix
outputs =
  {
    self,
    nixpkgs,
    home-manager,
    clrsync,
    ...
  }@inputs:
  let
    system = "x86_64-linux";
    pkgs = nixpkgs.legacyPackages.${system};
  in
  {
    # ...
    homeConfigurations.<Your user name> = home-manager.lib.homeManagerConfiguration {
      inherit pkgs;
      extraSpecialArgs = { inherit inputs; };
      modules = [
        ./home.nix
        clrsync.homeModules.default
      ];
    };
  };
```

3. Configure in home manager

```nix
programs.clrsync = {
  package = inputs.clrsync.packages.x86_64-linux.default;  
  defaultTheme = "dark";
  palettesPath = "~/.config/clrsync/palettes";
  font = "JetBrainsMono Nerd Font Mono";
  fontSize = 14;
  applyTheme = true;

  templates = {
    kitty = {
      enabled = true;
      inputPath = "~/.config/clrsync/templates/kitty.conf";
      outputPath = "~/.config/kitty/clrsync.conf";
      reloadCmd = "pkill -SIGUSR1 kitty";
    };
    
    rofi = {
      enabled = true;
      inputPath = "~/.config/clrsync/templates/rofi.rasi";
      outputPath = "~/.config/rofi/clrsync.rasi";
    };
  };
};
```

4. Rebuild

```nix
home-manager switch --flake .
```

## Install standalone package

1. Add clrsync to your flake inputs

```nix
{
  inputs = {
    clrsync.url = "github:obsqrbtz/clrsync";
  };
}
```

2. Install the package

```nix
# In NixOS configuration.nix:
nixpkgs.overlays = [
  inputs.clrsync.overlays.default
];

environment.systemPackages = [
  clrsync
];
```

Or for home manager:

```nix
# flake.nix
pkgs = import nixpkgs {
  inherit system;
  overlays = [
    clrsync.overlays.default
  ];
};
```

```nix
# home.nix
home.packages = [
  clrsync
];
```

3. Use the app manually

```shell
clrsync_gui

# or
clrsync_cli --apply --theme dark
```

## Install to profile

```shell
nix profile add github:obsqrbtz/clrsync
```

## Run without installing</summary>

```shell
nix run github:obsqrbtz/clrsync
nix run github:obsqrbtz/clrsync#clrsync-cli
```