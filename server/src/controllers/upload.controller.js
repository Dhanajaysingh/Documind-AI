
const { extractArchive } = require('../services/archive.service');
const { scanCodeFiles, readCodeFiles } = require('../services/codeScanner.service');
const { buildDocumentationPrompt } = require('../services/documentation.service');
const { generateDocumentation } = require('../services/ai.service');
const { saveDocumentationFile } = require('../services/documentFile.service');

const uploadFile = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: "No zip file uploaded"
        });
    }

    try {
        console.log('Upload received:', req.file.originalname);
        const extractedPath = extractArchive(req.file.path);
        console.log('Archive extracted:', extractedPath);

        const codeFiles = scanCodeFiles(extractedPath);
        console.log('Code files found:', codeFiles.length);

        const fileContents = readCodeFiles(codeFiles, extractedPath);
        console.log('Code files read:', fileContents.length);

        if (fileContents.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No readable code files found in this archive"
            });
        }

        const totalCharacters = fileContents.reduce((total, file) => {
            return total + file.content.length;
        }, 0);
        const documentationPrompt = buildDocumentationPrompt(fileContents);
        console.log('Prompt characters:', documentationPrompt.length);

        const documentation = await generateDocumentation(documentationPrompt);
        console.log('Documentation generated');

        const savedDocument = await saveDocumentationFile({
            userId: req.user.id,
            originalName: req.file.originalname,
            documentation
        });
        console.log('Documentation saved:', savedDocument.fileName);

        const documentationFileName = savedDocument.fileName;

        res.json({
            success: true,
            message: "Documentation generated successfully",
            file: {
                originalName: req.file.originalname,
                storedName: req.file.filename,
                path: req.file.path,
                size: req.file.size
            },
            extractedPath,
            totalFilesFound: codeFiles.length,
            totalFilesRead: fileContents.length,
            totalCharacters,
            promptCharacters: documentationPrompt.length,
            files: fileContents.map((file) => ({
                path: file.path,
                size: file.size
            })),
            documentId: savedDocument.id,
            documentationPath: documentationFileName,
            documentationUrl: `/api/docs/${documentationFileName}`,
            documentationDownloadUrl: `/api/docs/download/${documentationFileName}`,
            documentation
        });
    } catch (error) {
        console.error('Upload pipeline failed:', error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    uploadFile
};
