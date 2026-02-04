'use client'

import { cloneElement, isValidElement, ReactElement, ReactNode, useId, useState } from 'react'

interface TooltipProps {
  content: string
  children: ReactNode
}

export function Tooltip({ content, children }: TooltipProps) {
  const tooltipId = useId()
  const [isOpen, setIsOpen] = useState(false)
  const enhancedChild = isValidElement(children)
    ? cloneElement(children as ReactElement<Record<string, unknown>>, {
      'aria-describedby': [
        (children.props as { 'aria-describedby'?: string })['aria-describedby'],
        tooltipId,
      ].filter(Boolean).join(' '),
    })
    : children

  return (
    <div
      className="relative inline-flex group"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onFocusCapture={() => setIsOpen(true)}
      onBlurCapture={() => setIsOpen(false)}
    >
      {enhancedChild}
      <div
        id={tooltipId}
        role="tooltip"
        aria-hidden={!isOpen}
        className={`pointer-events-none absolute left-1/2 top-full z-30 mt-2 w-max max-w-xs -translate-x-1/2 rounded-lg border border-gray-700 bg-gray-900/95 px-3 py-2 text-sm text-gray-100 shadow-xl shadow-black/40 transition-all duration-200 ${
          isOpen ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'
        }`}
      >
        {content}
        <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45 border-l border-t border-gray-700 bg-gray-900/95" />
      </div>
    </div>
  )
}
