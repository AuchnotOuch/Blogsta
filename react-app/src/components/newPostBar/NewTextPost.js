import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { thunkCreatePost, thunkGetAllPosts } from "../../store/posts";
import { actionClearComments } from "../../store/comments";
import "../landing/Landing.css"


const NewTextPost = ({ mountText, setMountText }) => {
    const user = useSelector(state => state.session.user)
    const dispatch = useDispatch()
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [errors, setErrors] = useState([])
    const [submit, setSubmit] = useState(false)

    useEffect(() => {
        const errors = []
        if (!title && !content) {
            errors.push("Please provide either a title or some content for your post, or both")
        }
        if (title.length > 500) {
            errors.push("Title must be 500 or less characters")
        }
        if (content.length > 10000) {
            errors.push("Post content must be 10000 or less characters")
        }
        setErrors(errors)
    }, [title, content])

    const handleSubmit = (e) => {
        e.preventDefault()
        setSubmit(true)
        if (!!errors.length) return
        const newTextPost = {
            owner_id: user.id,
            type: "text",
            title,
            content
        }

        setMountText(!mountText)
        dispatch(thunkCreatePost(newTextPost))
        dispatch(actionClearComments())
        dispatch(thunkGetAllPosts())
    }
    return (
        <div className="background-blur">
            <div className="new-post-modal">
                <div className='feed-profile-photo' >
                    <img alt='profile pic' src={`${user.profile_photo_url}`} onError={e => e.currentTarget.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Font_B.svg/1874px-Font_B.svg.png"}></img>
                </div>
                <div className='new-post-header'>
                    <div className="new-header-section">
                        <div>{user.username}</div>

                        {/* <Link to={`/${user.username}`}>{user.username}</Link> */}
                    </div>
                    <div className='text-form-container'>
                        <form className="text-form">
                            <input
                                type="text"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                placeholder="Title"
                                id="title-input"
                            />

                            <textarea
                                type="text"
                                value={content}
                                onChange={e => setContent(e.target.value)}
                                placeholder="Insert text here..."
                                id="content-input"
                            />
                            <ul>
                                {submit && !!errors.length && errors.map(error => <li style={{ color: 'red' }} id="error" key={error}>{error}</li>)}
                            </ul>
                        </form>
                    </div>
                    <div className="cancel-submit-container">
                        <button id='cancel-text' onClick={() => setMountText(!mountText)}>cancel</button>
                        <button id='submit-text' onClick={handleSubmit}>post</button>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default NewTextPost
