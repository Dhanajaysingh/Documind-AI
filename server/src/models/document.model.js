const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },
        fileName: {
            type: String,
            required: true
        },
        originalName: {
            type: String,
            required: true
        },
        documentation: {
            type: String,
            required: true
        },
        size: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Document', documentSchema);
