const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    
    if (!uri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
      throw new Error(`Invalid MongoDB URI format. Got: "${uri}"`);
    }

    await mongoose.connect(uri);
    console.log('MongoDB Connected Successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
