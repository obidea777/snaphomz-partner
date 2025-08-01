"use client"
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'

function Page() {  // Changed 'page' to 'Page'
    const pathname = usePathname()
    const router = useRouter()
    if(pathname === "/dashboard"){
        router.push("/partner-dashboard")
    }
  return (
    <div></div>
  )
}

export default Page  // Changed 'page' to 'Page'
