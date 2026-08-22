const AdmZip = require('adm-zip');
const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '../../..');
const runtimeRoot = process.env.VERCEL
    ? path.join('/tmp', 'documind-ai')
    : projectRoot;
const extractedFolder = path.join(runtimeRoot, 'extracted');

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
