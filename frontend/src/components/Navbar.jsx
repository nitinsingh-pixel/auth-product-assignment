import { useContext, useEffect } from "react";

import { AuthContext } from "../context/AuthContext";
import useApi from "../utils/axiosInstance.utils";
import { Link, useNavigate } from "react-router";

export default function Navbar() {
    
    const api = useApi();
    
  const { user, setUser, setAccessToken, loading } = useContext(AuthContext);
  
  const navigate = useNavigate()
    const Logout = async () => {
    
            try {
                
                await api.post("/api/auth/logout")
                setUser(null);
                setAccessToken(null);
    
                navigate("/",{replace: true})
            } catch (error) {
                
            }
    }
    
  
  if(loading) return <p className="text-center">Loading...</p>
  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          to="/home"
          className="text-xl font-bold tracking-tight text-gray-900"
        >
          MyApp
        </Link>

        

        {/* Auth */}
        <div className="flex items-center gap-3">
          {(
            <>
              {user ? (
                <>
                
                  <span className="hidden text-sm font-medium text-gray-700 sm:block">
                    {user.name || user.email}
                  </span>

                  <button
                    onClick={Logout}
                    className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/"
                    className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
                  >
                    Register
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
