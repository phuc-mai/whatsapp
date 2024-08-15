import SideBar from "@/components/layout/SideBar";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen flex">
      <SideBar />
      {children}
    </div>
  );
};

export default MainLayout;
