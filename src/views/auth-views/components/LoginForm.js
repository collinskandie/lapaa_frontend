import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Button, Form, Input, Alert, Row, Col } from "antd";
import { MailOutlined, LockOutlined, KeyOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import {
  signIn,
  showLoading,
  showAuthMessage,
  hideAuthMessage,
} from "store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export const LoginForm = (props) => {
  const navigate = useNavigate();
  const [needOTP, setNeedOTP] = useState(false);

  const {
    showForgetPassword,
    hideAuthMessage,
    onForgetPasswordClick,
    showLoading,
    extra,
    signIn,
    token,
    loading,
    redirect,
    showMessage,
    message,
    allowRedirect = true,
  } = props;

  const onLogin = (values) => {
    showLoading();
    signIn(values).then((data) => {
      if (
        data.payload === "OTP sent. Please verify." ||
        data.payload === "Login failed. Invalid OTP."
      ) {
        setNeedOTP(true);
      } else {
        setNeedOTP(false);
      }
    });
  };

  useEffect(() => {
    // console.log('recieved token', token)
    if (token !== null && allowRedirect) {
      navigate(redirect);
    }

    if (showMessage) {
      const timer = setTimeout(() => hideAuthMessage(), 3000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [showMessage, token, redirect, allowRedirect, navigate, hideAuthMessage]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, marginBottom: 0 }}
        animate={{
          opacity: showMessage ? 1 : 0,
          marginBottom: showMessage ? 20 : 0,
        }}
      >
        <Alert
          type={needOTP ? "info" : "error"}
          showIcon
          message={message}
        ></Alert>
      </motion.div>
      <Form
        layout="vertical"
        name="login-form"
        // initialValues={initialCredential}
        onFinish={onLogin}
      >
        <Form.Item
          name="email"
          label="Email"
          rules={[
            {
              required: true,
              message: "Please input your email",
            },
            {
              type: "email",
              message: "Please enter a validate email!",
            },
          ]}
        >
          <Input prefix={<MailOutlined className="text-primary" />} />
        </Form.Item>
        <Form.Item
          name="password"
          label={
            <div
              className={`${
                showForgetPassword
                  ? "d-flex justify-content-between w-100 align-items-center"
                  : ""
              }`}
            >
              <span>Password</span>
              {showForgetPassword && (
                <span
                  onClick={() => onForgetPasswordClick}
                  className="cursor-pointer font-size-sm font-weight-normal text-muted"
                >
                  Forget Password?
                </span>
              )}
            </div>
          }
          rules={[
            {
              required: true,
              message: "Please input your password",
            },
          ]}
        >
          <Input.Password prefix={<LockOutlined className="text-primary" />} />
        </Form.Item>

        {/* Conditional OTP input field */}
        {needOTP && (
          <Form.Item
            name="otp"
            label="OTP"
            rules={[
              {
                required: true,
                message: "Please input your OTP",
              },
              {
                len: 6, // Assuming OTP is a 6-digit code
                message: "OTP must be 6 digits",
              },
            ]}
          >
            <Input
              prefix={<KeyOutlined className="text-primary" />}
              placeholder="Enter your OTP"
            />
          </Form.Item>
        )}

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Sign In
          </Button>
        </Form.Item>

        {extra}
        <Row>
          <Col sm={24} md={24} lg={12}>
            <a href="/auth/forgot-password">Forgot Password?</a>
          </Col>
        </Row>
        <Row>
          <Col sm={24} md={24} lg={12}>
            <a href="/app/self">Youth Registration Link</a>
          </Col>
        </Row>
        {/* Logo Section */}
        <div className="text-center mt-4">
          <p className="mt-2">Powered by HBL TecServe</p>
        </div>
      </Form>
    </>
  );
};

LoginForm.propTypes = {
  otherSignIn: PropTypes.bool,
  showForgetPassword: PropTypes.bool,
  extra: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
};

LoginForm.defaultProps = {
  otherSignIn: true,
  showForgetPassword: false,
};

const mapStateToProps = ({ auth }) => {
  const { loading, message, showMessage, token, redirect } = auth;
  return { loading, message, showMessage, token, redirect };
};

const mapDispatchToProps = {
  signIn,
  showAuthMessage,
  showLoading,
  hideAuthMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
