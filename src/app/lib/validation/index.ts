import * as yup from 'yup'
export const authSchema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter a valid email address.')
    .required('Email is required.'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters long.')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter.')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter.')
    .required('Password is required.'),
  username: yup
    .string()
    .min(3, 'Username must be at least 3 characters long.')
    .max(15, 'Username must not exceed 15 characters.')
    .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores.')
    .required('Username is required.'),
  fullname: yup
    .string()
    .min(3, 'Full name must be at least 3 characters long.')
    .matches(/^[a-zA-Z\s]+$/, 'Full name can only contain letters and spaces.')
    .required('Full name is required.')
});

export const loginAuthSchema = yup.object().shape({
  username: yup
  .string()
  .min(3, 'Username must be at least 3 characters long.')
  .max(15, 'Username must not exceed 15 characters.')
  .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores.')
  .required('Username is required.'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters long.')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter.')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter.')
    .matches(/[0-9]/, 'Password must contain at least one number.')
    .matches(/[@$!%*?&#]/, 'Password must contain at least one special character (@, $, !, %, *, ?, & or #).')
    .required('Password is required.'),
});

export const postSchema = yup.object().shape({
 caption: yup.string().min(3, 'Username must be at least 3 characters long.').required('Please enter a caption.'),
 tags: yup.string().min(1, 'At least one tag is required.'),
});

export const updateSchema = yup.object().shape({
  fullname: yup.string()
    .min(3, "Full name must be at least 3 characters")
    .max(50, "Full name can't be longer than 50 characters")
    .optional(),

  username: yup.string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username can't be longer than 30 characters")
    .optional(),

  email: yup.string()
    .email("Invalid email format")
    .optional(),

  bio: yup.string()
    .max(200, "Bio can't be longer than 200 characters")
    .optional(),

  link: yup.string()
    .url("Invalid URL format")
    .optional(),

  currentPassword: yup.string()
    .min(6, "Password must be at least 6 characters")
    .optional(),

  newPassword: yup.string()
    .min(6, "Password must be at least 6 characters")
     .optional(),
});

