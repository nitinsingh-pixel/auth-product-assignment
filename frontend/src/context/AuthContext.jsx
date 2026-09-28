import axios from "axios";
import { createContext, useEffect, useState } from "react";


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [loading, setLoading] = useState(true)

    return (
        <AuthContext.Provider value={{ user, setUser, accessToken, setAccessToken,loading, setLoading}}>
            {children}
        </AuthContext.Provider>
    )
}