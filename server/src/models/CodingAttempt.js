import mongoose from 'mongoose';

const codingAttemptSchema = new mongoose.Schema(
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
    questionId: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'Question ID is required'],
      ref: 'CodingQuestion',
      index: true,
    },
    language: {
      type: String,
      enum: ['cpp', 'java', 'python', 'javascript'],
      default: 'javascript',
    },
    code: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['not_started', 'in_progress', 'submitted', 'expired'],
      default: 'in_progress',
      index: true,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    deadline: {
      type: Date,
      required: true,
    },
    submittedAt: {
      type: Date,
      default: null,
    },
    // Storage preparation placeholders for future execution steps
    resultStatus: {
      type: String,
      default: 'pending',
    },
    testCasesPassed: {
      type: Number,
      default: 0,
    },
    totalTestCases: {
      type: Number,
      default: 0,
    },
    score: {
      type: Number,
      default: 0,
    },
    executionTime: {
      type: Number,
      default: 0,
    },
    memoryUsed: {
      type: Number,
      default: 0,
    },
    compilerError: {
      type: String,
      default: '',
    },
    runtimeError: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for session lookups and user uniqueness per session/question
codingAttemptSchema.index({ sessionId: 1, questionId: 1 }, { unique: true });
codingAttemptSchema.index({ userId: 1, sessionId: 1 });

codingAttemptSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id ? ret._id.toString() : ret.id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const CodingAttempt = mongoose.model('CodingAttempt', codingAttemptSchema);
export default CodingAttempt;
