import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import CodingQuestion from '../models/CodingQuestion.js';
import { codingQuestionsData } from '../data/codingQuestions.js';

dotenv.config();

export const seedCodingQuestions = async () => {
  try {
    console.log('Connecting to database for seeding coding questions...');
    await connectDB();

    if (mongoose.connection.readyState !== 1) {
      console.warn('MongoDB is not connected. Skipping DB insert. Questions remain accessible via in-memory bank.');
      return;
    }

    console.log('Clearing existing CodingQuestion documents...');
    const deleteResult = await CodingQuestion.deleteMany({});
    console.log(`Cleared ${deleteResult.deletedCount} existing questions.`);

    console.log(`Inserting ${codingQuestionsData.length} curated coding questions...`);
    const inserted = await CodingQuestion.insertMany(codingQuestionsData);
    console.log(`Successfully seeded ${inserted.length} coding questions into MongoDB.`);
  } catch (error) {
    console.error('Error seeding coding questions:', error.message);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
  }
};

// If run directly via node cli
if (process.argv[1] && process.argv[1].includes('seedCodingQuestions.js')) {
  seedCodingQuestions().then(() => {
    process.exit(0);
  });
}

export default seedCodingQuestions;
