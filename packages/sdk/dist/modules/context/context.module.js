const defaultGlobalContext = '# Global Context\n\n- Project initialized by Nexxoria\n- Global context is not defined yet\n';
export const getDefaultProjectContext = () => ({
    global: defaultGlobalContext,
});
export const ensureProjectContext = (globalContext) => {
    if (!globalContext || !globalContext.trim()) {
        return getDefaultProjectContext();
    }
    return {
        global: globalContext,
    };
};
