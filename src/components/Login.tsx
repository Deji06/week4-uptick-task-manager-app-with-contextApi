import React, { useState } from "react";
import { useAuthContext } from "../hooks/authContextHook";
import { useNavigate } from "react-router-dom";
import { UseTaskContext } from "../contexts/TaskContext";
// type Props = {}

const Login = () => {
  const navigate = useNavigate();
  const {fetchAllTasks} = UseTaskContext()
  const { error, login, setError, loading, setLoading } = useAuthContext();
  const [formData, setFormData] = useState({ password: "", email: "" });
  const [userError, setUserError] = useState({ email: "", password: "" });

  const validateForm = () => {
    let isValid = true;
    const errors = { email: "", password: "" };

    if (!formData.email.includes("@") || !formData.email.includes(".")) {
      errors.email = "provide valid email";
    }

    if (formData.password.length < 6) {
      errors.password = "password should be more than  6 characters";
    }
    setUserError(errors);
    if (!isValid) {
      setError(errors.email || errors.password);
    }

    return isValid;
  };
  const handleFormSubmit = async (e: React.FormEvent) => {
    if (!validateForm()) return;
    e.preventDefault();
    setError(null);
    setLoading(false);
    try {
      await login(formData.email, formData.password);
      navigate('/TaskDashboard')
      fetchAllTasks()
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = () => {
    navigate("/");
  };
  return (
    <>
      <div className="w-[50%] m-auto mt-10">
        <p className="text-red-900 capitalize text-center mt-10 text-[30px]">
          login
        </p>
        <form
          action=""
          className="flex flex-col space-y-4 mt-5"
          onSubmit={handleFormSubmit}
        >
          <input
            type="text"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="email"
            className="border -2  p-2 rounded-[10px]"
          />
          {userError.email && <p>{userError.email}</p>}
          <input
            type="text"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            placeholder="password"
            className="border -2  p-2 rounded-[10px]"
          />
          {userError.password && <p>{userError.password}</p>}
          {error && !userError.email && !userError.password && (
            <p className="text-red-900">{error}</p>
          )}
          <div className="flex items-center justify-evenly">
            <div className="flex gap-x-4 items-center mx-4">
              <button
                type="submit"
                disabled={false}
                className="border px-6 rounded cursor-pointer py-2"
                // onClick={handleLogIn}
              >
                {loading ? "logging in " : "login"}
              </button>
              <div className="flex  items-center gap-x-2">
                <p>Don't have an account?</p>
                <button
                  className="border px-5 rounded cursor-pointer py-2"
                  onClick={handleSignUp}
                >
                  sign up
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
