import React, { useState, useEffect } from "react";
import {
  Card,
  Breadcrumb,
  Form,
  Input,
  Button,
  Row,
  Col,
  message,
  Avatar,
  Switch,
} from "antd";
import API from "services/Api";

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [user, setUser] = useState(null);
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);

  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem("userDetails"));
    if (storedUserData) {
      setUser(storedUserData);
    }
  }, []);

  useEffect(() => {
    // Fetch user data only when `user` is available
    const fetchUserData = async () => {
      if (user && user.id) {
        try {
          const url = `user/users/${user.id}/`;
          const response = await API(url, "GET", {});
          if (response.status === "success") {
            setUserData(response.data);
            form.setFieldsValue(response.data);
            setIsTwoFactorEnabled(response.data.two_factor_enabled || false); // Assuming 2FA status comes from backend
          } else {
            message.error("Failed to fetch user data");
          }
        } catch (error) {
          message.error("Error fetching user data");
        }
      }
    };

    fetchUserData();
  }, [form, user]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      const payload = {
        full_name: values.full_name,
        phone_no: values.phone_no,
        email: values.email,
        two_factor_enabled: isTwoFactorEnabled,
        roles: userData.roles,
        organisation: user.organisation,
        photo: userData.photo,
      };

      if (values.new_password) {
        payload.cur_password = values.current_password;
        payload.new_password = values.new_password;
      }

      console.log("Payload: ", payload);

      const response = await API(`user/users/${user.id}/`, "PUT", payload);
      if (response.status === "success") {
        message.success("User information updated successfully");
        setUserData(values);

        // Show a message reminding to enable 2FA if it's disabled
        if (!isTwoFactorEnabled) {
          message.warning(
            "Consider enabling Two-Factor Authentication for added security."
          );
        }
      } else {
        message.error("Failed to update user information");
      }
    } catch (error) {
      message.error("Error saving user data");
    } finally {
      setLoading(false);
    }
  };

  const handleTwoFactorToggle = (checked) => {
    console.log("Checked", checked);
    setIsTwoFactorEnabled(checked);
  };

  return (
    <div style={{ padding: "24px" }}>
      <Breadcrumb style={{ marginBottom: "48px" }}>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>Solichain </Breadcrumb.Item>
        <Breadcrumb.Item>User Management</Breadcrumb.Item>
        <Breadcrumb.Item> User Profile </Breadcrumb.Item>
      </Breadcrumb>
      <Row gutter={16}>
        {/* Left Card: User Information */}
        <Col xs={24} md={12}>
          <Card title="User Information">
            <Form form={form} layout="vertical">
              <Form.Item
                name="full_name"
                label="Full Name"
                rules={[
                  { required: true, message: "Please enter your Full name" },
                ]}
              >
                <Input placeholder="Enter your name" />
              </Form.Item>
              <Form.Item name="phone_no" label="Phone">
                <Input placeholder="Enter your phone number" disabled />
              </Form.Item>
              <Form.Item name="email" label="Email">
                <Input placeholder="Enter your Email" disabled />
              </Form.Item>

              <Form.Item name="current_password" label="Current Password">
                <Input.Password placeholder="Enter your current password" />
              </Form.Item>

              <Form.Item
                name="new_password"
                label="New Password"
                rules={[
                  {
                    min: 6,
                    message: "Password must be at least 6 characters long",
                  },
                ]}
              >
                <Input.Password placeholder="Enter your new password" />
              </Form.Item>

              <Form.Item
                name="confirm_password"
                label="Confirm New Password"
                dependencies={["new_password"]}
                hasFeedback
                rules={[
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("new_password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("The two passwords do not match")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Confirm your new password" />
              </Form.Item>

              <Form.Item
                name="two_factor_enabled"
                label="Enable Two-Factor Authentication"
              >
                <Switch
                  checked={isTwoFactorEnabled}
                  onChange={handleTwoFactorToggle}
                />
              </Form.Item>
            </Form>
            <Button
              type="primary"
              onClick={handleSave}
              loading={loading}
              style={{ marginTop: "16px" }}
            >
              Save All
            </Button>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card>
            {user && (
              <div style={{ textAlign: "center" }}>
                <Avatar size={120} src={user.avatar} />
                <h3 style={{ marginTop: "16px" }}>{user.role}</h3>
                <p>{user.email}</p>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default UserProfile;
