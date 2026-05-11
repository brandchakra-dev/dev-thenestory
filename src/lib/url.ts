export const getImageUrl = (path?: string) => {
    if (!path) return "/placeholder.jpg";
  
    // already full URL
    if (path.startsWith("http")) return path;
  
    const base = process.env.NEXT_PUBLIC_BASE_URL;
  
    return `${base}${path}`;
  };