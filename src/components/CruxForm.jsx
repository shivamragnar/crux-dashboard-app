import React, { useState } from "react"
import { TextField, Button, CircularProgress } from "@mui/material"

const CruxForm = ({ setCruxData }) => {
  const [urlInput, setUrlInput] = useState("")
  const [urlError, setUrlError] = useState("")
  const [validUrls, setValidUrls] = useState([])
  const [loading, setLoading] = useState(false)

  const urlRegex =
    /^(https?:\/\/)?([\w\-]+(\.[\w\-]+)+)([\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/

  const validateUrls = () => {
    const urls = urlInput.split(",").map((url) => url.trim())
    const invalidUrls = urls.filter((url) => !urlRegex.test(url))

    if (invalidUrls.length > 0) {
      setUrlError(`Invalid URLs: ${invalidUrls.join(", ")}`)
      setValidUrls([])
    } else {
      setUrlError("")
      setValidUrls(urls)
    }
  }

  const handleSearch = async () => {
    if (!urlInput) {
      alert("Please enter at least one URL.")
      return
    }

    if (urlError || validUrls.length === 0) {
      alert("Please fix URL validation errors.")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/crux", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ origins: validUrls }),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`)
      }

      const data = await response.json()
      setCruxData(data)
    } catch (error) {
      console.error("Error fetching CrUX data:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center gap-10 w-full">
      <TextField
        label="Enter URLs (comma-separated)"
        variant="outlined"
        fullWidth
        value={urlInput}
        onChange={(e) => setUrlInput(e.target.value)}
        onBlur={validateUrls}
        error={!!urlError}
        helperText={urlError || "Separate URLs with commas"}
        sx={{ maxWidth: "600px" }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSearch}
        disabled={!!urlError || validUrls.length === 0 || loading}
        sx={{
          display: "flex",
          gap: "4px",
          alignItems: "center",
          marginTop: "-22px",
        }}
      >
        Fetch Metrics{" "}
        {loading && <CircularProgress size={16} color="inherit" />}
      </Button>
    </div>
  )
}

export default CruxForm
