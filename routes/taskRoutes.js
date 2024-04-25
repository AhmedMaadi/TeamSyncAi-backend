import { Router } from 'express';
import { createDefaultTask, createTask, deleteTask, getTaskByUserId, getTasksByModuleID, updateTask,markTaskAsCompleted } from '../controllers/taskController.js';

const router = Router();

router.post('/', createTask);
router.get('/modul/:module_id', getTasksByModuleID);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.post('/defaultT', async (req, res) => {
    try {
        const projectID = req.body.projectID; // Assuming projectID is sent in the request body
        const module_id = req.body.module_id; // Assuming module_id is sent in the request body
        const newTask = await createDefaultTask(projectID, module_id); // Call your function and await its completion

        // Send a success response with the created task
        res.status(200).json({ message: 'Default task created successfully', task: newTask });
    } catch (error) {
        // Send an error response if something goes wrong
        res.status(500).json({ error: 'Error creating default task', message: error.message });
    }
});
router.get('/user/:user',getTaskByUserId)
router.put('/:taskId/completed',markTaskAsCompleted)



export default router;
