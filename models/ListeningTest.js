import mongoose from "mongoose";

/* ============================
   QUESTION
============================ */
const ListeningQuestionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: {
    type: String,
    enum: ["choice", "multiple", "input", "summary", "boolean", "matching"],
    required: true,
  },
  text: String,

  options: [{ text: String, correct: Boolean }],
  answer: String,

  summaryText: String,
  summaryAnswers: [String],

  matchingQuestions: [String],
  matchingAnswers: [String],   // ← вот это новое
  correctMatches: [String],
});

/* ============================
   GROUP
============================ */
const ListeningGroupSchema = new mongoose.Schema({
  id: { type: String, required: true },
  imageUrl: { type: String, default: "" },
  questions: [ListeningQuestionSchema],
});

/* ============================
   PART
============================ */
const ListeningPartSchema = new mongoose.Schema({
  id: String,
  name: String,
  audioUrl: String,
  script: String,
  groups: [ListeningGroupSchema],
});

/* ============================
   TEST
============================ */
const ListeningTestSchema = new mongoose.Schema(
  {
    title: String,
    parts: [ListeningPartSchema],
  },
  { timestamps: true }
);

export default mongoose.model("ListeningTest", ListeningTestSchema);
