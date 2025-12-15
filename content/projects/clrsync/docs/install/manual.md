---
title: Manual installation
seo:
  title: Manual installation
---

## Prerequisites

- C++20 compatible compiler (GCC, Clang, or MSVC)
- CMake
- OpenGL
- glfw
- fontconfig
- freetype

```bash
mkdir build && cd build
cmake ..
cmake --build .
cmake --install .
```

Only tested on Linux and Windows.