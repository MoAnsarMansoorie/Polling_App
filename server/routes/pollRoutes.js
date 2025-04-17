const express = require('express');
const router = express.Router();
const pollController = require('../controllers/pollController');

router.get('/', pollController.getAllPolls);
router.post('/', pollController.createPoll);
router.get('/:id', pollController.getPollById);
router.put('/:id', pollController.updatePoll);
router.delete('/:id', pollController.deletePoll);
router.post('/:pollId/vote/:optionId', pollController.vote);

module.exports = router;