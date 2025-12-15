---
title: Configuration
seo:
  title: Configuration
---

Edit or create a configuration file at `~/.config/clrsync/config.toml`:

```toml
[general]
palettes_path = "~/.config/clrsync/palettes"
default_theme = "cursed"

[templates.kitty]
input_path = "~/.config/clrsync/templates/kitty.conf"
output_path = "~/.config/kitty/clrsync.conf"
enabled = true
reload_cmd = "pkill -SIGUSR1 kitty"
```