@echo off
chcp 1251 >nul
setlocal EnableDelayedExpansion

title VPK CORE - УСТАНОВЩИК

echo ======================================================
echo             VPK CORE - УСТАНОВКА МОДОВ
echo ======================================================
echo.

:: Проверка файлов
if not exist "%~dp0data\*.vpk" (
    echo [!] ОШИБКА: Файлы модов не найдены.
    echo.
    echo ТЫ НЕ РАСПАКОВАЛ АРХИВ!
    echo Извлеки папку "mods" из ZIP на рабочий стол.
    echo.
    pause
    exit /b
)

:: Поиск Dota 2
set "D_PATH="

:: Реестр Steam
for /f "tokens=2*" %%A in ('
    reg query "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\Steam App 570" /v InstallLocation 2^>nul
') do set "D_PATH=%%B"

:: Поиск по дискам
if not defined D_PATH (
    for %%D in (C D E F G H) do (
        if exist "%%D:\SteamLibrary\steamapps\common\dota 2 beta\game\dota" (
            set "D_PATH=%%D:\SteamLibrary\steamapps\common\dota 2 beta"
        )
        if exist "%%D:\Program Files (x86)\Steam\steamapps\common\dota 2 beta\game\dota" (
            set "D_PATH=%%D:\Program Files (x86)\Steam\steamapps\common\dota 2 beta"
        )
    )
)

:: Ручной ввод
if not defined D_PATH (
    echo [!] Дота не найдена автоматически.
    echo.
    set /p D_PATH=Введите путь к "dota 2 beta": 
)

:: Убираем кавычки
set "D_PATH=%D_PATH:"=%"

if not exist "%D_PATH%\game" (
    echo.
    echo [!] Неверный путь.
    pause
    exit /b
)

set "G_DIR=%D_PATH%\game"

cls
echo Путь: %D_PATH%
echo.
echo Выберите язык для установки:
echo.

set i=0

if exist "%G_DIR%\dota_russian" (
    set /a i+=1
    set "f[!i!]=dota_russian"
    echo [!i!] dota_russian
)

for /d %%D in ("%G_DIR%\dota_*") do (
    set "n=%%~nxD"
    if /i not "!n!"=="dota_russian" if /i not "!n!"=="dota_addons" (
        set /a i+=1
        set "f[!i!]=!n!"
        echo [!i!] !n!
    )
)

if %i%==0 (
    echo.
    echo [!] Языковые папки не найдены.
    pause
    exit /b
)

echo.
set /p c=Язык в доте: 

if not defined f[%c%] (
    echo.
    echo [!] Неверный выбор.
    pause
    exit /b
)

set "T=!f[%c%]!"
set "L_P=!T:dota_=!"

echo.
echo [+] Установка в !T!...
del /q "%G_DIR%\!T!\pak*_dir.vpk" >nul 2>&1
copy /y "%~dp0data\*.vpk" "%G_DIR%\!T!\" >nul

echo.
echo ======================================================
echo ГОТОВО!
echo В параметры запуска Steam добавь:
echo -language !L_P!
echo ======================================================
pause
