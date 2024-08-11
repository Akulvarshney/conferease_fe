import React, { useState } from "react";
import { Tabs, Form, Input, Button, message, notification } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

const { TabPane } = Tabs;

const Login = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Login");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpEmailDone, setSignUpEmailDone] = useState(false);
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpRePassword, setSignUpRePassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");

  const handleLoginSubmit = () => {
    let data = JSON.stringify({
      email: loginEmail,
      password: loginPassword,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_API_URL}/auth/login`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        if (response.data.success === true) {
          const token = response.data.token;
          localStorage.setItem("authToken", token);

          let userConfig = {
            method: "get",
            maxBodyLength: Infinity,
            url: `${process.env.REACT_APP_API_URL}/user/me`,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };

          axios
            .request(userConfig)
            .then((userResponse) => {
              localStorage.setItem(
                "userData",
                JSON.stringify(userResponse.data.user)
              );
              if (userResponse.data.user.profileComplete) {
                navigate("/dashboard");
              } else {
                navigate("/registerUser");
              }
            })
            .catch((error) => {
              console.log("Error fetching user data:", error);
            });
        }
      })
      .catch((error) => {
        console.log("Login error:", error);
        notification.error({
          message: "Login Failed",
          description: "Invalid email or password",
        });
      });
  };

  const handlePasswordSubmit = () => {
    if (signUpPassword !== signUpRePassword) {
      notification.error({
        message: "Password Mismatch",
        description: "Passwords do not match",
      });
      return;
    }
    let data = JSON.stringify({
      email: signUpEmail,
      otp: otp,
      password: signUpPassword,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_API_URL}/auth/verify-and-set-password`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        if (response.data.success) {
          localStorage.setItem("email", signUpEmail);
          setActiveTab("Login");
          notification.success(
            "User registered successfully, Please Login again."
          );
          setOtp("");
          setSignUpPassword("");
          setSignUpRePassword("");
        } else {
          notification.error({
            message: "Password Set Failed",
            description: "Invalid OTP",
          });
        }
      })
      .catch((error) => {
        console.log(error);
        notification.error({
          message: "Password Set Failed",
          description: "Invalid OTP",
        });
      });
  };

  const handleSignUpSubmit = () => {
    let data = JSON.stringify({
      email: signUpEmail,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_API_URL}/auth/signup`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        if (response.data.success === true) {
          setSignUpEmailDone(true);
          notification.success({
            message: "Registration Successful",
            description: "Check your email for the OTP",
          });
        } else {
          notification.error({
            message: "Registration Failed",
            description: "User already exists",
          });
        }
      })
      .catch((error) => {
        console.log(error);
        notification.error({
          message: "Registration Failed",
          description: "User already exists",
        });
      });
  };

  return (
    <div className="loginFormOuterContainer">
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="Login" key="Login">
          <Form onFinish={handleLoginSubmit} className="loginFormContainer">
            <Form.Item
              name="loginEmail"
              rules={[{ required: true, message: "Please input your email!" }]}
            >
              <Input
                placeholder="Email"
                value={loginEmail}
                type="email"
                onChange={(e) => setLoginEmail(e.target.value)}
              />
            </Form.Item>

            <Form.Item
              name="loginPassword"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                visibilityToggle={{
                  visible: showPassword,
                  onVisibleChange: setShowPassword,
                }}
              />
            </Form.Item>

            {/* <div className="loginRow2">
              <span type="button">Forgot Password?</span>
            </div> */}

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Login
              </Button>
            </Form.Item>
          </Form>
        </TabPane>

        <TabPane tab="Signup" key="Signup">
          {signUpEmailDone ? (
            <Form
              onFinish={handlePasswordSubmit}
              className="loginFormContainer"
            >
              <Form.Item
                name="otp"
                rules={[{ required: true, message: "Please input the OTP!" }]}
              >
                <Input
                  placeholder="OTP"
                  maxLength={6}
                  type="number"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </Form.Item>

              <Form.Item
                name="signUpPassword"
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}
              >
                <Input.Password
                  placeholder="Password"
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                  visibilityToggle={{
                    visible: showPassword,
                    onVisibleChange: setShowPassword,
                  }}
                />
              </Form.Item>

              <Form.Item
                name="signUpRePassword"
                rules={[
                  { required: true, message: "Please confirm your password!" },
                ]}
              >
                <Input.Password
                  placeholder="Re-enter Password"
                  value={signUpRePassword}
                  onChange={(e) => setSignUpRePassword(e.target.value)}
                  visibilityToggle={{
                    visible: showPassword,
                    onVisibleChange: setShowPassword,
                  }}
                />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  Set Password
                </Button>
              </Form.Item>
            </Form>
          ) : (
            <Form onFinish={handleSignUpSubmit} className="loginFormContainer">
              <Form.Item
                name="signUpEmail"
                rules={[
                  { required: true, message: "Please input your email!" },
                ]}
              >
                <Input
                  placeholder="Email"
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  Sign Up
                </Button>
              </Form.Item>
            </Form>
          )}
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Login;
