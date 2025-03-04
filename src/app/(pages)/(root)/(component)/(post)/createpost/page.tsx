import Image from 'next/image'
import add_post from '../../../../../../../public/assets/add-post.svg'
import PostForm from '../PostForm'
// import PostFoms from '../component/forms/PostForms'
const CreatePost = () => {
  return (
    <div className="flex flex-1">
       <div className="common-container">
            <div className='max-w-5xl w-full flex-start justify-start gap-3'>
                <Image src={add_post} alt="add_post" width={36} height={36}/>
                <h2 className='h3-bold md:h2-bold text-left w-full '>Create Post</h2>
            </div>
       <PostForm action='Create'/>
       </div>
    </div>
  )
}

export default CreatePost
