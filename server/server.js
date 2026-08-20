const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174'
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
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

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
