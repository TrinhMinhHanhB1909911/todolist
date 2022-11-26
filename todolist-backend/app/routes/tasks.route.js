const express = require('express');
const tasks = require('../controllers/task.controller');

const router = express.Router();

router.route('/')
    .get(tasks.findAll)
    .post(tasks.create)
    .delete(tasks.deleteAll);

router.route('/isImportant').get(tasks.findAllImportant);
router.route('/completed').get(tasks.findAllCompleted);

router.route('/:id')
    .get(tasks.findOne)
    .put(tasks.update)
    .delete(tasks.delete);

module.exports = router;