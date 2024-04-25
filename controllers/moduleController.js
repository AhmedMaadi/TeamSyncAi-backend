import Task from '../models/Task.js';
import Module from '../models/Module.js'


export async function receiveModules(req, res) {
    try {
        const { projectID, modules } = req.body;

        for (const moduleData of modules) {
            const { module_name, tasks, teamM } = moduleData; // Extract teamM from moduleData
            
            const newModule = new Module({ module_name, projectID, teamM }); // Include teamM when creating a new module
            await newModule.save();

            for (const task of tasks) {
                const newTask = new Task({ module_id: newModule._id, task_description: task.task_name, projectID , team: task.team});
                await newTask.save();
            }
        }

        console.log('Modules saved successfully');
        res.status(200).json({ projectID, message: 'Modules saved successfully' });
    } catch (error) {
        console.error('Error saving modules:', error);
        res.status(500).json({ error: 'Failed to save modules' });
    }
}




export async function getModulesByProjectID(req, res) {
    try {
        const { projectID } = req.params;

        const modules = await Module.find({ projectID }).exec();

        res.status(200).json({ modules });
    } catch (error) {
        console.error('Error retrieving modules by projectID:', error);
        res.status(500).json({ error: 'Failed to retrieve modules by projectID' });
    }
}



export const updateModule = async (req, res) => {
    try {
        const { id } = req.params;
        const { module_name } = req.body;

        const updateModule = await Module.findByIdAndUpdate(id, { module_name }, { new: true });
        res.status(200).json(updateModule);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}


export const deleteModule = async (req, res) => {
    try {
        const { id } = req.params;

        await Module.findByIdAndDelete(id);

        await Task.deleteMany({ module_id: id });

        res.status(200).json({ message: 'Module and associated tasks deleted' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export async function createDefaultModule(projectID) {
    try {
        const defaultModuleName = 'New Module';
        const exampleEmail = 'example@gmail.com'; // Example email address

        console.log('Creating default module...');
        
        const newModule = new Module({ module_name: defaultModuleName, projectID: projectID, teamM: [exampleEmail] }); // Pass the example email address as the value for teamM
        await newModule.save();

        console.log('Default module created successfully');
        
        return newModule;
    } catch (error) {
        console.error('Error creating default module:', error);
        throw error;
    }
}



export const getModuleById = async (req, res) => {
    try {
        const { id } = req.params;
        const module = await Module.findById(id);
        if (!module) {
            return res.status(404).json({ message: 'Module not found' });
        }
        res.status(200).json(module);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

