import Image from 'next/image';
import { FaComment } from 'react-icons/fa';
import Like from '../../../../../../../public/assets/icons/like.svg';
import Liked from '../../../../../../../public/assets/icons/liked.svg';
import Save from '../../../../../../../public/assets/icons/save.svg';
import {  useLikePost } from '@/app/lib/query';

interface PostStatsProps {
  postId: string;
  postLike: number;
  isLiked: boolean;
  allcomment: number;
  setIsComment: React.Dispatch<React.SetStateAction<boolean>>;
}

const PostStats: React.FC<PostStatsProps> = ({ postId, postLike, isLiked,  allcomment,  setIsComment  }) => {
  // const [isComment, setIsComment] = useState(false);
  const { mutate: likePost, isPending: isLiking, isError: isLikingError } = useLikePost();


  if (isLikingError) {
    console.log('Error liking post:', isLikingError);
  }

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    likePost(postId);
  };

  const handleComment = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation()
    setIsComment(prev => !prev);
  };


  return (
    <div className="flex justify-between items-center z-20">
      {/* Like */}
      <div className="flex gap-2 mr-5 cursor-pointer" onClick={handleLike}>
        {isLiking ? (
          <div className="flex items-center gap-2 justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-t-4 border-b-4 border-white"></div>
          </div>
        ) : (
          <Image
            src={isLiked ? Liked : Like}
            alt={isLiked ? 'Liked' : 'Like'}
            height={20}
            width={20}
          />
        )}
        <p className="small-medium lg:base-medium">{postLike}</p>
      </div>

      {/* Comment */}
      <div className="flex gap-2 mr-5" onClick={handleComment}>
        <FaComment size={20} className="cursor-pointer text-purple-500" />
        <p className="small-medium lg:base-medium">{allcomment}</p>
      </div>


      {/* Save */}
      <div className="flex gap-2">
        <Image src={Save} alt="Save" height={20} width={20} className="cursor-pointer" />
        <p className="small-medium lg:base-medium">1</p>
      </div>
    </div>
  );
};

export default PostStats;
