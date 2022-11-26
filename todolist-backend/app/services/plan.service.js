const { ObjectId } = require('mongodb');


class PlanService {
    constructor(client) {
        this.plans = client.db().collection('plans');
    }


    extractPlan(payload) {
        const plan = {
            _id: payload._id,
            title: payload.title,
            description: payload.description,
            completed: payload.completed,
            isImportant: payload.isImportant,
        };
        return plan;
    }

    async create(payload) {
        const plan = this.extractPlan(payload);
        delete plan._id;
        const result = await this.plans.findOneAndUpdate(
            plan,
            { $set: { completed: false, isImportant: false } },
            { returnDocument: 'after', upsert: true },
        );
        return result.value;
    }

    async find(filter) {
        const cursor = await this.plans.find(filter);
        return await cursor.toArray();
    }

    async findByTitle(title) {
        return await this.find({
            title: { $regex: new RegExp(title), $option: 'i' },
        });
    }

    async findById(id) {
        return await this.plans.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        }

        const update = this.extractPlan(payload);
        delete update._id;
        const result = await this.plans.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: 'after' },
        );
        return result.value;
    }

    async delete(id) {
        const result = await this.plans.deleteOne(
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
        const result = await this.plans.deleteMany({});
        return result.deleteCount;
    }

    async findCompleted() {
        return await this.find(
            { completed: true }
        );
    }
}

module.exports = PlanService;