export const renderBulletList = (values, emptyValue) => {
    return values.map((item) => `- ${item}`).join('\n') || emptyValue;
};
export const extractBulletValues = (content) => {
    if (!content)
        return [];
    return content
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.startsWith('- '))
        .map((line) => line.slice(2).trim())
        .filter(Boolean);
};
