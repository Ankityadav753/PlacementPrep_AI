import mongoose from 'mongoose';

export const REVIEW_TYPES = [
  'explain_mistakes',
  'explain_approach',
  'optimize_code',
  'better_approach',
  'show_solution',
];

const codingReviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'User ID is required'],
      ref: 'User',
      index: true,
    },
    sessionId: {
      type: String,
      required: [true, 'Session ID is required'],
      index: true,
    },
    attemptId: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'Attempt ID is required'],
      ref: 'CodingAttempt',
      index: true,
    },
    questionId: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'Question ID is required'],
      ref: 'CodingQuestion',
      index: true,
    },
    reviewType: {
      type: String,
      required: [true, 'Review type is required'],
      enum: {
        values: REVIEW_TYPES,
        message: '{VALUE} is not a valid review type',
      },
      index: true,
    },
    language: {
      type: String,
      required: [true, 'Language is required'],
      enum: ['cpp', 'java', 'python', 'javascript'],
    },
    generatedReview: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'Generated review content is required'],
    },
    model: {
      type: String,
      default: 'placementprep-ai-evaluator',
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for caching lookups and fast retrieval
codingReviewSchema.index({ attemptId: 1, reviewType: 1, language: 1 }, { unique: true });
codingReviewSchema.index({ sessionId: 1, questionId: 1, reviewType: 1 });
codingReviewSchema.index({ userId: 1, sessionId: 1 });

codingReviewSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id ? ret._id.toString() : ret.id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const CodingReview = mongoose.model('CodingReview', codingReviewSchema);
export default CodingReview;
