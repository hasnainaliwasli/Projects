import mongoose from 'mongoose';
import Paper from './src/models/Paper';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '.env') });

async function inspectPaper() {
    const paperId = '6996bded3a5ccfd57f52b113';
    const uri = process.env.MONGODB_URI;
    if (!uri) { console.error('No URI'); return; }

    try {
        await mongoose.connect(uri);
        const paper = await Paper.findById(paperId);
        if (!paper) {
            console.log('Paper not found');
        } else {
            console.log('--- SUMMARY SHORT START ---');
            console.log(paper.summaryShort);
            console.log('--- SUMMARY SHORT END ---');
        }
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

inspectPaper();
