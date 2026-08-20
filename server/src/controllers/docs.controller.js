const fs = require('fs');
const path = require('path');

const docsFolder = path.resolve('generated-docs');

const getDocumentPath = (fileName) => {
    const safeFileName = path.basename(fileName);
    const documentPath = path.resolve(docsFolder, safeFileName);

    if (!documentPath.startsWith(docsFolder)) {
        return null;
    }

    if (path.extname(documentPath) !== '.md') {
        return null;
    }

    return documentPath;
};

const viewDocumentation = (req, res) => {
    const documentPath = getDocumentPath(req.params.fileName);

    if (!documentPath || !fs.existsSync(documentPath)) {
        return res.status(404).json({
            success: false,
            message: "Documentation file not found"
        });
    }

    res.type('text/markdown');
    res.sendFile(documentPath);
};

const listDocumentation = (req, res) => {
    if (!fs.existsSync(docsFolder)) {
        return res.json({
            success: true,
            documents: []
        });
    }

    const documents = fs.readdirSync(docsFolder)
        .filter((fileName) => path.extname(fileName) === '.md')
        .map((fileName) => {
            const documentPath = path.join(docsFolder, fileName);
            const stats = fs.statSync(documentPath);

            return {
                fileName,
                size: stats.size,
                createdAt: stats.birthtime,
                viewUrl: `/api/docs/${fileName}`,
                downloadUrl: `/api/docs/download/${fileName}`
            };
        })
        .sort((first, second) => {
            return new Date(second.createdAt) - new Date(first.createdAt);
        });

    res.json({
        success: true,
        documents
    });
};

const downloadDocumentation = (req, res) => {
    const documentPath = getDocumentPath(req.params.fileName);

    if (!documentPath || !fs.existsSync(documentPath)) {
        return res.status(404).json({
            success: false,
            message: "Documentation file not found"
        });
    }

    const fileName = path.basename(documentPath);

    res.download(documentPath, fileName);
};

module.exports = {
    listDocumentation,
    viewDocumentation,
    downloadDocumentation
};
