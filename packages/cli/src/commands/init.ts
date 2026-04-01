import { Nexxoria } from '@nexxoria/sdk'

export const runInitCommand = async (projectRoot: string): Promise<string> => {
  const sdk = new Nexxoria({ projectRoot })
  const result = sdk.bootstrapIfNeeded()

  return [
    'Nexxoria init',
    `status: ${result.created ? 'bootstrapped' : result.repaired ? 'repaired' : 'ready'}`,
    `projectRoot: ${result.projectRoot}`,
    `nexxoriaRoot: ${result.nexxoriaRoot}`,
  ].join('\n')
}
