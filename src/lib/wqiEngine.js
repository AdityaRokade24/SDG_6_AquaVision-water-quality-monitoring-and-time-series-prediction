// ==========================================================
// CPCB & CCME Standard Water Quality Index (WQI) Engine
// Calibrated for River Ganga & Triveni Sangam IoT Telemetry
// ==========================================================

export const PARAM_STANDARDS = {
  ph: {
    name: 'pH Level',
    unit: 'pH',
    minSafe: 6.5,
    maxSafe: 8.5,
    ideal: 7.0,
    weight: 0.14,
    description: 'Measures water acidity or alkalinity (CPCB Safe: 6.5 - 8.5)'
  },
  do_level: {
    name: 'Dissolved Oxygen (DO)',
    unit: 'mg/L',
    minSafe: 5.0,
    ideal: 8.5,
    weight: 0.24,
    description: 'Vital for aquatic life and self-purification (CPCB Bathing: ≥5.0 mg/L)'
  },
  bod: {
    name: 'Biochemical Oxygen Demand (BOD)',
    unit: 'mg/L',
    maxSafe: 3.0,
    ideal: 1.0,
    weight: 0.20,
    description: 'Indicator of organic pollution & bacterial decay (CPCB Safe: ≤3.0 mg/L)'
  },
  conductivity: {
    name: 'Electrical Conductivity',
    unit: 'µS/cm',
    maxSafe: 750,
    ideal: 250,
    weight: 0.12,
    description: 'Indicates dissolved minerals, salts, and chemical runoff'
  },
  temperature: {
    name: 'Water Temperature',
    unit: '°C',
    minSafe: 15.0,
    maxSafe: 28.0,
    ideal: 20.0,
    weight: 0.08,
    description: 'Controls dissolved gas solubility and biological metabolism'
  },
  turbidity: {
    name: 'Turbidity',
    unit: 'NTU',
    maxSafe: 10.0,
    ideal: 2.0,
    weight: 0.12,
    description: 'Clarity and suspended silt/sediment load in water'
  },
  orp: {
    name: 'Oxidation Reduction Potential (ORP)',
    unit: 'mV',
    minSafe: 200,
    ideal: 350,
    weight: 0.10,
    description: 'Oxidizing power and self-sanitizing capability of the river'
  }
};

/**
 * Calculates parameter sub-index (q_i) from 0 to 100
 */
export function calculateSubIndex(param, value) {
  const std = PARAM_STANDARDS[param];
  if (!std) return 100;

  switch (param) {
    case 'ph': {
      if (value >= 6.8 && value <= 7.8) return 100;
      if (value < 6.5) return Math.max(0, 100 - (6.5 - value) * 45);
      if (value > 8.5) return Math.max(0, 100 - (value - 8.5) * 45);
      // in tolerable range 6.5-6.8 or 7.8-8.5
      return 85;
    }
    case 'do_level': {
      // higher is better
      if (value >= 7.5) return 100;
      if (value >= 6.0) return 85;
      if (value >= 5.0) return 70;
      if (value >= 3.5) return 40;
      return Math.max(5, value * 10);
    }
    case 'bod': {
      // lower is better
      if (value <= 1.5) return 100;
      if (value <= 3.0) return 80;
      if (value <= 5.0) return 55;
      if (value <= 8.0) return 30;
      return Math.max(0, 20 - (value - 8) * 3);
    }
    case 'conductivity': {
      if (value <= 300) return 100;
      if (value <= 600) return 80;
      if (value <= 1000) return 50;
      return Math.max(10, 50 - (value - 1000) * 0.05);
    }
    case 'turbidity': {
      if (value <= 4.0) return 100;
      if (value <= 10.0) return 75;
      if (value <= 25.0) return 45;
      return Math.max(5, 45 - (value - 25) * 0.8);
    }
    case 'orp': {
      if (value >= 300) return 100;
      if (value >= 220) return 80;
      if (value >= 150) return 55;
      return Math.max(10, value * 0.3);
    }
    case 'temperature': {
      const diff = Math.abs(value - 20);
      return Math.max(20, 100 - diff * 5);
    }
    default:
      return 80;
  }
}

