const express = require("express");
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const authenticate = require("../middlewares/authMiddleware");

const router = express.Router();

// Task Routes
router.post("/add", authenticate, createTask); 
router.get("/", authenticate, getTasks); 
router.put("/update/:id", authenticate, updateTask); 
router.delete("/delete/:id", authenticate, deleteTask);

module.exports = router;
