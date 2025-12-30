@echo off
chcp 1251 >nul
setlocal EnableDelayedExpansion

title VPK CORE - УСТАНОВЩИК

echo ======================================================
echo             VPK CORE - УСТАНОВКА МОДОВ
echo ======================================================
echo.

if not exist "%~dp0data\*.vpk" (
    echo [!] ОШИБКА: Файлы модов не найдены в папке "data".
    echo.
    echo Извлеки всё из архива перед запуском!
    echo.
    pause
    exit /b
)

set "D_PATH="
for /f "tokens=2*" %%A in ('reg query "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\Steam App 570" /v InstallLocation 2^>nul') do set "D_PATH=%%B"

if not defined D_PATH (
    for %%D in (C D E F G H) do (
        if exist "%%D:\SteamLibrary\steamapps\common\dota 2 beta\game\dota" set "D_PATH=%%D:\SteamLibrary\steamapps\common\dota 2 beta"
        if exist "%%D:\Program Files (x86)\Steam\steamapps\common\dota 2 beta\game\dota" set "D_PATH=%%D:\Program Files (x86)\Steam\steamapps\common\dota 2 beta"
    )
)

if not defined D_PATH (
    echo [!] Дота не найдена.
    set /p D_PATH=Введите путь к "dota 2 beta": 
)

set "D_PATH=%D_PATH:"=%"
set "G_DIR=%D_PATH%\game"
set "MOD_DIR=%G_DIR%\VPKCORE"
set "GI_FILE=%G_DIR%\dota\gameinfo_branchspecific.gi"

if not exist "%G_DIR%\dota" (
    echo [!] Ошибка: Неверный путь, папка game\dota отсутствует.
    pause
    exit /b
)

cls
echo [+] Найдено: %D_PATH%

if not exist "%MOD_DIR%" (
    echo [+] Создаю папку VPKCORE...
    mkdir "%MOD_DIR%"
)

echo [+] Копирую моды...
del /q "%MOD_DIR%\*.vpk" >nul 2>&1
copy /y "%~dp0data\*.vpk" "%MOD_DIR%\" >nul

echo [+] Патчу gameinfo_branchspecific.gi...

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
echo             Game				VPKCORE
echo             Mod					VPKCORE
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
echo ГОТОВО!
echo Моды установлены в VPKCORE.
echo ======================================================
pause