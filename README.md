# Plantelligence - Leaf Disease Integration

## What was integrated
- The leaf scanner page now performs real model inference.
- Backend API added: `leaf_disease_api.py`
- Frontend logic added: `leaf-scanner.js`
- Leaf scanner UI updated: `leaf-scanner.html`

## Prerequisites
Use your project virtual environment and install dependencies:

```powershell
.\.venv\Scripts\python.exe -m pip install -r "ml model/requirement.txt"
```

## Run
Start the app (API + frontend on one server):

```powershell
.\.venv\Scripts\python.exe leaf_disease_api.py
```

Open:

```text
http://127.0.0.1:5000/leaf-scanner.html
```

Quick start (double-click):

```text
start_leaf_scanner.bat
```

Optional: if you still serve static files separately (for example on port `5500`), the page will auto-fallback and use `http://127.0.0.1:5000` for prediction.

## API
- `GET /health` - health check
- `POST /predict` - multipart form upload with key `image`
