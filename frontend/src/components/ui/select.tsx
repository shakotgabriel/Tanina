import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

export interface SelectProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  ({ children, className, ...props }, ref) => (
    <div ref={ref} className={cn("relative w-full", className)} {...props}>
      {children}
    </div>
  )
)
Select.displayName = "Select"

export interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ElementType
}

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, children, icon: Icon, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(`
        relative w-full h-11 sm:h-12 px-4 py-2
        bg-white dark:bg-gray-950
        border border-gray-200 dark:border-gray-800
        rounded-lg text-left
        flex items-center
        focus:outline-none focus:ring-2 focus:ring-blue-500
        transition-all duration-200
        ${Icon ? 'pl-10' : ''}
      `, className)}
      {...props}
    >
      {Icon && (
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
      )}
      {children}
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
    </button>
  )
)
SelectTrigger.displayName = "SelectTrigger"

export interface SelectValueProps extends React.HTMLAttributes<HTMLSpanElement> {
  placeholder?: string
}

const SelectValue = React.forwardRef<HTMLSpanElement, SelectValueProps>(
  ({ className, children, placeholder, ...props }, ref) => (
    <span
      ref={ref}
      className={cn("block truncate", className)}
      {...props}
    >
      {children || placeholder}
    </span>
  )
)
SelectValue.displayName = "SelectValue"

export interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean
}

const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
  ({ className, children, open = false, ...props }, ref) => (
    <>
      {open && (
        <div
          ref={ref}
          className={cn(`
            absolute z-50 w-full mt-1
            bg-white dark:bg-gray-950
            border border-gray-200 dark:border-gray-800
            rounded-lg shadow-lg
            max-h-60 overflow-auto
            py-1
          `, className)}
          {...props}
        >
          {children}
        </div>
      )}
    </>
  )
)
SelectContent.displayName = "SelectContent"

export interface SelectItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean
}

const SelectItem = React.forwardRef<HTMLButtonElement, SelectItemProps>(
  ({ className, children, selected, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(`
        w-full px-4 py-2 text-left
        flex items-center
        hover:bg-gray-100 dark:hover:bg-gray-800
        transition-colors duration-150
        ${selected ? 'bg-gray-100 dark:bg-gray-800' : ''}
      `, className)}
      {...props}
    >
      <span className="block truncate">{children}</span>
      {selected && (
        <span className="absolute right-4 text-blue-500">✓</span>
      )}
    </button>
  )
)
SelectItem.displayName = "SelectItem"

export {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
}