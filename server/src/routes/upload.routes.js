const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();
const uploadsFolder = path.resolve('uploads');

const { uploadFile } =
    require('../controllers/upload.controller');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (!fs.existsSync(uploadsFolder)) {
            fs.mkdirSync(uploadsFolder, { recursive: true });
        }

        cb(null, uploadsFolder);
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + file.originalname;
        cb(null, uniqueName);
    }
});

const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();

    const allowedExtensions = ['.zip'];
    if (!allowedExtensions.includes(ext)) {
        return cb(new Error('Only zip files are supported right now'));
    }

    cb(null, true);
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024
    }
});

const uploadCodebase = (req, res, next) => {
    upload.single('codebase')(req, res, (error) => {
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        next();
    });
};

router.post('/upload', uploadCodebase, uploadFile);

module.exports = router;
