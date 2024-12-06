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
            await axios.post('http://localhost:3001/api/post/createPost', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            navigate('/');
        } catch (err) {
            console.error(err);
            alert(`Create post fail: ${err.message}`);
        }
    };

    return (
        <div>
            <h1>Create Post</h1>
            <form onSubmit={handleSubmit}>
                <div className="flex-1">
                    <label></label>
                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    /> <br/>
                </div>
                <div className="flex-1">
                    <label></label>
                    <select
                        required
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}>
                        <option value="place">InterestPlace</option>
                        <option value="sale">Sale</option>
                        <option value="normal">Banner</option>
                    </select>
                </div>
                <div className="flex-1">
                    <label></label>
                    <input
                        type="file"
                        onChange={(e) => setThumbnail(e.target.files[0])}
                        required
                    /> <br/>
                </div>
                <div className="flex-1">
                    <label></label>
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
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default CreatePost;
