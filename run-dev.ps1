# Refresh PATH to include Node.js and pnpm
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# Check if pnpm is available, if not use npx
$pnpmAvailable = Get-Command pnpm -ErrorAction SilentlyContinue

if (-not $pnpmAvailable) {
    Write-Host "pnpm not found. Using npx to run pnpm..." -ForegroundColor Yellow
    
    # Install dependencies using npx pnpm
    & "$nodePath\npx.cmd" --yes pnpm install
    
    # Run dev server using npx pnpm
    Write-Host "Starting dev server on http://localhost:3000..." -ForegroundColor Green
    & "$nodePath\npx.cmd" --yes pnpm dev
} else {
    Write-Host "pnpm found. Installing dependencies..." -ForegroundColor Green
    pnpm install
    
    Write-Host "Starting dev server on http://localhost:3000..." -ForegroundColor Green
    pnpm dev
}

