import { Data } from 'packages/interface'

export const isArray = Array.isArray

export const hasProps = (val: any, o: Data) => val in o
export const isString = (val: unknown): val is string => typeof val === 'string'
export const isNumber = (val: unknown): val is number => typeof val === 'number'
export const isSymbol = (val: unknown): val is symbol => typeof val === 'symbol'
export const isObject = (val: unknown): val is Record<any, any> => {
  return val !== null && typeof val === 'object'
}
export const isFunction = (val: unknown): val is Function => {
  return typeof val === 'function'
}
export const isPromise = <T = any>(val: unknown): val is Promise<T> => {
  return isObject(val) && isFunction(val.then) && isFunction(val.catch)
}

export const noop = (...arg: any) => {}

export const generateId = () => Math.floor(Math.random() * 10000)

const SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g
const MOZ_HACK_REGEXP = /^moz([A-Z])/

function camelCase(name: string) {
  return name
    .replace(SPECIAL_CHARS_REGEXP, function (_, separator, letter, offset) {
      return offset ? letter.toUpperCase() : letter
    })
    .replace(MOZ_HACK_REGEXP, 'Moz$1')
}

export function getStyle(element: any, styleName: string) {
  if (!element || !styleName) {
    return null
  }
  styleName = camelCase(styleName)
  if (styleName === 'float') {
    styleName = 'cssFloat'
  }
  try {
    const computed = document.defaultView!.getComputedStyle(element, '')
    return element.style[styleName as any] || computed
      ? computed[styleName as any]
      : null
  } catch (e) {
    return element.style[styleName as any]
  }
}
