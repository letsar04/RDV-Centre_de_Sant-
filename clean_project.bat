@echo off
echo Nettoyage du projet RdvSante pour envoi...
echo.

echo 1. Suppression des node_modules...
if exist backend\node_modules rmdir /s /q backend\node_modules
if exist mobile\node_modules rmdir /s /q mobile\node_modules

echo 2. Suppression des fichiers de log...
if exist mobile\logcat.txt del mobile\logcat.txt
if exist mobile\crash_log.txt del mobile\crash_log.txt
if exist mobile\tsc_errors.txt del mobile\tsc_errors.txt

echo 3. Suppression des fichiers de build...
if exist mobile\.bundle rmdir /s /q mobile\.bundle
if exist mobile\android\app\build rmdir /s /q mobile\android\app\build
if exist mobile\android\.gradle rmdir /s /q mobile\android\.gradle
if exist mobile\ios\build rmdir /s /q mobile\ios\build

echo 4. Suppression des fichiers cache...
if exist backend\.env del backend\.env
if exist mobile\.expo rmdir /s /q mobile\.expo

echo 5. Nettoyage des fichiers temporaires...
if exist backend\package-lock.json del backend\package-lock.json
if exist mobile\package-lock.json del mobile\package-lock.json
if exist package-lock.json del package-lock.json

echo.
echo Nettoyage termine !
echo.
echo Taille du dossier :
dir /s "c:\Users\PADSEM\RdvSante" | findstr "octets"
echo.
echo Vous pouvez maintenant compresser le dossier RdvSante
pause
