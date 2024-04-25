import { Router } from 'express';
import { receiveModules, getModulesByProjectID, updateModule, deleteModule, createDefaultModule } from '../controllers/moduleController.js';

const router = Router();

router.post('/receive_modules', receiveModules);
router.get('/project/:projectID', getModulesByProjectID);
router.put('/:id', updateModule);
router.delete('/:id', deleteModule);
router.post('/defaultM', async (req, res) => {
    try {
        const projectID = req.body.projectID; 
        const newModule = await createDefaultModule(projectID); 

        res.status(200).json({ message: 'Default module created successfully', module: newModule });
    } catch (error) {
        // Send an error response if something goes wrong
        res.status(500).json({ error: 'Error creating default module', message: error.message });
    }
});



export default router;
