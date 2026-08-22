const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const {
    connectDB
} = require('./src/config/db');

const app = express();
const isAllowedOrigin = (origin) => {
    if (!origin) {
        return true;
    }

    return /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);
};

app.use(cors({
    origin: (origin, callback) => {
        if (isAllowedOrigin(origin)) {
            return callback(null, true);
        }

        callback(new Error('Not allowed by CORS'));
    },
    credentials: true
}));
app.use(cookieParser());
const uploadRoutes =
    require('./src/routes/upload.routes');
const docsRoutes =
    require('./src/routes/docs.routes');
const authRoutes =
    require('./src/routes/auth.routes');
const {
    authMiddleware
} = require('./src/middlewares/auth.middleware');

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server is running');
});



app.use('/api/auth', authRoutes);
app.use('/api', authMiddleware, uploadRoutes);
app.use('/api/docs', authMiddleware, docsRoutes);

app.use((error, req, res, next) => {
    console.error(error);

    res.status(500).json({
        success: false,
        message: error.message || 'Internal server error'
    });
});

const PORT = process.env.PORT || 5000;

connectDB().catch((error) => {
    console.error('MongoDB connection failed:', error.message);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
