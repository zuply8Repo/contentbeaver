# Setup script to install Node.js, pnpm, and run dev server
Write-Host "Checking for Node.js..." -ForegroundColor Cyan

# Refresh PATH
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# Check if Node.js is installed
$nodeInstalled = Get-Command node -ErrorAction SilentlyContinue

if (-not $nodeInstalled) {
    Write-Host "Node.js not found. Installing Node.js LTS..." -ForegroundColor Yellow
    winget install OpenJS.NodeJS.LTS --silent --accept-package-agreements --accept-source-agreements
    
    Write-Host "Waiting for installation to complete..." -ForegroundColor Yellow
    Start-Sleep -Seconds 10
    
    # Refresh PATH again after installation
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
    
    # Verify installation
    $nodeInstalled = Get-Command node -ErrorAction SilentlyContinue
    if (-not $nodeInstalled) {
        Write-Host "Node.js installation may require a terminal restart. Please restart your terminal and run this script again." -ForegroundColor Red
        exit 1
    }
}

Write-Host "Node.js version: $(node --version)" -ForegroundColor Green

# Check if pnpm is installed
Write-Host "Checking for pnpm..." -ForegroundColor Cyan
$pnpmInstalled = Get-Command pnpm -ErrorAction SilentlyContinue

if (-not $pnpmInstalled) {
    Write-Host "Installing pnpm..." -ForegroundColor Yellow
    npm install -g pnpm
    
    # Refresh PATH
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
    
    # Verify installation
    $pnpmInstalled = Get-Command pnpm -ErrorAction SilentlyContinue
    if (-not $pnpmInstalled) {
        Write-Host "Installing pnpm via standalone installer..." -ForegroundColor Yellow
        iwr https://get.pnpm.io/install.ps1 -useb | iex
        $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
    }
}

Write-Host "pnpm version: $(pnpm --version)" -ForegroundColor Green

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Cyan
pnpm install

# Run dev server
Write-Host "Starting development server on http://localhost:3000..." -ForegroundColor Cyan
pnpm dev

