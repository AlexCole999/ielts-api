import ListeningTest from "../models/ListeningTest.js";

/* ============================================
   CREATE TEST
============================================ */

export const createListeningTest = async (req, res) => {
  const test = await ListeningTest.create({
    title: req.body.title || "New Listening Test",
    parts: [
      { id: "part1", name: "Part 1", audioUrl: "", script: "", groups: [] },
      { id: "part2", name: "Part 2", audioUrl: "", script: "", groups: [] },
      { id: "part3", name: "Part 3", audioUrl: "", script: "", groups: [] },
      { id: "part4", name: "Part 4", audioUrl: "", script: "", groups: [] },
    ],
  });

  res.json(test);
};

/* ============================================
   GET TESTS
============================================ */

export const getListeningTests = async (req, res) => {
  const tests = await ListeningTest.find().sort({ createdAt: -1 });
  res.json(tests);
};

export const getListeningTest = async (req, res) => {
  const test = await ListeningTest.findById(req.params.id);
  res.json(test);
};

/* ============================================
   UPDATE / DELETE TEST
============================================ */

export const updateListeningTest = async (req, res) => {
  const updated = await ListeningTest.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
};

export const deleteListeningTest = async (req, res) => {
  await ListeningTest.findById(req.params.id).deleteOne();
  res.json({ success: true });
};

/* ============================================
   PART OPERATIONS
============================================ */

export const updateListeningPart = async (req, res) => {
  const { id, pid } = req.params;
  const { name, audioUrl, script, groups } = req.body;

  const test = await ListeningTest.findById(id);
  if (!test) return res.status(404).json({ error: "Test not found" });

  const part = test.parts.find((p) => p.id === pid);
  if (!part) return res.status(404).json({ error: "Part not found" });

  if (name !== undefined) part.name = name;
  if (audioUrl !== undefined) part.audioUrl = audioUrl;
  if (script !== undefined) part.script = script;

  // Полная замена групп (если переданы)
  if (Array.isArray(groups)) {
    part.groups = groups;
    test.markModified("parts");
  }

  await test.save();
  res.json({ success: true, part });
};

/* ============================================
   GROUP OPERATIONS
============================================ */

export const addListeningGroup = async (req, res) => {
  const { id, pid } = req.params;

  const test = await ListeningTest.findById(id);
  const part = test.parts.find((p) => p.id === pid);

  const newGroup = {
    id: Date.now().toString(),
    imageUrl: "",
    questions: [],
  };

  part.groups.push(newGroup);
  await test.save();

  res.json(newGroup);
};

export const updateListeningGroup = async (req, res) => {
  const { id, pid, gid } = req.params;

  const test = await ListeningTest.findById(id);
  const part = test.parts.find((p) => p.id === pid);
  const group = part.groups.find((g) => g.id === gid);

  Object.assign(group, req.body);

  await test.save();
  res.json(group);
};

export const deleteListeningGroup = async (req, res) => {
  const { id, pid, gid } = req.params;

  const test = await ListeningTest.findById(id);
  const part = test.parts.find((p) => p.id === pid);

  part.groups = part.groups.filter((g) => g.id !== gid);

  await test.save();
  res.json({ success: true });
};

/* ============================================
   QUESTION OPERATIONS
============================================ */

export const addListeningQuestion = async (req, res) => {
  const { id, pid, gid } = req.params;
  const { question } = req.body;

  const test = await ListeningTest.findById(id);
  const part = test.parts.find((p) => p.id === pid);
  const group = part.groups.find((g) => g.id === gid);

  group.questions.push(question);
  await test.save();

  res.json(question);
};

export const updateListeningQuestion = async (req, res) => {
  const { id, pid, gid, qid } = req.params;

  const test = await ListeningTest.findById(id);
  const part = test.parts.find((p) => p.id === pid);
  const group = part.groups.find((g) => g.id === gid);
  const question = group.questions.find((q) => q.id === qid);

  Object.assign(question, req.body);

  await test.save();
  res.json(question);
};

export const deleteListeningQuestion = async (req, res) => {
  const { id, pid, gid, qid } = req.params;

  const test = await ListeningTest.findById(id);
  const part = test.parts.find((p) => p.id === pid);
  const group = part.groups.find((g) => g.id === gid);

  group.questions = group.questions.filter((q) => q.id !== qid);

  await test.save();
  res.json({ success: true });
};

/* ============================================
   CHECK ANSWERS
============================================ */

export const checkListeningAnswers = async (req, res) => {
  const { part: partId, answers } = req.body;

  const test = await ListeningTest.findById(req.params.id);
  const part = test.parts.find((p) => p.id === partId);

  let score = 0;
  let total = 0;

  // flatten all questions
  const allQuestions = part.groups.flatMap((g) => g.questions);

  allQuestions.forEach((q, i) => {
    const user = answers[i];
    if (!user) return;

    total++;

    switch (q.type) {
      case "input":
        if (
          q.answer?.trim().toLowerCase() === user.trim().toLowerCase() ||
          q.acceptableAnswers?.some(
            (a) => a.trim().toLowerCase() === user.trim().toLowerCase()
          )
        ) {
          score++;
        }
        break;

      case "choice":
        if (q.options.find((o) => o.correct && o.text === user)) score++;
        break;

      case "multiple":
        if (Array.isArray(user)) {
          const correct = q.options.filter((o) => o.correct).map((o) => o.text);
          if (JSON.stringify(correct.sort()) === JSON.stringify(user.sort()))
            score++;
        }
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

  res.json({ score, total });
};
