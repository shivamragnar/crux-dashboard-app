import React, { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  Typography,
  Select,
  MenuItem,
  TextField,
  Tooltip,
  Box,
} from "@mui/material"
import TableTitle from "./TableTitle"
import { processMetrics, filterMetrics, sortRows, getScoreColor } from "@/utils"

const excludedMetrics = ["form_factors", "navigation_types"]

const MetricsTable = ({ data }) => {
  const [sortConfig, setSortConfig] = useState({
    key: "metric",
    direction: "asc",
  })
  const [filters, setFilters] = useState({
    filterMetric: "",
    threshold: "",
    averageThreshold: "",
    sumThreshold: "",
  })

  if (!data || data.length === 0) {
    return <Typography variant="h6">No data available</Typography>
  }

  const isMultipleUrls = data.length > 1

  const tableRows = processMetrics(data, isMultipleUrls, excludedMetrics)

  const filteredRows = filterMetrics(tableRows, filters, isMultipleUrls)

  const sortedRows = sortRows(
    filteredRows,
    sortConfig.key,
    sortConfig.direction
  )

  const handleSortChange = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === "asc"
          ? "desc"
          : "asc",
    }))
  }

  const handleFilterChange = (field, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: value,
    }))
  }

  return (
    <TableContainer component={Paper} sx={{ marginTop: "50px" }}>
      <TableTitle urls={data.map((item) => item.origin)} />

      <Box
        sx={{
          margin: "10px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <Select
          value={filters.filterMetric}
          onChange={(e) => handleFilterChange("filterMetric", e.target.value)}
          displayEmpty
          size="small"
          sx={{ width: "200px" }}
        >
          <MenuItem value="">All Metrics</MenuItem>
          {tableRows.map((row, index) => (
            <MenuItem key={index} value={row.metric}>
              {row.metric}
            </MenuItem>
          ))}
        </Select>

        {!isMultipleUrls ? (
          <TextField
            label="Threshold (p75)"
            type="number"
            variant="outlined"
            size="small"
            value={filters.threshold}
            onChange={(e) => handleFilterChange("threshold", e.target.value)}
          />
        ) : (
          <>
            <TextField
              label="Threshold (Average)"
              type="number"
              variant="outlined"
              size="small"
              value={filters.averageThreshold}
              onChange={(e) =>
                handleFilterChange("averageThreshold", e.target.value)
              }
            />
            <TextField
              label="Threshold (Sum)"
              type="number"
              variant="outlined"
              size="small"
              value={filters.sumThreshold}
              onChange={(e) =>
                handleFilterChange("sumThreshold", e.target.value)
              }
            />
          </>
        )}
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <TableSortLabel
                active={sortConfig.key === "metric"}
                direction={
                  sortConfig.key === "metric" ? sortConfig.direction : "asc"
                }
                onClick={() => handleSortChange("metric")}
              >
                Metric
              </TableSortLabel>
            </TableCell>
            {isMultipleUrls ? (
              <>
                <TableCell align="center">
                  <TableSortLabel
                    active={sortConfig.key === "average"}
                    direction={
                      sortConfig.key === "average"
                        ? sortConfig.direction
                        : "asc"
                    }
                    onClick={() => handleSortChange("average")}
                  >
                    Average (p75)
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center">
                  <TableSortLabel
                    active={sortConfig.key === "sum"}
                    direction={
                      sortConfig.key === "sum" ? sortConfig.direction : "asc"
                    }
                    onClick={() => handleSortChange("sum")}
                  >
                    Sum (p75)
                  </TableSortLabel>
                </TableCell>
              </>
            ) : (
              <>
                <TableCell align="center">
                  <TableSortLabel
                    active={sortConfig.key === "p75"}
                    direction={
                      sortConfig.key === "p75" ? sortConfig.direction : "asc"
                    }
                    onClick={() => handleSortChange("p75")}
                  >
                    75th Percentile (p75)
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center">
                  <Tooltip
                    placement="top"
                    title={
                      <Box>
                        <Typography>Good: 100</Typography>
                        <Typography>Average: 50</Typography>
                        <Typography>Poor: 0</Typography>
                      </Box>
                    }
                  >
                    <TableSortLabel
                      active={sortConfig.key === "performanceScore"}
                      direction={
                        sortConfig.key === "performanceScore"
                          ? sortConfig.direction
                          : "asc"
                      }
                      onClick={() => handleSortChange("performanceScore")}
                    >
                      Performance Score
                    </TableSortLabel>
                  </Tooltip>
                </TableCell>
              </>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedRows.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.metric}</TableCell>
              {isMultipleUrls ? (
                <>
                  <TableCell align="center">{row.average.toFixed(2)}</TableCell>
                  <TableCell align="center">{row.sum.toFixed(2)}</TableCell>
                </>
              ) : (
                <>
                  <TableCell align="center">{row.p75}</TableCell>
                  <TableCell
                    align="center"
                    sx={{ color: getScoreColor(row.performanceScore) }}
                  >
                    {row.performanceScore}
                  </TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default MetricsTable
