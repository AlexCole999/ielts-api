import ReadingTest from "../models/ReadingTest.js";

export const createTest = async (req, res) => {
  const test = await ReadingTest.create({
    title: req.body.title || "New Reading Test",
    parts: [
      { id: "part1", name: "Part 1", passage: "", questions: [] },
      { id: "part2", name: "Part 2", passage: "", questions: [] },
      { id: "part3", name: "Part 3", passage: "", questions: [] },
    ],
  });
  res.json(test);
};

export const getTests = async (req, res) => {
  const tests = await ReadingTest.find().sort({ createdAt: -1 });
  res.json(tests);
};

export const getTest = async (req, res) => {
  const test = await ReadingTest.findById(req.params.id);
  res.json(test);
};

export const updateTest = async (req, res) => {
  const updated = await ReadingTest.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

export const deleteTest = async (req, res) => {
  await ReadingTest.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};

// ---------------- PART ----------------

export const updatePart = async (req, res) => {
  const { id, pid } = req.params;
  const { name, passage, questions } = req.body;

  const test = await ReadingTest.findById(id);
  if (!test) return res.status(404).json({ error: "Test not found" });

  const partIndex = test.parts.findIndex(p => p.id === pid);
  if (partIndex === -1) return res.status(404).json({ error: "Part not found" });

  if (name !== undefined) test.parts[partIndex].name = name;
  if (passage !== undefined) test.parts[partIndex].passage = passage;
  if (questions !== undefined) {
    test.parts[partIndex].questions = questions;
    test.markModified(`parts.${partIndex}.questions`);
  }

  await test.save();
  res.json({ success: true, part: test.parts[partIndex] });
};

// ---------------- QUESTIONS ----------------

export const addQuestion = async (req, res) => {
  const { id, pid } = req.params;
  const { question } = req.body;

  const test = await ReadingTest.findById(id);
  const part = test.parts.find(p => p.id === pid);

  part.questions.push(question);
  await test.save();

  res.json(part.questions[part.questions.length - 1]);
};

export const updateQuestion = async (req, res) => {
  const { id, pid, qid } = req.params;

  const test = await ReadingTest.findById(id);
  const part = test.parts.find(p => p.id === pid);
  const question = part.questions.find(q => q.id === qid);

  Object.assign(question, req.body);
  await test.save();

  res.json(question);
};

export const deleteQuestion = async (req, res) => {
  const { id, pid, qid } = req.params;

  const test = await ReadingTest.findById(id);
  const part = test.parts.find(p => p.id === pid);

  part.questions = part.questions.filter(q => q.id !== qid);
  await test.save();

  res.json({ success: true });
};

// ---------------- CHECK ----------------

export const checkAnswers = async (req, res) => {
  const { part, answers } = req.body;

  const test = await ReadingTest.findById(req.params.id);
  const p = test.parts.find(p => p.id === part);

  let score = 0;

  p.questions.forEach((q, i) => {
    const user = answers[i];
    if (!user) return;

    switch (q.type) {
      case "input":
        if (q.answer?.trim().toLowerCase() === user.trim().toLowerCase()) score++;
        break;
      case "choice":
        if (q.options.find(o => o.correct && o.text === user)) score++;
        break;
      case "boolean":
        if (q.answer === user.toUpperCase()) score++;
        break;
      case "matching":
        q.correctMatches.forEach((correct, idx) => {
          if (user[idx]?.toUpperCase() === correct.toUpperCase()) score++;
        });
        break;
    }
  });

  res.json({ score, total: p.questions.length });
};
