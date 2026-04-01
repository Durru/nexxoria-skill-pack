import { ProjectContext } from './context.types.js'

const defaultGlobalContext = '# Global Context\n\n- Project initialized by Nexxoria\n- Global context is not defined yet\n'

export const getDefaultProjectContext = (): ProjectContext => ({
  global: defaultGlobalContext,
})

export const ensureProjectContext = (globalContext: string | null | undefined): ProjectContext => {
  if (!globalContext || !globalContext.trim()) {
    return getDefaultProjectContext()
  }

  return {
    global: globalContext,
  }
}
