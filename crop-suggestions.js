(() => {
  const crops = [
    {
      name: "Rice",
      seasons: ["Kharif"],
      ph: [5.0, 7.2],
      temp: [22, 35],
      rainfall: [1000, 2500],
      humidity: [65, 95],
      moisture: [40, 95],
      sunlight: [5, 8],
      n: [80, 180],
      p: [20, 70],
      k: [40, 140],
      waterNeed: "High",
      yieldRange: "3.5-6.0 t/ha",
      rotation: "Rotate with pulses after harvest to improve soil nitrogen.",
      contingency: "If rainfall drops, switch part area to short-duration maize."
    },
    {
      name: "Maize (Hybrid)",
      seasons: ["Kharif", "Rabi"],
      ph: [5.5, 7.8],
      temp: [18, 32],
      rainfall: [500, 1200],
      humidity: [45, 80],
      moisture: [25, 60],
      sunlight: [6, 10],
      n: [120, 220],
      p: [40, 90],
      k: [40, 120],
      waterNeed: "Moderate",
      yieldRange: "5.0-8.0 t/ha",
      rotation: "Follow with legumes to break pest cycle and improve soil health.",
      contingency: "Use drought-tolerant hybrid if monsoon onset is delayed."
    },
    {
      name: "Soybean",
      seasons: ["Kharif"],
      ph: [6.0, 7.8],
      temp: [20, 33],
      rainfall: [450, 900],
      humidity: [50, 85],
      moisture: [20, 55],
      sunlight: [6, 9],
      n: [20, 120],
      p: [25, 80],
      k: [80, 220],
      waterNeed: "Low to Moderate",
      yieldRange: "1.8-3.0 t/ha",
      rotation: "Pair with wheat or chickpea in next season for better returns.",
      contingency: "Use seed treatment and drainage planning in high-rainfall pockets."
    },
    {
      name: "Cotton",
      seasons: ["Kharif"],
      ph: [5.8, 8.0],
      temp: [21, 36],
      rainfall: [500, 1000],
      humidity: [40, 75],
      moisture: [20, 50],
      sunlight: [7, 10],
      n: [90, 180],
      p: [20, 60],
      k: [40, 120],
      waterNeed: "Moderate",
      yieldRange: "1.5-2.8 t/ha (lint equivalent)",
      rotation: "Rotate with cereals or pulses to reduce pest pressure.",
      contingency: "Adopt drip if irrigation is uncertain during boll formation."
    },
    {
      name: "Wheat",
      seasons: ["Rabi"],
      ph: [6.0, 7.8],
      temp: [10, 26],
      rainfall: [300, 900],
      humidity: [35, 70],
      moisture: [20, 55],
      sunlight: [6, 9],
      n: [80, 180],
      p: [30, 80],
      k: [40, 120],
      waterNeed: "Moderate",
      yieldRange: "3.0-5.5 t/ha",
      rotation: "Good after soybean or mung bean for nitrogen advantage.",
      contingency: "Choose heat-tolerant variety if late sowing is expected."
    },
    {
      name: "Chickpea",
      seasons: ["Rabi"],
      ph: [6.0, 8.0],
      temp: [14, 30],
      rainfall: [300, 800],
      humidity: [30, 65],
      moisture: [15, 40],
      sunlight: [6, 9],
      n: [15, 90],
      p: [20, 70],
      k: [20, 90],
      waterNeed: "Low",
      yieldRange: "1.2-2.6 t/ha",
      rotation: "Follow with maize or sorghum to use residual nitrogen.",
      contingency: "Plan one protective irrigation at flowering if soil dries fast."
    },
    {
      name: "Groundnut",
      seasons: ["Kharif", "Zaid"],
      ph: [5.8, 7.5],
      temp: [20, 34],
      rainfall: [500, 1100],
      humidity: [40, 80],
      moisture: [20, 55],
      sunlight: [6, 10],
      n: [10, 80],
      p: [20, 70],
      k: [30, 100],
      waterNeed: "Low to Moderate",
      yieldRange: "1.5-3.2 t/ha",
      rotation: "Rotate with cereals to reduce disease carryover.",
      contingency: "Use raised beds in heavy soils to avoid waterlogging."
    },
    {
      name: "Mustard",
      seasons: ["Rabi"],
      ph: [6.0, 8.2],
      temp: [12, 28],
      rainfall: [250, 700],
      humidity: [30, 65],
      moisture: [15, 40],
      sunlight: [6, 9],
      n: [40, 120],
      p: [20, 60],
      k: [20, 80],
      waterNeed: "Low",
      yieldRange: "1.0-2.2 t/ha",
      rotation: "Include legumes every 2 years for nutrient balance.",
      contingency: "Avoid excess irrigation during flowering and pod stage."
    },
    {
      name: "Sorghum",
      seasons: ["Kharif", "Rabi"],
      ph: [5.5, 8.0],
      temp: [20, 35],
      rainfall: [350, 900],
      humidity: [30, 70],
      moisture: [15, 45],
      sunlight: [6, 10],
      n: [40, 140],
      p: [20, 60],
      k: [20, 90],
      waterNeed: "Low",
      yieldRange: "2.0-4.5 t/ha",
      rotation: "Use with legumes for better soil structure and fertility.",
      contingency: "Useful fallback crop under low-rainfall forecasts."
    },
    {
      name: "Sugarcane",
      seasons: ["Perennial"],
      ph: [6.0, 8.0],
      temp: [20, 38],
      rainfall: [900, 1800],
      humidity: [55, 90],
      moisture: [35, 80],
      sunlight: [7, 10],
      n: [120, 300],
      p: [40, 120],
      k: [100, 260],
      waterNeed: "High",
      yieldRange: "60-110 t/ha",
      rotation: "Alternate with short-duration legumes after ratoon cycle.",
      contingency: "Drip with fertigation is strongly recommended in dry spells."
    }
  ];

  const inputs = {
    location: document.getElementById("location"),
    season: document.getElementById("season"),
    soilType: document.getElementById("soil-type"),
    soilPh: document.getElementById("soil-ph"),
    nitrogen: document.getElementById("nitrogen"),
    phosphorus: document.getElementById("phosphorus"),
    potassium: document.getElementById("potassium"),
    moisture: document.getElementById("moisture"),
    rainfall: document.getElementById("rainfall"),
    humidity: document.getElementById("humidity"),
    tempRange: document.getElementById("temp-range"),
    irrigation: document.getElementById("irrigation"),
    waterSource: document.getElementById("water-source"),
    sunlight: document.getElementById("sunlight"),
    marketFocus: document.getElementById("market-focus")
  };

  const generateButton = document.getElementById("generate-crop-btn");
  const statusText = document.getElementById("crop-status");
  const placeholder = document.getElementById("analysis-placeholder");
  const loadingPanel = document.getElementById("analysis-loading");
  const resultsPanel = document.getElementById("analysis-results");

  const metricSuitability = document.getElementById("metric-suitability");
  const metricSuitabilityNote = document.getElementById("metric-suitability-note");
  const metricWaterRisk = document.getElementById("metric-water-risk");
  const metricWaterNote = document.getElementById("metric-water-note");
  const metricMarket = document.getElementById("metric-market");
  const metricMarketNote = document.getElementById("metric-market-note");

  const inputChipRow = document.getElementById("input-chip-row");
  const cropRankBody = document.getElementById("crop-rank-body");
  const bestFitPrimary = document.getElementById("best-fit-primary");
  const bestFitWhy = document.getElementById("best-fit-why");
  const nutritionBasal = document.getElementById("nutrition-basal");
  const nutritionTop = document.getElementById("nutrition-top");
  const irrigationNote = document.getElementById("irrigation-note");
  const rotationList = document.getElementById("rotation-list");
  const riskNote = document.getElementById("risk-note");

  if (!generateButton) {
    return;
  }

  function parseNumber(inputElement) {
    const value = Number.parseFloat((inputElement?.value || "").trim());
    return Number.isFinite(value) ? value : null;
  }

  function parseTemperatureAverage(tempRangeValue) {
    const normalized = (tempRangeValue || "").replace(/\s+/g, "");
    if (!normalized) {
      return null;
    }

    const parts = normalized.split("-").map((item) => Number.parseFloat(item));
    if (parts.length === 2 && Number.isFinite(parts[0]) && Number.isFinite(parts[1])) {
      return (parts[0] + parts[1]) / 2;
    }

    const single = Number.parseFloat(normalized);
    return Number.isFinite(single) ? single : null;
  }

  function computeRangeScore(value, min, max) {
    if (value === null || value === undefined) {
      return 0.55;
    }

    if (value >= min && value <= max) {
      return 1;
    }

    const width = Math.max(1, max - min);
    const tolerance = width * 0.3;
    const low = min - tolerance;
    const high = max + tolerance;

    if (value < low || value > high) {
      return 0;
    }

    if (value < min) {
      return (value - low) / (min - low);
    }

    return (high - value) / (high - max);
  }

  function getWaterAvailability(irrigation, waterSource) {
    const rainfed = irrigation === "Rainfed" || waterSource === "Uncertain";
    const assured = irrigation === "Canal + borewell" && waterSource === "Assured";

    if (assured) {
      return "High";
    }

    if (rainfed) {
      return "Low";
    }

    return "Moderate";
  }

  function normalizeWaterNeed(waterNeed) {
    if (waterNeed === "High") {
      return "High";
    }
    if (waterNeed === "Moderate") {
      return "Moderate";
    }
    return "Low";
  }

  function waterCompatibilityScore(need, availability) {
    const order = { Low: 1, Moderate: 2, High: 3 };
    const diff = order[availability] - order[normalizeWaterNeed(need)];

    if (diff >= 0) {
      return 1;
    }
    if (diff === -1) {
      return 0.55;
    }
    return 0.2;
  }

  function toSuitabilityLabel(score) {
    if (score >= 78) {
      return "High";
    }
    if (score >= 55) {
      return "Medium";
    }
    return "Low";
  }

  function toRankPillClass(score) {
    return score >= 78 ? "good" : "mid";
  }

  function marketOutlookText(marketFocus, topScore) {
    if (marketFocus === "Contract buyer") {
      return topScore >= 70 ? "Stable" : "Cautious";
    }
    if (marketFocus === "Export oriented") {
      return topScore >= 75 ? "Promising" : "Volatile";
    }
    return topScore >= 70 ? "Stable" : "Watchlist";
  }

  function waterRiskText(topCrop, rainfall, availability) {
    const needsHighWater = normalizeWaterNeed(topCrop.waterNeed) === "High";
    if (availability === "Low" && needsHighWater) {
      return "High";
    }
    if (rainfall !== null && rainfall < 500 && needsHighWater) {
      return "High";
    }
    if (availability === "Low" || (rainfall !== null && rainfall < 600)) {
      return "Medium";
    }
    return "Low";
  }

  function buildInputChips(snapshot) {
    const chips = [];
    if (snapshot.location) {
      chips.push(`Location: ${snapshot.location}`);
    }
    chips.push(`Season: ${snapshot.season}`);
    chips.push(`Soil: ${snapshot.soilType}`);

    if (snapshot.ph !== null) {
      chips.push(`pH: ${snapshot.ph.toFixed(1)}`);
    }
    if (snapshot.rainfall !== null) {
      chips.push(`Rainfall: ${snapshot.rainfall.toFixed(0)} mm`);
    }
    chips.push(`Irrigation: ${snapshot.irrigation}`);

    return chips;
  }

  function getFieldSnapshot() {
    return {
      location: (inputs.location?.value || "").trim(),
      season: (inputs.season?.value || "").trim(),
      soilType: (inputs.soilType?.value || "").trim(),
      ph: parseNumber(inputs.soilPh),
      n: parseNumber(inputs.nitrogen),
      p: parseNumber(inputs.phosphorus),
      k: parseNumber(inputs.potassium),
      moisture: parseNumber(inputs.moisture),
      rainfall: parseNumber(inputs.rainfall),
      humidity: parseNumber(inputs.humidity),
      tempAvg: parseTemperatureAverage(inputs.tempRange?.value || ""),
      irrigation: (inputs.irrigation?.value || "").trim(),
      waterSource: (inputs.waterSource?.value || "").trim(),
      sunlight: parseNumber(inputs.sunlight),
      marketFocus: (inputs.marketFocus?.value || "").trim()
    };
  }

  function scoreCrop(crop, field) {
    const weights = {
      season: 20,
      ph: 14,
      temp: 12,
      rainfall: 16,
      humidity: 8,
      moisture: 8,
      sunlight: 6,
      n: 8,
      p: 6,
      k: 6,
      irrigation: 6
    };

    const waterAvailability = getWaterAvailability(field.irrigation, field.waterSource);

    const scoreParts = {
      season: crop.seasons.includes(field.season) ? 1 : 0,
      ph: computeRangeScore(field.ph, crop.ph[0], crop.ph[1]),
      temp: computeRangeScore(field.tempAvg, crop.temp[0], crop.temp[1]),
      rainfall: computeRangeScore(field.rainfall, crop.rainfall[0], crop.rainfall[1]),
      humidity: computeRangeScore(field.humidity, crop.humidity[0], crop.humidity[1]),
      moisture: computeRangeScore(field.moisture, crop.moisture[0], crop.moisture[1]),
      sunlight: computeRangeScore(field.sunlight, crop.sunlight[0], crop.sunlight[1]),
      n: computeRangeScore(field.n, crop.n[0], crop.n[1]),
      p: computeRangeScore(field.p, crop.p[0], crop.p[1]),
      k: computeRangeScore(field.k, crop.k[0], crop.k[1]),
      irrigation: waterCompatibilityScore(crop.waterNeed, waterAvailability)
    };

    const weightedTotal = Object.keys(weights).reduce((acc, key) => {
      return acc + scoreParts[key] * weights[key];
    }, 0);

    return {
      crop,
      score: Math.round(weightedTotal),
      waterAvailability
    };
  }

  function setLoadingState(isLoading) {
    generateButton.disabled = isLoading;
    loadingPanel.classList.toggle("is-visible", isLoading);
  }

  function showResults() {
    placeholder.style.display = "none";
    resultsPanel.classList.add("is-visible");
  }

  function setStatus(message, isError) {
    statusText.textContent = message;
    statusText.classList.toggle("status-error", Boolean(isError));
  }

  function setChipList(chips) {
    inputChipRow.innerHTML = "";
    chips.forEach((chip) => {
      const span = document.createElement("span");
      span.className = "input-chip";
      span.textContent = chip;
      inputChipRow.appendChild(span);
    });
  }

  function setRankTable(scoredCrops) {
    cropRankBody.innerHTML = "";

    scoredCrops.slice(0, 4).forEach((entry) => {
      const row = document.createElement("tr");

      const cropCell = document.createElement("td");
      cropCell.textContent = entry.crop.name;

      const suitabilityCell = document.createElement("td");
      const pill = document.createElement("span");
      pill.className = `rank-pill ${toRankPillClass(entry.score)}`;
      pill.textContent = `${toSuitabilityLabel(entry.score)} (${entry.score})`;
      suitabilityCell.appendChild(pill);

      const waterCell = document.createElement("td");
      waterCell.textContent = entry.crop.waterNeed;

      const yieldCell = document.createElement("td");
      yieldCell.textContent = entry.crop.yieldRange;

      row.appendChild(cropCell);
      row.appendChild(suitabilityCell);
      row.appendChild(waterCell);
      row.appendChild(yieldCell);
      cropRankBody.appendChild(row);
    });
  }

  function buildFertilizerPlan(field, topCrop) {
    const nTarget = topCrop.n[0] + Math.round((topCrop.n[1] - topCrop.n[0]) * 0.5);
    const pTarget = topCrop.p[0] + Math.round((topCrop.p[1] - topCrop.p[0]) * 0.5);
    const kTarget = topCrop.k[0] + Math.round((topCrop.k[1] - topCrop.k[0]) * 0.5);

    const nGap = field.n === null ? 0 : Math.max(0, nTarget - field.n);
    const pGap = field.p === null ? 0 : Math.max(0, pTarget - field.p);
    const kGap = field.k === null ? 0 : Math.max(0, kTarget - field.k);

    return {
      basal: `${Math.round(nGap * 0.45)} kg N, ${Math.round(pGap * 0.7)} kg P, ${Math.round(kGap * 0.6)} kg K per ha`,
      top: `${Math.round(nGap * 0.55)} kg N split in 2 doses at active vegetative stage`
    };
  }

  async function generateRecommendations() {
    const field = getFieldSnapshot();

    if (field.ph === null || field.n === null || field.p === null || field.k === null || field.rainfall === null) {
      setStatus("Please enter Soil pH, N, P, K and rainfall values to get recommendations.", true);
      return;
    }

    setLoadingState(true);
    setStatus("Running crop suitability analysis...");

    await new Promise((resolve) => {
      window.setTimeout(resolve, 900);
    });

    const scored = crops
      .map((crop) => scoreCrop(crop, field))
      .sort((a, b) => b.score - a.score);

    const topEntry = scored[0];
    const topCrop = topEntry.crop;
    const fertilizerPlan = buildFertilizerPlan(field, topCrop);
    const waterRisk = waterRiskText(topCrop, field.rainfall, topEntry.waterAvailability);
    const marketOutlook = marketOutlookText(field.marketFocus, topEntry.score);

    metricSuitability.textContent = `${topEntry.score} / 100`;
    metricSuitabilityNote.textContent = `${topCrop.name} is currently the best fit for your conditions.`;
    metricWaterRisk.textContent = waterRisk;
    metricWaterNote.textContent = `${topCrop.waterNeed} crop water need vs ${topEntry.waterAvailability.toLowerCase()} water availability.`;
    metricMarket.textContent = marketOutlook;
    metricMarketNote.textContent = `Based on selected strategy: ${field.marketFocus}.`;

    setChipList(buildInputChips(field));
    setRankTable(scored);

    bestFitPrimary.innerHTML = `<strong>Primary:</strong> ${topCrop.name}`;
    bestFitWhy.innerHTML = `<strong>Why:</strong> Best combined match across season, nutrients, moisture, and weather inputs.`;

    nutritionBasal.innerHTML = `<strong>Basal:</strong> ${fertilizerPlan.basal}.`;
    nutritionTop.innerHTML = `<strong>Top dressing:</strong> ${fertilizerPlan.top}.`;

    irrigationNote.textContent =
      waterRisk === "High"
        ? "Water risk is high. Use drip/sprinkler scheduling and prioritize protective irrigation at critical growth stages."
        : "Maintain soil moisture near crop-specific optimum and avoid prolonged wet or dry stress periods.";

    rotationList.innerHTML = "";
    [topCrop.rotation, topCrop.contingency].forEach((itemText) => {
      const li = document.createElement("li");
      li.textContent = itemText;
      rotationList.appendChild(li);
    });

    riskNote.textContent =
      "This recommendation is rule-based and indicative. Validate with local agronomy experts, recent mandi trends, and latest weather forecast.";

    showResults();
    setLoadingState(false);
    setStatus("Recommendations generated successfully.", false);
    document.getElementById("analyze")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  generateButton.addEventListener("click", () => {
    generateRecommendations().catch((error) => {
      setLoadingState(false);
      setStatus(`Unable to generate recommendations: ${error.message}`, true);
    });
  });
})();
