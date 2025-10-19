import React, { forwardRef } from "react";
import { Modal, Form, Input, Select, Row, Col, Card } from "antd";

const { Option } = Select;

const UserModal = forwardRef(({ visible, onCancel, onOk, rolesData }, ref) => {
  return (
    <Modal
      title="Add User"
      open={visible}
      onOk={onOk}
      onCancel={onCancel}
      okText="Submit"
      cancelText="Cancel"
      width={800}
      style={{ top: 20 }}
      bodyStyle={{
        maxHeight: "70vh",
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      <Form
        ref={ref}
        layout="vertical"
        // initialValues={{ organisation: organizationId }} // Set initial values here
        // initialValues={organizationId ? { organisation: organizationId } : {}}
        name="add_entry_form"
      >
        <Row gutter={16}>
          <Col xs={24} sm={24} md={24}>
            <Card title="User Details">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="full_name"
                    label="Full name"
                    rules={[
                      {
                        required: true,
                        message: "Please enter the Full Name",
                      },
                    ]}
                  >
                    <Input placeholder="Enter full name" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="phone"
                    label="Phone Number"
                    rules={[
                      {
                        required: true,
                        message: "Please enter a phone number",
                      },
                    ]}
                  >
                    <Input placeholder="Enter a Phone number" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                      {
                        required: true,
                        message: "Please enter a valid Email Address",
                      },
                    ]}
                  >
                    <Input placeholder="Enter an Email Address" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                      { required: true, message: "Please enter a password" },
                    ]}
                  >
                    <Input type="password" placeholder="Enter a password" />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="roles"
                  label="Role"
                  rules={[{ required: true, message: "Please select a Role" }]}
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
          </Col>
        </Row>
      </Form>
    </Modal>
  );
});

export default UserModal;
