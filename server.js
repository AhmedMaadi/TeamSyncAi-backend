import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import userRouter from './routes/user.js';
import dotenv from 'dotenv';
import cors from 'cors'
import path from 'path'
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { createProject, getAllProjects } from './routes/projectRoutes.js';
import moduleRoute from './routes/moduleRoute.js'; 
import taskRoute from './routes/taskRoutes.js';
import axios from 'axios';
import Task from './models/Task.js'; 
import { notFoundError, errorHandler } from './middlewares/error-handler.js';
import User from './models/user.js';
import Project from './models/Project.js';
import Module from './models/Module.js'


const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();
app.use(morgan('dev'));
app.use(cors())
app.use(express.json());

app.use('/user', userRouter);
app.get("/logout", (req, res) => {
  res.cookie("jwt", "", { maxAge: "1" })
  res.status(201).json({ message: 'successfully logged out ' })
});

app.get('/uploads/:filename', (req, res) => {
  const filename = req.params.filename;
  const imagePath = path.join(__dirname, 'uploads', filename);

  // Send the image file
  res.sendFile(imagePath);
});

app.get('/user-specialties/:email', async (req, res) => {
  try {
    const email = req.params.email;
    // Find user specialties by email
    const specialty = await User.findByEmail(email);
    res.status(200).json({ specialty });
  } catch (error) {
    console.error('Error fetching user specialties:', error.message);
    res.status(500).json({ message: error.message });
  }
});

const generateSteps = async (task_description) => {
  try {
      const response = await axios.post('http://127.0.0.1:5000/task-title', { task_description });
      return response.data.text;
  } catch (error) {
      console.error('Error while generating steps:', error);
      return null;
  }
};

app.get('/task/:id', async (req, res) => {
  try {
      const taskId = req.params.id;
      const task = await Task.findById(taskId);

      if (!task) {
          return res.status(404).json({ message: 'Task not found' });
      } 

      // Extract task_description from the task
      const task_description = task.task_description;

      // Generate steps based on the task_description
      const steps = await generateSteps(task_description);

      if (!steps) {
          return res.status(500).json({ message: 'Error generating steps' });
      }

      res.status(200).json({ task, steps });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

app.post('/getByEmail', async (req, res) => {
  const { email } = req.body;
  try {
    const projects = await Project.find({ members: email });
    res.status(200).json(projects);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


app.post('/getMByEmail', async(req, res) => {
  const { email } = req.body;
  try {
    
    const modules = await Module.find( {teamM: email});
    res.status(200).json(modules);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
})


app.use('/projects', createProject);
app.use('/projectss', getAllProjects);
app.use('/modules', moduleRoute);
app.use('/tasks', taskRoute);
app.use(notFoundError);
app.use(errorHandler);
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

mongoose.connect('mongodb+srv://ahmedmaadi19:Ahmedmaadimido19@ahmed.uiec5dx.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.log(error);
  });

app.listen(PORT, () => {
  console.log(`Node app is running on port ${PORT}`);
});
