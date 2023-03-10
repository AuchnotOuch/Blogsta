import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import FeaturedPost from "../FeaturedPost/FeaturedPost";
import FollowerCard from "./FollowerCard";
import './Follows.css'


const Followers = () => {
    const { userId } = useParams()
    const [followers, setFollowers] = useState({})

    useEffect(() => {
        async function getFollowers() {
            const response = await fetch(`/api/users/${userId}/followers`, {
                method: 'GET'
            })
            const data = await response.json()
            setFollowers(data)
        }
        getFollowers()
    }, [userId])
    if (!userId) return null
    if (!followers) return null
    return (
        <>
            <div className="main-followers-container">
                <div className="followers">
                    <h2>{Object.keys(followers).length} Followers</h2>
                    <div className="followers-container">
                        {Object.values(followers).map(follower =>
                            <FollowerCard follower={follower} key={follower.id} />
                        )}
                    </div>
                </div>
                <div className='side-section'>
                    <h2>Radar</h2>
                    <FeaturedPost />
                    <div className="about-link-section">
                        <Link to={'/about'} id={'about-button'}>About</Link>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Followers
