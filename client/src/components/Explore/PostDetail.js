import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function PostDetail() {
    const { id } = useParams();
    const [post, setPost] = useState(null);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/api/post/getPost/${id}`).then((res) => setPost(res.data));
    }, [id]);

    if (!post) return <div>Đang tải dữ liệu...</div>;

    return (
        <div className="py-10 justify-center items-center" style={{backgroundImage: "url('https://wallpapercat.com/w/full/3/b/d/21204-1920x1200-desktop-hd-clouds-background-photo.jpg')"}}>
            {post.category === 'destination' ? (
                <div>
                    <iframe src={post.content.slice(3, -6)} className='w-full h-screen max-w-6xl mx-auto rounded-lg'></iframe>
                </div>
            ) : <div className="bg-gray-100 max-w-6xl  flex flex-col mx-auto justify-center rounded-2xl shadow-lg border-4 p-5 w-full space-y-7">
                    <h1 className='font-bold text-center text-3xl'>{post.title}</h1>
                    <img src={post.thumbnail} alt={post.title} className='w-full max-w-2xl h-96 mx-auto' />
                    <div dangerouslySetInnerHTML={{ __html: post.content }} className='max-h-96 overflow-y-auto' />
                </div>
            }
        </div>
    );
}

export default PostDetail;
