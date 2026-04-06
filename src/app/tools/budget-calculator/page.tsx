"use client";

import { useState, useMemo } from "react";
import { IndianRupee, Calendar, TrendingUp, Home } from "lucide-react";

export default function BudgetCalculator() {
  const [savings, setSavings] = useState(500000);
  const [emi, setEmi] = useState(25000);
  const [years, setYears] = useState(20);
  const rate = 8.5;

  const { budget, loanAmount, totalInterest } = useMemo(() => {
    const r = rate / 12 / 100;
    const n = years * 12;
    
    const loan = r === 0 
      ? emi * n 
      : (emi * (Math.pow(1 + r, n) - 1)) / (r * Math.pow(1 + r, n));
    
    const totalPayment = emi * n;
    const interest = totalPayment - loan;
    
    return {
      budget: Math.round(loan + savings),
      loanAmount: Math.round(loan),
      totalInterest: Math.round(interest),
    };
  }, [emi, years, savings]);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR',
      maximumFractionDigits: 0 
    }).format(val);

  return (
    <div className="max-w-7xl mx-auto ">
      {/* Header */}
      <div className="py-2">
        <h1 className="text-2xl font-semibold text-gray-900">
          Budget Calculator
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Find your ideal home budget based on your savings & EMI capacity
        </p>
      </div>

            {/* Preset Options */}
            <div className="py-10 grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "First Home", savings: 200000, emi: 15000, years: 20 },
          { label: "Upgrade", savings: 1000000, emi: 35000, years: 15 },
          { label: "Luxury", savings: 2500000, emi: 60000, years: 10 },
          { label: "Investment", savings: 500000, emi: 25000, years: 25 },
        ].map((preset, idx) => (
          <button
            key={idx}
            onClick={() => {
              setSavings(preset.savings);
              setEmi(preset.emi);
              setYears(preset.years);
            }}
            className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm text-gray-700 transition-colors"
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column - Sliders */}
          <div className="md:col-span-2 space-y-8">
            {/* Savings */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <IndianRupee className="w-4 h-4 text-teal-600" />
                  Your Savings
                </label>
                <span className="text-lg font-semibold text-teal-600">
                  {formatCurrency(savings)}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={5000000}
                step={100000}
                value={savings}
                onChange={(e) => setSavings(+e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>₹0</span>
                <span>₹25L</span>
                <span>₹50L</span>
              </div>
            </div>

            {/* Monthly EMI */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-teal-600" />
                  Monthly EMI Capacity
                </label>
                <span className="text-lg font-semibold text-teal-600">
                  {formatCurrency(emi)}
                </span>
              </div>
              <input
                type="range"
                min={5000}
                max={200000}
                step={1000}
                value={emi}
                onChange={(e) => setEmi(+e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>₹5K</span>
                <span>₹1L</span>
                <span>₹2L</span>
              </div>
            </div>

            {/* Loan Tenure */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-teal-600" />
                  Loan Tenure
                </label>
                <span className="text-lg font-semibold text-teal-600">
                  {years} Years
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={30}
                value={years}
                onChange={(e) => setYears(+e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>1 Year</span>
                <span>15 Years</span>
                <span>30 Years</span>
              </div>
            </div>
          </div>

          {/* Right Column - Result */}
          <div className="bg-gray-50 rounded-xl p-6 flex flex-col justify-center">
            <div className="text-center">
              <div className="inline-flex p-3 bg-teal-100 rounded-full mb-4">
                <Home className="w-6 h-6 text-teal-600" />
              </div>
              
              <p className="text-sm text-gray-500 mb-1">
                Your Property Budget
              </p>
              <p className="text-3xl font-bold text-teal-600 mb-4">
                {formatCurrency(budget)}
              </p>
              
              <div className="border-t border-gray-200 pt-4 mt-2 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Loan Amount</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(loanAmount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Interest</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(totalInterest)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-teal-600 text-xs">✓</span>
              </div>
              <p className="text-gray-600">
                Higher savings = lower loan & interest
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-teal-600 text-xs">✓</span>
              </div>
              <p className="text-gray-600">
                EMI should be ≤ 40% of monthly income
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-teal-600 text-xs">✓</span>
              </div>
              <p className="text-gray-600">
                Longer tenure = lower EMI, more interest
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}