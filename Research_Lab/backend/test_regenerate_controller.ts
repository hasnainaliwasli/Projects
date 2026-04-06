import mongoose from 'mongoose';
import { regenerateSummary } from './src/controllers/paperController';
import Paper from './src/models/Paper';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '.env') });

const mockReq = {
    params: { id: '6996bded3a5ccfd57f52b113' },
    user: { _id: 'mock_admin_id' } // mocking auth user if needed
} as any;

const mockRes = {
    statusCode: 200,
    data: null,
    status: function (code: number) {
        this.statusCode = code;
        return this;
    },
    json: function (data: any) {
        this.data = data;
        return this;
    }
} as any;

const mockNext = (err: any) => {
    console.error('Controller called next(err):', err);
};

async function testController() {
    const uri = process.env.MONGODB_URI;
    if (!uri) { console.error('No URI'); return; }

    try {
        await mongoose.connect(uri);
        console.log('Connected to DB. Calling regenerateSummary...');

        await regenerateSummary(mockReq, mockRes, mockNext);

        console.log('--- CONTROLLER RESPONSE ---');
        console.log('Status:', mockRes.statusCode);
        if (mockRes.data && mockRes.data.data) {
            const p = mockRes.data.data;
            console.log('Paper Title:', p.title);
            console.log('SummaryShort:', p.summaryShort);
            console.log('ExtractedTextLen:', p.extractedText ? p.extractedText.length : 0);
        } else {
            console.log('Response Body:', mockRes.data);
        }

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

testController();
