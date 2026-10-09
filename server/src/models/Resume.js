import mongoose from 'mongoose';

const bulletPointSuggestionSchema = new mongoose.Schema(
  {
    original: {
      type: String,
      required: true,
      trim: true,
    },
    improved: {
      type: String,
      required: true,
      trim: true,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const resumeAnalysisSchema = new mongoose.Schema(
  {
    atsScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    strengths: {
      type: [String],
      default: [],
    },
    issues: {
      type: [String],
      default: [],
    },
    missingKeywords: {
      type: [String],
      default: [],
    },
    skillAnalysis: {
      found: {
        type: [String],
        default: [],
      },
      missing: {
        type: [String],
        default: [],
      },
      categorized: {
        technical: {
          type: [String],
          default: [],
        },
        soft: {
          type: [String],
          default: [],
        },
        tools: {
          type: [String],
          default: [],
        },
      },
    },
    projectAnalysis: {
      count: {
        type: Number,
        default: 0,
      },
      hasMetrics: {
        type: Boolean,
        default: false,
      },
      feedback: {
        type: [String],
        default: [],
      },
    },
    educationAnalysis: {
      found: {
        type: Boolean,
        default: false,
      },
      degrees: {
        type: [String],
        default: [],
      },
      feedback: {
        type: [String],
        default: [],
      },
    },
    experienceAnalysis: {
      hasExperience: {
        type: Boolean,
        default: false,
      },
      feedback: {
        type: [String],
        default: [],
      },
    },
    certificationAnalysis: {
      found: {
        type: Boolean,
        default: false,
      },
      count: {
        type: Number,
        default: 0,
      },
      items: {
        type: [String],
        default: [],
      },
      feedback: {
        type: [String],
        default: [],
      },
    },
    formattingIssues: {
      type: [String],
      default: [],
    },
    grammarIssues: {
      type: [String],
      default: [],
    },
    unnecessaryInformation: {
      type: [String],
      default: [],
    },
    bulletPointSuggestions: {
      type: [bulletPointSuggestionSchema],
      default: [],
    },
  },
  { _id: false }
);

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'User ID is required'],
      index: true,
      ref: 'User',
    },
    originalFileName: {
      type: String,
      required: [true, 'Original file name is required'],
      trim: true,
    },
    fileType: {
      type: String,
      required: [true, 'File type is required'],
      default: 'application/pdf',
      trim: true,
    },
    fileSize: {
      type: Number,
      required: [true, 'File size is required'],
      min: [1, 'File size must be greater than 0'],
      max: [5 * 1024 * 1024, 'File size cannot exceed 5 MB'],
    },
    targetRole: {
      type: String,
      default: 'General / Any Role',
      trim: true,
    },
    extractedText: {
      type: String,
      required: [true, 'Extracted text is required'],
    },
    analysis: {
      type: resumeAnalysisSchema,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for user query performance
resumeSchema.index({ userId: 1, createdAt: -1 });

resumeSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id ? ret._id.toString() : ret.id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Resume = mongoose.model('Resume', resumeSchema);
export default Resume;
