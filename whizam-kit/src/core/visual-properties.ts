import { z } from 'zod'

const sides = ['top', 'right', 'bottom', 'left'] as const
export const visualFourValueProperties = {
  'border-radius': [
    'border-top-left-radius',
    'border-top-right-radius',
    'border-bottom-right-radius',
    'border-bottom-left-radius',
  ],
  'border-width': sides.map((side) => `border-${side}-width`),
  'border-color': sides.map((side) => `border-${side}-color`),
  'border-style': sides.map((side) => `border-${side}-style`),
  margin: sides.map((side) => `margin-${side}`),
  padding: sides.map((side) => `padding-${side}`),
} as const
export type VisualFourValueProperty = keyof typeof visualFourValueProperties

export const visualProperties = {
  Apparence: [
    'background-color',
    'border-color',
    'border-width',
    'border-style',
    'border-radius',
    'box-shadow',
    'opacity',
  ],
  'Contour de focus': ['outline-color', 'outline-width', 'outline-offset'],
  Typographie: [
    'color',
    'font-family',
    'font-size',
    'font-weight',
    'line-height',
    'letter-spacing',
    'text-align',
  ],
  Dimensions: ['width', 'height', 'min-width', 'max-width', 'min-height', 'max-height'],
  Espacements: ['margin', 'padding', 'gap'],
  Disposition: [
    'display',
    'flex-direction',
    'flex-wrap',
    'align-items',
    'justify-content',
    'grid-template-columns',
    'grid-template-rows',
  ],
} as const
export const cssProperties: readonly string[] = [
  ...Object.values(visualProperties).flat(),
  ...Object.values(visualFourValueProperties).flat(),
]
export const visualCssValue = z
  .string()
  .trim()
  .min(1)
  .max(300)
  .refine((v) => !/[;{}<>\\]|url\s*\(|@|expression\s*\(/i.test(v))
export const visualMediaCondition = z
  .string()
  .max(300)
  .regex(
    /^(\((min|max)-width:\s*\d+(\.\d+)?(px|rem|em)\))(\s+and\s+\((min|max)-width:\s*\d+(\.\d+)?(px|rem|em)\))*$/,
  )
export const designStateSchema = z.enum(['default', 'disabled', 'loading', 'error'])
const designName = z
  .string()
  .regex(/^[a-z][a-z0-9-]*$/)
  .max(80)
export const designPartSchema = z.strictObject({
  kind: z.literal('design-part'),
  target: designName,
  variant: designName,
  part: designName,
  state: designStateSchema,
})
export type DesignPart = z.infer<typeof designPartSchema>
