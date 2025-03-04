"use client";

import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { postSchema } from "@/app/lib/validation";
import { useCreatePost } from "@/app/lib/query";
import Loader from "../loader/page";
import FileUploader from "./Fileuploader/FileUploader";
import { useRouter } from "next/navigation";

interface PostFormProps {
  post?: {
    caption?: string;
    tags?: string;
    img?: string;
  };
  action: "Create" | "Update";
}

const PostForm = ({ post, action }: PostFormProps) => {
  const router = useRouter();
  const { mutate: CreatePost, isPending, error, isError } = useCreatePost();
  
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [formValues, setFormValues] = useState({
    caption: post?.caption || "",
    tags: post?.tags || "",
    img: post?.img || "",
  });

  useEffect(() => {
    if (selectedImage) {
      setFormValues((prev) => ({ ...prev, img: selectedImage }));
    }
  }, [selectedImage]);

  if (isError) {
    console.log("Error", error.message);
  }

  if (isPending) return <Loader />;

  return (
    <Formik
      initialValues={formValues}
      validationSchema={postSchema}
      enableReinitialize
      onSubmit={(values, { setSubmitting, resetForm }) => {
        console.log("Form Submitted:", { ...values });
        CreatePost({ ...values }, {
          onSuccess: () => {
            router.push("/");
            resetForm();
          },
        });
        setSubmitting(false);
      }}
    >
      {({ isSubmitting }) => (
        <Form className="flex flex-col gap-9 w-full h-[500px]">
          <div className="flex flex-col">
            <label className="shad-form_label">Caption</label>
            <Field
              as="textarea"
              name="caption"
              placeholder="Enter your text"
              className="shad-textarea custom-scrollbar w-[48vw] p-4 mt-2 max-sm:w-full placeholder:text-sm"
            />
            <ErrorMessage name="caption" component="div" className="text-red text-sm mt-2" />
          </div>

          <div className="flex flex-col">
            <label className="shad-form_label">Tags</label>
            <Field
              as="textarea"
              name="tags"
              placeholder="Enter Tags"
              className="shad-textarea custom-scrollbar w-[48vw] p-4 mt-2 max-sm:w-full placeholder:text-sm"
            />
            <ErrorMessage name="tags" component="div" className="text-red border border-red-5 text-sm mt-2" />
          </div>

          {/* File Uploader */}
          <FileUploader selectedImage={selectedImage} setSelectedImage={setSelectedImage} />

          {/* Buttons */}
          <div className="flex justify-end items-center gap-4">
            <button type="button" className="shad-button_dark_4">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="shad-button_primary whitespace-nowrap"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-4 border-b-4 border-white"></div>
                </div>
              ) : (
                `${action} Post`
              )}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default PostForm;
