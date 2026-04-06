export default function GlobalLoading() {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white">
        
        {/* Logo / Brand */}
        <h1 className="text-xl font-bold tracking-wide text-[#6B3A1F]">
          The Nestory
        </h1>
  
        {/* Minimal Line Loader */}
        <div className="mt-4 w-32 h-[2px] bg-gray-200 rounded overflow-hidden">
          <div className="h-full w-1/3 bg-[#6B3A1F] animate-[loader_1s_linear_infinite]" />
        </div>
  
        {/* Optional Tagline */}
        <p className="mt-2 text-xs text-gray-400">
          Finding your dream home...
        </p>
  
        <style>{`
          @keyframes loader {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(300%); }
          }
        `}</style>
      </div>
    );
  }