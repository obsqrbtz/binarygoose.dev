---
title: Building clrsync
seo:
  title: Building clrsync
---

## Prerequisites

- C++20 compatible compiler (GCC, Clang, or MSVC)
- CMake
- OpenGL
- glfw
- fontconfig
- freetype

## With CMake

 > If using nixos, first run `direnv allow` or `nix develop` in the clrsync root.

```bash
mkdir build && cd build
cmake ..
cmake --build .
```