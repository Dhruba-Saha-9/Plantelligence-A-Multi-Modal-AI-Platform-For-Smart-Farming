from __future__ import annotations

import io
import os
from pathlib import Path

import numpy as np
import tensorflow as tf
from flask import Flask, abort, jsonify, request, send_from_directory
from flask_cors import CORS
from PIL import Image, UnidentifiedImageError

BASE_DIR = Path(__file__).resolve().parent
MODEL_DIR = BASE_DIR / "ml model"
MODEL_CANDIDATES = ("trained_model.h5", "trained_model.keras")
IMAGE_SIZE = (128, 128)
MAX_UPLOAD_BYTES = 10 * 1024 * 1024
ALLOWED_STATIC_EXTENSIONS = {
    ".html",
    ".css",
    ".js",
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".svg",
    ".ico",
    ".webp",
}

CLASS_NAMES = [
    "Apple___Apple_scab",
    "Apple___Black_rot",
    "Apple___Cedar_apple_rust",
    "Apple___healthy",
    "Blueberry___healthy",
    "Cherry_(including_sour)___Powdery_mildew",
    "Cherry_(including_sour)___healthy",
    "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot",
    "Corn_(maize)___Common_rust_",
    "Corn_(maize)___Northern_Leaf_Blight",
    "Corn_(maize)___healthy",
    "Grape___Black_rot",
    "Grape___Esca_(Black_Measles)",
    "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)",
    "Grape___healthy",
    "Orange___Haunglongbing_(Citrus_greening)",
    "Peach___Bacterial_spot",
    "Peach___healthy",
    "Pepper,_bell___Bacterial_spot",
    "Pepper,_bell___healthy",
    "Potato___Early_blight",
    "Potato___Late_blight",
    "Potato___healthy",
    "Raspberry___healthy",
    "Soybean___healthy",
    "Squash___Powdery_mildew",
    "Strawberry___Leaf_scorch",
    "Strawberry___healthy",
    "Tomato___Bacterial_spot",
    "Tomato___Early_blight",
    "Tomato___Late_blight",
    "Tomato___Leaf_Mold",
    "Tomato___Septoria_leaf_spot",
    "Tomato___Spider_mites Two-spotted_spider_mite",
    "Tomato___Target_Spot",
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus",
    "Tomato___Tomato_mosaic_virus",
    "Tomato___healthy",
]


def _friendly_label(value: str) -> str:
    return " ".join(value.replace("_", " ").replace(",", " ").split())


def _split_label(raw_label: str) -> tuple[str, str]:
    if "___" not in raw_label:
        return _friendly_label(raw_label), "Unknown"
    crop, disease = raw_label.split("___", maxsplit=1)
    return _friendly_label(crop), _friendly_label(disease)


def _build_recommendations(disease_name: str) -> list[str]:
    normalized = disease_name.lower()
    if "healthy" in normalized:
        return [
            "Leaf appears healthy in this image.",
            "Continue regular monitoring every 5-7 days.",
            "Keep irrigation and nutrition consistent to prevent stress.",
        ]
    if "blight" in normalized:
        return [
            "Remove heavily affected leaves to reduce spread.",
            "Avoid overhead irrigation and keep foliage dry.",
            "Apply a crop-safe fungicide as per label instructions.",
        ]
    if "rust" in normalized or "mildew" in normalized:
        return [
            "Improve air circulation around plants.",
            "Avoid water splash on foliage, especially late in the day.",
            "Use preventive fungicide based on crop guidance.",
        ]
    if "bacterial" in normalized or "virus" in normalized:
        return [
            "Isolate infected plants quickly to limit transmission.",
            "Disinfect tools and avoid handling wet plants.",
            "Consult local agronomy guidance for targeted control.",
        ]
    return [
        "Remove and dispose of infected leaves safely.",
        "Monitor nearby plants for similar symptoms.",
        "Consult local extension advice for crop-specific treatment.",
    ]


def _load_model():
    load_errors = []
    for model_name in MODEL_CANDIDATES:
        model_path = MODEL_DIR / model_name
        if not model_path.exists():
            load_errors.append(f"{model_name}: not found")
            continue
        try:
            print(f"[INFO] Loading model from {model_path} ...")
            return tf.keras.models.load_model(model_path)
        except Exception as exc:  # pragma: no cover - model load error path
            load_errors.append(f"{model_name}: {exc}")
    joined_errors = " | ".join(load_errors) if load_errors else "no model files detected"
    raise RuntimeError(f"Unable to load model from '{MODEL_DIR}'. {joined_errors}")


MODEL = _load_model()
print("[INFO] Model loaded successfully.")
app = Flask(__name__)
CORS(app)


def _image_bytes_to_batch(raw_bytes: bytes) -> np.ndarray:
    image = Image.open(io.BytesIO(raw_bytes)).convert("RGB")
    image = image.resize(IMAGE_SIZE)
    image_arr = np.asarray(image, dtype=np.float32)
    return np.expand_dims(image_arr, axis=0)


def predict_from_bytes(raw_bytes: bytes) -> dict:
    model_input = _image_bytes_to_batch(raw_bytes)
    probabilities = MODEL.predict(model_input, verbose=0)[0]
    top_indices = np.argsort(probabilities)[-3:][::-1]
    best_index = int(top_indices[0])
    raw_label = CLASS_NAMES[best_index]
    crop_name, disease_name = _split_label(raw_label)

    return {
        "predicted_class_raw": raw_label,
        "predicted_class": _friendly_label(raw_label),
        "crop": crop_name,
        "disease": disease_name,
        "confidence": round(float(probabilities[best_index]) * 100, 2),
        "top_predictions": [
            {
                "label": _friendly_label(CLASS_NAMES[int(class_idx)]),
                "confidence": round(float(probabilities[int(class_idx)]) * 100, 2),
            }
            for class_idx in top_indices
        ],
        "recommendations": _build_recommendations(disease_name),
    }


def predict_from_path(image_path: str | os.PathLike[str]) -> dict:
    with open(image_path, "rb") as image_file:
        return predict_from_bytes(image_file.read())


@app.get("/health")
def health_check():
    return jsonify({"status": "ok", "model_dir": str(MODEL_DIR)})


@app.post("/predict")
def predict():
    file = request.files.get("image")
    if file is None or not file.filename:
        return jsonify({"error": "No image file was provided."}), 400

    file_bytes = file.read()
    if not file_bytes:
        return jsonify({"error": "Uploaded file is empty."}), 400
    if len(file_bytes) > MAX_UPLOAD_BYTES:
        return jsonify({"error": "Image is too large. Max size is 10 MB."}), 400

    try:
        result = predict_from_bytes(file_bytes)
    except UnidentifiedImageError:
        return jsonify({"error": "Unsupported image format. Use PNG or JPG."}), 400
    except Exception as exc:  # pragma: no cover - runtime failure path
        return jsonify({"error": f"Prediction failed: {exc}"}), 500

    return jsonify(result)


@app.get("/")
def serve_index():
    return send_from_directory(BASE_DIR, "index.html")


@app.get("/<path:file_path>")
def serve_frontend_file(file_path: str):
    requested_path = (BASE_DIR / file_path).resolve()
    if BASE_DIR not in requested_path.parents:
        abort(404)
    if not requested_path.is_file():
        abort(404)
    if requested_path.suffix.lower() not in ALLOWED_STATIC_EXTENSIONS:
        abort(404)
    return send_from_directory(BASE_DIR, file_path)


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=False)
