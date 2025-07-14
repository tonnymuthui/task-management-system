const express = require("express");
const router = express.Router();
const {
  getAllTasks,
  getMyTasks,
  assignTask,
  updateStatus,
} = require("../controllers/taskController");

const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

router.get("/", verifyToken, isAdmin, getAllTasks);
router.post("/", verifyToken, isAdmin, assignTask);
router.put("/:id/status", verifyToken, updateStatus);
router.get("/my-tasks", verifyToken, getMyTasks);

module.exports = router;
