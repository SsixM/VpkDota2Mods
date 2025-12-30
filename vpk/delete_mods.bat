@echo off
setlocal EnableDelayedExpansion

title VPK CORE - UNINSTALLER

echo ======================================================
echo             VPK CORE - MOD UNINSTALLER
echo ======================================================
echo.

set "D_PATH="
for /f "tokens=2*" %%A in ('reg query "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\Steam App 570" /v InstallLocation 2^>nul') do set "D_PATH=%%B"

if not defined D_PATH (
    for %%D in (C D E F G H) do (
        if exist "%%D:\SteamLibrary\steamapps\common\dota 2 beta\game\dota" set "D_PATH=%%D:\SteamLibrary\steamapps\common\dota 2 beta"
        if exist "%%D:\Program Files (x86)\Steam\steamapps\common\dota 2 beta\game\dota" set "D_PATH=%%D:\Program Files (x86)\Steam\steamapps\common\dota 2 beta"
    )
)

if not defined D_PATH (
    echo [!] Dota 2 not found automatically.
    set /p D_PATH="Enter path to 'dota 2 beta' folder: "
)

set "D_PATH=%D_PATH:"=%"
set "G_DIR=%D_PATH%\game"
set "MOD_DIR=%G_DIR%\VPKCORE"
set "GI_FILE=%G_DIR%\dota\gameinfo_branchspecific.gi"

if not exist "%G_DIR%\dota" (
    echo [!] ERROR: Game folder not found. Nothing to uninstall.
    pause
    exit /b
)

cls
echo [+] Found: %D_PATH%
echo.

if exist "%MOD_DIR%" (
    echo [+] Removing VPKCORE folder...
    rd /s /q "%MOD_DIR%"
) else (
    echo [?] VPKCORE folder not found. Already clean?
)

echo [+] Restoring original gameinfo_branchspecific.gi...

(
echo "GameInfo"
echo {
echo     game         "Dota 2"
echo     title        "Dota 2"
echo.
echo     FileSystem
echo     {
echo         SteamAppId				570
echo         BreakpadAppId			373300
echo         BreakpadAppId_Tools		375360
echo.
echo         SearchPaths
echo         {
echo             Game_Language		dota_*LANGUAGE*
echo             Game_LowViolence	dota_lv
echo.
echo             Game				dota
echo             Game				core
echo.
echo             Mod					dota
echo.
echo             Write				dota
echo.
echo             AddonRoot_Language	dota_*LANGUAGE*_addons
echo             AddonRoot			dota_addons
echo.
echo             PublicContent		dota_core
echo             PublicContent		core
echo         }
echo.
echo         "UserSettingsPathID"	"USRLOCAL"
echo         "LegacyUserSettingsPathID"	"MOD"
echo.
echo         AddonsChangeDefaultWritePath 0
echo     }
echo }
) > "%GI_FILE%"

echo.
echo ======================================================
echo SUCCESS!
echo Mods removed and config restored.
echo ======================================================
pause