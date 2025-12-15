---
title: Templates
seo:
  title: Templates
---

Create templates for all apps, defined in `config.toml`.

```conf
# ~/.config/clrsync/templates/kitty.conf
cursor              {cursor}
cursor_text_color   {background}
foreground            {foreground}
background            {background}
selection_foreground  {on_surface}
selection_background  {surface}
url_color             {accent}
color0      {base00}
color8      {base08}
color1      {base01}
color9      {base09}
color2      {base02}
color10     {base0A}
color3      {base03}
color11     {base0B}
color4      {base04}
color12     {base0C}
color5      {base05}
color13     {base0D}
color6      {base06}
color14     {base0E}
color7      {base07}
color15     {base0F}
```

## Color Format Specifiers

By default color keas are changed with normal hex string, but you may get other popular color formats with format specifiers:

```conf
# HEX formats
{color}                    # Default: #RRGGBB
{color.hex}                # #RRGGBB
{color.hex_stripped}       # RRGGBB
{color.hexa}               # #RRGGBBAA
{color.hexa_stripped}      # RRGGBBAA

# RGB components (0-255)
{color.rgb}                # rgb(r, g, b)
{color.r}                  # Red component
{color.g}                  # Green component
{color.b}                  # Blue component

# RGBA (alpha normalized 0-1)
{color.rgba}               # rgba(r, g, b, a)
{color.a}                  # Alpha component

# HSL (hue 0-360, saturation/lightness 0-1)
{color.hsl}                # hsl(h, s, l)
{color.h}                  # Hue component
{color.s}                  # Saturation component
{color.l}                  # Lightness component

# HSLA (hue 0-360, saturation/lightness/alpha 0-1)
{color.hsla}               # hsla(h, s, l, a)
{color.a}                  # Alpha component
```