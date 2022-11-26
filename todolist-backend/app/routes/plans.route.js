const express = require('express');
const plans = require('../controllers/plan.controller');

const router = express.Router();

router.route('/')
    .get(plans.findAll)
    .post(plans.create)
    .delete(plans.deleteAll);

router.route('/isImportant').get(plans.findAllImportant);
router.route('/completed').get(plans.findAllCompleted);

router.route('/:id')
    .get(plans.findOne)
    .put(plans.update)
    .delete(plans.delete);

module.exports = router;