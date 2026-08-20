const fs = require('fs');
const path = require('path');

const ignoredFolders = [
    'node_modules',
    '.git',
    'dist',
    'build',
    '.next',
    'coverage'
];

const allowedExtensions = [
    '.js',
    '.jsx',
    '.ts',
    '.tsx',
    '.json',
    '.html',
    '.css',
    '.md'
];

const maxFileSize = 100 * 1024;

const scanCodeFiles = (folderPath) => {
    const files = [];

    const scanFolder = (currentPath) => {
        const items = fs.readdirSync(currentPath, { withFileTypes: true });

        items.forEach((item) => {
            const itemPath = path.join(currentPath, item.name);

            if (item.isDirectory()) {
                if (!ignoredFolders.includes(item.name)) {
                    scanFolder(itemPath);
                }

                return;
            }

            const ext = path.extname(item.name).toLowerCase();

            if (allowedExtensions.includes(ext)) {
                files.push(itemPath);
            }
        });
    };

    scanFolder(folderPath);

    return files;
};

const readCodeFiles = (filePaths, rootPath) => {
    return filePaths
        .map((filePath) => {
            const stats = fs.statSync(filePath);

            if (stats.size > maxFileSize) {
                return null;
            }

            return {
                path: path.relative(rootPath, filePath),
                size: stats.size,
                content: fs.readFileSync(filePath, 'utf-8')
            };
        })
        .filter(Boolean);
};

module.exports = {
    scanCodeFiles,
    readCodeFiles
};
