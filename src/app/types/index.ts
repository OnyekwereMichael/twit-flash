
export type INavLink = {
  imgURL: string;
  route: string | ((username?: string) => string);
  label: string;
};

export type IUpdateUser = {
  fullname: string;
  username: string;
  bio: string;
  email: string;
  link:  string;
  currentPassword: string;
  newPassword: string;
};

export type INewPost = {
  // userId: string;
  caption?: string;
  img?: string | null;
  // location?: string;
  tags?: string;
};

export type IUpdatePost = {
  postId: string;
  caption: string;
  imageId: string;
  imageUrl: URL;
  file: File[];
  location?: string;
  tags?: string;
};

export type IUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  imageUrl: string;
  bio: string;
};


export type INewUser = {
  fullname: string;
  email: string;
  username: string;
  password: string;
};

export type IloginUser = {
  username: string;
  password: string;
};

