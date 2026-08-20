const AdmZip = require('adm-zip');
const fs = require('fs');
const path = require('path');

const extractedFolder = path.resolve('extracted');

const extractArchive = (filePath) => {
    const zip = new AdmZip(filePath);

    const fileName = path.basename(filePath, path.extname(filePath));
    const extractPath = path.join(extractedFolder, fileName);

    if (!fs.existsSync(extractedFolder)) {
        fs.mkdirSync(extractedFolder, { recursive: true });
    }

    zip.extractAllTo(extractPath, true);
    return extractPath;
};

module.exports = {
    extractArchive
};