/**
 * Calculates overall CPCB Weighted Water Quality Index (0-100)
 */
export function calculateWQI(readings) {
  let weightedSum = 0;
  let totalWeight = 0;
  const subIndices = {};
  const violations = [];

  for (const [key, std] of Object.entries(PARAM_STANDARDS)) {
    const rawVal = parseFloat(readings[key]);
    if (isNaN(rawVal)) continue;

    const q_i = calculateSubIndex(key, rawVal);
    subIndices[key] = Math.round(q_i);
    weightedSum += q_i * std.weight;
    totalWeight += std.weight;

    // Check boundary breaches
    if (std.minSafe !== undefined && rawVal < std.minSafe) {
      violations.push({
        param: key,
        name: std.name,
        value: rawVal,
        limit: `< ${std.minSafe} ${std.unit}`,
        severity: rawVal < std.minSafe * 0.7 ? 'CRITICAL' : 'WARNING'
      });
    }
    if (std.maxSafe !== undefined && rawVal > std.maxSafe) {
      violations.push({
        param: key,
        name: std.name,
        value: rawVal,
        limit: `> ${std.maxSafe} ${std.unit}`,
        severity: rawVal > std.maxSafe * 1.5 ? 'CRITICAL' : 'WARNING'
      });
    }
  }

  const wqi = totalWeight > 0 ? Math.round((weightedSum / totalWeight) * 10) / 10 : 75;
  const category = getWQICategory(wqi);

  return {
    wqi,
    ...category,
    subIndices,
    violations
  };
}

export function getWQICategory(wqi) {
  if (wqi >= 90) {
    return {
      status: 'Excellent',
      classCode: 'CPCB Class A',
      color: '#10b981', // emerald
      bgColor: 'rgba(16, 185, 129, 0.15)',
      borderColor: 'rgba(16, 185, 129, 0.4)',
      description: 'Pristine Ganga ecological condition; suitable for direct drinking with simple disinfection.',
      riskLevel: 'Low'
    };
  } else if (wqi >= 75) {
    return {
      status: 'Good',
      classCode: 'CPCB Class B',
      color: '#00f2fe', // cyan
      bgColor: 'rgba(0, 242, 254, 0.15)',
      borderColor: 'rgba(0, 242, 254, 0.4)',
      description: 'Compliant with outdoor religious bathing (Snan at Sangam) and healthy aquatic biodiversity.',
      riskLevel: 'Low'
    };
  } else if (wqi >= 55) {
    return {
      status: 'Moderate',
      classCode: 'CPCB Class C',
      color: '#f59e0b', // amber
      bgColor: 'rgba(245, 158, 11, 0.15)',
      borderColor: 'rgba(245, 158, 11, 0.4)',
      description: 'Moderate organic/sediment load. Requires conventional treatment prior to municipal distribution.',
      riskLevel: 'Moderate'
    };
  } else if (wqi >= 40) {
    return {
      status: 'Poor',
      classCode: 'CPCB Class D',
      color: '#f97316', // orange
      bgColor: 'rgba(249, 115, 22, 0.15)',
      borderColor: 'rgba(249, 115, 22, 0.4)',
      description: 'Elevated organic contaminants & hypoxia risk. Unsuitable for bathing or primary contact.',
      riskLevel: 'High'
    };
  } else {
    return {
      status: 'Critical',
      classCode: 'CPCB Class E',
      color: '#f43f5e', // rose/red
      bgColor: 'rgba(244, 63, 94, 0.18)',
      borderColor: 'rgba(244, 63, 94, 0.5)',
      description: 'Severe ecological distress / industrial runoff breach. Immediate municipal alert required!',
      riskLevel: 'Critical'
    };
  }
}
