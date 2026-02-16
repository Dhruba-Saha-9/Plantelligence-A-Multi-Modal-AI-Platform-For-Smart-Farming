@echo off
setlocal
cd /d "%~dp0"

if not exist ".\.venv\Scripts\python.exe" (
  echo [ERROR] Virtual environment not found at .\.venv
  echo Create it first, then install dependencies.
  pause
  exit /b 1
)

echo Starting Plantelligence leaf scanner server on http://127.0.0.1:5000 ...
start "" "http://127.0.0.1:5000/leaf-scanner.html"
".\.venv\Scripts\python.exe" leaf_disease_api.py
