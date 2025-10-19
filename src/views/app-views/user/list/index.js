import React, { useState, useRef, useEffect } from "react";
import { message, Button, Row, Col, Table, Input } from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import API from "services/Api";
import UserModal from "./userModal";
import moment from "moment";
import { useNavigate } from "react-router-dom";
const baseUrl = process.env.REACT_APP_LIVE_URL;

const User = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [rolesData, setRolesData] = useState([]);

  const [users, setUsers] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const formRef = useRef(null);
  const columns = [
    { title: "Full Name", dataIndex: "full_name", key: "full_name" },
    { title: "Phone", dataIndex: "phone_no", key: "phone_no" },
    { title: "Email", dataIndex: "email", key: "email" },

    {
      title: "Roles",
      dataIndex: "is_mobile_user",
      key: "is_mobile_user",
      render: (is_mobile_user) => (is_mobile_user ? "Field Agent" : "Web User"),
    },

    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (created_at) =>
        created_at ? moment(created_at).format("MMMM D, YYYY h:mm A") : "N/A",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Button type="link" onClick={() => navigateToUserManage(record)}>
          Manage
        </Button>
      ),
    },
  ];
  // const [pagePermission, setPagePermission] = useState(true);

  useEffect(() => {
    // const user = JSON.parse(localStorage.getItem("userDetails"));
    // const permissions = user?.permissions || [];
    // const hasDashboardPermission = permissions.some(
    //   (permission) =>
    //     permission.module.name === "System Users" && permission.can_view
    // );
    // setPagePermission(hasDashboardPermission);
    const getUsers = async () => {
      try {
        const response = await API("/user/users/list/", "GET", {});
        if (response.status === "success") {
          setUsers(response.data);
        } else {
          message.error("Failed to load Users");
        }
      } catch (error) {
        message.error(error);
      }
    };

    const getRolesAndPermissions = async () => {
      try {
        const response = await API("/user/role/list/", "GET", {});
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

    getUsers();
  }, []);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const navigateToUserManage = (user) => {
    navigate(
      `/solichain/usermanagement/systemusers/webusers/manage/${user.id}`
    );
  };

  const handleOk = () => {
    formRef.current
      .validateFields()
      .then((values) => {
        const payload = {
          full_name: values.full_name,
          email: values.email,
          phone_no: values.phone,

          roles: [values.roles],
          password: values.password,
          photo: `${baseUrl}/static/profile/user1`,
        };

        API("/user/register/", "POST", payload)
          .then((d) => {
            if (d.status === "success") {
              message.success(
                `User Agent ${values.full_name} added successfully`
              );
              setUsers((prevUsers) => [...prevUsers, d.data]);
            } else {
              console.log(JSON.stringify(d));
            }
          })
          .catch((error) => {
            message.error("Failed to add User");
            console.log(error);
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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredeUsers = users
    ? users.filter((user) =>
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : [];

  return (
    <>
      {/* {!pagePermission ? (
        <h1>You do not have permission to view this page</h1>
      ) : ( */}
      <div className="users">
        <Row justify="space-between" style={{ marginBottom: "25px" }}>
          <Col>
            <Input
              placeholder="Search User"
              onChange={handleSearchChange}
              prefix={<SearchOutlined />}
              style={{ width: 200 }}
            />
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={showModal}
            >
              Add User
            </Button>
          </Col>
        </Row>
        <Table dataSource={filteredeUsers} columns={columns} rowKey="id" />
        <UserModal
          visible={isModalVisible}
          onCancel={handleCancel}
          onOk={handleOk}
          rolesData={rolesData}
          ref={formRef}
        />
      </div>
      {/* )} */}
    </>
  );
};

export default User;
