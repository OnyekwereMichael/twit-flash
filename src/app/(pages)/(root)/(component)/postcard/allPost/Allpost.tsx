'use client'
import React, { useState } from 'react'
import PostCard from '../Postcard'

const Allpost = () => {
  const [isComment, setIsComment] = useState(false);
  return (
    <div>
       <PostCard type="all"  isComment={isComment} setIsComment={setIsComment}/>
    </div>
  )
}

export default Allpost
