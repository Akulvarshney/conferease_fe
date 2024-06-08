"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { LOCAL_URL } from "../constants";
import { useRouter } from "next/navigation";

const Login = () => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpRePassword, setSignUpRePassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleLoginEmailChange = (e) => {
    setLoginEmail(e.target.value);
  };

  const handleLoginPasswordChange = (e) => {
    setLoginPassword(e.target.value);
  };

  const handleSignUpEmailChange = (e) => {
    setSignUpEmail(e.target.value);
  };

  const handleSignUpPasswordChange = (e) => {
    setSignUpPassword(e.target.value);
  };

  const handleSignUpRePasswordChange = (e) => {
    setSignUpRePassword(e.target.value);
  };

  const validateLoginForm = () => {
    const newErrors = {};
    if (!loginEmail) newErrors.loginEmail = "Email is required";
    if (!loginPassword) newErrors.loginPassword = "Password is required";
    return newErrors;
  };

  const validateSignUpForm = () => {
    const newErrors = {};
    if (!signUpEmail) newErrors.signUpEmail = "Email is required";
    if (!signUpPassword) newErrors.signUpPassword = "Password is required";
    if (!signUpRePassword)
      newErrors.signUpRePassword = "Re-enter password is required";
    if (signUpPassword !== signUpRePassword)
      newErrors.signUpRePassword = "Passwords do not match";
    return newErrors;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateLoginForm();
    if (Object.keys(newErrors).length === 0) {
      const requestData = {
        email: loginEmail,
        password: loginPassword,
      };

      axios
        .post(`${LOCAL_URL}/login`, requestData)
        .then((response) => {
          if (response.status === false) {
            toast({
              title: "Error",
              description: "Incorrect Login Password",
              variant: "destructive",
              status: "error",
            });
          } else {
            const responseData = response.data;
            console.log(responseData);
            localStorage.setItem("token", responseData.token);
            localStorage.setItem("userData", JSON.stringify(responseData.data));
            router.push("/dashboard");
          }
        })
        .catch((error) => {
          if (error.response.status === 401) {
            toast({
              title: "Error",
              description: "Incorrect Login Password",
              variant: "destructive",
              status: "error",
            });
          } else {
            toast({
              title: "Error",
              description: "An error occurred while logging in.",
              variant: "destructive",
              status: "error",
            });
          }
        });
    } else {
      Object.values(newErrors).forEach((error) => {
        toast({
          title: "Error",
          description: error,
          variant: "destructive",
          status: "error",
        });
      });
    }
  };

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateSignUpForm();
    if (Object.keys(newErrors).length === 0) {
      console.log({ signUpEmail, signUpPassword, signUpRePassword });

      const requestData = {
        email: signUpEmail,
        password: signUpPassword,
      };

      axios
        .post(`${LOCAL_URL}/registerEmail`, requestData)
        .then((response) => {
          console.log(response);
          if (response.status === false) {
            toast({
              title: "Error",
              description: response?.message
                ? response.message
                : "Try again later!",
              variant: "destructive",
              status: "error",
            });
            setSignUpRePassword("");
            setSignUpPassword("");
            setSignUpEmail("");
          } else {
            const responseData = response.data;
            console.log(responseData);
            toast({
              title: "Success",
              description: "User Registered! Login again.",
              status: "success",
            });
            setSignUpRePassword("");
            setSignUpPassword("");
            setSignUpEmail("");
          }
        })
        .catch((error) => {
          if (error.response.status === 400) {
            toast({
              title: "Error",
              description: "Email already exists",
              variant: "destructive",
              status: "error",
            });
            setSignUpRePassword("");
            setSignUpPassword("");
            setSignUpEmail("");
          } else {
            toast({
              title: "Error",
              description: "An error occurred while logging in.",
              variant: "destructive",
              status: "error",
            });
            setSignUpRePassword("");
            setSignUpPassword("");
            setSignUpEmail("");
          }
        });
    } else {
      Object.values(newErrors).forEach((error) => {
        toast({
          title: "Error",
          variant: "destructive",
          description: error,
          status: "error",
        });
      });
    }
  };

  return (
    <div className="loginFormOuterContainer min-h-screen">
      <Tabs defaultValue="login">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="Signup">Sign Up</TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          <form className="loginFormContainer" onSubmit={handleLoginSubmit}>
            <h2>Login</h2>

            <div className="inputLabel">
              <input
                id="loginEmail"
                type="email"
                placeholder="Email"
                required={true}
                value={loginEmail}
                onChange={handleLoginEmailChange}
              />
            </div>

            <div className="inputLabel">
              <input
                id="loginPassword"
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                value={loginPassword}
                onChange={handleLoginPasswordChange}
              />
            </div>

            <div className="loginRow2">
              <p type="button" className="cursor-pointer">
                Forgot Password?
              </p>

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <button className="buttonSubmit" type="submit">
              Login
            </button>
          </form>
        </TabsContent>

        <TabsContent value="Signup">
          <form className="loginFormContainer" onSubmit={handleSignUpSubmit}>
            <h2>Sign Up</h2>

            <div className="inputLabel">
              <input
                id="signUpEmail"
                type="email"
                placeholder="Email"
                required={true}
                value={signUpEmail}
                onChange={handleSignUpEmailChange}
              />
            </div>

            <div className="inputLabel">
              <input
                id="signUpPassword"
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                value={signUpPassword}
                onChange={handleSignUpPasswordChange}
              />
            </div>

            <div className="inputLabel">
              <input
                id="signUpRePassword"
                placeholder="Re-enter Password"
                type={showPassword ? "text" : "password"}
                value={signUpRePassword}
                onChange={handleSignUpRePasswordChange}
              />
            </div>

            <div className="loginRow2">
              <p type="button" className="cursor-pointer">
                Forgot Password?
              </p>

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <button className="buttonSubmit" type="submit">
              Sign Up
            </button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Login;
