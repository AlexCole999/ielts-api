import { Router } from "express";

import {
  createListeningTest,
  getListeningTests,
  getListeningTest,
  updateListeningTest,
  deleteListeningTest,

  updateListeningPart,

  addListeningGroup,
  updateListeningGroup,
  deleteListeningGroup,

  addListeningQuestion,
  updateListeningQuestion,
  deleteListeningQuestion,

  checkListeningAnswers
} from "../controllers/listeningController.js";

const router = Router();

/* ===============================
   TEST LEVEL
=============================== */

router.post("/", createListeningTest);
router.get("/", getListeningTests);
router.get("/:id", getListeningTest);
router.put("/:id", updateListeningTest);
router.delete("/:id", deleteListeningTest);

/* ===============================
   PART LEVEL
=============================== */

router.put("/:id/part/:pid", updateListeningPart);

/* ===============================
   GROUP LEVEL
=============================== */

router.post("/:id/part/:pid/group", addListeningGroup);
router.put("/:id/part/:pid/group/:gid", updateListeningGroup);
router.delete("/:id/part/:pid/group/:gid", deleteListeningGroup);

/* ===============================
   QUESTION LEVEL
=============================== */

router.post("/:id/part/:pid/group/:gid/question", addListeningQuestion);
router.put("/:id/part/:pid/group/:gid/question/:qid", updateListeningQuestion);
router.delete("/:id/part/:pid/group/:gid/question/:qid", deleteListeningQuestion);

/* ===============================
   CHECK ANSWERS
=============================== */

router.post("/:id/check", checkListeningAnswers);

export default router;
