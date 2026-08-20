const express = require('express');

const router = express.Router();

const {
    listDocumentation,
    viewDocumentation,
    downloadDocumentation
} = require('../controllers/docs.controller');

router.get('/', listDocumentation);
router.get('/download/:fileName', downloadDocumentation);
router.get('/:fileName/download', downloadDocumentation);
router.get('/:fileName', viewDocumentation);

module.exports = router;
