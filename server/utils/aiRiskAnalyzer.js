/**
 * Rule-Based AI Risk Analyzer
 * Can be replaced by ML model later
 */

module.exports = function analyzeRisk(outpass, recentCount) {
  const { reason, fromDate, toDate } = outpass;

  const start = new Date(fromDate);
  const end = new Date(toDate);
  const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

  let score = 0;

  // ⏱ Duration-based risk
  if (days > 5) score += 3;
  else if (days >= 3) score += 2;
  else score += 1;

  // 🔁 Frequent requests risk
  if (recentCount >= 3) score += 3;
  else if (recentCount === 2) score += 2;

  // 🧾 Reason-based risk
  const riskyReasons = ["party", "trip", "vacation", "outing"];
  if (riskyReasons.some(r => reason.toLowerCase().includes(r))) {
    score += 3;
  }

  // 🎯 Final decision
  if (score >= 6) return "HIGH";
  if (score >= 4) return "MEDIUM";
  return "LOW";
};
