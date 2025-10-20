import React, { useState, useEffect } from 'react'
import {
    Table, Tag, Button, Card, Tooltip, Avatar, Menu, Dropdown, Modal,
    Form, Input, Select, InputNumber
} from 'antd'
import {
    EyeOutlined, EditOutlined, DeleteOutlined, PlusOutlined,
    UserOutlined, MoreOutlined
} from '@ant-design/icons'
import PageHeaderAlt from 'components/layout-components/PageHeaderAlt'
import Flex from 'components/shared-components/Flex'
import { useNavigate } from 'react-router-dom'
import { APP_PREFIX_PATH } from 'configs/AppConfig'
import dayjs from "dayjs"
import API from "services/Api"

const { Search } = Input

const YouthList = () => {
    const [list, setList] = useState([])
    const [filteredList, setFilteredList] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchText, setSearchText] = useState('')
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [form] = Form.useForm()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchYouths = async () => {
            try {
                setLoading(true)
                const response = await API('/youths/', 'GET', [])
                const results = response.data?.results || []
                setList(results)
                setFilteredList(results)
            } catch (error) {
                console.error('Error fetching youths:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchYouths()
    }, [])

    const handleSearch = (value) => {
        setSearchText(value)
        const filtered = list.filter((item) =>
            item.full_name?.toLowerCase().includes(value.toLowerCase()) ||
            item.national_id?.toString().includes(value) ||
            item.ward?.toLowerCase().includes(value.toLowerCase()) ||
            item.gender?.toLowerCase().includes(value.toLowerCase())
        )
        setFilteredList(filtered)
    }

    const deleteItem = (id) => {
        const updated = list.filter(elm => elm.id !== id)
        Modal.confirm({
            title: 'Delete Youth',
            content: 'Are you sure you want to delete this youth record?',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: () => confirmDelete(id, updated),
        })
    }

    const confirmDelete = (id, updated) => {
        API(`/youths/${id}/`, 'DELETE', [])
            .then(() => {
                setList(updated)
                setFilteredList(updated)
            })
            .catch(error => {
                console.error('Error deleting youth:', error)
                Modal.error({
                    title: 'Error',
                    content: 'Failed to delete the youth record. Please try again.',
                })
            })
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
                    : "N/A"
                return age
            },
        },
        {
            title: "Ward",
            dataIndex: "ward",
            key: "ward",
        },
        {
            title: "Actions",
            key: "actions",
            align: "right",
            render: (_, record) => {
                const menu = (
                    <Menu>
                        <Menu.Item key="view" onClick={() => navigate(`${APP_PREFIX_PATH}/apps/youth/view/${record.id}`)}>
                            <EyeOutlined />
                            <span className="ml-2">View Details</span>
                        </Menu.Item>
                        {/* <Menu.Item key="edit" onClick={() => navigate(`${APP_PREFIX_PATH}/apps/youth/edit/${record.id}`)}>
                            <EditOutlined />
                            <span className="ml-2">Edit</span>
                        </Menu.Item> */}
                        <Menu.Divider />
                        <Menu.Item key="delete" onClick={() => deleteItem(record.id)}>
                            <DeleteOutlined />
                            <span className="ml-2">Delete</span>
                        </Menu.Item>
                    </Menu>
                )

                return (
                    <Dropdown overlay={menu} trigger={["click"]}>
                        <Button icon={<MoreOutlined />} />
                    </Dropdown>
                )
            },
        },
    ]

    const openRegisterform = () => navigate(`${APP_PREFIX_PATH}/apps/youth/register`)

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
                    <Flex justifyContent="space-between" alignItems="center" className="mb-3">
                        <Search
                            placeholder="Search by name, ID, ward, or gender"
                            allowClear
                            onSearch={handleSearch}
                            onChange={(e) => handleSearch(e.target.value)}
                            style={{ maxWidth: 300 }}
                            value={searchText}
                        />
                    </Flex>

                    <Table
                        columns={columns}
                        dataSource={filteredList}
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
