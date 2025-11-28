import { Router } from "express";
import {
  createTest,
  getTests,
  getTest,
  updateTest,
  deleteTest,
  updatePart,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  checkAnswers
} from "../controllers/readingController.js";

const router = Router();

router.post("/", createTest);
router.get("/", getTests);
router.get("/:id", getTest);
router.put("/:id", updateTest);
router.delete("/:id", deleteTest);

router.put("/:id/part/:pid", updatePart);

router.post("/:id/part/:pid/question", addQuestion);
router.put("/:id/part/:pid/question/:qid", updateQuestion);
router.delete("/:id/part/:pid/question/:qid", deleteQuestion);

router.post("/:id/check", checkAnswers);

export default router;
