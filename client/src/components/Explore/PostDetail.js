import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function PostDetail() {
    const { id } = useParams();
    const [post, setPost] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:3001/api/post/getPost/${id}`).then((res) => setPost(res.data));
    }, [id]);

    if (!post) return <div>Đang tải dữ liệu...</div>;

    return (
        <div>
            <h1>{post.title}</h1>
            <img src={post.thumbnail} alt={post.title} />
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
    );
}

export default PostDetail;
