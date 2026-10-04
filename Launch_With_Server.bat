@echo off
setlocal
cd /d "%~dp0"

echo ========================================================
echo   Starting Awakening & Dispersion Local Server (Port 8000)...
echo ========================================================

:: Start lightweight python web server in background
start /min "AwakeningMapServer" python -m http.server 8000

:: Wait 1.5 seconds for server to bind
timeout /t 2 /nobreak >nul

:: Launch Edge in standalone App Mode
set EDGE_PATH="C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if not exist %EDGE_PATH% set EDGE_PATH="C:\Program Files\Microsoft\Edge\Application\msedge.exe"

set CHROME_PATH="C:\Program Files\Google\Chrome\Application\chrome.exe"
if not exist %CHROME_PATH% set CHROME_PATH="C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"

if exist %EDGE_PATH% (
    start "" %EDGE_PATH% --app="http://localhost:8000" --window-size=1366,850
    exit /b
)

if exist %CHROME_PATH% (
    start "" %CHROME_PATH% --app="http://localhost:8000" --window-size=1366,850
    exit /b
)

start "" http://localhost:8000
