'use client'
import { Formik, Form, Field, ErrorMessage } from "formik";
import { updateSchema } from "@/app/lib/validation";
import { GetAuthUser, useUpdateProfile } from "@/app/lib/query";
import toast from "react-hot-toast";
import { useRouter } from 'next/navigation'; 


const EditProfileModal = () => {
const router = useRouter()

  const {data:authUser} = GetAuthUser()
  console.log('the auth', authUser);

  const {mutate: updateProfile} = useUpdateProfile() 


	return (
        <Formik
        // enableReinitialize
        initialValues={{
          fullname: authUser?.fullname || "",
          username: authUser?.username || "",
          email: authUser?.email || "",
          bio: authUser?.bio || "",
          link: authUser?.link || "",
          currentPassword: "",
          newPassword: "",
        }}
        validationSchema={updateSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          updateProfile(values, {
            onSuccess: () => {
              router.push(`/profile/${authUser?.username}`)
              resetForm();
            },
            onError: () => {
              toast.error("Failed to update profile. Try again.");
            },
            onSettled: () => {
              setSubmitting(false);
            },
          });
        }}
      >
        {({ isSubmitting }) => (
          <Form className="flex flex-col gap-9 w-full h-[500px] mt-6 ">
            {/* Text Field */}
            <div className="flex gap-4">
            <div className="flex flex-col">
              <label className="text-[15px]">Fullname</label>
              <Field
                as="input"
                name="fullname"
                placeholder="Enter your text"
                className="shad-input rounded-md  w-[25vw] p-4 mt-2 max-sm:w-full text-sm border-none outline-none focus:ring-0 focus:border-none placeholder:text-sm"
              />
              <ErrorMessage name="fullname" component="div" className="text-red text-sm mt-2" />
            </div>
  
            {/* Tags Field */}
            <div className="flex flex-col">
              <label className="text-[15px]">Username</label>
              <Field
                as="input"
                name="username"
                placeholder="Enter Tags"
                className="shad-input rounded-md  w-[25vw] p-4 mt-2 max-sm:w-full text-sm border-none outline-none focus:ring-0 focus:border-none placeholder:text-sm"
              />
              <ErrorMessage name="username" component="div" className="text-red  text-sm mt-2" />
            </div>
            </div>
            <div className="flex gap-4">
            <div className="flex flex-col">
              <label className="text-[15px]">Email</label>
              <Field
                as="input"
                name="email"
                placeholder="Enter Email"
                className="shad-input rounded-md  w-[25vw] p-4 mt-2 max-sm:w-full text-sm border-none outline-none focus:ring-0 focus:border-none placeholder:text-sm"
              />
              <ErrorMessage name="email" component="div" className="text-red  text-sm mt-2" />
            </div>

            <div className="flex flex-col">
              <label className="text-[15px]">Bio</label>
              <Field
                as="input"
                name="bio"
                placeholder="Enter Bio"
                className="custom-scrollbar shad-input rounded-md  w-[25vw] p-4 mt-2 max-sm:w-full  text-sm border-none outline-none focus:ring-0 focus:border-none placeholder:text-sm"
              />
              <ErrorMessage name="bio" component="div" className="text-red  text-sm mt-2" />
            </div>
            </div>

            <div className="flex flex-col">
              <label className="text-[15px]">Links</label>
              <Field
                as="input"
                name="link"
                placeholder="Enter Bio"
                className="shad-input rounded-md  w-[50vw] p-4 mt-2 max-sm:w-full  text-sm border-none outline-none focus:ring-0 focus:border-none placeholder:text-sm"
              />
              <ErrorMessage name="link" component="div" className="text-red  text-sm mt-2" />
            </div>
  

            <div className="flex flex-col">
              <label className="text-[15px]">Current Password</label>
              <Field
                as="input"
                name="currentPassword"
                placeholder="Enter Bio"
                className="shad-input rounded-md  w-[50vw] p-4 mt-2 max-sm:w-full  text-sm border-none outline-none focus:ring-0 focus:border-none placeholder:text-sm"
              />
              <ErrorMessage name="currentPassword" component="div" className="text-red text-sm mt-2" />
            </div>
  
            <div className="flex flex-col">
              <label className="text-[15px]">New Password</label>
              <Field
                as="input"
                name="newPassword"
                placeholder="Enter Bio"
                className="shad-input rounded-md  w-[50vw] p-4 mt-2 max-sm:w-full  text-sm border-none outline-none focus:ring-0 focus:border-none placeholder:text-sm"
              />
              <ErrorMessage name="newPassword" component="div" className="text-red  text-sm mt-2" />
            </div>
  
  
            {/* Buttons */}
            <div className="flex justify-end items-center gap-4">
              <button type="button" className="shad-button_dark_4">
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="shad-button_primary  whitespace-nowrap w-[15%] flex justify-center "
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-4 border-b-4 text-center border-white"></div>
                  </div>
                ) : (
                  <p className="text-center font-medium">Update</p>
                )}
              </button>
            </div>
          </Form>
        )}
      </Formik>
	);
};
export default EditProfileModal;