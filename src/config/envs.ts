type IEnvs = {
  apiUrl: string
  apiMode: 'dev' | 'prod'
}

export const envs: IEnvs = {
  apiUrl: 'http://localhost:3000',
  apiMode: 'dev'
}
