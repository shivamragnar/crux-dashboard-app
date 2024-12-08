export const CRUX_API_URL =
  "https://chromeuxreport.googleapis.com/v1/records:queryRecord"
export const THRESHOLDS = {
  largest_contentful_paint: { good: 2500, moderate: 4000 },
  first_contentful_paint: { good: 1800, moderate: 3000 },
  cumulative_layout_shift: { good: 0.1, moderate: 0.25 },
  interaction_to_next_paint: { good: 200, moderate: 500 },
  round_trip_time: { good: 100, moderate: 200 },
  experimental_time_to_first_byte: { good: 800, moderate: 1800 },
}

export const getScoreColor = (score) => {
  if (score === 100) return "green" // Good
  if (score === 50) return "orange" // Average
  return "red" // Poor
}

export const calculatePerformanceScore = (metricName, score) => {
  const thresholds = THRESHOLDS[metricName]
  if (!thresholds) return 0 // Unknown metric
  if (score <= thresholds.good) return 100 // Good
  if (score <= thresholds.moderate) return 50 // Moderate
  return 0 // Poor
}

export const sortRows = (rows, key, direction) => {
  const multiplier = direction === "asc" ? 1 : -1
  return [...rows].sort((a, b) => {
    if (a[key] < b[key]) return -1 * multiplier
    if (a[key] > b[key]) return 1 * multiplier
    return 0
  })
}

export const processMetrics = (data, isMultipleUrls, excludedMetrics) => {
  if (isMultipleUrls) {
    const metricsSummary = {}
    data.forEach(({ record }) => {
      const { metrics } = record
      Object.entries(metrics || {})
        .filter(([metricName]) => !excludedMetrics.includes(metricName))
        .forEach(([metricName, metricData]) => {
          const p75 = parseFloat(metricData.percentiles?.p75 || 0)
          if (!metricsSummary[metricName]) {
            metricsSummary[metricName] = { sum: 0, count: 0 }
          }
          metricsSummary[metricName].sum += p75
          metricsSummary[metricName].count += 1
        })
    })
    return Object.entries(metricsSummary).map(([metricName, summary]) => ({
      metric: metricName.replace(/_/g, " ").toUpperCase(),
      average: summary.sum / summary.count,
      sum: summary.sum,
    }))
  } else {
    const { metrics } = data[0].record
    return Object.entries(metrics || {})
      .filter(([metricName]) => !excludedMetrics.includes(metricName))
      .map(([metricName, metricData]) => {
        const p75 = parseFloat(metricData.percentiles?.p75 || 0)
        return {
          metric: metricName.replace(/_/g, " ").toUpperCase(),
          p75,
          performanceScore: calculatePerformanceScore(metricName, p75),
        }
      })
  }
}

export const filterMetrics = (rows, filters, isMultipleUrls) => {
  const { filterMetric, threshold, averageThreshold, sumThreshold } = filters

  return rows.filter((row) => {
    if (filterMetric && row.metric !== filterMetric) return false
    if (!isMultipleUrls && threshold && row.p75 < parseFloat(threshold))
      return false
    if (
      isMultipleUrls &&
      averageThreshold &&
      row.average < parseFloat(averageThreshold)
    )
      return false
    if (isMultipleUrls && sumThreshold && row.sum < parseFloat(sumThreshold))
      return false
    return true
  })
}
