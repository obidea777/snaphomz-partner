'use client'

import React from 'react'

interface LoadingStateProps {
  keyType: 'div' | 'svg'
}

const LoadingState: React.FC<LoadingStateProps> = ({ keyType }) => {
  return (
    <section className="w-full h-full flex items-center justify-center">
      {keyType === 'div' ? (
        <div className="w-3/4 md:w-1/2 lg:w-1/4 h-10 bg-slate-200 rounded animate-pulse"></div>
      ) : (
        <svg
          className="animate-spin -ml-1 mr-3 h-10 w-10 text-black"
          viewBox="0 0 24 24"
          aria-label="Loading">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
        </svg>
      )}
    </section>
  )
}

export default LoadingState
