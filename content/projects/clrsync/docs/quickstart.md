---
title: Quickstart
seo:
  title: Quickstart
---

## Installation

Install clrsync for your platform:

- **NixOS**: See [NixOS installation guide](../install/nixos)
>
> If you use clrsync via Home Manager, do **not** edit `config.toml` manually and do **not** use the GUI to change application settings.
>
> All clrsync configuration (general settings, templates, paths, reload commands, etc.)
> should be defined in your **Home Manager configuration** instead.
>
> You can safely edit palettes visually using the GUI
- **Fedora/Ubuntu**: Download and install the package from [releases](https://github.com/obsqrbtz/clrsync/releases)
- **Other systems**: See [manual installation](../install/manual)

## CLI

### Create a Palette

Create a palette file at `~/.config/clrsync/palettes`. Use one of bundled palettes as a reference.

### Create a Template

Create a template for your application. You may find some example templates at `~/.config/clrsync/templates`:

**~/.config/clrsync/templates/kitty.conf**:

```conf
foreground          {foreground}
background          {background}
selection_foreground {on_surface}
selection_background {surface}
url_color           {accent}

color0  {base00}
color1  {base01}
color2  {base02}
color3  {base03}
color4  {base04}
color5  {base05}
color6  {base06}
color7  {base07}
color8  {base08}
color9  {base09}
color10 {base0A}
color11 {base0B}
color12 {base0C}
color13 {base0D}
color14 {base0E}
color15 {base0F}
```

### Configure clrsync

Edit `~/.config/clrsync/config.toml`:

```toml
[general]
default_theme = 'example'
palettes_path = '~/.config/clrsync/palettes'

[templates.kitty]
enabled = true
input_path = '~/.config/clrsync/templates/kitty.conf'
output_path = '~/.config/kitty/theme.conf'
reload_cmd = 'pkill -SIGUSR1 kitty'
```

### Apply Theme

```bash
clrsync_cli --apply
```

## GUI

Run:

```bash
clrsync_gui
```

The GUI provides a visual editor for palettes with real-time preview and simple text editor for templates.

## Next Steps

- [Configuration details](../configure)
- [Template syntax](../templates)
- [Palette format](../palettes)
- [CLI usage](../usage)
