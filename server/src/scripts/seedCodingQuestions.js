import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import CodingQuestion from '../models/CodingQuestion.js';
import { codingQuestionsData } from '../data/codingQuestions.js';

dotenv.config();

/**
 * Idempotently seed coding questions into MongoDB.
 * Never deletes existing documents or drops collections.
 * Preserves question _id references so existing CodingAttempt records remain linked.
 */
export const seedCodingQuestions = async () => {
  const stats = {
    totalToSeed: codingQuestionsData.length,
    insertedCount: 0,
    updatedCount: 0,
    alreadyPresentCount: 0,
    totalAvailable: 0,
    isDbConnected: false,
  };

  try {
    console.log('Connecting to database for seeding coding questions...');
    await connectDB();

    if (mongoose.connection.readyState !== 1) {
      console.warn(
        'MongoDB is not currently reachable. Skipping DB insert. Questions remain fully accessible via the 100-question in-memory bank.'
      );
      stats.totalAvailable = codingQuestionsData.length;
      return stats;
    }

    stats.isDbConnected = true;
    console.log(`Analyzing database state for ${codingQuestionsData.length} questions...`);

    for (const q of codingQuestionsData) {
      const slug = q.slug || q.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      // Locate existing question by slug or title to reconcile existing DB records safely
      const existingDoc = await CodingQuestion.findOne({
        $or: [{ slug }, { title: q.title }],
      });

      const questionPayload = {
        title: q.title,
        slug,
        difficulty: q.difficulty,
        topic: q.topic,
        tags: q.tags || [],
        inputFormat: q.inputFormat || '',
        outputFormat: q.outputFormat || '',
        referenceUrl: q.referenceUrl || '',
        attribution: q.attribution || '',
        description: q.description,
        constraints: q.constraints || [],
        examples: q.examples || [],
        testCases: q.testCases || [],
        starterCode: q.starterCode || {},
        supportedLanguages: q.supportedLanguages || ['cpp', 'java', 'python', 'javascript'],
      };

      if (existingDoc) {
        stats.alreadyPresentCount++;
        const updateRes = await CodingQuestion.updateOne(
          { _id: existingDoc._id },
          { $set: questionPayload }
        );
        if (updateRes.modifiedCount > 0) {
          stats.updatedCount++;
        }
      } else {
        await CodingQuestion.create(questionPayload);
        stats.insertedCount++;
      }
    }

    stats.totalAvailable = await CodingQuestion.countDocuments();

    console.log('====================================================');
    console.log('CODING QUESTIONS SEEDING COMPLETED SUCCESSFULLY');
    console.log(`- Questions in source bank: ${stats.totalToSeed}`);
    console.log(`- New questions inserted:   ${stats.insertedCount}`);
    console.log(`- Questions already present:${stats.alreadyPresentCount}`);
    console.log(`- Questions updated:        ${stats.updatedCount}`);
    console.log(`- Total available in DB:    ${stats.totalAvailable}`);
    console.log('====================================================');

    return stats;
  } catch (error) {
    console.error('Error seeding coding questions:', error.message);
    throw error;
  } finally {
    // Only disconnect if invoked directly via CLI
    if (process.argv[1] && process.argv[1].includes('seedCodingQuestions.js')) {
      if (mongoose.connection.readyState === 1) {
        await mongoose.disconnect();
      }
    }
  }
};

// If run directly via node cli
if (process.argv[1] && process.argv[1].includes('seedCodingQuestions.js')) {
  seedCodingQuestions()
    .then(() => {
      process.exit(0);
    })
    .catch(() => {
      process.exit(1);
    });
}

export default seedCodingQuestions;
