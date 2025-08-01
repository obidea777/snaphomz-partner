import { CustomCircularLogoLoader } from "./CustomCircularLogoLoader";

export function LoadingScreen() {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="relative w-16 h-16 animate-spin rounded-full border-4 border-orange-500 border-t-black">
          <CustomCircularLogoLoader/>
        </div>
        <span className="absolute mt-24 text-orange-500 font-semibold text-lg">Loading...</span>
      </div>
    )
  }
  