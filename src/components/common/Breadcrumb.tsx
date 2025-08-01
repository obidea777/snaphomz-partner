import Link from "next/link"
import { ChevronRight } from "lucide-react"
import React from "react"

type BreadcrumbItem = {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className="text-sm text-gray-500" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1 sm:space-x-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={index} className="flex items-center">
              {item.href && !isLast ? (
                <Link href={item.href} className="hover:underline text-gray-500 font-medium">
                  {item.label}
                </Link>
              ) : (
                <span className="text-gray-500 font-semibold">{item.label}</span>
              )}

              {!isLast && (
                <ChevronRight className="w-4 h-4 mx-1 text-gray-400" />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default Breadcrumb
