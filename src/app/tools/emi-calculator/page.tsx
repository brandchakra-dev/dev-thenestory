"use client";

import { useState, useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function EmiCalculator() {
  const [loan, setLoan] = useState(10000000);
  const [rate, setRate] = useState(8.5);
  const [years, setYears] = useState(20);

  const { emi, totalPayment, totalInterest } = useMemo(() => {
    const r = rate / 12 / 100;
    const n = years * 12;

    const emi =
      (loan * r * Math.pow(1 + r, n)) /
      (Math.pow(1 + r, n) - 1);

    const totalPayment = emi * n;
    const totalInterest = totalPayment - loan;

    return {
      emi: Math.round(emi),
      totalPayment: Math.round(totalPayment),
      totalInterest: Math.round(totalInterest),
    };
  }, [loan, rate, years]);

  const chartData = [
    { name: "Principal", value: loan },
    { name: "Interest", value: totalInterest },
  ];

  return (
    <div className="space-y-10">

      <h1 className="text-4xl font-bold text-secondary">
        EMI <span className="text-primary">Calculator</span>
      </h1>

      <div className="grid lg:grid-cols-2 gap-10">

        {/* LEFT SIDE - Controls */}
        <div className="glass-card rounded-2xl p-8 shadow-card space-y-8">

          {/* Loan */}
          <div>
            <label className="text-sm text-muted-foreground">
              Loan Amount
            </label>
            <p className="text-primary font-semibold text-lg">
              ₹ {loan.toLocaleString()}
            </p>
            <input
              type="range"
              min="100000"
              max="50000000"
              step="100000"
              value={loan}
              onChange={(e) => setLoan(+e.target.value)}
              className="w-full accent-primary"
            />
          </div>

          {/* Interest */}
          <div>
            <label className="text-sm text-muted-foreground">
              Interest Rate (%)
            </label>
            <p className="text-primary font-semibold text-lg">
              {rate}%
            </p>
            <input
              type="range"
              min="1"
              max="15"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(+e.target.value)}
              className="w-full accent-primary"
            />
          </div>

          {/* Tenure */}
          <div>
            <label className="text-sm text-muted-foreground">
              Loan Tenure (Years)
            </label>
            <p className="text-primary font-semibold text-lg">
              {years} Years
            </p>
            <input
              type="range"
              min="1"
              max="30"
              value={years}
              onChange={(e) => setYears(+e.target.value)}
              className="w-full accent-primary"
            />
          </div>

        </div>

        {/* RIGHT SIDE - Result */}
        <div className="bg-card rounded-2xl shadow-card p-8 space-y-6">

          <div>
            <h2 className="text-muted-foreground text-sm">
              Monthly EMI
            </h2>
            <p className="text-3xl font-bold text-primary">
              ₹ {emi.toLocaleString()}
            </p>
          </div>

          <div className="text-sm text-muted-foreground space-y-2">
            <p>Total Payment: ₹ {totalPayment.toLocaleString()}</p>
            <p>Total Interest: ₹ {totalInterest.toLocaleString()}</p>
          </div>

          <div className="h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={chartData}
                  innerRadius={70}
                  outerRadius={110}
                  dataKey="value"
                >
                  <Cell fill="hsl(var(--primary))" />
                  <Cell fill="hsl(var(--secondary))" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

        </div>

      </div>
    </div>
  );
}
