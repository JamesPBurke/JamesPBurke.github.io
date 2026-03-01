---
title: Exhibits
layout: single
permalink: /linuxinstall/
author_profile: false
---

# Complete Linux Installation Guide for Dell XPS 13 9360
## For Educators: Focus on Simplicity, Stability, and Development

**Target User:** Former software engineer, high school CS/Engineering teacher  
**Hardware:** Dell XPS 13 9360 (Kaby Lake / 8th‑gen refresh)  
**Primary Uses:** Google Workspace, curriculum development, blogging (Jekyll/GitHub Pages), VSCode development  
**Priority:** Ease of use, low maintenance, reliable desktop environment

---

## Table of Contents

1. Distribution Recommendation
2. Why This Choice
3. Pre-Installation Preparation
4. BIOS Configuration (XPS 13 9360)
5. Installation Process
6. Post-Installation Setup
7. Installing Development Tools
8. Hardware Optimization for XPS 13 9360
9. Stability Tips for XPS 13 9360
10. Troubleshooting
11. Useful Resources
12. Maintenance Schedule

---

## 1. Distribution Recommendation

### **Winner: Linux Mint 22 "Wilma" (Cinnamon Edition)**

Why Linux Mint for You:

- **Lowest maintenance burden** – Updates are conservative and well-tested, ideal when you have limited time.
- **Windows-like interface** – Cinnamon desktop feels familiar (panel + menu + taskbar).
- **5‑year support cycle** – Based on Ubuntu LTS, with long-term security updates.
- **Excellent laptop support** – Mint/Ubuntu are well-tested on XPS machines including the 9360.
- **Pre-configured multimedia support** – Optional codecs installer handles MP3, H.264, etc.
- **Google Workspace friendly** – Chrome/Chromium supported, web apps work perfectly.
- **Huge ecosystem** – Ubuntu base means easy access to VSCode, Jekyll, and teaching tools.

### Alternative Options

- **Ubuntu 24.04 LTS** – If you prefer GNOME or want “official” Dell Ubuntu alignment.
- **Fedora Workstation (current)** – Great for cutting-edge dev tools, but requires more frequent upgrades.

---

## 2. Why This Choice Fits Your Work

| Requirement                            | Linux Mint Solution                                                                 |
|----------------------------------------|-------------------------------------------------------------------------------------|
| Limited time for maintenance           | Conservative updates; Timeshift snapshots; LTS base.                                |
| Google Workspace access                | Chrome/Chromium + PWAs for Classroom/Docs/etc.                                     |
| VSCode & dev tools                     | Official VSCode .deb and repos; strong language support.                            |
| Blogging with Jekyll + GitHub Pages    | Ruby & Jekyll install cleanly on Ubuntu/Mint; GitHub docs target this stack.       |
| Non-intrusive desktop                  | Cinnamon’s traditional UX stays out of your way.                                    |
| Curriculum & docs creation             | LibreOffice, PDF export, screenshot tools included/available.                      |

You get a **stable, predictable machine** that behaves much like a polished Windows laptop but with better control, no forced restarts, and first-class dev tooling.

---

## 3. Pre-Installation Preparation

### Materials Needed

- USB flash drive (≥ 8 GB, 16 GB recommended)
- External drive or cloud storage for backups
- Stable internet
- 90–120 minutes of uninterrupted time

### Step 1: Backup Windows Data

- Copy Documents, Downloads, Desktop, and any course materials to an external drive or cloud.
- Ensure Chrome/Edge/Firefox are syncing bookmarks/passwords via your account.
- Optionally, create a full Windows image (Macrium Reflect Free or built-in Windows backup) if you might return to Windows later.

### Step 2: Download Linux Mint

1. Go to: https://linuxmint.com/download.php  
2. Choose **Linux Mint 22 “Wilma” – Cinnamon Edition**.  
3. Pick a nearby mirror (Northeast US).  
4. Also download the **SHA256 checksum** file.

Verify checksum (Windows PowerShell):

```powershell
cd Downloads
Get-FileHash linuxmint-22-cinnamon-64bit.iso -Algorithm SHA256
# Compare with SHA256 listed on the Mint download page
```

