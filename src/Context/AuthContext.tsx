
import { createContext, useEffect, useState } from "react";
import { getMyDetails } from "../service/auth";

export const AuthContext = createContext<any>(null);

const AuthProvider = ({ children }: any) => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("ACCESS_TOKEN");

        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }

        getMyDetails()
            .then((res) => {
                if (res.data) {
                    setUser(res.data);
                } else {
                    setUser(null);
                }
            })
            .catch((err) => {
                console.error("Failed to get user details:", err);

                localStorage.removeItem("ACCESS_TOKEN");
                localStorage.removeItem("REFRESH_TOKEN");

                setUser(null);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
