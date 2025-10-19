import React, { useState } from 'react'
import PageHeaderAlt from 'components/layout-components/PageHeaderAlt'
import { Button, Row, Col, Tooltip, Tag, Avatar, Menu, Card } from 'antd'
import {
	EyeOutlined,
	EditOutlined,
	DeleteOutlined,
	PlusOutlined,
	UserOutlined
} from '@ant-design/icons'
import Flex from 'components/shared-components/Flex'
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown'

// 🧠 Sample youth data (replace with API or DB data)
const youthData = [
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

const ItemAction = ({ id, removeId }) => (
	<EllipsisDropdown
		menu={
			<Menu>
				<Menu.Item key="0">
					<EyeOutlined />
					<span className="ml-2">View Details</span>
				</Menu.Item>
				<Menu.Item key="1">
					<EditOutlined />
					<span className="ml-2">Edit</span>
				</Menu.Item>
				<Menu.Divider />
				<Menu.Item key="2" onClick={() => removeId(id)}>
					<DeleteOutlined />
					<span className="ml-2">Delete</span>
				</Menu.Item>
			</Menu>
		}
	/>
)

const YouthListItem = ({ data, removeId }) => (
	<Card className="mb-3">
		<Row align="middle">
			<Col xs={24} sm={24} md={6}>
				<Flex alignItems="center">
					<Avatar size={40} icon={<UserOutlined />} className="mr-2" />
					<div>
						<h4 className="mb-0">{data.name}</h4>
						<span className="text-muted">ID: {data.nationalId}</span>
					</div>
				</Flex>
			</Col>

			<Col xs={24} sm={24} md={4}>
				<span className="text-muted">Gender:</span>
				<div className="font-weight-semibold">{data.gender}</div>
			</Col>

			<Col xs={24} sm={24} md={3}>
				<span className="text-muted">Age:</span>
				<div className="font-weight-semibold">{data.age}</div>
			</Col>

			<Col xs={24} sm={24} md={5}>
				<span className="text-muted">Ward:</span>
				<div className="font-weight-semibold">{data.ward}</div>
			</Col>

			<Col xs={24} sm={24} md={4}>
				<Tag color={
					data.status === 'Active' ? 'green' :
						data.status === 'Pending' ? 'gold' :
							'red'
				}>
					{data.status}
				</Tag>
			</Col>

			<Col xs={24} sm={24} md={2}>
				<div className="text-right">
					<ItemAction id={data.id} removeId={removeId} />
				</div>
			</Col>
		</Row>
	</Card>
)

const YouthList = () => {
	const [list, setList] = useState(youthData)

	const deleteItem = (id) => {
		setList(list.filter(elm => elm.id !== id))
	}

	return (
		<>
			<PageHeaderAlt className="border-bottom">
				<div className="container-fluid">
					<Flex justifyContent="space-between" alignItems="center" className="py-4">
						<h2>Youth Registry</h2>
						<Button type="primary">
							<PlusOutlined />
							<span className="ml-1">Add New Youth</span>
						</Button>
					</Flex>
				</div>
			</PageHeaderAlt>

			<div className="container my-4">
				{list.length > 0 ? (
					list.map(elm => (
						<YouthListItem key={elm.id} data={elm} removeId={deleteItem} />
					))
				) : (
					<Card>
						<p className="text-center text-muted mb-0">No youth records found.</p>
					</Card>
				)}
			</div>
		</>
	)
}

export default YouthList
