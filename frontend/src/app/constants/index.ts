import Home from '../../../public/assets/icons/home.svg'
import Wallpaper from '../../../public/assets/icons/wallpaper.svg'
import People from '../../../public/assets/icons/people.svg'
import bookmark from '../../../public/assets/icons/bookmark.svg'
import gallery_add from '../../../public/assets/icons/gallery-add.svg'
import { INavLink } from '../types'
export const sidebarLinks:INavLink[] = [
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
      route: (username) => `/profile/${username || "guest"}`,
      label: "Profile",
    },
    {
      imgURL: bookmark,
      route: "/chat",
      label: "Chat Users",
    },
    {
      imgURL: gallery_add,
      route: "/createpost",
      label: "Create Post",
    },
  ];
  
  export const sidebarLinksMobile:INavLink[] = [
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
      route: (username) => `/profile/${username || "guest"}`,
      label: "Profile",
    },
    {
      imgURL: bookmark,
      route: "/followuser",
      label: "Follow Users",
    },
    {
      imgURL: bookmark,
      route: "/chat",
      label: "Chat Users",
    },
    {
      imgURL: gallery_add,
      route: "/createpost",
      label: "Create Post",
    },
  ];

  export const THEMES = [
    "light",
    "dark",
    "cupcake",
    "bumblebee",
    "emerald",
    "corporate",
    "synthwave",
    "retro",
    "cyberpunk",
    "valentine",
    "halloween",
    "garden",
    "forest",
    "aqua",
    "lofi",
    "pastel",
    "fantasy",
    "wireframe",
    "black",
    "luxury",
    "dracula",
    "cmyk",
    "autumn",
    "business",
    "acid",
    "lemonade",
    "night",
    "coffee",
    "winter",
    "dim",
    "nord",
    "sunset",
  ];