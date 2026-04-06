import mongoose from 'mongoose';
import Paper from './src/models/Paper';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '.env') });

async function listPapers() {
    const uri = process.env.MONGODB_URI;
    if (!uri) return;
    try {
        await mongoose.connect(uri);
        const papers = await Paper.find().sort({ createdAt: -1 }).limit(5);
        console.log('Recent Papers:');
        papers.forEach(p => {
            console.log(`- ID: ${p._id}, Title: ${p.title}`);
            console.log(`  TextLen: ${p.extractedText?.length || 0}`);
            console.log(`  SummaryStart: ${p.summaryShort ? p.summaryShort.substring(0, 100).replace(/\n/g, ' ') : 'N/A'}`);
            if (p.summaryShort && (p.summaryShort.includes('endobj') || p.summaryShort.includes('/Type'))) {
                console.log('  *** HAS GARBAGE SUMMARY ***');
            }
        });
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

listPapers();
