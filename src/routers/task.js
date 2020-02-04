const {Task} = require('../models/task');
const {Router} = require('express');
const {auth} = require('../middleware/auth');

const router = new Router();

router.post('/tasks', auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id,
  });

  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(401).send(e);
  }
});

router.get('/tasks', auth, async (req, res) => {
  const filter = {
    owner: req.user._id,
  };

  if (req.query.completed === 'true') {
    filter.completed = true;
  } else if (req.query.completed === 'false') {
    filter.completed = false;
  }

  const limit = parseInt(req.query.limit);
  const skip = parseInt(req.query.skip);
  const sort = {};

  if (req.query.sortby) {
    const parts = req.query.sortby.split(':');
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
  }

  const queryOptions = {
    limit,
    skip,
    sort,
  };

  try {
    const task = await Task.find(filter, null, queryOptions);
    res.send(task);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get('/tasks/:id', auth, async (req, res) => {
  const id = req.params.id;

  try {
    const task = await Task.findOne({_id: id, owner: req.user._id});

    if (!task) {
      return res.status(404).send();
    }

    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});

router.patch('/tasks/:id', auth, async (req, res) => {
  const id = req.params.id;
  const updates = Object.keys(req.body);
  const allowedUpdates = ['description', 'completed'];
  const isValid = updates.every((update) => {
    return allowedUpdates.includes(update);
  });

  if (!isValid) {
    return res.status(400).send({error: 'Invalid operation'});
  }

  try {
    const task = await Task.findOne({_id: id, owner: req.user._id});

    updates.forEach((update) => {
      task[update] = req.body[update];
    });

    await task.save();

    if (!task) {
      return res.status(404).send();
    }

    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});

router.delete('/tasks/:id', auth, async (req, res) => {
  const id = req.params.id;

  try {
    const task = await Task.findOneAndDelete({_id: id, owner: req.user._id});

    if (!task) {
      return res.status(404).send();
    }

    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = {
  taskRouter: router,
};
