const Post = require('../models/Post');

const createPost = async (req, res) => {
    try {
        const { title, category, content } = req.body;
        const thumbnail = req.file.buffer;

        const user = req.user;
        if (user.user_type !== 'Admin') {
            return res.status(404).json({error: 'Bạn không có thẩm quyền để sử dung chức năng này'});
        }

        const post = new Post({
            title: title,
            category: category,
            thumbnail: thumbnail,
            content: content
        });
        await post.save();

        res.status(201).json(post);
    } catch (err) {
        console.error("Error creating post", err);
        return res.status(500).json({ status: false, message: err.message });
    }
};

const listPost = async (req, res) => {
    const {category} = req.body;

    try {
        const posts = await Post.find({
            category: category
        });
        const formattedPosts = posts.map((post) => ({
            id: post._id,
            title: post.title,
            category: post.category,
            thumbnail: `data:image/png;base64,${post.thumbnail.toString('base64')}`
        }));
        return res.status(200).json(formattedPosts);
    } catch (err) {
        console.error(`Error getting posts from category ${category}`, err);
        return res.status(500).json({ status: false, message: err.message });
    }
}

const getPost = async (req, res) => {
    try {
        const {id} = req.params;
        const post = await Post.findById(id);
        const formattedPost = {
            id: post._id,
            title: post.title,
            content: post.content,
            category: post.category,
            thumbnail: `data:image/png;base64,${post.thumbnail.toString('base64')}`
        };
        return res.status(200).json(formattedPost);
    } catch (err) {
        console.error("Error getting post", err);
        return res.status(500).json({ status: false, message: err.message });
    }
}

module.exports = {createPost, listPost, getPost};