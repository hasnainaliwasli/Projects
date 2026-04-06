import mongoose from 'mongoose';
import Paper from '../models/Paper';
import { generateAISummary } from '../services/aiService';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

async function debugSummary() {
    const paperId = '6996bded3a5ccfd57f52b113';
    const uri = process.env.MONGODB_URI;

    if (!uri) {
        console.error('MONGODB_URI not found in .env');
        return;
    }

    try {
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');

        const paper = await Paper.findById(paperId);
        if (!paper) {
            console.error('Paper not found');
            return;
        }

        console.log(`Paper Title: ${paper.title}`);
        console.log(`Extracted Text Length: ${paper.extractedText?.length || 0}`);

        if (!paper.extractedText || paper.extractedText.length < 100) {
            console.warn('Text is too short for AI summary');
        }

        console.log('--- Calling generateAISummary ---');
        const result = await generateAISummary(paper.extractedText);
        console.log('--- Result ---');
        console.log(JSON.stringify(result, null, 2));

    } catch (error) {
        console.error('Debug failed:', error);
    } finally {
        await mongoose.disconnect();
    }
}

debugSummary();
