(() => {
  const MAX_FILE_SIZE = 10 * 1024 * 1024;
  const API_TIMEOUT_MS = 5000;

  const form = document.getElementById("leaf-scanner-form");
  const uploadBox = document.getElementById("upload-box");
  const fileInput = document.getElementById("leaf-image-input");
  const analyzeButton = document.getElementById("analyze-button");
  const preview = document.getElementById("leaf-preview");
  const selectedFileLabel = document.getElementById("selected-file-label");
  const statusText = document.getElementById("status-text");
  const placeholder = document.getElementById("analysis-placeholder");
  const loadingPanel = document.getElementById("analysis-loading");
  const resultsPanel = document.getElementById("analysis-results");
  const detectedDisease = document.getElementById("detected-disease");
  const confidenceScore = document.getElementById("confidence-score");
  const topPredictionsList = document.getElementById("top-predictions-list");
  const recommendationsList = document.getElementById("recommendations-list");

  if (!form) {
    return;
  }

  let selectedFile = null;
  let previewObjectUrl = null;
  let activeApiBase = null;
  const apiBases = [];

  if (window.location.origin && window.location.origin.startsWith("http")) {
    apiBases.push(window.location.origin);
  }
  if (!apiBases.includes("http://127.0.0.1:5000")) {
    apiBases.push("http://127.0.0.1:5000");
  }

  function setStatus(message, isError = false) {
    statusText.textContent = message;
    statusText.classList.toggle("status-error", isError);
  }

  function setLoading(isLoading) {
    analyzeButton.disabled = isLoading;
    loadingPanel.classList.toggle("is-visible", isLoading);
  }

  function hideResults() {
    resultsPanel.classList.remove("is-visible");
    placeholder.style.display = "block";
  }

  function showResults() {
    placeholder.style.display = "none";
    resultsPanel.classList.add("is-visible");
  }

  function setListItems(listElement, values) {
    listElement.innerHTML = "";
    values.forEach((value) => {
      const item = document.createElement("li");
      item.textContent = value;
      listElement.appendChild(item);
    });
  }

  async function fetchWithTimeout(url, options = {}) {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), API_TIMEOUT_MS);
    try {
      return await fetch(url, {
        ...options,
        signal: controller.signal,
      });
    } finally {
      window.clearTimeout(timeoutId);
    }
  }

  async function detectApiBase() {
    for (const base of apiBases) {
      try {
        const response = await fetchWithTimeout(`${base}/health`);
        if (!response.ok) {
          continue;
        }
        const payload = await response.json();
        if (payload.status === "ok") {
          activeApiBase = base;
          return base;
        }
      } catch (error) {
        // Try next candidate.
      }
    }
    return null;
  }

  function resetPreview() {
    if (previewObjectUrl) {
      URL.revokeObjectURL(previewObjectUrl);
      previewObjectUrl = null;
    }
    preview.removeAttribute("src");
    preview.classList.remove("is-visible");
  }

  function setSelectedFile(file) {
    selectedFile = file;
    selectedFileLabel.textContent = file.name;

    resetPreview();
    previewObjectUrl = URL.createObjectURL(file);
    preview.src = previewObjectUrl;
    preview.classList.add("is-visible");
  }

  function clearSelectedFile() {
    selectedFile = null;
    selectedFileLabel.textContent = "No file selected";
    fileInput.value = "";
    resetPreview();
  }

  function validateFile(file) {
    if (!file) {
      setStatus("Please choose an image first.", true);
      return false;
    }
    if (!file.type.startsWith("image/")) {
      setStatus("Unsupported file type. Please upload PNG or JPG.", true);
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      setStatus("Image size exceeds 10 MB.", true);
      return false;
    }
    return true;
  }

  function applyPredictionResult(result) {
    const diseaseText = `${result.crop} - ${result.disease}`;
    detectedDisease.textContent = diseaseText;
    confidenceScore.textContent = `${result.confidence.toFixed(2)}% confidence`;

    const topPredictions = result.top_predictions.map(
      (item) => `${item.label} (${item.confidence.toFixed(2)}%)`
    );
    setListItems(topPredictionsList, topPredictions);
    setListItems(recommendationsList, result.recommendations);
    showResults();
  }

  async function runPrediction(file) {
    if (!activeApiBase) {
      const detectedBase = await detectApiBase();
      if (!detectedBase) {
        throw new Error(
          'API is unreachable. Start it with ".venv\\Scripts\\python leaf_disease_api.py".'
        );
      }
    }

    const formData = new FormData();
    formData.append("image", file);

    const response = await fetchWithTimeout(`${activeApiBase}/predict`, {
      method: "POST",
      body: formData,
    });

    let payload;
    try {
      payload = await response.json();
    } catch (error) {
      throw new Error("The API returned an invalid response.");
    }

    if (!response.ok) {
      throw new Error(payload.error || "Prediction request failed.");
    }

    return payload;
  }

  fileInput.addEventListener("change", () => {
    const [file] = fileInput.files || [];
    if (!file) {
      clearSelectedFile();
      return;
    }
    if (!validateFile(file)) {
      clearSelectedFile();
      return;
    }
    setSelectedFile(file);
    setStatus("Image selected. Click Analyze to run the model.");
  });

  ["dragenter", "dragover"].forEach((eventName) => {
    uploadBox.addEventListener(eventName, (event) => {
      event.preventDefault();
      event.stopPropagation();
      uploadBox.classList.add("drag-active");
    });
  });

  ["dragleave", "drop"].forEach((eventName) => {
    uploadBox.addEventListener(eventName, (event) => {
      event.preventDefault();
      event.stopPropagation();
      uploadBox.classList.remove("drag-active");
    });
  });

  uploadBox.addEventListener("drop", (event) => {
    const droppedFiles = event.dataTransfer?.files;
    if (!droppedFiles || droppedFiles.length === 0) {
      return;
    }
    const file = droppedFiles[0];
    if (!validateFile(file)) {
      clearSelectedFile();
      return;
    }
    setSelectedFile(file);
    setStatus("Image selected. Click Analyze to run the model.");
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!validateFile(selectedFile)) {
      return;
    }

    setLoading(true);
    hideResults();
    setStatus("Analyzing image...");

    try {
      const result = await runPrediction(selectedFile);
      applyPredictionResult(result);
      setStatus("Analysis complete.");
    } catch (error) {
      hideResults();
      setStatus(error.message, true);
    } finally {
      setLoading(false);
    }
  });

  detectApiBase().then((base) => {
    if (base) {
      setStatus(`API connected at ${base}. Upload image and click Analyze.`);
    } else {
      setStatus(
        'API not detected. Start it with ".venv\\Scripts\\python leaf_disease_api.py".',
        true
      );
    }
  });
})();
