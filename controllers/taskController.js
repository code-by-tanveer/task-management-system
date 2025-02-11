const Task = require('../models/Task');

exports.createTask = async (req, res) => {
    try {
        const { title, description, status, priority, due_date, assigned_to } = req.body;

        if (!assigned_to) {
            return res.status(400).json({ message: 'Task must be assigned to a user.' });
        }

        const task = new Task({
            title,
            description,
            status,
            priority,
            due_date,
            assigned_to,
        });
        await task.save();
        res.status(201).json({ message: 'Task created successfully', task });
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ message: 'Failed to create task', error: error.message });
    }
};

exports.getTask = async (req, res) => {
    try {
        const taskId = req.params.taskId;
        const userId = req.user.id;

        const task = await Task.findById(taskId).populate('assigned_to', 'email role');
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (task.assigned_to._id.toString() !== userId) {
            return res.status(403).json({ message: 'Forbidden. You can only access tasks assigned to you.' });
        }

        res.status(200).json(task);
    } catch (error) {
        console.error('Error fetching task:', error);
        res.status(500).json({ message: 'Failed to fetch task', error: error.message });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const taskId = req.params.taskId;
        const userId = req.user.id;
        const updates = req.body;

        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (task.assigned_to.toString() !== userId) {
            return res.status(403).json({ message: 'Forbidden. You can only update tasks assigned to you.' });
        }

        const updatedTask = await Task.findByIdAndUpdate(taskId, updates, { new: true, runValidators: true }).populate('assigned_to', 'email role');
        res.status(200).json({ message: 'Task updated successfully', task: updatedTask });
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ message: 'Failed to update task', error: error.message });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const taskId = req.params.taskId;
        const userId = req.user.id;

        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (task.assigned_to.toString() !== userId) {
            return res.status(403).json({ message: 'Forbidden. You can only delete tasks assigned to you.' });
        }

        const deletedTask = await Task.findByIdAndDelete(taskId);
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ message: 'Failed to delete task', error: error.message });
    }
};

exports.getAllTasksForUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const { page = 1, pageSize = 10, sortBy, sortOrder = 'asc', status, priority, dueDate } = req.query;

        const pageNumber = parseInt(page);
        const itemsPerPage = parseInt(pageSize);
        const skip = (pageNumber - 1) * itemsPerPage;

        const sort = {};
        if (sortBy) {
            sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
        }

        const filter = { assigned_to: userId };
        if (status) {
            filter.status = status;
        }
        if (priority) {
            filter.priority = priority;
        }
        if (dueDate) {
            filter.due_date = { $lte: new Date(dueDate) };
        }

        const tasks = await Task.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(itemsPerPage)
            .populate('assigned_to', 'email role');

        const totalTasks = await Task.countDocuments(filter);
        const totalPages = Math.ceil(totalTasks / itemsPerPage);

        res.status(200).json({
            tasks,
            page: pageNumber,
            pageSize: itemsPerPage,
            totalPages,
            totalTasks,
        });
    } catch (error) {
        console.error('Error fetching tasks for user:', error);
        res.status(500).json({ message: 'Failed to fetch tasks', error: error.message });
    }
};