### Step 3: Create Bootable USB (balenaEtcher)

1. Download Etcher: https://etcher.balena.io/  
2. Insert USB drive.
3. Open Etcher → “Flash from file” → select Mint ISO.
4. “Select target” → choose USB.
5. Click “Flash!” and wait.  
6. If Windows later offers to “format” the USB, cancel – it’s already bootable.

(You can also use Rufus on Windows with default settings for “GPT + UEFI” if you prefer.)

### Step 4: Update BIOS/Firmware

1. Go to Dell support for your model:  
   https://www.dell.com/support/home/en-bm/drivers/supportedos/xps-13-9360-laptop  
2. Download the **latest BIOS update** for XPS 13 9360.
3. Plug in AC power; run the `.exe` from Windows; let it reboot and finish.

This also improves power management and fixes older Linux-related issues.

---

## 4. BIOS Configuration (XPS 13 9360)

### Enter BIOS / Boot Menu

- **F2** at power‑on: BIOS setup  
- **F12** at power‑on: one‑time boot menu

### Key Settings for Linux

1. **SATA Operation → AHCI**

   - Path: *System Configuration → SATA Operation*  
   - Change from **RAID** to **AHCI**.  
   - Required for clean NVMe support on Linux.

   > If you plan to keep Windows, switch Windows into Safe Mode once before changing this, or reinstall Windows with AHCI; otherwise Windows may fail to boot.

2. **Secure Boot**

   - Path: *Secure Boot*  
   - Set **Secure Boot = Disabled** for the simplest Mint install.  
   - You can re‑enable later if you desire, but Mint works fine without it.

3. **Boot Mode**

   - Ensure **UEFI** (not Legacy) is enabled.

4. **Boot Priority**

   - Move **USB Storage** above “Windows Boot Manager” so you can boot the Mint USB.

5. Optional power tweaks (can do later):

   - Disable **Thunderbolt** if you never use TB3 docks; this saves power and can avoid rare resume issues.  
   - Disable **Bluetooth** if you don’t use it; small power savings.

Save and exit (usually **F10**).

---

## 5. Installation Process

### 5.1 Boot the Live System

1. Insert the Mint USB.
2. Power on and tap **F12** for the boot menu.
3. Select your USB drive (UEFI entry).
4. At the GRUB menu, pick **“Start Linux Mint”**.

After ~30–60 seconds you should see the Mint Cinnamon desktop.

### 5.2 Sanity Check Hardware

Before installing, quickly test:

- Wi‑Fi: click network icon → connect to your SSID.  
  - With your **Intel Dual Band Wireless‑AC 8265**, this should work out of the box via `iwlwifi`.
- Trackpad/keyboard: cursor movement, tap‑to‑click, function keys.
- Audio: play the sample video.
- Display: correct resolution, brightness keys.

If all looks good, proceed.

### 5.3 Run the Installer

1. Double‑click **“Install Linux Mint”** on the desktop.
2. **Language**: English (US) or your preference → Continue.
3. **Keyboard**: verify layout → Continue.
4. On “Multimedia codecs” screen: **check “Install multimedia codecs”** → Continue.
5. **Installation type**:
   - **Erase disk and install Linux Mint** – simplest, wipes Windows.
   - **Install alongside Windows** – for dual‑boot; allocate ≥ 50 GB for Mint.
   - **Something else** – manual partitioning (only if you want a custom layout).

Recommended (if you don’t need Windows): *Erase disk and install Linux Mint*.

For manual partitioning, a sensible layout:

- EFI System Partition: existing 512 MB FAT32 (mounted at `/boot/efi`)
- Root `/`: 50–100 GB, ext4
- Swap: 8–16 GB (optional if you use swapfile; Mint handles this)
- `/home`: remaining space, ext4

6. Set **time zone** (Boston / New York).
7. Create user:

   - Name: `James Burke`
   - Username: `james`
   - Strong password, “Require password to log in” checked.

8. Let the installer run (~10–15 minutes).
9. When prompted, **Restart Now**, remove the USB when it says so.

