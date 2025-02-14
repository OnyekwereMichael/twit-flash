'use client'
import React, { useState } from 'react'
import PostCard from '../Postcard'

const Profilepost = () => {
      const [isComment, setIsComment] = useState(false);
  return (
    <div>
          <PostCard type="user"  isComment={isComment} setIsComment={setIsComment}/>
    </div>
  )
}

export default Profilepost
