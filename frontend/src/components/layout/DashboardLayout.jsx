import { useState, useEffect } from "react";
import { Briefcase, LogOut, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ProfileDropdown from "./ProfileDropdown";
import { NAVIGATION_MENU } from "../../utils/data";


const NavigationItem=({item,isActive,onClick,collapsed})=>{

  const Icon =item.icon;

  return <button 
  onClick={()=>onClick(item.id)}
  className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group ${
    isActive?"bg-blue-50 text-blue-900 shadow-sm shadow-blue-50":"text-gray-600 hover:bg-gray-50 hover:text-gray-900"
  }`}>
    <Icon className={`h-5 w-5 shrink-0 ${
      isActive? "text-blue-900 ":"text-gray-500"
    }`} />
    {!collapsed && <span className="ml-3 truncate">{item.name}</span>}
  </button>
}

const DashboardLayout = ({ children }) => {
  const {user, logout} = useAuth();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeNavigate, setActiveNavigate] = useState(
     "dashboard"
  );
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  //Handle responsive beahviour
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.addEventListener("resize", handleResize);
    };
  }, []);

  //Class dropdown when click outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (profileDropdownOpen) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [profileDropdownOpen]);

  const handleNavigate = (itemId) => {
    setActiveNavigate(itemId);
    navigate(`/${itemId}`);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/*Sidebar*/}
      <div
        className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 transform 
          ${
            isMobile
              ? sidebarOpen
                ? "translate-x-0"
                : "-translate-x-full"
              : "translate-x-0"
          }
       
       
          ${
            sidebarCollapsed ? "w-16" : "w-64"
          } bg-white border-r border-gray-200`}
      >
        {/*Company Logo*/}
        <div className="flex items-center h-16 border-b border-gray-200 px-6">
          <Link className="flex items-center space-x-3" to="/dashboard">
            <div className="h-8 w-8 bg-linear-to-br from-blue-900 to-blue-700 rounded-lg flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            {!sidebarCollapsed && <span className="text-gray-900 font-bold text-xl">AI Invoice App </span>}
          </Link>
        </div>

        {/*Navigation*/}
        <nav className="p-4 space-y-2">

          {NAVIGATION_MENU.map((item) => (
            <NavigationItem
             key={item.id}
             item={item}
             isActive={activeNavigate === item.id}
             onClick={handleNavigate}
             collapsed={sidebarCollapsed}/>
          ))
            }
        </nav>

        {/*Logout*/}
        <div className="absolute bottom-4 left-4 right-4">
          <button className="w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200" onClick={logout}>
            <LogOut className="h-5 w-5 shrink-0 text-gray-500" />
            {!sidebarCollapsed && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </div>

      {/*Mobile overlay*/}
      {isMobile && sidebarOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-50" onClick={() => setSidebaropen(false)} />
      )}

      {/*Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isMobile ? "ml-16" : "ml-64"
        }`}
      >
        {/*Top navbar*/}
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 h-1/6 flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center space-x-4">
            {isMobile && (
              <button className="p-2 rounded-xl hover:bg-gray-100 transition-color duration-200" onClick={toggleSidebar}>
                {sidebarOpen ? <X className="h-5 w-5 text-gray-600" /> : <Menu className="h-5 w-5 text-gray-600" />}
              </button>
            )}
            <div>
              <h1 className="text-base font-semibold text-gray-900 ">Welcome back,{user?.name}!</h1>
              <p className="text-sm text-gray-500 hidden sm:block">Here's your invoice overview.</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/*Profile Dropdown*/}
            <ProfileDropdown
            isOpen={profileDropdownOpen}
            onToggle={(e)=>{
              e.stopPropagation();
              setProfileDropdownOpen(!profileDropdownOpen);
            }}
            avatar={user?.avatar || ""}
            companyName={user?.companyName || ""}
            email={user?.email || ""}
            onLogout={logout}
            />
          </div>
        </header>

        {/* Main Content*/}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
