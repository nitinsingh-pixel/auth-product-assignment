import React, { useContext, useEffect } from 'react'

import Navbar from '../components/Navbar';
import { Outlet } from 'react-router';
import useApi from '../utils/axiosInstance.utils';
import { AuthContext } from '../context/AuthContext';


const Home = () => {

  const api = useApi();
  const { setUser, setLoading } = useContext(AuthContext);
  
  const getProfile = async () => {

    try {

      const res = await api.get("/api/auth/getMe", { withCredentials: true });
      setUser(res.data.user)
      setLoading(false)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getProfile();
  },[])
  return (
      <>
      <Navbar />
      <Outlet/>
      </>
  )
}

export default Home;