import mongoose from "mongoose";

const OptionSchema = new mongoose.Schema({
  text: String,
  correct: Boolean,
});

const QuestionSchema = new mongoose.Schema({
  id: String,
  type: {
    type: String,
    enum: ["choice", "multiple", "input", "summary", "boolean", "matching"],
    required: true,
  },
  text: String,
  options: [OptionSchema],
  answer: String,
  matchingQuestions: [String],
  matchingAnswers: [String],
  correctMatches: [String],
  summaryText: String,
  summaryAnswers: [String],
});

const InstructionSchema = new mongoose.Schema({
  id: String,
  from: Number,
  to: Number,
  title: String,
  text: String,
});

const PartSchema = new mongoose.Schema({
  id: String,
  name: String,
  passage: String,
  passageFile: String,

  instructions: [InstructionSchema], // 👈 ДОБАВИЛИ

  questions: [QuestionSchema],
});

const ReadingTestSchema = new mongoose.Schema(
  {
    title: String,

    duration: {
      type: Number, // в минутах
      default: 60,  // IELTS Reading
    },

    parts: [PartSchema],
  },
  { timestamps: true }
);

export default mongoose.model("ReadingTest", ReadingTestSchema);
