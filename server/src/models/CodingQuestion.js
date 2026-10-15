import mongoose from 'mongoose';

const exampleSchema = new mongoose.Schema(
  {
    input: {
      type: String,
      required: true,
    },
    output: {
      type: String,
      required: true,
    },
    explanation: {
      type: String,
      default: '',
    },
  },
  { _id: false }
);

const testCaseSchema = new mongoose.Schema(
  {
    input: {
      type: String,
      required: true,
    },
    expectedOutput: {
      type: String,
      required: true,
    },
    hidden: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const starterCodeSchema = new mongoose.Schema(
  {
    cpp: {
      type: String,
      default: '',
    },
    java: {
      type: String,
      default: '',
    },
    python: {
      type: String,
      default: '',
    },
    javascript: {
      type: String,
      default: '',
    },
  },
  { _id: false }
);

const codingQuestionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Question title is required'],
      trim: true,
      index: true,
    },
    slug: {
      type: String,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Question description is required'],
    },
    difficulty: {
      type: String,
      required: [true, 'Difficulty level is required'],
      enum: {
        values: ['Easy', 'Medium', 'Hard'],
        message: '{VALUE} is not a valid difficulty level',
      },
      index: true,
    },
    topic: {
      type: String,
      required: [true, 'Topic is required'],
      trim: true,
      index: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    inputFormat: {
      type: String,
      default: '',
    },
    outputFormat: {
      type: String,
      default: '',
    },
    referenceUrl: {
      type: String,
      default: '',
    },
    attribution: {
      type: String,
      default: '',
    },
    constraints: {
      type: [String],
      default: [],
    },
    examples: {
      type: [exampleSchema],
      default: [],
    },
    testCases: {
      type: [testCaseSchema],
      default: [],
    },
    starterCode: {
      type: starterCodeSchema,
      required: true,
      default: () => ({}),
    },
    supportedLanguages: {
      type: [String],
      enum: ['cpp', 'java', 'python', 'javascript'],
      default: ['cpp', 'java', 'python', 'javascript'],
    },
  },
  {
    timestamps: true,
  }
);

// Helpful compound index
codingQuestionSchema.index({ difficulty: 1, topic: 1 });

codingQuestionSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id ? ret._id.toString() : ret.id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const CodingQuestion = mongoose.model('CodingQuestion', codingQuestionSchema);
export default CodingQuestion;
