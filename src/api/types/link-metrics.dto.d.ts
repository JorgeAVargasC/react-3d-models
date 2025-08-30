export interface ILinkMetricsDTO {
  source: number
  target: number
  lost: number // %
  delay: number // ms
  throughput: number // Kb/s
}
