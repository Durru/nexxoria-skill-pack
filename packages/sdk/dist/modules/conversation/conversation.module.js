const normalizePrompt = (prompt) => {
    return prompt.trim();
};
const isPromptEmpty = (prompt) => {
    return normalizePrompt(prompt).length < 2;
};
const detectIntent = (prompt) => {
    const normalized = normalizePrompt(prompt).toLowerCase();
    if (normalized.length < 2)
        return 'empty_input';
    if (normalized === 'status' ||
        normalized.includes('qué estado') ||
        normalized.includes('que estado') ||
        normalized.includes('dónde estamos') ||
        normalized.includes('donde estamos') ||
        normalized.includes('en qué estamos') ||
        normalized.includes('en que estamos') ||
        normalized.includes('qué sigue') ||
        normalized.includes('que sigue') ||
        normalized.includes('cómo vamos') ||
        normalized.includes('como vamos') ||
        normalized.includes('en qué etapa') ||
        normalized.includes('en que etapa') ||
        normalized.includes('qué falta') ||
        normalized.includes('que falta')) {
        return 'status';
    }
    if (normalized.includes('organizar') ||
        normalized.includes('ordenar') ||
        normalized.includes('estructurar')) {
        return 'organize_project';
    }
    if (normalized.includes('continuar') ||
        normalized.includes('seguir') ||
        normalized.includes('continue')) {
        return 'continue';
    }
    return 'clarify_request';
};
const getFirstBullet = (content) => {
    return content
        .split('\n')
        .find((line) => line.startsWith('- '))?.slice(2) ?? null;
};
const buildSystemSnapshot = (input) => {
    const stage = input.state.current_stage ?? 'sin etapa activa';
    const nextStep = input.state.next_step ?? 'sin próximo paso';
    const tasksCount = input.tasks.items.length;
    const firstTask = input.tasks.items[0]?.title ?? 'sin task base';
    const firstStage = input.planning.stages[0]?.title ?? 'sin etapa definida';
    const contextLine = getFirstBullet(input.context.global) ?? 'sin contexto definido';
    const architectureLine = getFirstBullet(input.memory.global.architecture) ?? 'sin notas de arquitectura';
    return {
        stage,
        nextStep,
        tasksCount,
        firstTask,
        firstStage,
        contextLine,
        architectureLine,
    };
};
const buildMessage = (intent, input) => {
    const snapshot = buildSystemSnapshot(input);
    switch (intent) {
        case 'empty_input':
            return `Nexxoria ya está listo. Estás en ${snapshot.stage}, con ${snapshot.tasksCount} task activa y el siguiente paso sugerido es ${snapshot.nextStep}. Decime qué querés organizar, construir o revisar dentro del proyecto.`;
        case 'status':
            return `Nexxoria ahora mismo está en la etapa ${snapshot.stage}. La tarea activa es "${snapshot.firstTask}". El siguiente paso recomendado es ${snapshot.nextStep}.\n\nContexto actual: ${snapshot.contextLine}.\n\nSi querés, podemos continuar con ese paso o ajustar el enfoque.`;
        case 'organize_project':
            return `Ya tenés una base real: etapa activa ${snapshot.stage}, task base "${snapshot.firstTask}" y próximo paso ${snapshot.nextStep}. Lo más lógico ahora es definir mejor el alcance de esa task antes de seguir expandiendo el proyecto.`;
        case 'continue':
            return `Podemos seguir desde donde quedó Nexxoria. Estás en ${snapshot.stage}, con ${snapshot.tasksCount} task activa, y el paso que mejor encaja ahora es ${snapshot.nextStep}. Base de arquitectura registrada: ${snapshot.architectureLine}.`;
        case 'clarify_request':
        default:
            return `Entiendo que querés avanzar, pero todavía necesito un poco más de claridad. Ya existe la etapa ${snapshot.stage} y la task base "${snapshot.firstTask}". Decime si querés organizar el proyecto, revisar estado o definir mejor la task actual.`;
    }
};
export const runConversationModule = (input) => {
    const prompt = normalizePrompt(input.prompt);
    const intent = detectIntent(prompt);
    const status = intent === 'empty_input'
        ? 'needs_input'
        : input.bootstrap.created
            ? 'bootstrapped'
            : 'ready';
    return {
        message: buildMessage(intent, input),
        status,
        bootstrap: input.bootstrap,
        intent,
    };
};
