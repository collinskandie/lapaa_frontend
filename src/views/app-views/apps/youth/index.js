import React, { useState, useEffect } from 'react'
import { Table, Tag, Button, Card, Tooltip, Avatar, Menu, Dropdown, Modal, Form, Input, Select, InputNumber } from 'antd'
import {
    EyeOutlined,
    EditOutlined,
    DeleteOutlined,
    PlusOutlined,
    UserOutlined,
    MoreOutlined
} from '@ant-design/icons'
import PageHeaderAlt from 'components/layout-components/PageHeaderAlt'
import Flex from 'components/shared-components/Flex'
import { useNavigate } from 'react-router-dom'
import { APP_PREFIX_PATH } from 'configs/AppConfig'
import dayjs from "dayjs"; // to calculate age easily
import API from "services/Api";

const YouthList = () => {
    const [list, setList] = useState([])
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [form] = Form.useForm()

    const navigate = useNavigate()
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchYouths = async () => {
            try {
                setLoading(true);
                const response = await API('/youths/', 'GET', []);
                console.log('Fetched youths:', response.data.results);
                setList(response.data?.results || []);
            } catch (error) {
                console.error('Error fetching youths:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchYouths();
    }, []);


    const showModal = () => setIsModalVisible(true)
    const handleCancel = () => {
        setIsModalVisible(false)
        form.resetFields()
    }

    const handleAddYouth = () => {
        form.validateFields().then(values => {
            const newYouth = {
                id: Date.now(),
                ...values
            }
            setList([...list, newYouth])
            handleCancel()
        })
    }

    const deleteItem = (id) => {
        setList(list.filter(elm => elm.id !== id))
    }

    const columns = [
        {
            title: "Name",
            dataIndex: "full_name",
            key: "full_name",
            render: (text, record) => (
                <Flex alignItems="center">
                    <Avatar size={40} icon={<UserOutlined />} className="mr-2" />
                    <div>
                        <div className="font-weight-semibold">{text}</div>
                        <span className="text-muted">ID: {record.national_id}</span>
                    </div>
                </Flex>
            ),
        },
        {
            title: "Gender",
            dataIndex: "gender",
            key: "gender",
        },
        {
            title: "Age",
            key: "age",
            render: (_, record) => {
                const age = record.date_of_birth
                    ? dayjs().diff(dayjs(record.date_of_birth), "year")
                    : "N/A";
                return age;
            },
        },
        {
            title: "Ward",
            dataIndex: "ward",
            key: "ward",
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status) => (
                <Tag
                    color={
                        status === "Active"
                            ? "green"
                            : status === "Pending"
                                ? "gold"
                                : "red"
                    }
                >
                    {status}
                </Tag>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            align: "right",
            render: (_, record) => {
                const menu = (
                    <Menu>
                        <Menu.Item key="view">
                            <EyeOutlined />
                            <span className="ml-2">View Details</span>
                        </Menu.Item>
                        <Menu.Item key="edit">
                            <EditOutlined />
                            <span className="ml-2">Edit</span>
                        </Menu.Item>
                        <Menu.Divider />
                        <Menu.Item key="delete" onClick={() => deleteItem(record.id)}>
                            <DeleteOutlined />
                            <span className="ml-2">Delete</span>
                        </Menu.Item>
                    </Menu>
                );

                return (
                    <Dropdown overlay={menu} trigger={["click"]}>
                        <Button icon={<MoreOutlined />} />
                    </Dropdown>
                );
            },
        },
    ];

    const openRegisterform = () => {
        // showModal()
        navigate(`${APP_PREFIX_PATH}/apps/youth/register`)
    }

    return (
        <>
            <PageHeaderAlt className="border-bottom">
                <div className="container-fluid">
                    <Flex justifyContent="space-between" alignItems="center" className="py-4">
                        <h2>Youth Registry</h2>
                        <Button type="primary" onClick={openRegisterform}>
                            <PlusOutlined />
                            <span className="ml-1">Add New Youth</span>
                        </Button>
                    </Flex>
                </div>
            </PageHeaderAlt>
            <Card>
                <div className="container my-4">
                    <Table
                        columns={columns}
                        dataSource={list}
                        rowKey="id"
                        loading={loading}
                        pagination={{ pageSize: 50 }}
                    />

                </div>
            </Card>
        </>
    )
}

export default YouthList
