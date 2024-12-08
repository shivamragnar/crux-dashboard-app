"use client"
import { useState } from "react"
import CruxForm from "@/components/CruxForm"
import MetricsTable from "@/components/MetricsTable"

export default function Home() {
  const [cruxData, setCruxData] = useState(null)

  return (
    <div className="flex flex-col items-center pt-20 px-10 mx-auto">
      <h1 className="text-2xl font-bold mb-10">CRUX Performance Checker</h1>
      <CruxForm setCruxData={setCruxData} />
      {cruxData && <MetricsTable data={cruxData} />}
    </div>
  )
}
