@echo off
REM ============================================
REM HARD ROCK GYM - Iniciar Sistema
REM ============================================
REM Este script abre 2 terminais automaticamente
REM ============================================

echo.
echo ========================================
echo HARD ROCK GYM - Iniciando Sistema
echo ========================================
echo.

REM Abrir Terminal 1 - Django Backend
echo Abrindo Django Backend (porta 8000)...
start cmd /k "cd /d d:\HardRock--main\backend-django && python manage.py runserver 0.0.0.0:8000"

REM Aguardar um pouco para Django inicializar
timeout /t 3 /nobreak

REM Abrir Terminal 2 - Vite Frontend
echo Abrindo Vite Frontend (porta 5175)...
start cmd /k "cd /d d:\HardRock--main && npm run dev"

REM Aguardar Vite inicializar
timeout /t 5 /nobreak

REM Abrir navegador automaticamente
echo Abrindo navegador...
start http://localhost:5175

echo.
echo ========================================
echo SISTEMA INICIADO!
echo ========================================
echo.
echo Frontend: http://localhost:5175
echo Backend:  http://localhost:8000
echo.
echo Login com:
echo   Email: admin@hardrock.com
echo   Senha: admin123
echo.
echo NÃO FECHE OS TERMINAIS!
echo ========================================
echo.

pause
