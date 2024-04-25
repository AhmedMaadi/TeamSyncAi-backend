import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
    module_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true },
    task_description: { type: String, required: true },
    projectID: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    completed: { type: Boolean, default: false },
    date: { type: Date, default: Date.now },
    team: [{ type: String }] 
});

const Task = mongoose.model('Task', TaskSchema);

export default Task;