---

## 6. Post-Installation Setup

Log in to your new Mint desktop and do these first:

### 6.1 System Updates

Using Update Manager (GUI):

- Open **Update Manager** from the welcome screen or menu.
- Accept default mirrors if asked.
- Click **“Refresh”**, then **“Install Updates”**.
- Reboot if the kernel was updated.

Or via terminal:

```bash
sudo apt update
sudo apt full-upgrade -y
sudo apt autoremove -y
```

### 6.2 Timeshift Snapshots (Safety Net)

1. **Menu → Administration → Timeshift**.
2. Select **RSYNC**.
3. Choose your system partition.
4. Schedule: daily (keep 3) + weekly (keep 2).
5. Create a first snapshot.

This makes it trivial to roll back after a bad update or experiment.

### 6.3 Firewall

```bash
sudo apt install ufw -y
sudo ufw enable
sudo ufw status
```

---

## 7. Installing Development Tools

### 7.1 Visual Studio Code

Official Microsoft repo (recommended):

```bash
# Import Microsoft GPG key
wget -qO- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > packages.microsoft.gpg
sudo install -D -o root -g root -m 644 packages.microsoft.gpg /usr/share/keyrings/packages.microsoft.gpg
rm packages.microsoft.gpg

# Add VSCode repo
echo "deb [arch=amd64,arm64,armhf signed-by=/usr/share/keyrings/packages.microsoft.gpg] https://packages.microsoft.com/repos/code stable main" | sudo tee /etc/apt/sources.list.d/vscode.list

# Install
sudo apt update
sudo apt install code -y
```

Launch with `code` or from **Menu → Programming → Visual Studio Code**.

Suggested extensions:

- Markdown All in One
- GitLens
- GitHub Pull Requests
- Live Server
- Python, ESLint, etc., depending on your courses.

### 7.2 Git & GitHub

```bash
sudo apt install git -y

git config --global user.name "James P. Burke"
git config --global user.email "your.email@example.com"

ssh-keygen -t ed25519 -C "your.email@example.com"
# press Enter for defaults; set a passphrase if you want
cat ~/.ssh/id_ed25519.pub
```

Copy that key to GitHub (Settings → SSH and GPG keys → *New SSH key*).

### 7.3 Ruby & Jekyll (GitHub Pages)

```bash
sudo apt install ruby-full build-essential zlib1g-dev -y

echo 'export GEM_HOME="$HOME/gems"' >> ~/.bashrc
echo 'export PATH="$HOME/gems/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

gem install jekyll bundler
jekyll -v    # sanity check
```

Create a new Jekyll site:

```bash
mkdir -p ~/sites && cd ~/sites
jekyll new my-blog
cd my-blog
bundle exec jekyll serve
# Visit http://localhost:4000
```

Push to GitHub Pages following the GitHub Pages + Jekyll docs.

### 7.4 Chrome for Google Workspace

```bash
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
sudo dpkg -i google-chrome-stable_current_amd64.deb
sudo apt --fix-broken install -y
```

Sign in to your Google account, then create app‑like windows:

- Chrome menu → **More tools → Create shortcut… → “Open as window”**  
  for Classroom, Drive, Docs, etc.

---

## 8. Hardware Optimization for XPS 13 9360

The 9360 is already efficient; these tweaks refine it.

### 8.1 Power Management (TLP)

```bash
sudo apt install tlp tlp-rdw -y
sudo systemctl enable tlp
sudo systemctl start tlp
```

TLP automatically tunes CPU, PCIe, and USB power.

### 8.2 Intel Graphics

Your XPS 13 9360 uses Intel integrated graphics only; the `i915` driver is loaded automatically.

Optional extra power-savings (only if you want to experiment):

```bash
sudo nano /etc/modprobe.d/i915.conf
```

Add:

```conf
options i915 enable_fbc=1
```

### 8.3 Wi‑Fi – Intel 8265

You’re using **Intel Dual Band Wireless‑AC 8265**, which is the preferred card for Linux on this model.

