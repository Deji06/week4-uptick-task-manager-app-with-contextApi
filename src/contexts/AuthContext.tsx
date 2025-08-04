import axios from "axios";
import { createContext, useState, type ReactNode, useCallback } from "react";
// import SignUp from "../components/SignUp";

interface AuthContextType {
  username: string;
//   token:string;
//   email: string;
//   password: string;
  loading: boolean;
  error: string | null;
  setUserName: (username: string) => void;
//   setEmail: (email: string) => void;
//   setPassword: (password: string) => void;
//  setToken : (token:string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  signUp: (username: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [username, setUserName] = useState<string>("");
//   const [token, setToken] = useState<string> ('')
//   const [email, setEmail] = useState<string>("");
//   const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const signUp = useCallback(
    async (username: string, email: string, password: string) => {
      try {
        setLoading(true);
        setError(null);
        if (!email.includes("@") || !email.includes(".")) {
          setError("Invalid email format");
        }
        if (password.length < 6) {
          setError("Password must be at least 6 characters");
        }
        if (!username.trim()) {
          setError("Username is required");
        }
        const URL: string = import.meta.env.VITE_SERVER_URL;
        const body = { username, password, email };
        const config = {
          headers: {
            "Content-Type": "application/json",
          },
        };
        const response = await axios.post(
          `${URL}/api/v1/auth/register`,
          body,
          config
        );
        const data = response.data;
        const { token } = data;
        localStorage.setItem("regToken", token);
        setUserName(data.user?.name)
        console.log("data:", data);
        console.log("data:", token);
        // setEmail('')
        setUserName('')
        // setPassword('')
      } catch (error: any) {
        console.log(error);
        const errorMessage =
          error.response.data.msg || "something went wrong try later!";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    []
  );



  const login = useCallback(async (email:string, password:string) => {
    try {
    //   setEmail('')
      setLoading(true);
      setError(null);
      const URL: string = import.meta.env.VITE_SERVER_URL;
      const body = { password, email };
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axios.post(
        `${URL}/api/v1/auth/login`,
        body,
        config
      );
      const data = response.data;
      const {token} = data
    //   setToken(token)
      localStorage.setItem('authToken', token)
      console.log("data:", data);
    } catch (error:any) {
      console.error(error);
      const errorMessage = error.response.data?.msg || 'something went wrong, try again'
      setError(errorMessage)
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        username,
        // token,
        // setToken,
        // password,
        // email,
        setUserName,
        // setPassword,
        // setEmail,
        error,
        setError,
        loading,
        setLoading,
        signUp,
        login,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
