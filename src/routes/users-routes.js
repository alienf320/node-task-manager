const express = require('express')
const User = require('../models/user.js')
const auth = require('../middleware/auth.js')
const multer = require('multer')

const router = new express.Router()
const upload = multer({
  fileSize: 100000,
  storage: multer.memoryStorage(),
  fileFilter(req, file, cb) {
    if(!file.originalname.match(/.*\.(jpg|png|jpeg)$/)) {
      return cb(new Error("The file must be jpeg, jpg or png"))
    }
    cb(null, true)
  }
}); 

router.post('/me/avatar', auth, upload.single('avatar'), async(req, res) => {
  try {
    req.user.avatar = req.file.buffer
    await req.user.save()
    res.send()    
  } catch (error) {
    console.error(error)
    res.status(504).send(error)
  }
}, (error, req, res, next) => {
  res.status(400).send({error: error.message})
})

router.delete('/me/avatar', auth, async(req, res) => {
  try {
    delete req.user.avatar
    await req.user.save()
    res.send(`Avatar from user ${req.user.name} was deleted`)
  } catch (error) {
    res.status(505).send(error)
    
  }
})

router.post('/', async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(409).send({ error: 'That email is already in use.' });
    }
    const user = new User(req.body);
    const token = await user.generateAuthToken()
    
    res.send({user, token});
  } catch (e) {
    console.error(e)
    res.status(400).send(e);
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const data = await User.find({});
    res.send(data);
  } catch (e) {
    res.send(e);
  }
});

router.get('/me', auth, async (req, res) => {
  res.send(req.user)
});

router.get('/:id', async (req, res) => {
  const _id = req.params.id;
  try {
    const data = await User.findById(_id);
    if (!data) {
      res.status(401).send();
    }
    res.send(data);
  } catch (e) {
    res.send(e);
  }
});

router.patch('/me', auth, async (req, res) => {
  const allowedUpdates = ['name', 'email', 'password', 'age'];
  const updates = Object.keys(req.body);
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  const _id = req.user._id;
  try {
    const user = await User.findOneAndUpdate({_id}, req.body, { new: true, runValidators: true });
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete('/me', auth, async (req, res) => {
  try {
    req.user.delete()
    res.send(req.user)
  } catch (error) {
    res.status(500).send(error)    
  }
})

router.post('/login', auth, async (req, res) => {
  try {
    const user = await User.findCredentials(req.body.email, req.body.password)
    const token = await user.generateAuthToken(user.id.toString())
    res.send({user, token})    
  } catch (error) {
    res.status(500).send(error)
  }
})

router.post('/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(t => t.token !== req.token)

    req.user.save();
    res.send()
  } catch (error) {
    res.status(500).send(error)    
  }
})

router.post('/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = []

    req.user.save();
    res.send()
  } catch (error) {
    res.status(500).send(error)    
  }
})

module.exports = router