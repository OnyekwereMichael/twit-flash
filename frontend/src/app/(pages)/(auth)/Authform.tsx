"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useFormik } from "formik";
import { authSchema, loginAuthSchema } from "@/app/lib/validation";
import { createUserAccount, getAuthUser, signInAccount } from "@/app/lib/query/index";

const Authform = ({ type }: { type: string }) => {
    const pathname = usePathname();
    const router = useRouter();

    // Sign up mutation
    const { mutate: createNewUser, isPending: isSigningUp, error: signUpError, isError: isSignUpError } = createUserAccount();
    const { data: isAuthenticated, isLoading: isAuthenticating, error: authError, isError: isAuthError } = getAuthUser();

    // Sign in mutation
    const { mutate: signInUser, isPending: isSigningIn, error: signInError, isError: isSignInError } = signInAccount();

    const onSubmit = (values: any, action: any) => {
        if (type === 'signup') {
            createNewUser(values, {
                onSuccess: () => {
                    action.resetForm();
                },
            });
        } else {
            signInUser(values, {
                onSuccess: () => {
                    action.resetForm();
                },
            });
        }
    };

    // Redirect logic based on authentication state
    useEffect(() => {
        if (!isAuthenticating) {
            if (isAuthenticated) {
                router.push("/"); // Redirect to home page after successful authentication
            } else {
                router.push("/signin"); // Redirect to sign-in page if not authenticated
            }
        }
    }, [isAuthenticated, isAuthenticating, router]);

    const { values, errors, touched, handleSubmit, handleChange, handleBlur } = useFormik({
        initialValues: {
            email: "",
            password: "",
            username: "",
            fullname: "",
        },
        validationSchema: type === 'signup' ? authSchema : loginAuthSchema,
        onSubmit,
    });

    if(isAuthenticating) return <p className="flex justify-center items-center h-full mx-auto">Loading...</p>

    return (
        <div>
            <h1 className="text-white text-[35px] font-semibold my-6 max-sm:my-3 max-sm:text-[20px]">TWIT-FLASH ✨</h1>

            <div className="flex gap-14 space-x-10 items-center mt-10">
                <Link href="/signup" className={`text-[#8C67F6] font-bold text-[15px] pb-2 transition-all duration-300 ${pathname === '/signup' ? 'border-b-4 border-[#8C67F6]' : 'border-b-4 border-transparent'}`}>SIGN UP</Link>
                <Link href="/signin" className={`text-[#8C67F6] font-bold text-[15px] pb-2 transition-all duration-300 ${pathname === '/signin' ? 'border-b-4 border-[#8C67F6]' : 'border-b-4 border-transparent'}`}>LOGIN</Link>
            </div>

            {isSignUpError && <p className="text-red text-sm mt-2">Error: {signUpError?.message}</p>}
            {isSignInError && <p className="text-red text-sm mt-2">Error: {signInError?.message}</p>}

            <form className="space-y-8 my-10" onSubmit={handleSubmit}>
                {type === "signup" && (
                    <>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-[#ECECEC]">Email Address</label>
                            <input
                                name="email"
                                type="text"
                                id="email"
                                value={values.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`mt-2 block w-full py-[13px] text-[14px] p-3 bg-[#1A1C26] text-white rounded-xl border-none outline-none focus:ring-0 focus:border-none ${errors.email && touched.email ? 'border-red border-[3px]' : ''}`}
                                placeholder="Enter your email"
                            />
                            {errors.email && touched.email && <div className="text-red text-sm mt-1">{errors.email}</div>}
                        </div>

                        <div>
                            <label htmlFor="fullname" className="block text-sm font-medium text-[#ECECEC]">Fullname</label>
                            <input
                                name="fullname"
                                type="text"
                                id="fullname"
                                value={values.fullname}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`mt-2 block w-full py-[13px] text-[14px] p-3 bg-[#1A1C26] text-white rounded-xl border-none outline-none focus:ring-0 focus:border-none ${errors.fullname && touched.fullname ? 'border-red' : ''}`}
                                placeholder="Enter fullname"
                            />
                            {errors.fullname && touched.fullname && <div className="text-red text-sm mt-1">{errors.fullname}</div>}
                        </div>
                    </>
                )}

                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-[#ECECEC]">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={values.username}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`mt-2 block w-full py-[13px] text-[14px] p-3 bg-[#1A1C26] text-white rounded-xl border-none outline-none focus:ring-0 focus:border-none ${errors.username && touched.username ? 'border-red' : ''}`}
                        placeholder="Enter your username"
                    />
                    {errors.username && touched.username && <div className="text-red text-sm mt-1">{errors.username}</div>}
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-[#ECECEC]">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`mt-2 block w-full py-[13px] text-[14px] p-3 bg-[#1A1C26] text-white rounded-xl border-none outline-none focus:ring-0 focus:border-none ${errors.password && touched.password ? 'border-red' : ''}`}
                        placeholder="Enter your password"
                    />
                    {errors.password && touched.password && <p className="text-red text-sm mt-1">{errors.password}</p>}
                </div>

                <button
                    className="w-full bg-gradient-to-r from-[#8A2BE2] via-[#6A0DAD] to-[#4B0082] text-white py-3 px-4 rounded-lg font-semibold transition hover:from-blue-500 hover:via-blue-600 hover:to-blue-700"
                    type="submit"
                    disabled={isSigningUp || isSigningIn}
                >
                    {isSigningUp ? "Creating Account..." : isSigningIn ? "Logging In..." : type === 'signup' ? 'Create Account' : 'Log In'}
                </button>
            </form>
        </div>
    );
};

export default Authform;
