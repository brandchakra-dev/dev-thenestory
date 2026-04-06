import HeroSection from "@/components/sections/HeroSection";
import FeaturedProjects from "@/components/property/FeaturedProjects";
import ToolsSection from "@/components/tools/ToolsSection";

import Cities from "@/components/cities/Cities";
import CompareSection from "@/components/property/CompareSection";

import SponsoredSection from "@/components/sponsored/SponsoredSection";
import YoutubeSection from "@/components/sections/YoutubeSection";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import BlogSection from "@/components/sections/BlogSection";
import PropertyGridSection from "@/components/categories/Propertygridsection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <PropertyGridSection />
      <FeaturedProjects />
      <ToolsSection />
      <Cities />
      <CompareSection /> 
      <YoutubeSection />
      <SponsoredSection />
      <WhyChooseUs />
      <BlogSection />
    </>
  );
}
