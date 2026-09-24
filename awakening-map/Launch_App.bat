@echo off
setlocal
cd /d "%~dp0"

echo ========================================================
echo   Awakening & Dispersion - Interactive Spiritual Map
echo   Launching Standalone Desktop Application...
echo ========================================================

:: Check for Edge or Chrome to run in standalone app window
set EDGE_PATH="C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if not exist %EDGE_PATH% set EDGE_PATH="C:\Program Files\Microsoft\Edge\Application\msedge.exe"

set CHROME_PATH="C:\Program Files\Google\Chrome\Application\chrome.exe"
if not exist %CHROME_PATH% set CHROME_PATH="C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"

:: 1. If Edge exists, launch as a sleek native app window
if exist %EDGE_PATH% (
    start "" %EDGE_PATH% --app="file:///%~dp0index.html" --window-size=1366,850
    exit /b
)

:: 2. Else if Chrome exists, launch in app mode
if exist %CHROME_PATH% (
    start "" %CHROME_PATH% --app="file:///%~dp0index.html" --window-size=1366,850
    exit /b
)

:: 3. Fallback: open default web browser
start "" "%~dp0index.html"
