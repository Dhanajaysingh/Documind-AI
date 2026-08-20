const fs = require('fs');
const path = require('path');

const docsFolder = 'generated-docs';

const saveDocumentationFile = (uploadedFileName, documentation) => {
    if (!fs.existsSync(docsFolder)) {
        fs.mkdirSync(docsFolder);
    }

    const parsedName = path.parse(uploadedFileName);
    const documentName = `${parsedName.name}.md`;
    const documentPath = path.join(docsFolder, documentName);

    fs.writeFileSync(documentPath, documentation, 'utf-8');

    return documentPath;
};

module.exports = {
    saveDocumentationFile
};
