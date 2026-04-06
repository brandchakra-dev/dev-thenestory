"use client";

import Image from "next/image";
import { Heart, MapPin } from "lucide-react";

interface ProjectCardProps {
  title: string;
  location: string;
  price: string;
  status: string;
  image: string;
}

export default function ProjectCard({
  title,
  location,
  price,
  status,
  image,
}: ProjectCardProps) {
  return (
    <div className="bg-card rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden group">

      {/* Image */}
      <div className="relative h-60 w-full">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Status Badge */}
        <span className="absolute top-3 left-3 bg-white text-secondary text-xs font-semibold px-3 py-1 rounded-full shadow">
          {status}
        </span>

        {/* Wishlist */}
        <button className="absolute top-3 right-3 bg-white/90 backdrop-blur-md p-2 rounded-full shadow hover:bg-white transition">
          <Heart size={16} className="text-primary" />
        </button>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-display text-lg font-semibold text-secondary group-hover:text-primary transition">
          {title}
        </h3>

        <div className="flex items-center text-muted-foreground text-sm mt-2">
          <MapPin size={14} className="mr-1" />
          {location}
        </div>

        <p className="text-primary font-bold mt-4 text-lg">
          {price}
        </p>
      </div>
    </div>
  );
}
