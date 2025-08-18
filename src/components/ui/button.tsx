import { cn } from '@/utilities/ui'
import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    defaultVariants: {
      size: 'default',
      variant: 'default',
    },
    variants: {
      size: {
        clear: '',
        default: 'h-10 px-4 py-2',
        icon: 'h-10 w-10',
        lg: 'h-11 rounded px-8',
        sm: 'h-9 rounded px-3',
      },
      variant: {
        default:
          'border-2 border-white bg-primary text-black font-bold tracking-wider uppercase transform -skew-x-12  hover:bg-primary/90 transition-all duration-300 hover:translate-y-[-4px]',
        destructive:
          'border-2 bg-destructive text-white font-bold tracking-wider uppercase transform -skew-x-12  hover:bg-destructive/90 transition-all duration-300 hover:translate-y-[-4px]',
        ghost:
          'bg-transparent text-white font-bold tracking-wider uppercase transform -skew-x-12  hover:bg-white/10 transition-all duration-300',
        link: 'text-primary items-start justify-start underline-offset-4 hover:underline',
        outline:
          'border-2 border-primary bg-transparent text-primary font-bold tracking-wider uppercase transform -skew-x-12  hover:bg-primary hover:text-black transition-all duration-300 hover:translate-y-[-4px]',
        secondary:
          'border-2 bg-white text-black font-bold tracking-wider uppercase transform -skew-x-12  hover:bg-gray-100 transition-all duration-300 hover:translate-y-[-4px]',
      },
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  ref?: React.Ref<HTMLButtonElement>
}

const Button: React.FC<ButtonProps> = ({
  asChild = false,
  className,
  size,
  variant,
  ref,
  children,
  ...props
}) => {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp className={cn(buttonVariants({ className, size, variant }))} ref={ref} {...props}>
      <span className="flex gap-1 items-center">{children}</span>
    </Comp>
  )
}

export { Button, buttonVariants }
