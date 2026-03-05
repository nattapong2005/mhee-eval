@echo off
chcp 65001 >nul
echo ===================================================
echo     Personnel Assessment System Setup ^& Runner
echo ===================================================
echo.

echo [1/4] Installing Backend Dependencies...
cd backend
call npm install
echo Generating Prisma Client...
call npx prisma generate
cd ..

echo.
echo [2/4] Installing Frontend Dependencies...
cd frontend
call npm install
cd ..

echo.
echo [3/4] Starting Backend Server...
start "Backend Server" cmd /k "cd backend && npm run dev"

echo.
echo [4/4] Starting Frontend Server...
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo ===================================================
echo All dependencies installed and servers are starting!
echo.
echo - The Backend will run in a new Command Prompt.
echo - The Frontend will run in another Command Prompt on port 3001.
echo.
echo You can safely close this window.
echo ===================================================
pause
