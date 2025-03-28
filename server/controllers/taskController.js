const Task = require("../models/Task");

// Create Task
exports.createTask = async (req, res) => {
  const { taskName, description, expectedTime } = req.body;

  if (!taskName || !expectedTime) {
    return res
      .status(400)
      .json({ message: "Task name and expected time are required" });
  }

  try {
    const task = await Task.create({
      userId: req.user._id,
      taskName,
      description,
      expectedTime,
    });
    res.status(201).json(task);
  } catch (error) {
    console.log(error);
    
    res.status(500).json({ message: error.message });
  }
};

// Get All Tasks for Logged-in User
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user._id });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Task
exports.updateTask = async (req, res) => {
  const { taskName, description, expectedTime, status, actualTime } = req.body;
  console.log(req.body,"update task body");
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    task.taskName = taskName || task.taskName;
    task.description = description || task.description;
    task.expectedTime = expectedTime || task.expectedTime;
    task.status = status || task.status;

    // If marking as completed, save actual time
    if (status === "completed" && actualTime) {
      task.actualTime = actualTime;
    }

    await task.save();
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await task.deleteOne();
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
