'use client'
import React, { useState } from 'react'
import PostCard from '../Postcard'

const Profilelikes = () => {
      const [isComment, setIsComment] = useState(false);
  return (
    <div>
          <PostCard type="likes"  isComment={isComment} setIsComment={setIsComment}/>
    </div>
  )
}

export default Profilelikes
