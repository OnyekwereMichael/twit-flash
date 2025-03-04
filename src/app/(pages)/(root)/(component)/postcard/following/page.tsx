'use client'
import React, { useState } from 'react'
import PostCard from '../Postcard'

const FollowingPost = () => {
  const [isComment, setIsComment] = useState(false);
  return (
    <div>
        <PostCard type="following"  isComment={isComment} setIsComment={setIsComment}/>
    </div>
  )
}

export default FollowingPost
