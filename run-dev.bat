@echo off
set "PATH=C:\Program Files\nodejs;%PATH%"
echo Installing dependencies...
call npx --yes pnpm install
echo.
echo Starting dev server on http://localhost:3000...
call npx --yes pnpm dev

