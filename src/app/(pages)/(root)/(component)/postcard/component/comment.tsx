import { useComment } from '@/app/lib/query';
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Profile from '../../../../../../../public/assets/profilepic.svg';
import Image from 'next/image';
import cloudinaryLoader from '@/app/lib/cloudinary';



interface Comment {
  _id: string;
  text: string;
  user: {
    _id: string;
    fullname: string;
    profileImg: string;
  };
}

interface CommentProps {
  postId: string;
  post: {
  comments: Comment[],
  caption:string,
  fullname:string,
  _id:string,
  user: {
    _id: string;
    fullname: string;
    profileImg: string;
  }
  }
}


const CommentComponent = ({ postId, post  }: CommentProps) => {
  const { mutate: Comment, isError, isPending, error } = useComment();

  if (isError) {
    console.log('Error', error.message);
  }
  if (isPending) {
    console.log('Loading');
  }

  return (
    <div className="mt-5 border-t border-gray-300 pt-4">
      <Formik
        initialValues={{ comment: '' }}
        validationSchema={Yup.object({
          comment: Yup.string().required('Comment cannot be empty'),
        })}
        onSubmit={(values, { resetForm }) => {
          Comment({ cid: postId, text: values.comment });
        resetForm();
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Field
              as="textarea"
              name="comment"
              placeholder="Add a comment..."
              className="w-full h-16 p-3 bg-dark-3 text-light-1 rounded-md border border-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              rows={3}
            />
            <ErrorMessage
              name="comment"
              component="div"
              className="text-red text-sm mt-1"
            />
            <button
              type="submit"
              className="text-[10px] mt-3 px-4 py-2 bg-primary-500 text-white rounded-lg transition-all hover:bg-primary-400 focus:ring-2 focus:ring-primary-500 font-semibold"
              disabled={isSubmitting}
            >
              <div className="text-[15px]">{isPending ? <div className="flex items-center gap-2  justify-center">
        <div className="animate-spin rounded-full h-4 w-4 border-t-4 border-b-4 border-white"></div>
        </div> : "Post Comment"}</div>
            </button>
          </Form>
        )}
      </Formik>

      <div>
        {post.comments.map((comment: Comment) => (
          <div key={comment._id} className="flex items-center mt-4">
            <div className="mr-2">
              <Image
                src={comment.user.profileImg || Profile}
                loader={cloudinaryLoader}
                alt={comment.user.fullname}
                className="w-8 h-8 rounded-full"
                width={8}
                height={8}
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{comment.user.fullname}</p>
              <p className="text-sm text-gray-400">{comment.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentComponent;
