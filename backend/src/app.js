const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Task = require('./models/Task');

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(
  process.env.MONGODB_URI || 'mongodb://mongodb:27017/taskmanager',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Routes
// app.get('/api/tasks', async (req, res) => {
//   try {
//     const { status, priority } = req.query;
//     let query = {};

//     if (status && status !== 'all') {
//       query.completed = status === 'completed';
//     }

//     if (priority && priority !== 'all') {
//       query.priority = priority;
//     }

//     const tasks = await Task.find(query).sort({ createdAt: -1 });
//     res.json(tasks);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

app.get('/api/tasks', async (req, res) => {
  try {
    const { status, priority, query } = req.query;
    let searchCriteria = {};

    // Status filter
    if (status && status !== 'all') {
      searchCriteria.completed = status === 'completed';
    }

    // Priority filter
    if (priority && priority !== 'all') {
      searchCriteria.priority = priority;
    }

    // Search by query text
    if (query) {
      searchCriteria.text = { $regex: query, $options: 'i' }; // Case-insensitive search
    }

    const tasks = await Task.find(searchCriteria).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const task = new Task(req.body);
    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.patch('/api/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Search tasks by text or priority
app.get('/api/tasks/search', async (req, res) => {
  try {
    const { query, priority } = req.query;
    let searchCriteria = {};

    // Search by query text
    if (query) {
      searchCriteria.text = { $regex: query, $options: 'i' }; // Case-insensitive search
    }

    // Filter by priority if provided
    if (priority && priority !== 'all') {
      searchCriteria.priority = priority;
    }

    const tasks = await Task.find(searchCriteria).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
