const path = require('path');
const Document = require('../models/document.model');

const getSafeFileName = (fileName) => {
    const safeFileName = path.basename(fileName);

    if (path.extname(safeFileName) !== '.md') {
        return null;
    }

    return safeFileName;
};

const findUserDocument = async (req) => {
    const fileName = getSafeFileName(req.params.fileName);

    if (!fileName) {
        return null;
    }

    return Document.findOne({
        userId: req.user.id,
        fileName
    }).sort({
        createdAt: -1
    });
};

const viewDocumentation = async (req, res) => {
    const document = await findUserDocument(req);

    if (!document) {
        return res.status(404).json({
            success: false,
            message: "Documentation file not found"
        });
    }

    res.type('text/markdown');
    res.send(document.documentation);
};

const listDocumentation = async (req, res) => {
    const documents = await Document.find({
        userId: req.user.id
    }).sort({
        createdAt: -1
    });

    res.json({
        success: true,
        documents: documents.map((document) => ({
            id: document.id,
            fileName: document.fileName,
            originalName: document.originalName,
            size: document.size,
            createdAt: document.createdAt,
            viewUrl: `/api/docs/${document.fileName}`,
            downloadUrl: `/api/docs/download/${document.fileName}`
        }))
    });
};

const downloadDocumentation = async (req, res) => {
    const document = await findUserDocument(req);

    if (!document) {
        return res.status(404).json({
            success: false,
            message: "Documentation file not found"
        });
    }

    res.setHeader(
        'Content-Disposition',
        `attachment; filename="${document.fileName}"`
    );
    res.type('text/markdown');

    res.send(document.documentation);
};

module.exports = {
    listDocumentation,
    viewDocumentation,
    downloadDocumentation
};
