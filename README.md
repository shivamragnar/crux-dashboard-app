# **CRUX Metrics Viewer**

A Next.js application that visualizes Chrome User Experience Report (CRUX) metrics for one or more URLs. The app allows filtering, sorting, and analyzing performance data, including `p75`, averages, and sums of various metrics.

---

## **Features**

- **Fetch CrUX Metrics**: 
  - Input one or multiple URLs (comma-separated) to fetch metrics from the CrUX API using a backend endpoint.
  - The backend API endpoint (`/api/crux`) accepts a list of URLs, retrieves performance metrics from the CrUX API, and returns data for rendering on the frontend.
- **Dynamic Table Rendering**:
  - Single URL: Displays `p75` values and performance scores.
  - Multiple URLs: Displays average and sum values across URLs.
- **Interactive Filters**:
  - Filter by metric name.
  - Apply thresholds to filter data based on `p75`, average, or sum values.
- **Sorting**:
  - Sort data by metric name, `p75`, average, sum, or performance score.
- **Dynamic Header**: Displays the first URL and a count of additional URLs (e.g., `+2`).

---

## **Configuration Details**

### **1. Prerequisites**

- **Node.js** (>= 14.x recommended)
- **NPM** or **Yarn**
- A valid **CRUX API key** from Google Cloud Platform.

### **2. Environment Variables**

Create a `.env` file in the root directory with the following content:

```env
CRUX_API_KEY=<your-google-cloud-crux-api-key>
```

### **3. Installation

Clone the repository

```bash
git clone https://github.com/shivamragnar/crux-dashboard-app.git
cd crux-dashboard-app
```

Install Dependencies & Run the server

```bash
npm install
npm run dev
```

The app should be running on http://localhost:3000


