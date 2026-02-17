import dotenv from 'dotenv';
dotenv.config();

export const config = {
    port: parseInt(process.env.PORT || '5000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',

    mongodb: {
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/research_assistant',
    },

    jwt: {
        secret: process.env.JWT_SECRET || 'default_jwt_secret',
        refreshSecret: process.env.JWT_REFRESH_SECRET || 'default_refresh_secret',
        expire: process.env.JWT_EXPIRE || '15m',
        refreshExpire: process.env.JWT_REFRESH_EXPIRE || '7d',
    },

    cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
        apiKey: process.env.CLOUDINARY_API_KEY || '',
        apiSecret: process.env.CLOUDINARY_API_SECRET || '',
    },

    gemini: {
        apiKey: process.env.GEMINI_API_KEY || '',
    },
};
