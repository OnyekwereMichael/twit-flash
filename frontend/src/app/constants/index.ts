import Home from '../../../public/assets/icons/home.svg'
import Wallpaper from '../../../public/assets/icons/wallpaper.svg'
import People from '../../../public/assets/icons/people.svg'
import bookmark from '../../../public/assets/icons/bookmark.svg'
import gallery_add from '../../../public/assets/icons/gallery-add.svg'
export const sidebarLinks = [
    {
      imgURL: Home,
      route: "/",
      label: "Home",
    },
    {
      imgURL: Wallpaper,
      route: "/notification",
      label: "Notifications",
    },
    {
      imgURL: People,
      route: (username:any) => `/profile/${username || "guest"}`,
      label: "Profile",
    },
    {
      imgURL: bookmark,
      route: "/saved",
      label: "Saved",
    },
    {
      imgURL: gallery_add,
      route: "/createpost",
      label: "Create Post",
    },
  ];
  
  export const bottombarLinks = [
    {
      imgURL: Home,
      route: "/",
      label: "Home",
    },
    {
      imgURL: Wallpaper,
      route: "/explore",
      label: "Explore",
    },
    {
      imgURL: bookmark,
      route: "/saved",
      label: "Saved",
    },
    {
      imgURL: gallery_add,
      route: "/create-post",
      label: "Create",
    },
  ];