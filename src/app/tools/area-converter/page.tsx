"use client"

import { useState } from "react"

const conversionRates: any = {
  "square feet": 1,
  "square meter": 0.092903,
  acre: 0.0000229568,
}

export default function AreaConverter() {
  const [value, setValue] = useState(0)
  const [from, setFrom] = useState("square feet")
  const [to, setTo] = useState("square meter")
  const [result, setResult] = useState(0)

  const convert = () => {
    const inSqft = value / conversionRates[from]
    const converted = inSqft * conversionRates[to]
    setResult(converted)
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-6">Area Converter</h1>

      <div className="space-y-5">

        <input
          type="number"
          placeholder="Enter value"
          className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none"
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
        />

        <div className="grid grid-cols-2 gap-4">
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="border rounded-xl p-3"
          >
            {Object.keys(conversionRates).map((unit) => (
              <option key={unit}>{unit}</option>
            ))}
          </select>

          <select
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="border rounded-xl p-3"
          >
            {Object.keys(conversionRates).map((unit) => (
              <option key={unit}>{unit}</option>
            ))}
          </select>
        </div>

        <button
          onClick={convert}
          className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:opacity-90 transition"
        >
          Convert
        </button>

        <div className="bg-slate-50 rounded-xl p-4 text-lg font-semibold">
          Result: {result.toFixed(2)} {to}
        </div>
      </div>
    </div>
  )
}
