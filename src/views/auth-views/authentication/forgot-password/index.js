import React, { useState } from "react";
import { Card, Row, Col, Form, Input, Button, message } from "antd";
import { MailOutlined, KeyOutlined, LockOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import API from "services/Api";
import { useNavigate } from "react-router-dom";

const backgroundStyle = {
  backgroundImage: "url(/img/others/image.png)",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
};

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [forgotPasswordSent, setForgotPasswordSent] = useState(false);
  const [emailUsed, setEmailUsed] = useState(""); // State to store email

  const theme = useSelector((state) => state.theme.currentTheme);

  const onSend = (values) => {
    setLoading(true);

    if (forgotPasswordSent) {
      const payload = {
        email: emailUsed, // Use stored email
        otp: values.otp,
        new_password: values.new_password, // Only send the new password, not confirm_password
      };
      API("user/forgot-password/", "POST", payload)
        .then((response) => {
          if (response.status === "success") {
            navigate(`/auth/login`);
          } else {
            message.error(`Error: ${response.data.error}`);
            setLoading(false);
          }
        })
        .catch((error) => {
          message.error("Failed to add send email.");
          console.log(error);
        });
    } else {
      API("user/forgot-password/", "POST", values)
        .then((response) => {
          if (response.status === "success") {
            message.success("New password has sent to your email!");
            setEmailUsed(values.email); // Store the email in state
            setForgotPasswordSent(true);
            setLoading(false);
          } else {
            message.error(`Error: ${response.data.error}`);
            setLoading(false);
          }
        })
        .catch((error) => {
          message.error("Failed to add send email.");
          console.log(error);
        });
    }
  };

  return (
    <div className="h-100" style={backgroundStyle}>
      <div className="container d-flex flex-column justify-content-center h-100">
        <Row justify="center">
          <Col xs={20} sm={20} md={20} lg={9}>
            <Card>
              <div className="my-2">
                <div className="text-center">
                  <img
                    className="img-fluid"
                    src={`/img/${
                      theme === "light" ? "logo.png" : "logo-white.png"
                    }`}
                    alt=""
                  />
                  <h3 className="mt-3 font-weight-bold">
                    {forgotPasswordSent ? "Reset Password" : "Forgot Password?"}
                  </h3>
                  <p className="mb-4">
                    {forgotPasswordSent
                      ? "Enter the OTP sent to your email along with the new password"
                      : "Enter your Email to reset password"}
                  </p>
                </div>
                <Row justify="center">
                  <Col xs={24} sm={24} md={20} lg={20}>
                    <Form
                      form={form}
                      layout="vertical"
                      name="forget-password"
                      onFinish={onSend}
                    >
                      {!forgotPasswordSent ? (
                        // Form to send reset email
                        <>
                          <Form.Item
                            name="email"
                            rules={[
                              {
                                required: true,
                                message: "Please input your email address",
                              },
                              {
                                type: "email",
                                message: "Please enter a valid email!",
                              },
                            ]}
                          >
                            <Input
                              placeholder="Email Address"
                              prefix={<MailOutlined className="text-primary" />}
                            />
                          </Form.Item>
                          <Form.Item>
                            <Button
                              loading={loading}
                              type="primary"
                              htmlType="submit"
                              block
                            >
                              {loading ? "Sending" : "Send"}
                            </Button>
                          </Form.Item>
                        </>
                      ) : (
                        // Form to reset password
                        <>
                          <Form.Item
                            name="otp"
                            rules={[
                              {
                                required: true,
                                message:
                                  "Please input the OTP sent to your email!",
                              },
                            ]}
                          >
                            <Input
                              placeholder="Enter OTP"
                              prefix={<KeyOutlined className="text-primary" />}
                            />
                          </Form.Item>
                          <Form.Item
                            name="new_password"
                            rules={[
                              {
                                required: true,
                                message: "Please input your new password!",
                              },
                            ]}
                            hasFeedback
                          >
                            <Input.Password
                              placeholder="New Password"
                              prefix={<LockOutlined className="text-primary" />}
                            />
                          </Form.Item>
                          <Form.Item
                            name="confirm_password"
                            dependencies={["new_password"]}
                            hasFeedback
                            rules={[
                              {
                                required: true,
                                message: "Please confirm your password!",
                              },
                              ({ getFieldValue }) => ({
                                validator(_, value) {
                                  if (
                                    !value ||
                                    getFieldValue("new_password") === value
                                  ) {
                                    return Promise.resolve();
                                  }
                                  return Promise.reject(
                                    new Error("The two passwords do not match!")
                                  );
                                },
                              }),
                            ]}
                          >
                            <Input.Password
                              placeholder="Confirm Password"
                              prefix={<LockOutlined className="text-primary" />}
                            />
                          </Form.Item>
                          <Form.Item>
                            <Button
                              loading={loading}
                              type="primary"
                              htmlType="submit"
                              block
                            >
                              {loading ? "Resetting" : "Reset Password"}
                            </Button>
                          </Form.Item>
                        </>
                      )}
                    </Form>
                  </Col>
                </Row>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ForgotPassword;
