---
title: Exhibits
layout: single
permalink: /linuxinstall
author_profile: false
---

# Complete Linux Installation Guide for Dell XPS 15 9560
## For Educators: Focus on Simplicity, Stability, and Development

**Target User:** Me  
**Hardware:** Dell XPS 15 9560 (2017 model)  
**Primary Uses:** Google Workspace, curriculum development, blogging (Jekyll/GitHub Pages), VSCode development  
**Priority:** Ease of use, low maintenance, reliable desktop environment

---

## Table of Contents

1. [Distribution Recommendation](#distribution-recommendation)
2. [Why This Choice](#why-this-choice)
3. [Pre-Installation Preparation](#pre-installation-preparation)
4. [BIOS Configuration](#bios-configuration)
5. [Installation Process](#installation-process)
6. [Post-Installation Setup](#post-installation-setup)
7. [Installing Development Tools](#installing-development-tools)
8. [Hardware Optimization for XPS 9560](#hardware-optimization)
9. [Troubleshooting](#troubleshooting)
10. [Useful Resources](#useful-resources)

---

## Distribution Recommendation

### **Winner: Linux Mint 22 "Wilma" (Cinnamon Edition)**

**Why Linux Mint for You:**
- **Lowest maintenance burden** - Updates are conservative and well-tested
- **Windows-like interface** - Familiar desktop layout minimizes relearning
- **5-year support cycle** - Install once, maintain minimally
- **Excellent hardware detection** - Works well with XPS 15 9560
- **Pre-configured multimedia support** - No codec hunting
- **Google Chrome/Chromium included** - Seamless Google Workspace integration
- **Based on Ubuntu LTS** - Access to vast software repositories
- **Community-focused** - User-friendly forums and documentation

### Alternative Options (If You Want to Explore)

**Ubuntu 24.04 LTS** - If you prefer GNOME desktop or want cutting-edge features  
**Fedora Workstation 42** - If you want the absolute latest developer tools (requires more maintenance)

---

## Why This Choice

### For Your Specific Use Case:

| Requirement | Linux Mint Solution |
|-------------|---------------------|
| **Limited time for maintenance** | Conservative update policy; won't break unexpectedly |
| **Google Workspace access** | Chrome/Chromium pre-installed; web apps work perfectly |
| **VSCode development** | Easy .deb installation; full compatibility |
| **Jekyll/GitHub Pages** | Ruby environment easily installable; strong documentation |
| **Non-intrusive desktop** | Cinnamon stays out of your way; traditional workflow |
| **Curriculum creation** | LibreOffice pre-installed; PDF export; screenshot tools |

### What You're Gaining:
- **Stability**: Rock-solid base with fewer surprise updates
- **Familiarity**: Menu-driven interface like Windows
- **Productivity**: No telemetry, no forced reboots, no license hassles
- **Control**: You decide when to update and what to install
- **Privacy**: No data collection by default
- **Performance**: Faster boot times, better battery life than Windows

---

## Pre-Installation Preparation

### Materials Needed:
- **USB flash drive** (8GB minimum, 16GB recommended)
- **External backup drive** (for Windows backup if dual-booting)
- **Stable internet connection**
- **90-120 minutes of time**

### Step 1: Backup Your Current System

**Critical:** Even if you're replacing Windows completely, backup important data.

#### Windows Users:
1. **Documents, Photos, Downloads**
   - Copy to external drive or cloud storage
   - Verify files are readable on backup

2. **Browser bookmarks and passwords**
   - Export from Chrome/Firefox
   - Ensure Google account sync is enabled

3. **Save Windows product key** (if you might want to reinstall)
   ```
   Windows: Run "cmd" as Administrator
   Type: wmic path softwarelicensingservice get OA3xOriginalProductKey
   Save this key somewhere safe
   ```

4. **Optional: Full system image**
   - Use Macrium Reflect Free: https://www.macrium.com/reflectfree
   - Or built-in Windows Backup

### Step 2: Download Linux Mint

**Direct Download Link:** https://linuxmint.com/download.php

1. Choose: **Linux Mint 22 "Wilma" Cinnamon Edition**
2. Select download mirror closest to you (Northeast US recommended)
3. Download size: ~2.8GB
4. **Also download the SHA256 checksum** to verify integrity

#### Verify Your Download (Important!)

**Windows:**
```powershell
# Open PowerShell
cd Downloads
Get-FileHash linuxmint-22-cinnamon-64bit.iso -Algorithm SHA256
# Compare output with SHA256 file from Linux Mint website
```

**Mac/Existing Linux:**
```bash
sha256sum linuxmint-22-cinnamon-64bit.iso
# Compare output with published checksum
```

### Step 3: Create Bootable USB Drive

#### Recommended Tool: **balenaEtcher**
- Download: https://etcher.balena.io/
- Available for Windows, Mac, Linux
- Simple 3-click process

**Steps:**
1. Install and open balenaEtcher
2. Click "Flash from file" → select Linux Mint ISO
3. Click "Select target" → choose your USB drive
4. Click "Flash!" → wait 5-10 minutes
5. When complete, **don't format the drive** if Windows asks

#### Alternative Tool: **Rufus** (Windows only)
- Download: https://rufus.ie/
- More options but slightly more complex
- Use default settings for Linux Mint

### Step 4: Update Your XPS 9560 BIOS

**Current BIOS version check:**
- Restart computer → press F2 repeatedly → check BIOS version

**Latest BIOS for XPS 9560:** Version 1.22.1 (as of 2026)

**Update Process:**
1. Visit: https://www.dell.com/support/home/en-us/product-support/product/xps-15-9560-laptop/drivers
2. Download latest BIOS update (.exe file)
3. Run while plugged into AC power
4. **Do not interrupt** - Let it complete fully
5. System will reboot automatically

---

## BIOS Configuration

### Accessing BIOS:
1. Restart your XPS 15
2. **Immediately tap F2 repeatedly** until BIOS screen appears
3. Alternatively: F12 for boot menu

### Critical Settings to Change:

#### 1. **SATA Mode (MOST IMPORTANT)**
```
Location: System Configuration → SATA Operation
Change: RAID On → AHCI
Why: Allows Linux to detect your NVMe SSD
```

**⚠️ WARNING for Dual-Boot Users:**
- If you change to AHCI, existing Windows will not boot
- Fix: Boot Windows in Safe Mode once, then reboot normally
- Or: Fresh install both operating systems

#### 2. **Secure Boot**
```
Location: Secure Boot → Secure Boot Enable
Change: Enabled → Disabled
Why: Allows unsigned Linux bootloaders
```

#### 3. **Fast Boot**
```
Location: POST Behaviour → Fastboot
Change: Minimal → Thorough
Why: Prevents intermittent boot failures
```

#### 4. **Boot Sequence**
```
Location: Boot Sequence
Change: Move USB Storage to top
Why: Allows booting from installation USB
```

### Save and Exit:
- Press **F10** to save changes
- Confirm "Yes"
- Computer will reboot

---

## Installation Process

### Phase 1: Boot from USB

1. **Insert USB drive** into XPS 15
2. **Power on** and immediately press **F12** (one-time boot menu)
3. Select your USB drive from list
4. Choose "Start Linux Mint" from GRUB menu
5. Wait 30-60 seconds for live environment to load

### Phase 2: Test Before Installing (Optional but Recommended)

Once booted into Linux Mint:
- **Test WiFi**: Click network icon → connect to your network
- **Test trackpad**: Multi-touch gestures should work
- **Test keyboard**: All keys functional
- **Test audio**: Play a video or music
- **Test display**: Resolution should be correct

If everything works, proceed. If not, check troubleshooting section.

### Phase 3: Installation

1. **Double-click "Install Linux Mint"** icon on desktop

2. **Language Selection**
   - Select English (or your preference)
   - Click "Continue"

3. **Keyboard Layout**
   - Usually auto-detected correctly
   - Test in text box to confirm
   - Click "Continue"

4. **Multimedia Codecs**
   - ☑ **Check "Install multimedia codecs"**
   - This installs MP3, H.264, etc.
   - Click "Continue"

5. **Installation Type** (Choose based on your goal)

   **Option A: Replace Windows Completely** (Recommended for simplicity)
   ```
   ○ Erase disk and install Linux Mint
   ☑ Encrypt the new Linux Mint installation (optional but recommended)
   Click "Install Now"
   Confirm partition changes
   ```

   **Option B: Dual Boot with Windows**
   ```
   ○ Install Linux Mint alongside Windows
   Use slider to allocate space (50GB minimum for Linux)
   Click "Install Now"
   Confirm partition changes
   ```

   **Option C: Manual Partitioning** (Advanced)
   ```
   ○ Something else
   Create partitions:
     - /boot/efi: 512MB, EFI System Partition
     - /: 50GB+, ext4, Mount point /
     - swap: 8-16GB (match your RAM size)
     - /home: Remaining space, ext4
   ```

6. **Time Zone Selection**
   - Click on map or type city name
   - For Somerset, MA: America/New_York
   - Click "Continue"

7. **User Account Creation**
   ```
   Your name: James Burke
   Computer name: xps-mint (or your choice)
   Username: james (lowercase, no spaces)
   Password: [Choose strong password]
   ☑ Require password to log in (recommended)
   ☑ Encrypt my home folder (optional security)
   ```
   - Click "Continue"

8. **Wait for Installation**
   - Takes 10-15 minutes
   - Progress bar shows current task
   - Read the slideshow to learn Mint features

9. **Installation Complete**
   - Click "Restart Now"
   - Remove USB drive when prompted
   - System will reboot into Linux Mint

### Phase 4: First Boot

1. Computer restarts
2. GRUB bootloader appears (if dual-boot)
3. Linux Mint loads in 15-30 seconds
4. Login screen appears
5. **Enter your password**
6. Welcome to Linux Mint!

---

## Post-Installation Setup

### First Login Tasks

#### 1. Welcome Screen

Linux Mint greets you with helpful first steps:
- ☑ Take the tour (5 minutes, recommended)
- ☑ Install updates
- ☑ Install additional drivers
- ☐ Set up system snapshots (Timeshift - highly recommended)

#### 2. Update System (Critical First Step)

**Using GUI:**
```
Menu → Administration → Update Manager
Click "OK" on welcome message
Click "Install Updates"
Enter password
Wait for updates to complete (10-20 minutes first time)
Reboot if kernel updated
```

**Using Terminal** (faster):
```bash
sudo apt update
sudo apt upgrade -y
sudo apt dist-upgrade -y
sudo apt autoremove -y
```

#### 3. Install Proprietary Drivers

Your XPS 9560 has NVIDIA GTX 1050 graphics:

```
Menu → Administration → Driver Manager
Wait for detection to complete
Select "nvidia-driver-550" (or latest recommended)
Click "Apply Changes"
Enter password
Reboot when complete
```

**To verify:**
```bash
nvidia-smi
# Should show GPU info and driver version
```

#### 4. Set Up Timeshift (System Snapshots)

**Critical for peace of mind:**

```
Menu → Administration → Timeshift
Select "RSYNC" (recommended)
Choose system partition (usually /dev/nvme0n1p2)
Schedule: Daily (keep 3), Weekly (keep 2)
Include @home: No (keeps snapshots smaller)
Click "Create" to make first snapshot
```

**Why this matters:**
- Roll back if an update breaks something
- Restore after accidental system changes
- Safety net for experimentation

#### 5. Enable Firewall

```bash
sudo ufw enable
sudo ufw status
# Should show "Status: active"
```

#### 6. Configure Settings

**System Settings → Power Management:**
- Laptop lid: Suspend when closed
- Critical battery: Hibernate
- Turn off screen: 10 minutes

**System Settings → Display:**
- Resolution: 1920×1080 (FHD model)
- Scaling: 100% or 125% (your preference)

**System Settings → Preferred Applications:**
- Web: Google Chrome or Firefox
- Terminal: Gnome Terminal or Tilix

---

## Installing Development Tools

### Visual Studio Code

#### Method 1: Official Microsoft Repository (Recommended)

```bash
# Import Microsoft GPG key
wget -qO- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > packages.microsoft.gpg
sudo install -D -o root -g root -m 644 packages.microsoft.gpg /usr/share/keyrings/packages.microsoft.gpg
rm packages.microsoft.gpg

# Add VSCode repository
echo "deb [arch=amd64,arm64,armhf signed-by=/usr/share/keyrings/packages.microsoft.gpg] https://packages.microsoft.com/repos/code stable main" | sudo tee /etc/apt/sources.list.d/vscode.list

# Install VSCode
sudo apt update
sudo apt install code -y
```

#### Method 2: Download .deb Package

1. Visit: https://code.visualstudio.com/Download
2. Click "Linux .deb x64"
3. Save to Downloads
4. Install:
```bash
cd ~/Downloads
sudo dpkg -i code_*.deb
sudo apt --fix-broken install -y
```

**Launch VSCode:**
```bash
code
# Or: Menu → Programming → Visual Studio Code
```

**Essential Extensions for Your Work:**
```bash
# Open VSCode
# Press Ctrl+Shift+X (Extensions)
# Search and install:
- Markdown All in One
- GitHub Pull Requests
- GitLens
- Live Server
- Python (if using Python)
- ESLint (for JavaScript)
```

### Git Configuration

```bash
# Install Git (usually pre-installed)
sudo apt install git -y

# Configure identity
git config --global user.name "James Burke"
git config --global user.email "your.email@example.com"

# Recommended aliases
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit

# Verify
git config --list
```

**GitHub Authentication:**
```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your.email@example.com"
# Press Enter for default location
# Enter passphrase (or skip)

# Copy public key
cat ~/.ssh/id_ed25519.pub
# Copy output

# Add to GitHub:
# GitHub.com → Settings → SSH and GPG keys → New SSH key
# Paste key, give it a title like "XPS 15 Linux Mint"
```

### Jekyll for GitHub Pages

#### Install Ruby and Dependencies

```bash
# Install Ruby and build tools
sudo apt install ruby-full build-essential zlib1g-dev -y

# Avoid installing gems as root
echo '# Ruby Gems' >> ~/.bashrc
echo 'export GEM_HOME="$HOME/gems"' >> ~/.bashrc
echo 'export PATH="$HOME/gems/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

# Install Jekyll and Bundler
gem install jekyll bundler

# Verify installation
jekyll -v
# Should show: jekyll 4.x.x
```

#### Set Up Your First Jekyll Site

```bash
# Create new Jekyll site
cd ~
mkdir websites
cd websites
jekyll new my-blog
cd my-blog

# Serve locally
bundle exec jekyll serve

# Open browser to: http://localhost:4000
```

#### GitHub Pages Integration

**Create GitHub repository:**
```bash
# On GitHub.com:
# New repository → username.github.io
# Initialize without README

# In your Jekyll directory:
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin git@github.com:username/username.github.io.git
git push -u origin main
```

**Configure for GitHub Pages:**

Edit `Gemfile`:
```ruby
# Comment out:
# gem "jekyll", "~> 4.3.3"

# Uncomment:
gem "github-pages", group: :jekyll_plugins
```

Run:
```bash
bundle install
bundle exec jekyll serve --baseurl=""
```

**Visit:** https://username.github.io (after pushing)

**Useful Resources:**
- GitHub Pages: https://pages.github.com/
- Jekyll Docs: https://jekyllrb.com/docs/
- Jekyll Themes: https://jekyllthemes.io/

### Google Chrome for Workspace

```bash
# Download Chrome
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb

# Install
sudo dpkg -i google-chrome-stable_current_amd64.deb
sudo apt --fix-broken install -y

# Launch
google-chrome
```

**Sign in to Google account for:**
- Gmail
- Google Drive
- Google Docs/Sheets/Slides
- Google Classroom
- Google Calendar

**Tip:** Install as PWA (Progressive Web Apps):
- Visit any Google service
- Chrome Menu → More Tools → Create Shortcut
- ☑ Open as window
- Creates app-like experience

### Additional Development Tools

```bash
# Node.js and npm (for web development)
sudo apt install nodejs npm -y
node -v  # Should show v18.x or later

# Python (usually pre-installed)
python3 --version
pip3 --version

# If pip missing:
sudo apt install python3-pip -y

# Useful utilities
sudo apt install -y \
  htop \              # System monitor
  tree \              # Directory visualization
  curl \              # Data transfer
  wget \              # File downloads
  vim \               # Text editor
  neofetch \          # System info display
  tldr \              # Simplified man pages
  gnome-screenshot    # Screenshot tool
```

---

## Hardware Optimization for XPS 9560

### Battery Life Optimization

#### Install TLP (Power Management)

```bash
sudo apt install tlp tlp-rdw -y
sudo systemctl enable tlp
sudo systemctl start tlp

# Check status
sudo tlp-stat -s
```

**Expected improvements:**
- 30-40% better battery life
- Automatic CPU frequency scaling
- USB power management
- PCI device power control

### Touchpad Fine-Tuning

Create configuration file:
```bash
sudo nano /usr/share/X11/xorg.conf.d/40-libinput.conf
```

Add:
```
Section "InputClass"
    Identifier "touchpad"
    Driver "libinput"
    MatchIsTouchpad "on"
    Option "Tapping" "on"
    Option "NaturalScrolling" "true"
    Option "AccelSpeed" "0.4"
EndSection
```

Save (Ctrl+O, Enter, Ctrl+X) and restart.

### NVIDIA Optimus (Switchable Graphics)

#### Check Current Graphics Mode

```bash
prime-select query
# Shows: nvidia or intel
```

#### Switch Graphics Mode

```bash
# Use NVIDIA (better performance, more battery drain)
sudo prime-select nvidia

# Use Intel (better battery, lower performance)
sudo prime-select intel

# Reboot required after switching
sudo reboot
```

**Recommendation:** Use Intel for daily work, NVIDIA for intensive tasks.

### WiFi Stability

Your XPS 9560 has Intel Wireless-AC 8265:

```bash
# If WiFi drops frequently, disable power management
sudo nano /etc/NetworkManager/conf.d/wifi-powersave.conf
```

Add:
```
[connection]
wifi.powersave = 2
```

Save and restart NetworkManager:
```bash
sudo systemctl restart NetworkManager
```

### Audio Fixes

If speakers sound tinny:

```bash
# Install PulseAudio Volume Control
sudo apt install pavucontrol -y

# Launch
pavucontrol
```

Go to Configuration tab → Built-in Audio → Profile: Analog Stereo Duplex

### Temperature Monitoring

```bash
# Install sensors
sudo apt install lm-sensors -y
sudo sensors-detect  # Press Enter for all defaults

# Check temperatures
sensors
```

**Normal temps:**
- Idle: 40-50°C
- Light use: 50-65°C
- Heavy load: 65-85°C
- Thermal throttling: 90°C+

### SSD TRIM (Performance)

```bash
# Enable weekly TRIM for SSD longevity
sudo systemctl enable fstrim.timer
sudo systemctl start fstrim.timer

# Manual TRIM
sudo fstrim -av
```

---

## Troubleshooting

### Boot Issues

#### Problem: "No bootable device found"

**Solution:**
```
1. Enter BIOS (F2)
2. Boot Sequence → Add Boot Option
3. File System: Select EFI partition
4. Path: \EFI\ubuntu\grubx64.efi (yes, even for Mint)
5. Save and exit
```

#### Problem: Black screen after GRUB

**Solution:**
```
1. At GRUB menu, press 'e' on Linux Mint entry
2. Find line starting with 'linux'
3. Add to end: nouveau.modeset=0
4. Press F10 to boot
5. Install NVIDIA drivers once booted
```

#### Problem: System freezes on boot

**Solution:**
```
At GRUB, add kernel parameter:
acpi_rev_override=5

To make permanent:
sudo nano /etc/default/grub
Add: GRUB_CMDLINE_LINUX_DEFAULT="quiet splash acpi_rev_override=5"
sudo update-grub
```

### WiFi Not Working

```bash
# Check if WiFi is blocked
rfkill list

# If blocked:
sudo rfkill unblock all

# Restart NetworkManager
sudo systemctl restart NetworkManager
```

### Trackpad Issues

```bash
# If multi-touch not working:
sudo apt install xserver-xorg-input-synaptics -y
sudo reboot
```

### Sound Not Working

```bash
# Reload audio driver
pulseaudio -k
pulseaudio --start

# If still no sound:
sudo alsa force-reload
```

### Screen Brightness Control

```bash
# If brightness keys don't work:
sudo nano /etc/default/grub

# Change:
GRUB_CMDLINE_LINUX_DEFAULT="quiet splash acpi_backlight=vendor"

sudo update-grub
sudo reboot
```

### Suspend/Resume Issues

```bash
# If laptop doesn't wake from suspend:
sudo nano /etc/default/grub

# Add:
GRUB_CMDLINE_LINUX_DEFAULT="quiet splash mem_sleep_default=deep"

sudo update-grub
sudo reboot
```

### High CPU Usage

```bash
# Check what's using CPU:
htop

# Sort by CPU: Press F6, select CPU%

# Common culprits:
# - snapd (if you installed snaps)
# - tracker-miner (file indexing)

# Disable tracker:
systemctl --user mask tracker-store.service tracker-miner-fs.service tracker-miner-rss.service tracker-extract.service tracker-miner-apps.service tracker-writeback.service
```

### Slow Boot Times

```bash
# Analyze boot time:
systemd-analyze

# See what takes longest:
systemd-analyze blame

# Critical services taking >5s should be investigated
```

---

## Useful Resources

### Linux Mint Official Resources
- **Main Website:** https://linuxmint.com/
- **Documentation:** https://linuxmint.com/documentation.php
- **Forums:** https://forums.linuxmint.com/
- **User Guide:** https://linuxmint.com/documentation/user-guide/Cinnamon/english_18.0.pdf

### Learning Linux
- **Linux Journey:** https://linuxjourney.com/ (Free interactive tutorials)
- **The Linux Command Line Book:** https://linuxcommand.org/tlcl.php (Free PDF)
- **ExplainShell:** https://explainshell.com/ (Decode complex commands)

### Development Resources
- **VSCode on Linux:** https://code.visualstudio.com/docs/setup/linux
- **Jekyll Documentation:** https://jekyllrb.com/docs/
- **GitHub Pages Guide:** https://docs.github.com/en/pages
- **Git Book:** https://git-scm.com/book/en/v2

### Dell XPS 9560 Specific
- **Arch Wiki (excellent for any distro):** https://wiki.archlinux.org/title/Dell_XPS_15_(9560)
- **Dell Support:** https://www.dell.com/support/home/en-us/product-support/product/xps-15-9560-laptop
- **Ubuntu Wiki:** https://help.ubuntu.com/community/

### Communities and Support
- **r/linuxmint:** https://reddit.com/r/linuxmint
- **r/linux4noobs:** https://reddit.com/r/linux4noobs
- **Ask Ubuntu:** https://askubuntu.com/ (works for Mint too)
- **Stack Overflow:** https://stackoverflow.com/ (programming questions)

### YouTube Channels
- **LearnLinuxTV:** https://www.youtube.com/@LearnLinuxTV
- **DistroTube:** https://www.youtube.com/@DistroTube
- **Chris Titus Tech:** https://www.youtube.com/@ChrisTitusTech
- **The Linux Experiment:** https://www.youtube.com/@TheLinuxEXP

---

## Quick Reference: Essential Commands

### System Management
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install package
sudo apt install package-name

# Remove package
sudo apt remove package-name

# Search for package
apt search keyword

# Clean up
sudo apt autoremove -y
sudo apt autoclean
```

### File Operations
```bash
# List files
ls -lah

# Change directory
cd /path/to/directory

# Copy files
cp source destination

# Move/rename
mv source destination

# Remove file
rm filename

# Remove directory
rm -r directory

# Create directory
mkdir directory-name

# Find files
find /path -name "filename"
```

### System Information
```bash
# Disk usage
df -h

# Directory size
du -sh /path

# Memory usage
free -h

# CPU info
lscpu

# Process monitor
htop

# Network info
ip addr show

# System info
neofetch
```

### File Editing
```bash
# Simple editor
nano filename

# Advanced editor
vim filename

# View file
cat filename
less filename
```

### Permissions
```bash
# Make executable
chmod +x script.sh

# Change owner
sudo chown user:user filename

# View permissions
ls -l filename
```

---

## Maintenance Schedule

### Daily (Automated)
- ☑ Automatic Timeshift snapshots (if configured)
- ☑ TLP battery optimization

### Weekly
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Clean package cache
sudo apt autoremove -y
sudo apt autoclean
```

### Monthly
- ☐ Review Timeshift snapshots (delete old ones if space low)
- ☐ Check disk space: `df -h`
- ☐ Review installed packages: `apt list --installed`

### As Needed
- ☐ BIOS updates (check Dell support site)
- ☐ NVIDIA driver updates (via Driver Manager)
- ☐ Linux Mint point releases (21.1 → 21.2, etc.)

---

## Conclusion

You now have everything you need to install and optimize Linux Mint on your Dell XPS 15 9560. This setup will provide you with:

✅ **Stable, reliable system** for daily educational work  
✅ **Full development environment** with VSCode, Git, Jekyll  
✅ **Seamless Google Workspace integration** via Chrome  
✅ **Optimized performance** for your specific hardware  
✅ **Low maintenance** with conservative update policy  
✅ **Privacy and control** over your computing environment  

**Remember:** Linux is a journey, not a destination. Don't be afraid to explore, experiment (with Timeshift safety net), and ask for help in the vibrant Linux community.

**Good luck, and welcome to the world of open source!**

---

*Document Version: 1.0*  
*Last Updated: February 22, 2026*  
*Hardware: Dell XPS 15 9560*  
*OS: Linux Mint 22 "Wilma" Cinnamon Edition*
