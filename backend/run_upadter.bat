@echo off
echo Current Directory: %cd%
cd /d "C:\Users\adevenish\ttmetoffice_aws\backend"
echo Changed Directory: %cd%

echo Checking if Python executable exists...
if exist "C:\Users\adevenish\ttmetoffice_aws\env\Scripts\python.exe" (
    echo Python executable found.
) else (
    echo Python executable not found. Please check the path.
    exit /b 1
)

echo Running Python Command: "C:\Users\adevenish\ttmetoffice_aws\env\Scripts\python.exe" manage.py updater
"C:\Users\adevenish\ttmetoffice_aws\env\Scripts\python.exe" manage.py updater

if %errorlevel% neq 0 (
    echo Python command failed with error level %errorlevel%.
) else (
    echo Python command executed successfully.
)