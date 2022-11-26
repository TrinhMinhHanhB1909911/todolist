const { ObjectId } = require("mongodb");

class TaskService {
    constructor(client) {
        this.tasks = client.db().collection('tasks');
    }

    extractTask(payload) {
        const task = {
            _id: payload._id,
            planId: payload.planId,
            title: payload.title,
            description: payload.description,
            completed: payload.completed,
            isImportant: payload.isImportant,
        };

        // ObjectId.keys(plan).forEach(
        //     (key) => plan[key] === undefined && delete plan[key]
        // );

        return task;
    }

    async create(payload) {
        const task = this.extractTask(payload);
        delete task._id;
        const result = await this.tasks.findOneAndUpdate(
            task,
            { $set: { completed: false, isImportant: false } },
            { returnDocument: 'after', upsert: true },
        );
        return result.value;
    }

    async find(filter) {
        const cursor = await this.tasks.find(filter);
        return await cursor.toArray();
    }

    async findByTitle(title) {
        return await this.find({
            title: { $regex: new RegExp(title), $option: 'i' },
        });
    }

    async findById(id) {
        return await this.tasks.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        }
        const update = this.extractTask(payload);
        delete update._id;
        const result = await this.tasks.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: 'after' },
        );   
        return result.value;
    }

    async delete(id) {
        const result = await this.tasks.deleteOne(
            {
                _id: ObjectId.isValid(id) ? new ObjectId(id) : null
            }
        );
        return result.value;
    }

    async findImportant() {
        return await this.find(
            {
                isImportant: true,
            }
        );
    }

    async deleteAll() {
        const result = await this.tasks.deleteMany({});
        return result.deleteCount;
    }

    async findCompleted() {
        return await this.find(
            { completed: true }
        );
    }

    
}

module.exports = TaskService;