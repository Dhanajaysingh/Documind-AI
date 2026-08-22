const mongoose = require('mongoose');

mongoose.set('bufferCommands', false);

const connectDB = async () => {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
        throw new Error('MONGODB_URI is missing');
    }

    await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 10000
    });
    console.log('MongoDB connected');
};

module.exports = {
    connectDB
};
