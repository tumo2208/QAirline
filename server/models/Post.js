const mongoose = require('mongoose');
const { Schema } = mongoose;

const postSchema = new Schema({
    title: { type: String, required: true },
    category: { type: String, enum: ['destination', 'offer', 'mail', 'banner'], required: true },
    thumbnail: {type: Buffer},
    content: { type: String, required: true }
});

module.exports = mongoose.model('Post', postSchema);
