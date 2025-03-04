"use client";

import React from 'react';
import { Formik, Form, Field, ErrorMessage } from "formik";
import toast from 'react-hot-toast';
import { postSchema } from '@/app/lib/validation';
import { useUpdatePost } from '@/app/lib/query';
import { useParams, useRouter } from 'next/navigation';


const EditPostProfile = () => {
    const { id: postId } = useParams() as { id: string };
    const { mutate: updatePost, isPending } = useUpdatePost();
    const router = useRouter()

    return (
        <Formik
            initialValues={{
                caption: "",
                tags: "",
            }}
            validationSchema={postSchema}
            onSubmit={(values, { setSubmitting, resetForm }) => {
                console.log("Form Submitted:", values);
                updatePost({postId,  ...values }, {
                    onSuccess: (data) => {
                        console.log("Success Response:", data);
                        router.push('/')
                        resetForm();
                    },
                    onError: (error) => {
                        console.error("Error Response:", error);
                        toast.error("Failed to update post.");
                    },
                });                
                setSubmitting(false);
            }}
        >
            {({ isSubmitting }) => (
                <Form className="flex flex-col gap-9 w-full max-sm:px-3 h-[500px] mt-6">
                    {/* Caption Field */}
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

                    {/* Tags Field */}
                    <div className="flex flex-col">
                        <label className="shad-form_label">Tags</label>
                        <Field
                            as="textarea"
                            name="tags"
                            placeholder="Enter Tags"
                            className="shad-textarea custom-scrollbar w-[48vw] p-4 mt-2 max-sm:w-full placeholder:text-sm"
                        />
                        <ErrorMessage name="tags" component="div" className="text-red text-sm mt-2" />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end items-center gap-4">
                        <button type="button" className="shad-button_dark_4">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || isPending}
                            className="shad-button_primary whitespace-nowrap"
                        >
                            {isSubmitting || isPending ? (
                                <div className="flex items-center gap-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-t-4 border-b-4 border-white"></div>
                                </div>
                            ) : (
                                <p>Update</p>
                            )}
                        </button>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default EditPostProfile;
