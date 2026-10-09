import mongoose from 'mongoose';

/**
 * Connect to MongoDB database via Mongoose.
 * Does not terminate the server process if database connection fails,
 * allowing the application structure and non-database endpoints to be tested standalone.
 */
export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  const isProd = process.env.NODE_ENV === 'production';

  if (!uri) {
    if (isProd) {
      console.error('❌ CRITICAL: MONGODB_URI is required in production mode. Refusing to run in ephemeral mode.');
      process.exit(1);
    }
    console.warn('⚠️  MONGODB_URI not set. Running in standalone mode without database connection.');
    return null;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    if (isProd) {
      console.error(`❌ CRITICAL: MongoDB production connection failed: ${error.message}`);
      process.exit(1);
    }
    console.warn(`⚠️  MongoDB connection failed: ${error.message}`);
    console.warn('⚠️  Continuing server execution in standalone mode for local development/testing.');
    return null;
  }
};

export default connectDB;
