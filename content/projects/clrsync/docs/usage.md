---
title: Usage
seo:
  title: Usage
---

## CLI

List available themes:
```bash
clrsync_cli --list-themes
```

Apply the default theme:
```bash
clrsync_cli --apply
```

Apply a specific theme:
```bash
clrsync_cli --apply --theme cursed
```

Apply a theme from a file path:
```bash
clrsync_cli --apply --path /path/to/theme.toml
```

Show available color variables:
```bash
clrsync_cli --show-vars
```

Use a custom config file:
```bash
clrsync_cli --config /path/to/config.toml --apply
```

## GUI

Launch the graphical editor:
```bash
clrsync_gui
```