import { ConversationInput, ConversationResult } from './conversation.types.js'

const normalizePrompt = (prompt: string): string => {
  return prompt.trim()
}

const isPromptEmpty = (prompt: string): boolean => {
  return normalizePrompt(prompt).length < 2
}

export const runConversationModule = (input: ConversationInput): ConversationResult => {
  const prompt = normalizePrompt(input.prompt)
  const contextLine = input.context.global
    .split('\n')
    .find((line) => line.startsWith('- '))?.slice(2) ?? 'sin contexto definido'
  const stageLine = input.state.current_stage ?? 'sin etapa activa'
  const tasksCount = input.tasks.items.length
  const nextStep = input.state.next_step ?? 'sin próximo paso'

  if (isPromptEmpty(prompt)) {
    return {
      message: `Nexxoria ya está listo. Etapa actual: ${stageLine}. Tasks activas: ${tasksCount}. Próximo paso sugerido: ${nextStep}. Decime qué querés hacer con este proyecto.`,
      status: 'needs_input',
      bootstrap: input.bootstrap,
    }
  }

  if (input.bootstrap.created) {
    return {
      message: `Nexxoria preparó la base del proyecto, aseguró ${input.planning.stages.length} etapa inicial y ${tasksCount} task mínima. Etapa activa: ${stageLine}. Próximo paso: ${nextStep}. Ahora contame cuál es el objetivo o qué querés organizar primero.`,
      status: 'bootstrapped',
      bootstrap: input.bootstrap,
    }
  }

  return {
    message: `Nexxoria detectó una base existente y está listo para continuar. Etapa actual: ${stageLine}. Tasks activas: ${tasksCount}. Próximo paso: ${nextStep}. Contexto actual: ${contextLine}. Decime qué querés organizar o cómo seguimos.`,
    status: 'ready',
    bootstrap: input.bootstrap,
  }
}
