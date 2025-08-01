import React from 'react'
import logo from '../../../public/assets/images/oc-Logo-1.svg'
type Props = {
  
  size?: number // diameter of the loader in px, default 80
}

export function CustomCircularLogoLoader({  size = 80 }: Props) {
  const borderWidth = 6
  const halfSize = size / 2

  return (
    <div
      className="flex items-center justify-center bg-black"
      style={{ width: size, height: size, borderRadius: '50%', position: 'relative' }}
    >
      {/* Spinning ring */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: size,
          height: size,
          borderRadius: '50%',
          border: `${borderWidth}px solid #f97316`, // orange border
          borderTopColor: '#000000', // black top for spinner effect
          animation: 'spin 1.5s linear infinite',
          boxSizing: 'border-box',
        }}
      />

      {/* Centered logo */}
      <img
        src={logo}
        alt="Logo"
        style={{
          width: size * 0.5,
          height: size * 0.5,
          borderRadius: '50%',
          position: 'relative',
          zIndex: 10,
          objectFit: 'contain',
        }}
      />

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  )
}
