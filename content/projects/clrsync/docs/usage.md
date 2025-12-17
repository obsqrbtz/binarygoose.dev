---
title: Usage
seo:
  title: Usage
---

## CLI

### List Available Themes

Display all palettes in the configured `palettes_path`:

```bash
clrsync_cli --list-themes
```

### Apply Default Theme

Apply the theme specified by `default_theme` in configuration:

```bash
clrsync_cli --apply
```

### Apply Specific Theme

Apply a theme by name (must exist in `palettes_path`):

```bash
clrsync_cli --apply --theme cursed
```

### Apply from Custom Path

Apply a theme from an arbitrary file path:

```bash
clrsync_cli --apply --path /path/to/theme.toml
```

### Show Color Variables

Display all available color variables:

```bash
clrsync_cli --show-vars
```
### Custom Configuration

Use an alternate configuration file:

```bash
clrsync_cli --config /path/to/config.toml --apply
```

### Help

```bash
clrsync_cli --help
```

## GUI

### Launch

```bash
clrsync_gui
```