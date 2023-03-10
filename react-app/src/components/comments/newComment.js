import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { thunkCreateComment, thunkGetAllComments } from "../../store/comments";
import "../landing/Landing.css"

const NewComment = ({ postId }) => {
    const user = useSelector(state => state.session.user)

    const [comment, setComment] = useState('')
    const [errors, setErrors] = useState([])
    const dispatch = useDispatch()

    useEffect(() => {
        const errors = []
        if (comment.length > 255) {
            errors.push("Comment must be 255 characters or less")
        }
        if (comment.length < 1) {
            errors.push("Must provide a comment")
        }
        setErrors(errors)
    }, [comment])

    const handleSubmit = (e) => {
        e.preventDefault()

        const newComment = {
            comment,
            postId,
            userId: user.id
        }

        dispatch(thunkCreateComment(newComment))
        dispatch(thunkGetAllComments(postId))
        setComment('')
    }

    return (
        <>

            <div className="new-comment">
                <div className="comment-pic-input">
                    <img alt="commenter pic" id='comment-user-image' src={user.profile_photo_url} onError={e => e.currentTarget.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Font_B.svg/1874px-Font_B.svg.png"} />
                    <form onSubmit={handleSubmit}>
                        <div id="comment-input-submit">
                            <textarea
                                type='text'
                                value={comment}
                                onChange={e => setComment(e.target.value)}
                                placeholder="Say something nice about this post..."
                                id="text-comment-input"
                            />
                            <button type="submit" disabled={!!errors.length} id="add-comment-button">Reply</button>
                        </div>
                        <ul>
                            {errors.map(error => <li id="error" key={error}>{error}</li>)}
                        </ul>
                    </form>

                </div>
            </div>
        </>

    )
}

export default NewComment
