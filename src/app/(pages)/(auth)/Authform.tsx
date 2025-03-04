"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FormikHelpers, useFormik } from "formik";
import { authSchema, loginAuthSchema } from "@/app/lib/validation";
import { CreateUserAccount, GetAuthUser, SignInAccount } from "@/app/lib/query/index";
import { INewUser } from "@/app/types";
import { motion } from "framer-motion";
import Loader from "../(root)/(component)/loader/page";


const AuthForm = ({ type }: { type: string }) => {
  const pathname = usePathname();
  const router = useRouter();

  const { mutate: createNewUser, isPending: isSigningUp, error: signUpError, isError: isSignUpError } = CreateUserAccount();
  const { data: isAuthenticated, isLoading: isAuthenticating } = GetAuthUser();
  const { mutate: SignInUser, isPending: isSigningIn, error: signInError, isError: isSignInError } = SignInAccount();

  useEffect(() => {
    if (!isAuthenticating && isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, isAuthenticating, router]);

  const onSubmit = (values: INewUser, action: FormikHelpers<INewUser>) => {
    if (type === "signup") {
      createNewUser(values, { onSuccess: () => action.resetForm() });
    } else {
      SignInUser(values, { onSuccess: () => action.resetForm() });
    }
  };

  const { values, errors, touched, handleSubmit, handleChange, handleBlur } = useFormik({
    initialValues: { email: "", password: "", username: "", fullname: "" },
    validationSchema: type === "signup" ? authSchema : loginAuthSchema,
    onSubmit,
  });

  if (isAuthenticating) return <div className="flex justify-center items-center  h-screen"><Loader /></div>;

  return (
    <div className="relative min-h-screen max-sm:w-full  flex justify-center items-center bg-black overflow-hidden">
      <video
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-full object-cover opacity-50 max-sm:hidden"
        src={'/assets/video/vid10.mp4'}
      />
      <video
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-full object-cover opacity-50 xl:hidden md:hidden lg:hidden"
        src={'/assets/video/vid3.mp4'}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10  bg-[#1A1C26] bg-opacity-80 backdrop-blur-xl shadow-2xl rounded-2xl p-10 border w-[50%] border-gray-200 max-sm:p-5 max-sm:w-full"
      >
        <Link href="/">
          <h1 className="text-white  text-3xl font-semibold">TWIT-FLASH ✨</h1>
        </Link>
        <div className="flex  gap-8 mt-6">
          <Link href="/signup" className={`${pathname === '/signup' ? 'border-b-2' : ''} text-[#8C67F6] font-bold`}>SIGN UP</Link>
          <Link href="/signin" className={`${pathname === '/signin' ? 'border-b-2' : ''} text-[#8C67F6] font-bold`}>LOGIN</Link>
        </div>
        {isSignUpError && <p className="text-red-500 text-sm mt-2">{signUpError?.message}</p>}
        {isSignInError && <p className="text-red-500 text-sm mt-2">{signInError?.message}</p>}
        <form className="space-y-6 mt-6" onSubmit={handleSubmit}>
  {type === "signup" && (
    <>
      <input
        type="text"
        name="fullname"
        placeholder="Full Name"
        className="w-full p-3 bg-gray-800 text-white rounded-lg border-none outline-none focus:ring-2 focus:ring-[#8C67F6] text-[15px]"
        value={values.fullname}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      {errors.fullname && touched.fullname && (
        <p className="text-red text-sm">{errors.fullname}</p>
      )}

<input
    type="email"
    name="email"
    placeholder="Email Address"
    className="w-full p-3 bg-gray-800 text-white rounded-lg border-none outline-none focus:ring-2 focus:ring-[#8C67F6]text-[15px]"
    value={values.email}
    onChange={handleChange}
    onBlur={handleBlur}
  />
  {errors.email && touched.email && (
    <p className="text-red text-sm">{errors.email}</p>
  )}
    </>
  )}

  <input
    type="text"
    name="username"
    placeholder="Username"
    className="w-full p-3 bg-gray-800 text-white rounded-lg border-none outline-none focus:ring-2 focus:ring-[#8C67F6] text-[15px]"
    value={values.username}
    onChange={handleChange}
    onBlur={handleBlur}
  />
  {errors.username && touched.username && (
    <p className="text-red text-sm">{errors.username}</p>
  )}


  <input
    type="password"
    name="password"
    placeholder="Password"
    className="w-full p-3 bg-gray-800 text-white rounded-lg border-none outline-none focus:ring-2 focus:ring-[#8C67F6] text-[15px]"
    value={values.password}
    onChange={handleChange}
    onBlur={handleBlur}
  />
  {errors.password && touched.password && (
    <p className="text-red text-sm">{errors.password}</p>
  )}

  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="w-full bg-gradient-to-r from-[#8A2BE2] to-[#4B0082] text-white py-3 rounded-lg font-semibold"
    type="submit"
    disabled={isSigningUp || isSigningIn}
  >
    {isSigningUp ?     <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin text-center mx-auto"></div> : isSigningIn ?     <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin text-center mx-auto"></div> : type === "signup" ? "Create Account" : "Sign In"}
  </motion.button>
</form>
      </motion.div>
    </div>
  );
};

export default AuthForm;
