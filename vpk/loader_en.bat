@echo off
setlocal enabledelayedexpansion
title VPK CORE - MOD INSTALLER

echo ======================================================
echo             VPK CORE - MOD INSTALLER
echo ======================================================
echo.

:: 1. ПРОВЕРКА ФАЙЛОВ
if not exist "%~dp0data\*.vpk" (
    echo [!] ERROR: Mod files not found.
    echo.
    echo YOU MUST EXTRACT THE "MODS" FOLDER FROM THE ZIP!
    echo Do not run the script inside the archive.
    echo.
    pause
    exit /b
)

set "D_PATH="
:: Ищем путь через реестр
for /f "tokens=2*" %%A in ('reg query "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\Steam App 570" /v "InstallLocation" 2^>nul') do set "D_PATH=%%B"

:: Если реестр пуст - ищем по дискам
if "%D_PATH%"=="" (
    for %%D in (C D E F G H) do (
        if exist "%%D:\SteamLibrary\steamapps\common\dota 2 beta\game\dota" set "D_PATH=%%D:\SteamLibrary\steamapps\common\dota 2 beta"
        if exist "%%D:\Program Files (x86)\Steam\steamapps\common\dota 2 beta\game\dota" set "D_PATH=%%D:\Program Files (x86)\Steam\steamapps\common\dota 2 beta"
    )
)

:: Если совсем не нашли - ручной ввод
if "%D_PATH%"=="" (
    echo [!] Dota 2 not found automatically.
    set /p D_PATH="Enter path to 'dota 2 beta' folder: "
)
set "D_PATH=%D_PATH:"=%"

if not exist "%D_PATH%\game\dota" (
    echo [!] ERROR: Invalid path. 'game\dota' not found.
    pause
    exit /b
)

set "G_DIR=%D_PATH%\game"
cls
echo Target: %D_PATH%
echo.
echo Select your language:
set i=0

:: RU Всегда первый
if exist "%G_DIR%\dota_russian" (
    set /a i+=1
    set "f[!i!]=dota_russian"
    echo [!i!] dota_russian
)

:: Остальные кроме RU и аддонов
for /d %%D in ("%G_DIR%\dota_*") do (
    set "n=%%~nxD"
    if /i not "!n!"=="dota_russian" if /i not "!n!"=="dota_addons" (
        set /a i+=1
        set "f[!i!]=!n!"
        echo [!i!] !n!
    )
)

echo.
set /p c="Choice: "
if not defined f[%c%] ( echo Invalid. & pause & exit /b )

set "T=!f[%c%]!"
set "L_P=!T:dota_=!"

echo.
echo [+] Installing to !T!...
del /q "%G_DIR%\!T!\pak*_dir.vpk" >nul 2>&1
copy /y "%~dp0data\*.vpk" "%G_DIR%\!T!\" >nul

echo.
echo ======================================================
echo SUCCESS!
echo Add to Steam launch options: -language !L_P!
echo ======================================================
pause