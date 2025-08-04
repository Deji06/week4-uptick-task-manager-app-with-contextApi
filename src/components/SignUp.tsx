
import type React from "react";
import { useAuthContext } from "../hooks/authContextHook";
import { useNavigate } from "react-router-dom";
import { useState } from "react";


const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [userError, setUserError] = useState({
    email: "",
    password: "",
    username: "",
  });
  const {
    username,
    setUserName,
    signUp,
    error,
    setError,
    loading,
    setLoading,
  } = useAuthContext();

  const validateForm = () => {
    let isvalid = true;
    const errors = { username: "", password: "", email: "" };

    if (username.trim() === "") {
      errors.username = "username is required";
      isvalid = false;
    }

    if (!formData.email.includes("@") || !formData.email.includes(".")) {
      errors.email = "provide valid email address";
      isvalid = false;
    }

    if (formData.password.length < 6) {
      errors.password = "password must be longer than 6 characters";
      isvalid = false;
    }

    setUserError(errors);
    if (!isvalid) {
      setError(errors.username || errors.email || errors.password);
    }
    return isvalid;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validateForm()) return;
    setLoading(false);
    try {
      setLoading(true);
      await signUp(username, formData.email, formData.password);
      setUserName("");
      navigate("/login");
      setError("");
      setFormData({ email: "", password: "" });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // const handleSignUp = async() => {
  //     if(!validateForm()) return;
  //     // console.log('clicked');
  //         try {
  //         await signUp(username, formData.email, formData.password)
  //         navigate('/login')
  //         setError(null)
  //         setUserName('')
  //         setFormData({email: '', password: ''})
  //     } catch (error) {
  //         console.error(error)
  //     }

  // }

  const handleLogIn = () => {
    console.log("clicked");
    navigate("/login");
  };

  return (
    <>
      <div className="w-[50%] m-auto mt-10">

        <p className="10 text-[30px]">
          sign up
        </p>

        <form
          action=""
          className="flex flex-col space-y-4 mt-5"
          onSubmit={handleFormSubmit}
        >
          <input
            type="text"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="username"
            className="border -2  p-2 rounded-[10px]"
          />

          {userError.username && (
            <p className="text-red-900">{userError.username}</p>
          )}

          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="email"
            className="border -2  p-2 rounded-[10px]"
          />

          {userError.email && <p className="text-red-900">{userError.email}</p>}

          <input
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            placeholder="password"
            className="border -2  p-2 rounded-[10px]"
          />

          {userError.password && (
            <p className="text-red-900">{userError.password}</p>
          )}

          {error &&
            !userError.username &&
            !userError.email &&
            !userError.password && <p className="text-red-900">{error}</p>}

          <div className="flex items-center justify-evenly">
            <button
              type="submit"
              className="border px-5 rounded cursor-pointer py-2"
              disabled={false}
            >
              {loading ? "signing up" : "sign up"}
            </button>

            <div className="flex gap-x-4 items-center mx-4">
              <p className="text-red-900">already have an account ?</p>
              <button
                className="border px-6 rounded cursor-pointer py-2"
                onClick={handleLogIn}
              >
                login
              </button>
            </div>

          </div>
        </form>

      </div>
    </>
  );
};

export default SignUp;
