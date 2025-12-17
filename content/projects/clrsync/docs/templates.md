---
title: Templates
seo:
  title: Templates
---

Templates are application configuration files with color placeholders.

## Template Syntax


```conf
# Basic placeholder
foreground {foreground}
background {background}
cursor {cursor}
```

## Example: Kitty Terminal


```conf
cursor              {cursor}
cursor_text_color   {background}

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

## Color Format Specifiers

Access different color representations using format specifiers:

### HEX Formats

```conf
{color}                  # #RRGGBB (default)
{color.hex}              # #RRGGBB
{color.hex_stripped}     # RRGGBB
{color.hexa}             # #RRGGBBAA
{color.hexa_stripped}    # RRGGBBAA
```

### RGB Format

```conf
{color.rgb}              # rgb(r, g, b)
{color.r}                # Red component (0-255)
{color.g}                # Green component (0-255)
{color.b}                # Blue component (0-255)
```

### RGBA Format

```conf
{color.rgba}             # rgba(r, g, b, a)
{color.a}                # Alpha component (0.0-1.0)
```

### HSL Format

```conf
{color.hsl}              # hsl(h, s, l)
{color.h}                # Hue (0-360)
{color.s}                # Saturation (0.0-1.0)
{color.l}                # Lightness (0.0-1.0)
```

### HSLA Format

```conf
{color.hsla}             # hsla(h, s, l, a)
{color.a}                # Alpha component (0.0-1.0)
```

## Example


```css
.element {
  background-color: {background.hex};
  color: rgba({foreground.r}, {foreground.g}, {foreground.b}, 0.8);
}
```