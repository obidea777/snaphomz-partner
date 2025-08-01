'use client'

import * as React from 'react'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { ChevronDown } from 'lucide-react'
import { cn } from 'lib/utils'
import { Icons } from '../icons'

const Accordion = AccordionPrimitive.Root
const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn(
      'group mb-4 overflow-hidden rounded-2xl backdrop-blur-lg ring-1 ring-neutral-200/50',
      'bg-white/70 shadow-sm transition-shadow duration-300',
      'data-[state=open]:shadow-md focus-within:shadow-md',
      className,
    )}
    {...props}
  />
))
AccordionItem.displayName = 'AccordionItem'

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & {
    customIcon?: boolean
    accentColor?: string
  }
>(({ className, children, customIcon, accentColor = 'bg-primary', ...props }, ref) => (
  <AccordionPrimitive.Header>
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        'flex w-full items-center justify-between gap-4 px-6 py-4 text-left',
        'text-base font-semibold text-neutral-800 ',
        'transition-colors duration-200 focus:outline-none',
        'hover:bg-neutral-100/60',
        'data-[state=open]:bg-neutral-100/60 ',
        `relative before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:rounded-full before:transition-opacity before:duration-300 before:content-[""] before:${accentColor} before:opacity-0 data-[state=open]:before:opacity-100`,
        '[&[data-state=open]>svg]:rotate-180',
        className,
      )}
      {...props}
    >
      <span className="flex-1 truncate">{children}</span>
      {customIcon ? (
        <Icons.ChevronCircleDown className="h-5 w-5 shrink-0 transition-transform duration-300" />
      ) : (
        <ChevronDown className="h-5 w-5 shrink-0 transition-transform duration-300" />
      )}
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(
      'overflow-hidden text-sm leading-relaxed text-neutral-700',
      'data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up',
    )}
    {...props}
  >
    <div className={cn('px-6 pb-6 pt-2', className)}>{children}</div>
  </AccordionPrimitive.Content>
))
AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
