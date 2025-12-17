---
title: Configuration
seo:
  title: Configuration
---

The configuration file is located at `~/.config/clrsync/config.toml`.

## General Section

```toml
[general]
palettes_path = "~/.config/clrsync/palettes"
default_theme = "cursed"
font = "JetBrainsMono Nerd Font Mono"
font_size = 14
```

### Parameters

- `palettes_path` - Directory containing palette TOML files
- `default_theme` - Name of the palette to apply by default
- `font` - Font family for GUI (optional)
- `font_size` - Font size for GUI (optional)

## Template Configuration

Each template is defined in a `[templates.<name>]` section:

```toml
[templates.kitty]
enabled = true
input_path = "~/.config/clrsync/templates/kitty.conf"
output_path = "~/.config/kitty/theme.conf"
reload_cmd = "pkill -SIGUSR1 kitty"

[templates.nvim]
enabled = true
input_path = "~/.config/clrsync/templates/nvim.lua"
output_path = "~/.config/nvim/colors/clrsync.lua"
reload_cmd = ""
```

### Template Parameters

- `enabled` - Whether to process this template when applying themes
- `input_path` - Path to template file with color placeholders
- `output_path` - Destination for rendered configuration file
- `reload_cmd` - Optional shell command to reload the application after applying theme
