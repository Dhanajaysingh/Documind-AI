const path = require('path');
const Document = require('../models/document.model');

const saveDocumentationFile = async ({
    userId,
    originalName,
    documentation
}) => {
    const parsedName = path.parse(originalName);
    const fileName = `${parsedName.name}.md`;
    const size = Buffer.byteLength(documentation, 'utf-8');

    const document = await Document.create({
        userId,
        fileName,
        originalName,
        documentation,
        size
    });

    return document;
};

module.exports = {
    saveDocumentationFile
};
