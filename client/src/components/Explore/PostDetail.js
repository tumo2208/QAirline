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
        <div className="py-10 justify-center items-center" style={{backgroundImage: "url('https://wallpapercat.com/w/full/3/b/d/21204-1920x1200-desktop-hd-clouds-background-photo.jpg')"}}>
            {post.category === 'destination' ? (
                <div>
                    <iframe src={post.content.slice(3, -6)} className='w-full h-screen max-w-6xl mx-auto rounded-lg'></iframe>
                </div>
            ) : <div>
                    <h1>{post.title}</h1>
                    <img src={post.thumbnail} alt={post.title} />
                    <div dangerouslySetInnerHTML={{ __html: post.content }} />
                </div>
            }
        </div>
    );
}

export default PostDetail;
