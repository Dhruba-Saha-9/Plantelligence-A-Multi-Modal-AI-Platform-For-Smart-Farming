(() => {
  const inputs = {
    soilType: document.getElementById("soil-type"),
    ph: document.getElementById("soil-ph"),
    moisture: document.getElementById("soil-moisture"),
    n: document.getElementById("soil-n"),
    p: document.getElementById("soil-p"),
    k: document.getElementById("soil-k")
  };

  const analyzeButton = document.getElementById("analyze-soil-btn");
  const statusText = document.getElementById("soil-status");
  const placeholder = document.getElementById("soil-analysis-placeholder");
  const loadingPanel = document.getElementById("soil-analysis-loading");
  const resultsPanel = document.getElementById("soil-analysis-results");

  const healthScore = document.getElementById("soil-health-score");
  const diagnosisList = document.getElementById("soil-diagnosis-list");
  const fertilizerList = document.getElementById("soil-fertilizer-list");

  if (!analyzeButton) {
    return;
  }

  function setStatus(message, isError) {
    statusText.textContent = message;
    statusText.classList.toggle("status-error", Boolean(isError));
  }

  function setLoading(isLoading) {
    analyzeButton.disabled = isLoading;
    loadingPanel.classList.toggle("is-visible", isLoading);
  }

  function showResults() {
    placeholder.style.display = "none";
    resultsPanel.classList.add("is-visible");
  }

  function parseValue(inputElement) {
    const value = Number.parseFloat((inputElement?.value || "").trim());
    return Number.isFinite(value) ? value : null;
  }

  function addListItems(targetList, items) {
    targetList.innerHTML = "";
    items.forEach((itemText) => {
      const listItem = document.createElement("li");
      listItem.textContent = itemText;
      targetList.appendChild(listItem);
    });
  }

  function nutrientStatus(value, low, high) {
    if (value < low) {
      return "Low";
    }
    if (value > high) {
      return "High";
    }
    return "Optimal";
  }

  function calculateHealthScore(ph, moisture, n, p, k) {
    let score = 40;

    if (ph >= 6 && ph <= 7.5) {
      score += 18;
    } else if (ph >= 5.5 && ph <= 8) {
      score += 10;
    } else {
      score += 3;
    }

    if (moisture >= 18 && moisture <= 35) {
      score += 16;
    } else if (moisture >= 12 && moisture <= 45) {
      score += 10;
    } else {
      score += 4;
    }

    const nStatus = nutrientStatus(n, 120, 280);
    const pStatus = nutrientStatus(p, 18, 45);
    const kStatus = nutrientStatus(k, 120, 320);

    score += nStatus === "Optimal" ? 9 : 4;
    score += pStatus === "Optimal" ? 9 : 4;
    score += kStatus === "Optimal" ? 8 : 4;

    return {
      score: Math.min(100, Math.max(0, Math.round(score))),
      nStatus,
      pStatus,
      kStatus
    };
  }

  function buildDiagnosis(soilType, ph, moisture, nStatus, pStatus, kStatus) {
    const diagnosis = [];

    if (ph < 6) {
      diagnosis.push("Soil is acidic; liming may improve nutrient availability.");
    } else if (ph > 7.8) {
      diagnosis.push("Soil is alkaline; sulfur/organic amendments can help optimize pH.");
    } else {
      diagnosis.push("Soil pH is in a favorable range for most crops.");
    }

    if (moisture < 15) {
      diagnosis.push("Moisture is low; soil may face stress during early crop growth.");
    } else if (moisture > 40) {
      diagnosis.push("Moisture is high; drainage monitoring is recommended.");
    } else {
      diagnosis.push("Moisture is within a healthy operating range.");
    }

    diagnosis.push(`Nitrogen status: ${nStatus}.`);
    diagnosis.push(`Phosphorus status: ${pStatus}.`);
    diagnosis.push(`Potassium status: ${kStatus}.`);
    diagnosis.push(`Soil type considered: ${soilType}.`);

    return diagnosis;
  }

  function buildFertilizerPlan(ph, n, p, k, nStatus, pStatus, kStatus) {
    const plan = [];

    if (nStatus === "Low") {
      const nGap = Math.max(0, 160 - n);
      plan.push(`Apply ${Math.round(0.7 * nGap)} kg N/ha basal and split ${Math.round(0.3 * nGap)} kg N/ha for top dressing.`);
    } else if (nStatus === "High") {
      plan.push("Reduce nitrogen dose by 15-20% to avoid excess vegetative growth.");
    } else {
      plan.push("Maintain moderate nitrogen schedule aligned with crop stage.");
    }

    if (pStatus === "Low") {
      const pGap = Math.max(0, 30 - p);
      plan.push(`Apply ${Math.max(15, Math.round(1.2 * pGap))} kg P/ha before sowing to correct phosphorus deficiency.`);
    } else if (pStatus === "High") {
      plan.push("Avoid heavy phosphorus application this cycle; monitor with next soil test.");
    } else {
      plan.push("Use balanced phosphorus dose based on crop demand.");
    }

    if (kStatus === "Low") {
      const kGap = Math.max(0, 180 - k);
      plan.push(`Add ${Math.max(20, Math.round(0.5 * kGap))} kg K/ha to strengthen root and stress tolerance.`);
    } else if (kStatus === "High") {
      plan.push("Potassium is adequate; prioritize micronutrients and organic matter.");
    } else {
      plan.push("Apply maintenance potassium dose during land preparation.");
    }

    if (ph < 6) {
      plan.push("Incorporate agricultural lime with organic manure to gradually raise pH.");
    } else if (ph > 7.8) {
      plan.push("Use acid-forming fertilizers and compost to gradually improve pH balance.");
    }

    plan.push("Re-test soil after one crop cycle to recalibrate nutrient doses.");
    return plan;
  }

  async function runSoilAnalysis() {
    const soilType = (inputs.soilType?.value || "").trim() || "Unknown";
    const ph = parseValue(inputs.ph);
    const moisture = parseValue(inputs.moisture);
    const n = parseValue(inputs.n);
    const p = parseValue(inputs.p);
    const k = parseValue(inputs.k);

    if (ph === null || moisture === null || n === null || p === null || k === null) {
      setStatus("Please enter numeric values for pH, moisture, N, P, and K.", true);
      return;
    }

    setLoading(true);
    setStatus("Running soil analysis...");

    await new Promise((resolve) => {
      window.setTimeout(resolve, 900);
    });

    const scoreResult = calculateHealthScore(ph, moisture, n, p, k);
    const diagnosis = buildDiagnosis(soilType, ph, moisture, scoreResult.nStatus, scoreResult.pStatus, scoreResult.kStatus);
    const plan = buildFertilizerPlan(ph, n, p, k, scoreResult.nStatus, scoreResult.pStatus, scoreResult.kStatus);

    healthScore.innerHTML = `Overall rating: <strong>${(scoreResult.score / 10).toFixed(1)} / 10 (${scoreResult.score}/100)</strong>.`;
    addListItems(diagnosisList, diagnosis);
    addListItems(fertilizerList, plan);

    showResults();
    setLoading(false);
    setStatus("Soil analysis generated successfully.", false);
    document.getElementById("analyze")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  analyzeButton.addEventListener("click", () => {
    runSoilAnalysis().catch((error) => {
      setLoading(false);
      setStatus(`Unable to analyze soil: ${error.message}`, true);
    });
  });
})();
