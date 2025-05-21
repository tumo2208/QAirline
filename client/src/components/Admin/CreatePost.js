import React, { useState } from 'react';
import { EditorState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import axios from 'axios';
import {useNavigate} from "react-router-dom";

function CreatePost() {
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [thumbnail, setThumbnail] = useState(null);
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const onEditorStateChange = (newState) => {
        setEditorState(newState);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const content = draftToHtml(convertToRaw(editorState.getCurrentContent()));
        const formData = new FormData();
        formData.append('title', title);
        formData.append('category', category);
        formData.append('thumbnail', thumbnail);
        formData.append('content', content);

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/post/createPost`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            });
            if (response.status === 201) {
                setSuccess('Bài viết đã được tạo thành công!');
                setTimeout(() => {
                    setSuccess('');
                }, 3000);
            }
        } catch (err) {
            console.error(err);
            setError(`Không thể tạo bài viết: ${err.message}`);
            setTimeout(() => {
                setSuccess('');
            }, 3000);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4">
            <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Tạo bài đăng</h1>
                {success && (<div className="mb-4 text-green-500 text-center">{success}</div>)}
                {error && (<div className="mb-4 text-red-500 text-center">{error}</div>)}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Tiêu đề
                        </label>
                        <input
                            type="text"
                            placeholder="Enter post title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                            Chủ đề
                        </label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="" disabled>Select a category</option>
                            <option value="destination">Địa điểm</option>
                            <option value="offer">Khuyến mãi</option>
                            <option value="banner">Banner</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700">
                            Ảnh đại diện
                        </label>
                        <input
                            type="file"
                            onChange={(e) => setThumbnail(e.target.files[0])}
                            required
                            className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-md shadow-sm cursor-pointer bg-gray-50"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                            Nội dung
                        </label>
                        <div className="border border-gray-300 rounded-md p-2">
                            <Editor
                                editorState={editorState}
                                wrapperClassName="wrapper-class"
                                editorClassName="editor-class"
                                toolbarClassName="toolbar-class"
                                onEditorStateChange={onEditorStateChange}
                                toolbar={{
                                    options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'emoji', 'history'],
                                    blockType: {
                                        inDropdown: true,
                                        options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'Blockquote', 'Code'],
                                        className: undefined,
                                        component: undefined,
                                        dropdownClassName: undefined,
                                    },
                                    fontSize: {
                                        options: [8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72, 96],
                                        className: undefined,
                                        component: undefined,
                                        dropdownClassName: undefined,
                                    },
                                    fontFamily: {
                                        options: ['Arial', 'Georgia', 'Impact', 'Tahoma', 'Times New Roman', 'Verdana'],
                                        className: undefined,
                                        component: undefined,
                                        dropdownClassName: undefined,
                                    },
                                    list: {
                                        inDropdown: false,
                                        className: undefined,
                                        component: undefined,
                                        dropdownClassName: undefined,
                                        options: ['unordered', 'ordered'],
                                    },
                                    textAlign: {
                                        inDropdown: false,
                                        className: undefined,
                                        component: undefined,
                                        dropdownClassName: undefined,
                                        options: ['left', 'center', 'right', 'justify'],
                                    },
                                    emoji: {
                                        className: undefined,
                                        component: undefined,
                                        popupClassName: undefined,
                                        emojis: [
                                            '😀', '😁', '😂', '😃', '😉', '😋', '😎', '😍', '😗', '🤗', '🤔', '😣', '😫', '😴', '😌', '🤓',
                                            '😛', '😜', '😠', '😇', '😷', '😈', '👻', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '🙈',
                                            '🙉', '🙊', '👼', '👮', '🕵', '💂', '👳', '🎅', '👸', '👰', '👲', '🙍', '🙇', '🚶', '🏃', '💃',
                                            '⛷', '🏂', '🏌', '🏄', '🚣', '🏊', '⛹', '🏋', '🚴', '👫', '💪', '👈', '👉', '👉', '👆', '🖕',
                                            '👇', '🖖', '🤘', '🖐', '👌', '👍', '👎', '✊', '👊', '👏', '🙌', '🙏', '🐵', '🐶', '🐇', '🐥',
                                            '🐸', '🐌', '🐛', '🐜', '🐝', '🍉', '🍄', '🍔', '🍤', '🍨', '🍪', '🎂', '🍰', '🍾', '🍷', '🍸',
                                            '🍺', '🌍', '🚑', '⏰', '🌙', '🌝', '🌞', '⭐', '🌟', '🌠', '🌨', '🌩', '⛄', '🔥', '🎄', '🎈',
                                            '🎉', '🎊', '🎁', '🎗', '🏀', '🏈', '🎲', '🔇', '🔈', '📣', '🔔', '🎵', '🎷', '💰', '🖊', '📅',
                                            '✅', '❎', '💯',
                                        ],
                                    },
                                    history: {
                                        inDropdown: false,
                                        className: undefined,
                                        component: undefined,
                                        dropdownClassName: undefined,
                                        options: ['undo', 'redo'],
                                    },
                                }}
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CreatePost;
