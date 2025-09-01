import { COLORS } from '@/constants/colors'

export type IEnvs = {
  apiUrl: string
  apiMode: 'dev' | 'prod'
  styles: {
    switchColor: string
    linkColor: string
    successColor: string
    warningColor: string
    errorColor: string
    tablesBackgroundColor: string
  }
}

export const envs: IEnvs = {
  apiUrl: 'http://localhost:3000',
  apiMode: 'dev',
  styles: {
    switchColor: COLORS.SKY,
    linkColor: COLORS.GREEN,
    successColor: COLORS.GREEN,
    warningColor: COLORS.YELLOW,
    errorColor: COLORS.RED,
    tablesBackgroundColor: "#020618"
  }
}
