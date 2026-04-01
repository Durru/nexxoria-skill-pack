const appendUniqueEntries = (source, entries = []) => {
    const normalizedSource = source.trimEnd();
    const existingLines = new Set(normalizedSource
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean));
    const nextLines = entries
        .map((entry) => entry.trim())
        .filter(Boolean)
        .filter((entry) => !existingLines.has(`- ${entry}`) && !existingLines.has(entry))
        .map((entry) => `- ${entry}`);
    if (nextLines.length === 0) {
        return `${normalizedSource}\n`;
    }
    const separator = normalizedSource ? '\n' : '';
    return `${normalizedSource}${separator}${nextLines.join('\n')}\n`;
};
export const ensureMemoryResult = (memory) => memory;
export const mergeMemoryEvents = (memory, events) => ({
    global: {
        decisions: appendUniqueEntries(memory.global.decisions, events.decisions),
        architecture: appendUniqueEntries(memory.global.architecture, events.architecture),
        errors: appendUniqueEntries(memory.global.errors, events.errors),
    },
});
