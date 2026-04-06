"use client"

import Image from "next/image"
import Link from "next/link"

interface CompareCardProps {
  leftImage: string
  rightImage: string
  leftName: string
  rightName: string
  leftPrice: string
  rightPrice: string
  link: string
}

export default function CompareCard({
  leftImage,
  rightImage,
  leftName,
  rightName,
  leftPrice,
  rightPrice,
  link,
}: CompareCardProps) {
  return (
    <div className="group relative max-w-[310px] bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden">

      {/* Images */}
      <div className="relative h-56 flex">
        <div className="relative w-1/2">
          <Image
            src={leftImage}
            alt={leftName}
            fill
            className="object-cover group-hover:scale-105 transition duration-500"
          />
        </div>

        <div className="relative w-1/2">
          <Image
            src={rightImage}
            alt={rightName}
            fill
            className="object-cover group-hover:scale-105 transition duration-500"
          />
        </div>

        {/* VS Badge */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shadow-lg">
            VS
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 text-center">

        <div className="flex justify-between text-sm font-medium text-secondary">
          <div>
            <p>{leftName}</p>
            <p className="text-primary font-semibold mt-1">{leftPrice}</p>
          </div>

          <div>
            <p>{rightName}</p>
            <p className="text-primary font-semibold mt-1">{rightPrice}</p>
          </div>
        </div>

        <Link
          href={link}
          className="mt-6 inline-block w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 transition"
        >
          Compare Now →
        </Link>
      </div>
    </div>
  )
}
