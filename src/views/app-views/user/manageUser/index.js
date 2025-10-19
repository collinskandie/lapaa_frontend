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
  Select,
  Avatar,
  Switch,
} from "antd";
import API from "services/Api";
import { useParams } from "react-router-dom"; // For navigating back to the list page
const { Option } = Select;

const UserProfile = () => {
  const { id } = useParams(); // Get the product ID from the URL parameters
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [rolesData, setRolesData] = useState([]);
  //   const [user, setUser] = useState(null);
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);

  useEffect(() => {
    // Fetch user data only when `user` is available
    const fetchUserData = async () => {
      try {
        const url = `user/users/${id}/`;
        const response = await API(url, "GET", {});
        if (response.status === "success") {
          setUserData(response.data);
          form.setFieldsValue(response.data);
          //   setIsTwoFactorEnabled(response.data.two_factor_enabled || false); // Assuming 2FA status comes from backend
        } else {
          message.error("Failed to fetch user data");
        }
      } catch (error) {
        message.error("Error fetching user data");
      }
    };
    const getRolesAndPermissions = async () => {
      try {
        const response = await API("user/roles/", "GET", {});
        if (response.status === "success") {
          setRolesData(response.data);
        } else {
          message.error("Failed to load roles and permissions");
        }
      } catch (error) {
        message.error("Error fetching roles and permissions: " + error);
      }
    };

    getRolesAndPermissions();

    fetchUserData();
  }, [form, id]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      const payload = {
        full_name: values.full_name,
        phone_no: values.phone_no,
        email: values.email,
        role_ids: [values.roles], // Map roles to role_ids
        photo: userData.photo,
      };

      if (values.new_password) {
        payload.cur_password = values.current_password;
        payload.new_password = values.new_password;
      }

      console.log("Payload: ", payload);

      const response = await API(`user/users/${id}/`, "PUT", payload);
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

  return (
    <div style={{ padding: "24px" }}>
      <Breadcrumb style={{ marginBottom: "48px" }}>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>Solichain </Breadcrumb.Item>
        <Breadcrumb.Item>User Management</Breadcrumb.Item>
        {/* <Breadcrumb.Item> User Profile </Breadcrumb.Item> */}
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
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="roles"
                    label="Role"
                    rules={[
                      { required: true, message: "Please select a Role" },
                    ]}
                  >
                    <Select placeholder="Select a Role">
                      {Array.isArray(rolesData) && rolesData.length > 0 ? (
                        rolesData.map((role) => (
                          <Option key={role.id} value={role.id}>
                            {role.name}
                          </Option>
                        ))
                      ) : (
                        <Option disabled>No Roles Defined</Option>
                      )}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
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
            {userData && (
              <div style={{ textAlign: "center" }}>
                <Avatar size={120} src={userData.avatar} />
                <h3 style={{ marginTop: "16px" }}>{userData.role}</h3>
                <p>{userData.email}</p>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default UserProfile;
