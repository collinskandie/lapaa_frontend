import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  Row,
  Col,
  Table,
  Input,
  Modal,
  message,
  Form,
  Checkbox,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import API from "services/Api";

const RoleManagement = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [rolesData, setRolesData] = useState([]);
  const [newRolePermissions, setNewRolePermissions] = useState([]);
  const [updatedPermissions, setUpdatedPermissions] = useState({});
  const formRef = useRef(null);
  // const [pagePermission, setPagePermission] = useState(true);

  useEffect(() => {
    // const user = JSON.parse(localStorage.getItem("userDetails"));
    const getRolesAndPermissions = async () => {
      try {
        const response = await API("user/roles/list/", "GET", {});
        if (response.status === "success") {
          setRolesData(response.data);
          console.log("Roles and Permissions:", response.data);
        } else {
          message.error("Failed to load roles and permissions");
        }
      } catch (error) {
        message.error("Error fetching roles and permissions: " + error);
      }
    };
    getRolesAndPermissions();

    const getModules = async () => {
      try {
        const response = await API("user/modules/list/", "GET", {});
        if (response.status === "success") {
          const initialPermissions = response.data.map((module) => ({
            module,
            can_create: false,
            can_view: false,
            can_edit: false,
            can_delete: false,
          }));
          setNewRolePermissions(initialPermissions);
        } else {
          message.error("Failed to load modules");
        }
      } catch (error) {
        message.error("Error fetching modules: " + error);
      }
    };
    getModules();
  }, []);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    formRef.current
      .validateFields()
      .then((values) => {
        const transformedPermissions = newRolePermissions.map((perm) => ({
          module_id: perm.module.id,
          can_create: perm.can_create,
          can_view: perm.can_view,
          can_edit: perm.can_edit,
          can_delete: perm.can_delete,
        }));

        const newRoleData = {
          name: values.roleName,
          permissions: transformedPermissions,
        };

        API("user/role/", "POST", newRoleData)
          .then((response) => {
            if (response.status === "success") {
              message.success("Role created successfully");
              console.log("New Role:", newRoleData);
              setRolesData([...rolesData, response.data]);
            } else {
              message.error("Failed to create role");
            }
          })
          .catch((error) => {
            message.error("Error creating role: " + error);
          });

        formRef.current.resetFields();
        setIsModalVisible(false);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Handle checkbox change for permissions in the main table
  const handleMainTableCheckboxChange = (roleId, moduleKey, permissionType) => {
    setRolesData((prevRolesData) =>
      prevRolesData.map((role) =>
        role.id === roleId
          ? {
              ...role,
              permissions: role.permissions.map((perm, index) =>
                index === moduleKey
                  ? { ...perm, [permissionType]: !perm[permissionType] }
                  : perm
              ),
            }
          : role
      )
    );
    // Mark this role as having changes for the Update button
    setUpdatedPermissions((prevUpdated) => ({
      ...prevUpdated,
      [roleId]: true,
    }));
  };

  const handleUpdatePermissions = async (roleId) => {
    // Find the role data from rolesData using roleId
    const roleToUpdate = rolesData.find((role) => role.id === roleId);

    // Transform the role data to match the API's expected structure
    const updatedRolePermissions = {
      id: roleToUpdate.id,
      name: roleToUpdate.name,
      permissions: roleToUpdate.permissions.map((perm) => ({
        id: perm.id,
        module_id: perm.module,
        can_create: perm.can_create,
        can_view: perm.can_view,
        can_edit: perm.can_edit,
        can_delete: perm.can_delete,
      })),
    };

    try {
      const response = await API(
        `user/roles/${updatedRolePermissions.id}/`,
        "PUT",
        updatedRolePermissions
      );

      if (response.status === "success") {
        message.success("Permissions updated successfully");
      } else {
        message.error("Failed to update permissions");
      }
    } catch (error) {
      message.error("Error updating permissions: " + error);
    }
  };

  const handleModalCheckboxChange = (index, permissionType) => {
    setNewRolePermissions((prevPermissions) =>
      prevPermissions.map((perm, permIndex) =>
        permIndex === index
          ? { ...perm, [permissionType]: !perm[permissionType] }
          : perm
      )
    );
  };

  const modalPermissionsColumns = [
    {
      title: "Module",
      dataIndex: "module",
      key: "module.id",
      render: (module) => module.name,
    },
    {
      title: "Create",
      dataIndex: "can_create",
      key: "can_create",
      render: (value, _, index) => (
        <Checkbox
          checked={value}
          onChange={() => handleModalCheckboxChange(index, "can_create")}
        />
      ),
    },
    {
      title: "View",
      dataIndex: "can_view",
      key: "can_view",
      render: (value, _, index) => (
        <Checkbox
          checked={value}
          onChange={() => handleModalCheckboxChange(index, "can_view")}
        />
      ),
    },
    {
      title: "Edit",
      dataIndex: "can_edit",
      key: "can_edit",
      render: (value, _, index) => (
        <Checkbox
          checked={value}
          onChange={() => handleModalCheckboxChange(index, "can_edit")}
        />
      ),
    },
    {
      title: "Delete",
      dataIndex: "can_delete",
      key: "can_delete",
      render: (value, _, index) => (
        <Checkbox
          checked={value}
          onChange={() => handleModalCheckboxChange(index, "can_delete")}
        />
      ),
    },
  ];

  const permissionsColumns = [
    {
      title: "Module",
      dataIndex: "module",
      key: "module",
      render: (module) => module.name,
    },
    {
      title: "Create",
      dataIndex: "can_create",
      key: "can_create",
      render: (value, record, index) => (
        <Checkbox
          checked={value}
          onChange={() =>
            handleMainTableCheckboxChange(record.roleId, index, "can_create")
          }
        />
      ),
    },
    {
      title: "View",
      dataIndex: "can_view",
      key: "can_view",
      render: (value, record, index) => (
        <Checkbox
          checked={value}
          onChange={() =>
            handleMainTableCheckboxChange(record.roleId, index, "can_view")
          }
        />
      ),
    },
    {
      title: "Edit",
      dataIndex: "can_edit",
      key: "can_edit",
      render: (value, record, index) => (
        <Checkbox
          checked={value}
          onChange={() =>
            handleMainTableCheckboxChange(record.roleId, index, "can_edit")
          }
        />
      ),
    },
    {
      title: "Delete",
      dataIndex: "can_delete",
      key: "can_delete",
      render: (value, record, index) => (
        <Checkbox
          checked={value}
          onChange={() =>
            handleMainTableCheckboxChange(record.roleId, index, "can_delete")
          }
        />
      ),
    },
  ];

  const expandedRowRender = (record) => {
    console.log("Expanded Record:", record);
    return (
      <Table
        columns={permissionsColumns}
        dataSource={record.permissions.map((perm, index) => ({
          ...perm,
          key: index,
          roleId: record.id,
        }))}
        pagination={false}
        rowKey="key"
      />
    );
  };

  // Updated rolesColumns to add an "Update" button when permissions change
  const rolesColumns = [
    {
      title: "Roles",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Action",
      key: "action",
      fixed: "right", // Fix the column to the right
      width: 100, // Optional: set a width for the action column
      render: (_, record) =>
        updatedPermissions[record.id] ? (
          <Button
            type="primary"
            onClick={() => handleUpdatePermissions(record.id)}
          >
            Update
          </Button>
        ) : null,
    },
  ];
  return (
    <>
      {/* {!pagePermission ? (
        <h1>You do not have permission to view this page</h1>
      ) : ( */}
        <div className="organization">
          <Row justify="space-between" style={{ marginBottom: "25px" }}>
            <Col></Col>
            <Col>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={showModal}
              >
                Add Role
              </Button>
            </Col>
          </Row>

          <Table
            dataSource={rolesData}
            columns={rolesColumns}
            expandable={{
              expandedRowRender,
            }}
            rowKey="id"
            scroll={{ x: "max-content" }} // Enable horizontal scrolling if necessary
          />

          {/* Add Role Modal */}
          <Modal
            title="Add New Role"
            open={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
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
            <Form ref={formRef} layout="vertical" name="add_role_form">
              <Form.Item
                name="roleName"
                label="Role Name"
                rules={[
                  { required: true, message: "Please enter a role name" },
                ]}
              >
                <Input placeholder="Enter Role Name" />
              </Form.Item>

              {/* Permissions Table for New Role */}
              <Table
                columns={modalPermissionsColumns}
                dataSource={newRolePermissions}
                pagination={false}
                rowKey="module.id"
              />
            </Form>
          </Modal>
        </div>
      {/* )} */}
    </>
  );
};

export default RoleManagement;
