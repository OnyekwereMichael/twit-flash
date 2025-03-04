 'use client'
import Profile from '../../../../../../public/assets/defaultpostBackgrounf.jpeg';
import Edit from '../../../../../../public/assets/icons/edit.svg';
import Link from 'next/link';
import Image from 'next/image';
import {  GetAllPost, GetAuthUser, useDeletePost } from '@/app/lib/query';
import Loader from '../loader/page';
import Delete from '../../../../../../public/assets/icons/delete.svg'
import PostStats from './component/PostStats';
import Comment from './component/comment'
import { getRelativeTime } from '@/app/lib/date';
import cloudinaryLoader from '@/app/lib/cloudinary'
import { IoSadOutline } from 'react-icons/io5';

interface Commentt {
  _id: string;
  text: string;
  user: {
    _id: string;
    fullname: string;
    profileImg: string;
  };
}

interface PostCardProps {
  caption:string,
  fullname:string,
  likes: number[],
 comments: Commentt[],
  allcomments: number[],
  img:string,
  tags: string[],
  _id:string,
  createdAt: string,
  user: {
    _id: string;
    fullname: string;
    username: string;
    profileImg: string;
  }

}



const PostCard = ({ type, isComment, setIsComment }: { type: string, isComment?: boolean, setIsComment: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const {data:posts, isError, error, isLoading} = GetAllPost(type)
  const {data:authUser, isLoading:isloadingAuth, isError:isErrorauth, error:errorauth} = GetAuthUser()
  const { mutate: deletePosts, isPending: isDeleting } = useDeletePost();
  console.log('hr', posts);
  console.log('hg', isComment);
  
  
  if(isLoading || isloadingAuth) {
    return <Loader />
  }
  if(isError) {
    return <p>Error: {error.message}</p>
  }
  if(isErrorauth) {
    return <p>Error: {errorauth.message}</p>
  }
 


  const handleDelete = (pid: string) => {
      deletePosts(pid);
  };

  // if(isDeleting) {
  //   return <div className="flex items-center gap-2 h-screen justify-center">
  //   <div className="animate-spin rounded-full h-4 w-4 border-t-4 border-b-4 border-white"></div>
  // </div>
  // }

 
  return (
    
    <section>  
<div className={`flex gap-4 mb-4 max-sm:mx-4 ${type === 'following' ? 'mt-4' : ''}`}>
  {type === 'all' && 'following' && (
 <>
    <Link href={'/'}>
        <button
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            'bg-dark-4  text-gray-300'
          }`}
        >
          For You
        </button>
        </Link>
        <Link href={'/postcard/following'}>
        <button
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
             'bg-dark-4  text-gray-300'
          }`}
        
        >
          Following
        </button>
          </Link>
 </>
  ) }
        </div>
    <div className="post-car w-[50vw] max-sm:w-full max-sm:px-3 max-h-[600px]  overflow-y-auto ">
       <style jsx>{`
        .post-car::-webkit-scrollbar {
          display: none;
        }
        .post-car {
          -ms-overflow-style: none; /* Internet Explorer 10+ */
          scrollbar-width: none; /* Firefox */
        }
      `}</style>
      {posts && posts?.length === 0 && (
        <div className="flex flex-col items-center justify-center h-screen">
          <IoSadOutline className="text-gray-300 text-6xl mb-2" />
          <h1 className="text-2xl font-semibold text-gray-300">No Posts Yet</h1>
          <p className="text-gray-400">Be the first to post something!</p>
        </div>
      )}

      {posts?.map((post:PostCardProps) => {
      const isLiked = post.likes.includes(authUser._id);
      const isMyPost = authUser._id === post?.user?._id; 
      // console.log(`post ${post}`);
      
        return (
          <div key={post._id} className='border-dark-4 bg-dark-2 overflow-y-auto p-5 lg:p-7 border  rounded-3xl mb-6 '>  
          {/* Header Section */}
          <div className="flex-between w-full mb-4">
            <div className="flex items-center gap-3">
              <Link href={`profile/`} className="flex gap-3 items-center">
                <Image loader={cloudinaryLoader} src={ `${post?.user?.profileImg || Profile}`} alt="creator" className="h-12 w-12 rounded-full" width={12} height={12}/>
              </Link>
    
              <div className="flex flex-col">
                <p className="base-medium lg:body-bold text-light-1">{post?.user?.fullname}</p>
                <div className="flex gap-2 text-light-3">
                  <p className="subtle-semibold lg:small-regular">
                    {getRelativeTime(post.createdAt)}
                  </p>
                  <span>-</span>
                  <p className="subtle-semibold lg:small-regular">Benin</p>
                </div>
              </div>
            </div>
    
    <div className='flex gap-3'>
       {isMyPost && (
        <Link href={`/profile/editpostprofile/${post._id}`}>
          <Image src={Edit} alt="Edit post" width={20} height={20} />
        </Link>
        )}

        {!isMyPost && (
          <p>😉</p>
        )}
            {isMyPost && (
                    <button onClick={() => handleDelete(post._id)} disabled={isDeleting}>
                    {isDeleting ? (
                     <div className="flex items-center gap-2">
                     <div className="animate-spin rounded-full h-4 w-4 border-t-4 border-b-4 border-white"></div>
                   </div>
                    ) : (
                      <Image src={Delete} alt="Delete post" width={20} height={20} />
                    )}
                  </button>
            )}
    
            </div>
          </div>
    
          {/* Post Content Section */}
          <Link href={`/`}>
            <div className="small-medium lg:base-medium py-5 mb-4 border-b border-gray-200">
              <p>{post?.caption}</p>

              {post?.tags?.map((tag: string, index: number) => (
                <div key={index}>
                  <ul className="flex gap-1 mt-2">
                  <li className="text-light-3">#{tag}</li>
                </ul>
       </div>
      ))}
            </div>

        
    
            <Image loader={cloudinaryLoader} src={post?.img || Profile} alt="post" className="post-card_img mb-4" width={100} height={100}/>
          </Link>
          <PostStats postId={post._id} postLike={post?.likes?.length} isLiked={isLiked} allcomment={post?.comments?.length}  setIsComment={setIsComment} />
          {isComment ? (
           <Comment postId={post._id} post={post} />
          ):(
            <div>
              <p></p>
            </div>
          )}
         
        </div>
        )})}
      
        {/* Comment Section */}
 
    </div>
    </section>
  );
};

export default PostCard;
