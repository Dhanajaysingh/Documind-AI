const maxContextCharacters = 200000;

const buildProjectContext = (files) => {
    let context = '';

    files.forEach((file) => {
        const fileBlock = [
            `File: ${file.path}`,
            '```',
            file.content,
            '```',
            ''
        ].join('\n');

        if (context.length + fileBlock.length <= maxContextCharacters) {
            context += fileBlock;
        }
    });

    return context;
};

const buildDocumentationPrompt = (files) => {
    const projectContext = buildProjectContext(files);

    return [
        'You are an expert software documentation writer.',
        'Generate clear documentation for this codebase.',
        'Use plain ASCII Markdown only. Do not use emojis, box drawing characters, or special symbols.',
        '',
        'Include:',
        '- Project overview',
        '- Folder and file structure',
        '- Main features',
        '- Important functions, routes, and modules',
        '- Setup and run instructions if visible from the code',
        '',
        'Codebase:',
        projectContext
    ].join('\n');
};

module.exports = {
    buildProjectContext,
    buildDocumentationPrompt
};
