
const ApiError = require("../api-error");
const TaskService = require("../services/task.service");
const MongoDB = require("../utils/mongodb.util");

exports.create = async (req, res, next) => {
    console.log(req.body);
    console.log(req.url);
    if (!req.body?.title) {
        return next(new ApiError(400, 'Name can not be empty'));
    }
    try {
        const taskService = new TaskService(MongoDB.client);
        const document = await taskService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, 'An error occured while creating the task')
        );
    }
};

exports.findAll = async (req, res, next) => {
    let documents = [];

    try {
        const taskService = new TaskService(MongoDB.client);
        const { title } = req.query;

        if (title) {
            documents = await taskService.findByTitle(title);

        } else {
            documents = await taskService.find({});
        }
    } catch (error) {
        return new ApiError(500, 'An error occured while retrieving tasks')
    }
    return res.send(documents);
};

exports.findOne = async (req, res, next) => {
    try {
        const taskService = new TaskService(MongoDB.client);
        const document = await taskService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, 'task can not found'));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, `Error retriving task with id=${req.params.id}`)
        );
    }
};

exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, 'Data to update can not be empty'));
    }

    try {
        const taskService = new TaskService(MongoDB.client);
        const document = await taskService.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, 'task not found'));
        }
        return res.send({ message: 'task was updated successfully' });

    } catch (error) {
        return next(
            new ApiError(500, `Error updating task with id=${req.params.id}`)
        );
    }
};

exports.delete = async (req, res, next) => {
    try {
        const taskService = new TaskService(MongoDB.client);
        const document = await taskService.extractTask(req.params.id);
        taskService.delete(req.params.id);
        if (!document) {
            return next(
                new ApiError(404, 'task not found')
            );
        }
        return res.send({ message: 'task was deleted successfully' });
    } catch (error) {
        return next(
            new ApiError(500, `Could not delete task with id=${req.params.id}`)
        );
    }
};

exports.deleteAll = async (req, res, next) => {
    try {
        const taskService = new TaskService(MongoDB.client);
        const deletedCount = await taskService.deleteAll();
        return res.send(
            {
                message: `${deletedCount} tasks were deleted successfully`,
            }
        );
    } catch (error) {
        return next(
            new ApiError(500, 'An error occurred while removing all tasks'),
        );
    }
};

exports.findAllCompleted = async (req, res, next) => {
    try {
        const taskService = new TaskService(MongoDB.client);
        const documents = await taskService.findCompleted();
        return res.send(documents);
    } catch (error) {
        return next(
            new ApiError(500, 'An error occurred while retriving completed tasks')
        );
    }
};

exports.findAllImportant = async (req, res, next) => {
    try {
        const taskService = new TaskService(MongoDB.client);
        const documents = taskService.findImportant();
        return res.send(documents);
    } catch (error) {
        return next(
            new ApiError(500, 'An error occurred while retriving completed tasks')
        );
    }
};
