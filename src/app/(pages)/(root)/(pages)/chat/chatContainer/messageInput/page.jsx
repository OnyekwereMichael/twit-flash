// 'use client'
// import { useRef } from "react";
// import { Formik, Field, Form } from "formik";
// import { FaImage, FaTimes, FaPaperPlane } from "react-icons/fa";
// import toast from "react-hot-toast";
// import Image from "next/image";
// import { useCreateMessage } from "@/app/lib/query";
// import cloudinaryLoader from "@/app/lib/cloudinary";

// interface MessageProps {
//   user: {
//     _id: string;
//   };
// }

// const MessageInput = ({ user }: MessageProps) => {
//   const { mutate: CreateMessage } = useCreateMessage();
//   const fileInputRef = useRef<HTMLInputElement | null>(null);

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, setFieldValue: (field: string, value: string) => void) => {
//     const file = e.target.files?.[0];
//     if (file && !file.type.startsWith("image/")) {
//       toast.error("Please select an image file");
//       return;
//     }

//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setFieldValue("image", reader.result as string);
//     };
//     if (file) reader.readAsDataURL(file);
//   };

//   const removeImage = (setFieldValue: (field: string, value: unknown) => void) => {
//     setFieldValue("image", null);
//     if (fileInputRef.current) fileInputRef.current.value = "";
//   };

//   return (
//     <div className="p-4">
//       <Formik
//         initialValues={{ text: "", image: null as string | null }}
//         onSubmit={async (values, { resetForm }) => {
//           if (!values.text.trim() && !values.image) return;

//           try {
//             console.log("The value", values);
//             CreateMessage({
//               text: values.text.trim(),
//               image: values.image || "",
//               rid: user._id,
//             });

//             resetForm();
//           } catch (error) {
//             console.error("Failed to send message:", error);
//           }
//         }}
//       >
//         {({ setFieldValue, values, handleSubmit }) => (
//           <Form onSubmit={handleSubmit}>
//             {values.image && (
//               <div className="mb-3 flex items-center gap-2 max-sm:gap-1">
//                 <div className="relative">
//                   <Image
//                     src={values.image}
//                     alt="Preview"
//                     loader={cloudinaryLoader}
//                     className="w-16 h-16 object-cover rounded-lg border border-gray-700 shadow-lg max-sm:w-12 max-sm:h-12"
//                     width={30}
//                     height={30}
//                   />
//                   <button
//                     onClick={() => removeImage(setFieldValue)}
//                     className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-white hover:bg-red-500 max-sm:w-5 max-sm:h-5"
//                     type="button"
//                   >
//                     <FaTimes size={14} />
//                   </button>
//                 </div>
//               </div>
//             )}

//             <div className="flex items-center gap-2 max-sm:gap-2">
//               <div className="flex-1 flex gap-2 max-sm:gap-3">
//                 <Field
//                   name="text"
//                   as="input"
//                   type="text"
//                   className="w-full bg-gray-700 text-white input rounded-lg input-sm sm:input-md focus-visible:bg-none outline-none max-sm:h-12 max-sm:text-sm max-sm:w-full"
//                   placeholder="Type a message..."
//                 />
//                 <input
//                   type="file"
//                   accept="image/*"
//                   className="hidden"
//                   ref={fileInputRef}
//                   onChange={(e) => handleImageChange(e, setFieldValue)}
//                 />
//                 <button
//                   type="button"
//                   className={`btn btn-circle text-gray-400 hover:text-gray-500 ${values.image ? "text-emerald-500" : ""} max-sm:text-sm`}
//                   onClick={() => fileInputRef.current?.click()}
//                 >
//                   <FaImage size={16} />
//                 </button>
//               </div>
//               <button
//                 type="submit"
//                 className="btn btn-circle bg-purple-500 text-white hover:bg-purple-600 max-sm:h-12 max-sm:text-sm"
//                 disabled={!values.text.trim() && !values.image}
//               >
//                 <FaPaperPlane size={16} />
//               </button>
//             </div>
//           </Form>
//         )}
//       </Formik>
//     </div>
//   );
// };

// export default MessageInput;



'use client'
import { useRef } from "react";
import { Formik, Field, Form } from "formik";
import { FaImage, FaTimes, FaPaperPlane } from "react-icons/fa";
import toast from "react-hot-toast";
import Image from "next/image";
import { useCreateMessage } from "@/app/lib/query";
import cloudinaryLoader from "@/app/lib/cloudinary";

// interface MessageProps {
//   user: {
//     _id: string;
//   };
// }


const MessageInput = (user ) => {
  const { mutate: CreateMessage } = useCreateMessage();
  const fileInputRef = useRef(null);

  const handleImageChange = (e, setFieldValue) => {
    const file = e.target.files?.[0];
    if (file && !file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFieldValue("image", reader.result);
    };
    if (file) reader.readAsDataURL(file);
  };

  const removeImage = (setFieldValue) => {
    setFieldValue("image", null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="p-4">
      <Formik
        initialValues={{ text: "", image: null  }}
        onSubmit={async (values, { resetForm }) => {
          if (!values.text.trim() && !values.image) return;

          try {
            console.log("The value", values);
            CreateMessage({
              text: values.text.trim(),
              image: values.image || "",
              rid: user._id,
            });

            resetForm();
          } catch (error) {
            console.error("Failed to send message:", error);
          }
        }}
      >
        {({ setFieldValue, values, handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            {values.image && (
              <div className="mb-3 flex items-center gap-2 max-sm:gap-1">
                <div className="relative">
                  <Image
                    src={values.image}
                    alt="Preview"
                    loader={cloudinaryLoader}
                    className="w-16 h-16 object-cover rounded-lg border border-gray-700 shadow-lg max-sm:w-12 max-sm:h-12"
                    width={30}
                    height={30}
                  />
                  <button
                    onClick={() => removeImage(setFieldValue)}
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-white hover:bg-red-500 max-sm:w-5 max-sm:h-5"
                    type="button"
                  >
                    <FaTimes size={14} />
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 max-sm:gap-2">
              <div className="flex-1 flex gap-2 max-sm:gap-3">
                <Field
                  name="text"
                  as="input"
                  type="text"
                  className="w-full bg-gray-700 text-white input rounded-lg input-sm sm:input-md focus-visible:bg-none outline-none max-sm:h-12 max-sm:text-sm max-sm:w-full"
                  placeholder="Type a message..."
                />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={(e) => handleImageChange(e, setFieldValue)}
                />
                <button
                  type="button"
                  className={`btn btn-circle text-gray-400 hover:text-gray-500 ${values.image ? "text-emerald-500" : ""} max-sm:text-sm`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FaImage size={16} />
                </button>
              </div>
              <button
                type="submit"
                className="btn btn-circle bg-purple-500 text-white hover:bg-purple-600 max-sm:h-12 max-sm:text-sm"
                disabled={!values.text.trim() && !values.image}
              >
                <FaPaperPlane size={16} />
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default MessageInput;
