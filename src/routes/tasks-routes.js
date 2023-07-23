const express = require('express')
const auth = require('../middleware/auth.js')
const Task = require('../models/task.js')

const router = new express.Router()

router.post('/', auth, async (req, res) => {
  try {
    let task
    if(req.body.length) {
      task = req.body.map( t => new Task({
        ...t,
        owner: req.user._id
      }))
    } else {
      task = new Task({
        ...req.body,
        owner: req.user._id
      });
    }
    await Task.create(task);
    res.send(task);
  } catch (e) {
    res.send(e);
  }
});

router.get('/', auth, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  let match = {};
  if (req.query.description) {
    match.description = { $regex: req.query.description, $options: 'i' };
  }
  if (req.query.title) {
    match.title = { $regex: req.query.title, $options: 'i' };
  }
  if (req.query.completed) {
    match.completed = req.query.completed
  }

  try {
    const totalTasks = await Task.countDocuments(match);
    const totalPages = Math.ceil(totalTasks / limit);
    const skip = (page - 1) * limit;

    let sort = {};
    if (req.query.sortBy) {
      const parts = req.query.sortBy.split(':');
      if (parts.length === 2) {
        const field = parts[0];
        const order = parts[1] === 'desc' ? -1 : 1;
        sort[field] = order;
      }
    }
    
    const tasks = await req.user
      .populate({
        path: 'tasks',
        match: match,
        options: {
          skip: skip,
          limit: limit,
          sort: sort
        }
      })
    
    res.send({
      tasks: tasks.tasks,
      currentPage: page,
      totalPages: totalPages
    });
  } catch (e) {
    console.error(e);
    res.status(500).send('Server Error');
  }
});


router.get('/:id', auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const data = await Task.findOne({_id, owner: req.user._id});
    console.log('data')
    console.log(data)
    if (!data) {
      res.status(401).send();
    }
    res.send(data);
  } catch (e) {
    console.error(e)
    res.status(501).send(e);
  }
});

router.patch('/:id', async (req, res) => {
  const _id = req.params.id
  const fields = ['title', 'description', 'completed']
  const fieldsReq = Object.keys(req.body)
  const isValidOperation = fieldsReq.every( f => fields.includes(f) )

  if(!isValidOperation) {
    return res.status(404).send({error: "Invalid field"})
  }

  try {
    const task = await Task.findOneAndUpdate({_id}, req.body, {new: true, runValidators: true})
    if(!task) {
      res.status(404).send()
    }
    res.send(task)
  } catch (error) {
    res.status(500).send(error)    
  }
})

router.delete('/:id', auth, async (req, res) => {
  const _id = req.params.id

  try {
    const user = await Task.findOneAndDelete({_id, owner: req.user._id})

    if(!user) {
      return res.status(404).send({error: "Invalid id"})
    }

    res.send(user)
  } catch (error) {
    res.status(500).send(error)    
  }
})

module.exports = router