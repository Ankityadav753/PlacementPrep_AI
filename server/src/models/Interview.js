import mongoose from 'mongoose';

/**
 * Question sub-schema for Interview session
 */
const questionSchema = new mongoose.Schema(
  {
    questionId: {
      type: String,
      required: [true, 'Question ID is required'],
    },
    text: {
      type: String,
      required: [true, 'Question text is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['technical', 'project', 'hr', 'behavioral'],
      required: [true, 'Category is required'],
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      required: [true, 'Difficulty is required'],
    },
    askedAt: {
      type: Date,
      default: Date.now,
    },
    answeredAt: {
      type: Date,
      default: null,
    },
  },
  { _id: false }
);

/**
 * Answer & Evaluation sub-schema for Interview session
 */
const answerSchema = new mongoose.Schema(
  {
    questionId: {
      type: String,
      required: [true, 'Question ID is required'],
    },
    answer: {
      type: String,
      required: [true, 'Answer text is required'],
    },
    category: {
      type: String,
      default: 'technical',
    },
    difficulty: {
      type: String,
      default: 'Medium',
    },
    answeredAt: {
      type: Date,
      default: Date.now,
    },
    evaluation: {
      score: {
        type: Number,
        default: 0,
      },
      strengths: {
        type: [String],
        default: [],
      },
      weaknesses: {
        type: [String],
        default: [],
      },
      feedback: {
        type: String,
        default: '',
      },
      conceptClarity: {
        type: Number,
        default: 0,
      },
      communication: {
        type: Number,
        default: 0,
      },
    },
  },
  { _id: false }
);

/**
 * Main Interview Schema
 */
const interviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.Mixed,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    role: {
      type: String,
      required: [true, 'Target role is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['not_started', 'in_progress', 'completed', 'abandoned'],
      default: 'in_progress',
      index: true,
    },
    questions: {
      type: [questionSchema],
      default: [],
    },
    answers: {
      type: [answerSchema],
      default: [],
    },
    scores: {
      technicalKnowledge: { type: Number, default: 0 },
      conceptClarity: { type: Number, default: 0 },
      communication: { type: Number, default: 0 },
      confidenceIndicators: { type: Number, default: 0 },
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    finalReport: {
      overallScore: { type: Number, default: 0 },
      summary: { type: String, default: '' },
      strengths: { type: [String], default: [] },
      weakTopics: { type: [String], default: [] },
      recommendations: { type: [String], default: [] },
      technicalKnowledge: { type: Number, default: 0 },
      conceptClarity: { type: Number, default: 0 },
      communication: { type: Number, default: 0 },
      confidenceIndicators: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast lookup by user and creation date
interviewSchema.index({ userId: 1, createdAt: -1 });

interviewSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id ? ret._id.toString() : ret.id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Interview = mongoose.model('Interview', interviewSchema);
export default Interview;
