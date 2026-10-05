@echo off
title Akina Motorsport - servidor local
cd /d "%~dp0"
echo.

rem Se o site ja estiver a correr na porta 3001, abre so o browser.
netstat -ano | findstr /R /C:":3001 .*LISTENING" >nul
if %errorlevel%==0 (
  echo  O site ja esta a correr. A abrir o browser...
  start http://localhost:3001
  timeout /t 3 >nul
  exit /b
)

echo  A arrancar o site Akina Motorsport...
echo  Site:   http://localhost:3001
echo  Painel: http://localhost:3001/admin
echo.
echo  Deixa esta janela aberta. Para parar: fecha a janela ou Ctrl+C.
echo.
start "" cmd /c "timeout /t 8 >nul & start http://localhost:3001"
call npx.cmd next dev -p 3001
pause