Optional tweak to reduce disconnects and temper powersave:

```bash
sudo mkdir -p /etc/NetworkManager/conf.d
sudo nano /etc/NetworkManager/conf.d/wifi-powersave.conf
```

Put:

```ini
[connection]
wifi.powersave = 2
```

Then:

```bash
sudo systemctl restart NetworkManager
```

### 8.4 SSD TRIM

```bash
sudo systemctl enable fstrim.timer
sudo systemctl start fstrim.timer
sudo fstrim -av   # test run
```

### 8.5 Temperature Monitoring

```bash
sudo apt install lm-sensors htop -y
sudo sensors-detect   # accept defaults
sensors
```

Expect idle temps in the 40–50 °C range, moderate load 60–80 °C.

---

## 9. Stability Tips for XPS 13 9360

1. **Run a current kernel** (Mint 22 / Ubuntu 24.04 satisfy this).
2. **Keep BIOS up to date** via Dell’s support site.
3. **Thunderbolt/docks**:
   - If you don’t use TB3, disable Thunderbolt in BIOS for lower power and fewer wake‑up quirks.
   - If you use Dell TB16/D6000 docks and see freezes, update dock firmware and test with/without the dock.
4. **Avoid extreme powertop auto‑tuning**; some aggressive tunables can cause hard freezes on this model.
5. **NVMe quirks** (only if you see lockups under disk load):

   ```bash
   sudo nano /etc/default/grub
   # append inside GRUB_CMDLINE_LINUX_DEFAULT:
   nvme_core.default_ps_max_latency_us=170000
   sudo update-grub
   ```

---

## 10. Troubleshooting

### 10.1 Cannot Boot from USB

- Confirm USB is created in **GPT/UEFI** mode.
- Ensure **UEFI** (not Legacy) and **USB** first in boot order.
- Try another USB port or stick.

### 10.2 System Freezes / Hangs

Check in this order:

1. BIOS up to date? Thunderbolt disabled or dock firmware updated?
2. Using a recent kernel from your distro?
3. Did you apply many manual kernel parameters or powertop tunings? Remove them and revert to defaults first.
4. If freezes occur mostly on heavy I/O, test the NVMe parameter above.

### 10.3 Suspend/Resume Problems

- Test with no external devices attached; TB3 docks are common culprits.
- If system wakes to a black screen, try switching TTYs (`Ctrl` + `Alt` + `F2`) then back (`Ctrl` + `Alt` + `F1`); ensure system is fully updated.

### 10.4 Brightness Keys Not Working

```bash
sudo nano /etc/default/grub
```

Change:

```ini
GRUB_CMDLINE_LINUX_DEFAULT="quiet splash acpi_backlight=vendor"
```

Then:

```bash
sudo update-grub
sudo reboot
```

If that fails, try `acpi_backlight=native` or `video.use_native_backlight=1`.

### 10.5 Wi‑Fi Drops or Slow

With Intel 8265 this is uncommon, but if it happens:

- Ensure the `wifi.powersave = 2` tweak is set as above.
- Check `dmesg` for `iwlwifi` messages; update to latest kernel via normal distro updates.

---

## 11. Useful Resources

- Linux Mint – https://linuxmint.com/
- Dell XPS 13 (9360) hardware notes – ArchWiki and Dell Linux notes.
- VSCode on Linux – https://code.visualstudio.com/docs/setup/linux
- GitHub Pages + Jekyll – https://docs.github.com/en/pages

---

## 12. Maintenance Schedule (Practical)

**Weekly (5 minutes):**

```bash
sudo apt update && sudo apt full-upgrade -y
sudo apt autoremove -y
```

**Monthly (10 minutes):**

- Check Timeshift snapshots; prune old ones.
- Run `df -h` to glance at disk usage.
- Confirm `fstrim.timer` is active (`systemctl status fstrim.timer`).

**Occasionally:**

- Check Dell’s support page for BIOS updates.
- Glance at `sensors` under load to ensure temps are reasonable.

---

*Document Version: 2.0 (XPS 13 9360 specific)*  
*Last Updated: February 28, 2026*
