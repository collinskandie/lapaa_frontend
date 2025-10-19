import React, { useState } from 'react'
import { Table, Tag, Button, Tooltip, Avatar, Menu, Dropdown, Modal, Form, Input, Select, InputNumber } from 'antd'
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

// 🧠 Sample youth data
const initialData = [
    {
        id: 1,
        name: 'Brian Mwangi',
        nationalId: '34782345',
        gender: 'Male',
        age: 24,
        ward: 'Langas',
        status: 'Active'
    },
    {
        id: 2,
        name: 'Faith Njeri',
        nationalId: '39201764',
        gender: 'Female',
        age: 22,
        ward: 'Kapseret',
        status: 'Pending'
    },
    {
        id: 3,
        name: 'Kevin Kiptoo',
        nationalId: '37541230',
        gender: 'Male',
        age: 27,
        ward: 'Kimumu',
        status: 'Inactive'
    }
]

const CompanyList = () => {
    const [list, setList] = useState(initialData)
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [form] = Form.useForm()

    const navigate = useNavigate()

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
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <Flex alignItems="center">
                    <Avatar size={40} icon={<UserOutlined />} className="mr-2" />
                    <div>
                        <div className="font-weight-semibold">{text}</div>
                        <span className="text-muted">ID: {record.nationalId}</span>
                    </div>
                </Flex>
            ),
        },
        {
            title: 'Gender',
            dataIndex: 'gender',
            key: 'gender',
        },
        {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
        },
        {
            title: 'Ward',
            dataIndex: 'ward',
            key: 'ward',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: status => (
                <Tag
                    color={
                        status === 'Active' ? 'green' :
                            status === 'Pending' ? 'gold' :
                                'red'
                    }
                >
                    {status}
                </Tag>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            align: 'right',
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
                )

                return (
                    <Dropdown overlay={menu} trigger={['click']}>
                        <Button icon={<MoreOutlined />} />
                    </Dropdown>
                )
            },
        },
    ]
    const openRegisterform = () => {
        // showModal()
        navigate(`${APP_PREFIX_PATH}/apps/youth/register`)
    }

    return (
        <>
            <PageHeaderAlt className="border-bottom">
                <div className="container-fluid">
                    <Flex justifyContent="space-between" alignItems="center" className="py-4">
                        <h2>Company List</h2>
                        <Button type="primary" onClick={openRegisterform}>
                            <PlusOutlined />
                            <span className="ml-1">Add New Company</span>
                        </Button>
                    </Flex>
                </div>
            </PageHeaderAlt>

            <div className="container my-4">

                <p>No companies found, This feature is coming Soon</p>
            </div>


        </>
    )
}

export default CompanyList
