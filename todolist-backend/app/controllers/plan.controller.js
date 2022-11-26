
const ApiError = require("../api-error");
const PlanService = require("../services/plan.service");
const MongoDB = require("../utils/mongodb.util");

exports.create = async (req, res, next) => {
    console.log(req.body);
    console.log(req.url);
    if (!req.body?.title) {
        return next(new ApiError(400, 'Name can not be empty'));
    }
    try {
        const planService = new PlanService(MongoDB.client);
        const document = await planService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, 'An error occured while creating the plan')
        );
    }
};

exports.findAll = async (req, res, next) => {
    let documents = [];

    try {
        const planService = new PlanService(MongoDB.client);
        const { title } = req.query;

        if (title) {
            documents = await planService.findByTitle(title);

        } else {
            documents = await planService.find({});
        }
    } catch (error) {
        return new ApiError(500, 'An error occured while retrieving plans')
    }
    return res.send(documents);
};

exports.findOne = async (req, res, next) => {
    try {
        const planService = new PlanService(MongoDB.client);
        const document = await planService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, 'plan can not found'));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, `Error retriving plan with id=${req.params.id}`)
        );
    }
};

exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, 'Data to update can not be empty'));
    }

    try {
        const planService = new PlanService(MongoDB.client);
        const document = await planService.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, 'plan not found'));
        }
        return res.send({ message: 'plan was updated successfully' });

    } catch (error) {
        return next(
            new ApiError(500, `Error updating plan with id=${req.params.id}`)
        );
    }
};

exports.delete = async (req, res, next) => {
    try {
        const planService = new PlanService(MongoDB.client);
        const document = await planService.extractPlan(req.params.id);
        planService.delete(req.params.id);
        if (!document) {
            return next(
                new ApiError(404, 'plan not found')
            );
        }
        return res.send({ message: 'plan was deleted successfully' });
    } catch (error) {
        return next(
            new ApiError(500, `Could not delete plan with id=${req.params.id}`)
        );
    }
};

exports.deleteAll = async (req, res, next) => {
    try {
        const planService = new PlanService(MongoDB.client);
        const deletedCount = await planService.deleteAll();
        return res.send(
            {
                message: `${deletedCount} plans were deleted successfully`,
            }
        );
    } catch (error) {
        return next(
            new ApiError(500, 'An error occurred while removing all plans'),
        );
    }
};

exports.findAllCompleted = async (req, res, next) => {
    try {
        const planService = new PlanService(MongoDB.client);
        const documents = await planService.findCompleted();
        return res.send(documents);
    } catch (error) {
        return next(
            new ApiError(500, 'An error occurred while retriving completed plans')
        );
    }
};

exports.findAllImportant = async (req, res, next) => {
    try {
        const planService = new PlanService(MongoDB.client);
        const documents = planService.findImportant();
        return res.send(documents);
    } catch (error) {
        return next(
            new ApiError(500, 'An error occurred while retriving completed plans')
        );
    }
};