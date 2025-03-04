import type { Metadata } from "next";
import LeftSideBar from "./(component)/leftsidebar/page";
import TopBar from "./(component)/topbar/page";
import RightSidebar from "./(component)/rightsidebar/Rightsidebar";


export const metadata: Metadata = {
  title: "TWIT FLASH - A Social Media App",
  description: "A social media app built with Next.js, Tailwind CSS, and MongoDB.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (    
<div className="w-full  md:flex justify-between ">
  <div>
    <LeftSideBar />
    <TopBar/>
    </div>

<div> 
    {children}
    </div>
    

    <div>
    {/* <BottomBar /> */}
    <RightSidebar />
    </div>
</div> 
      
        
     
  );
}
