const express = require('express');
const {createPost, listPost, getPost} = require('../controller/PostController');
const userVerification = require('../middleware/authMiddleware');

const router = express.Router();

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/createPost', userVerification, upload.single('thumbnail'), createPost);
router.post('/listPost', listPost);
router.get('/getPost/:id', getPost);

module.exports = router;