export type ILinkDTO = {
  sourceSwitch: {
    low: number
    high: number
  }
  sourcePort: {
    low: number
    high: number
  }

  targetSwitch: {
    low: number
    high: number
  }
  targetPort: {
    low: number
    high: number
  }
}
