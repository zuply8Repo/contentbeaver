# Quick Start Guide

## Problem
`pnpm` command is not recognized in PowerShell.

## Solution

### Option 1: Install Node.js and pnpm (Recommended)

1. **Install Node.js** (if not already installed):
   - Download from: https://nodejs.org/ (LTS version recommended)
   - Or use winget: `winget install OpenJS.NodeJS.LTS`
   - **Important**: After installation, close and reopen your terminal/PowerShell

2. **Install pnpm**:
   ```powershell
   npm install -g pnpm
   ```
   Or use the standalone installer:
   ```powershell
   iwr https://get.pnpm.io/install.ps1 -useb | iex
   ```

3. **Install dependencies and run dev server**:
   ```powershell
   pnpm install
   pnpm dev
   ```

### Option 2: Use the Setup Script

Run the provided setup script:
```powershell
powershell -ExecutionPolicy Bypass -File .\setup-and-run.ps1
```

### Option 3: Use npm instead (if Node.js is installed)

If you have Node.js but pnpm isn't working, you can use npm:
```powershell
npm install
npm run dev
```

## After Installation

If you just installed Node.js or pnpm, you may need to:
- Close and reopen your terminal/PowerShell window
- Or refresh the PATH: `$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")`

The dev server will run on **http://localhost:3000**

