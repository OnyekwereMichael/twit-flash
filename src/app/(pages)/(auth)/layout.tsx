export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      // <main className=" bg-[#272932]">
      <main>
        <div className="flex w-[93%] max-sm:w-full max-sm:px-3 mx-auto  flex-col ">
          {children}
        </div>
          <div>
             {/* <div className="">
                <Image src={AuthBg} alt="auth-img" width={600} height={600} className="flex max-sm:hidden object-cover h-[100vh] w-full bg-no-repeat"/>
             </div> */}
          </div>
      </main>
    );
  }