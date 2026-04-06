import PropertiesPage from "@/components/properties/Propertiespage";
import { Suspense } from "react";
export default function Page() {
  return <Suspense>
     <PropertiesPage/>
  </Suspense>;
}