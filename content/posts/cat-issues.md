---
title: Yes, that's definitely OS's fault /s
publishDate: "2025-09-18"
updated: "2025-09-18"
isFeatured: true
tags:
  - Linux
  - macOS
  - AMD
  - troubleshooting
  - lifestyle
excerpt: "Being dumb for 4 hours straight"
---

A few days ago I booted up my Arch Linux install and immediately hit a black screen right after GRUB. No error message, no flicker, just blackness.

The weird part? The system was clearly running. I could seemingly “blindly” log in and even access my media servers from my phone. So it wasn’t a total crash, just no display.

Naturally, my first thought was: great, another driver issue. 

## Step 1: Suspecting the update

The problem started right after I did a system upgrade. But since I had already successfully rebooted once after pacman finished its dirty deeds, I was pretty confident the update itself wasn’t the culprit.

Still, I started digging through logs. That’s when I found this suspicious line (`journalctl -k -b -1`):

```shell
amdgpu 0000:0a:00.0: [drm] Cannot find any crtc or sizes
```

That immediately screamed GPU driver issue. Oddly enough, the monitor worked perfectly in BIOS, GRUB, and Windows.

## Step 2: Kernel parameters and downgrades

I tried gpu-related kernel parameters:

- `nomodeset` - system booted fine
- `amdgpu.dc=0` - also worked
- `video=HDMI-A-1:1920x1080@100` - black screen
- `video=HDMI-A-1:1920x1080@60` - black screen

At this point I decided that the latest kernel or amdgpu driver broke something. 

Okay, let's check which amdgpu-related packages were upgraded:

```shell
grep -r "amdgpu\|drm" /var/log/pacman.log | grep -i "upgrade\|update"
> [2025-08-18T17:43:57+0300] [ALPM] upgraded linux-firmware-amdgpu (20250708-1 -> 20250808-1)
> [2025-08-18T17:43:58+0300] [ALPM] upgraded xf86-video-amdgpu (23.0.0-2 -> 25.0.0-1)
```

I installed the LTS kernel, downgraded `linux-firmware-amdgpu` and `xf86-video-amdgpu` packages… nope. Same black screen.

## Step 3: The paranoia kicks in

That’s when I noticed something that really threw me off:

```shell
host: MacPro7,1 
```

on my Arch install, on classic desktop PC.

The day before, I had been messing around with macOS 26 installation. It had immediately kernel panicked, but I've still had working macOS 15, so shelved it for later. But now my Arch box thought it was a Mac Pro?

Even worse: macOS was also booting to a black screen. System was alive (keyboard responsive), but no display.

I'm not an OS-expert, so I've immediately made some dumb assumptions - did macOS somehow corrupt NVRAM or some other black magic to my motherboard?

## Step 4: Any issue can be resolved by nuking something

In desperation, I flashed the latest BIOS for my motherboard. At least that fixed the weird host string and I got new cool ROG splash screen on startup.

But the black screen? Still there.

## Step 5: The Real Fix

After four hours of troubleshooting, log scraping, parameter testing, BIOS flashing, and general paranoia… I looked at my cat. Then at my HDMI cable.

I tightened the cable on the monitor side.

And suddenly, everything worked.

## Conclussion

Debugging often starts at the wrong end of the stack. It’s tempting to dive straight into logs, kernel flags, and firmware updates, but sometimes the issue is sitting right on your desk.

![](https://ornella.club/uploads/posts/2023-05/30958/1684941839_ornella-club-p-khitrii-kotik-oboi-4.jpg)