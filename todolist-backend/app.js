const express = require('express');
const cors = require('cors');
const plansRouter = require('./app/routes/plans.route');
const taskRouter = require('./app/routes/tasks.route');
const ApiError = require('./app/api-error');

const app = express();




app.use(cors());
app.use(express.json());
app.use('/api/plans', plansRouter);
app.use('/api/tasks/', taskRouter);
app.use((req, res, next) => {
    return next(new ApiError(404, 'Resource not found!'));
});

app.use((error, req, res, next) => {
    return res.status(error.statusCode || 500).json({
        message: error.message || 'Internal Server Error',
    });
});

app.get('/', (req, res) => {
    res.json({ "message": "Welcomee to To-do-list application." });
});

module.exports = app;
