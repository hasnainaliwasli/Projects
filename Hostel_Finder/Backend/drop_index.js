const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hostel_finder');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const dropIndex = async () => {
    await connectDB();

    try {
        const collection = mongoose.connection.collection('reviews');
        // Check if index exists
        const indexes = await collection.indexes();
        const indexExists = indexes.some(idx => idx.name === 'hostel_1_user_1');

        if (indexExists) {
            await collection.dropIndex('hostel_1_user_1');
            console.log('Success: Index "hostel_1_user_1" dropped!');
        } else {
            console.log('Info: Index "hostel_1_user_1" not found. It might have consistently been removed already.');
        }
    } catch (error) {
        console.error('Error dropping index:', error.message);
    }

    process.exit();
};

dropIndex();
