import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { thunkGetAllPosts } from '../../store/posts';
import NewPostBar from "../newPostBar/NewPostBar";
import DeletePost from "../posts/Delete";
import '../landing/Landing.css'

const Dashboard = () => {
    const posts = useSelector(state => state.posts)
    const user = useSelector(state => state.session.user)
    const [mountDelete, setMountDelete] = useState(false)
    const [mountEdit, setMountEdit] = useState(false)

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(thunkGetAllPosts())
    }, [dispatch])

    return (
        <>
            <div className="container">
                <div className='feed-container'>
                    <div className='feed'>
                        <NewPostBar />
                        {Object.values(posts).reverse().map(post => (
                            <div className='post-container'>
                                <div className='feed-profile-photo' >
                                    <img src={`${post.owner.profile_photo_url}`}></img>
                                </div>
                                <div className='post-header'>
                                    <Link to={`/${post.owner.username}/post/${post.id}`}>{post.owner.username}</Link>
                                    <div className='post-content'>
                                        {post.type === 'text' &&
                                            <>
                                                <div className='title'>{post.title}</div>
                                                <div className='content'>{post.content}</div>
                                            </>
                                        }
                                        {post.type === 'quote' &&
                                            <>
                                                <div className='quote-body'>"{post.content}"</div>
                                                <div className='quote-source'>- {post.quote_source}</div>
                                            </>
                                        }
                                        {post.type === 'photo' &&
                                            <>
                                                {Object.values(post.photos).map(photo => (
                                                    <div className='image-post-container'>
                                                        <div className='post-image'>
                                                            <img src={photo.url}></img>
                                                        </div>
                                                        <div className='post-image-caption'>{photo.text}</div>
                                                    </div>
                                                ))}
                                                <div>{post.content}</div>
                                            </>
                                        }
                                        {post.owner.id === user.id &&
                                            <>
                                                <button>Edit</button>
                                                <button onClick={() => setMountDelete(!mountDelete)}>Delete</button>
                                            </>
                                        }
                                        {mountDelete && <DeletePost post={post} mountDelete={mountDelete} setMountDelete={setMountDelete} />}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className='side-section'>Side Section</div>
                </div>
            </div>
        </>

    )
}

export default Dashboard