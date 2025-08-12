import axios from "axios";
import { createContext, useState, type ReactNode, useCallback , useEffect} from "react";

interface AuthContextType {
  username: string;
  loading: boolean;
  logInError: string | null;
  signUpError: string | null;
  setUserName: (username: string) => void;
  setLoading: (loading: boolean) => void;
  setLogInError: (error: string | null) => void;
  setSignUpError: (error: string | null) => void;
  signUp: (username: string, email: string, password: string) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logOut: () => void;

}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [username, setUserName] = useState<string>(localStorage.getItem('username') || '');
  const [loading, setLoading] = useState<boolean>(false);
  const [signUpError, setSignUpError] = useState<string | null>(null);
  const [logInError, setLogInError] = useState<string | null>(null);

   useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    if (savedUsername) {
      setUserName(savedUsername);
    }
  }, []);

  const logOut = useCallback(() => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("regToken");
    localStorage.removeItem("username");
    setUserName('')
    console.log("all authentications and user info cleared");
    
  }, []);

  const signUp = useCallback(
    async (username: string, email: string, password: string) => {
      try {
        setLoading(true);
        setSignUpError(null);
        if (!email.includes("@") || !email.includes(".")) {
          setLoading(false)
          setSignUpError("Invalid email format");
          return false;
        }
        if (password.length < 6) {
          setLoading(false)
          setSignUpError("Password must be at least 6 characters");
          return false
        }
        if (!username.trim()) {
          setLoading(false)
          setSignUpError("Username is required");
          return false;
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
        setUserName('')
        return true;
      } catch (error: any) {
        console.log(error);
        const errorMessage =
          error.response.data.msg || "something went wrong try later!";
        setSignUpError(errorMessage);
        return false;
        // throw new Error(errorMessage)
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
      setLogInError(null);
        if (!email.includes("@") || !email.includes(".")) {
          setLoading(false)
          setLogInError("Invalid email format");
          return false;
        }
        if (password.length < 6) {
          setLoading(false)
          setLogInError("Password must be at least 6 characters");
        }
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
      localStorage.setItem('authToken', token)
      localStorage.setItem("username", data.user?.username);
      setUserName(data.user?.username)      
      console.log("data:", data);
      return true;
    } catch (error:any) {
      console.error(error);
      const errorMessage = error.response.data?.msg || 'something went wrong, try again'
      setLogInError(errorMessage)
      return false;
      // throw new Error(errorMessage)
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        username,
        setUserName,
        logInError,
        signUpError,
        setLogInError,
        setSignUpError,
        logOut,
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
