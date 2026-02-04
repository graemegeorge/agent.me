'use client'

import { ReactNode } from 'react'

interface TooltipProps {
  content: string
  children: ReactNode
}

export function Tooltip({ content, children }: TooltipProps) {
  return (
    <div className="relative inline-flex group">
      {children}
      <div
        role="tooltip"
        className="pointer-events-none absolute left-1/2 top-full z-30 mt-2 w-max max-w-xs -translate-x-1/2 translate-y-1 rounded-lg border border-gray-700 bg-gray-900/95 px-3 py-2 text-sm text-gray-100 shadow-xl shadow-black/40 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100"
      >
        {content}
        <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45 border-l border-t border-gray-700 bg-gray-900/95" />
      </div>
    </div>
  )
}
