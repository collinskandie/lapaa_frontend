import React, { useState, useEffect } from 'react'
import {
    Form,
    Input,
    Button,
    DatePicker,
    Select,
    Card,
    Steps,
    Row,
    Col,
    Spin,
    message
} from 'antd'
import { useParams, useNavigate } from 'react-router-dom'
import PageHeaderAlt from 'components/layout-components/PageHeaderAlt'
import Flex from 'components/shared-components/Flex'
import dayjs from 'dayjs'
import API from 'services/Api'

const { Step } = Steps
const { Option } = Select
const { TextArea } = Input

const YouthDetailsView = () => {
    const [current, setCurrent] = useState(0)
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(true)
    const [youth, setYouth] = useState(null)
    const { id } = useParams()
    const navigate = useNavigate()

    // Fetch youth details
    useEffect(() => {
        const fetchYouth = async () => {
            try {
                setLoading(true)
                const response = await API(`/youths/${id}/`, 'GET')
                const data = response.data
                setYouth(data)

                // Populate the form with backend data
                form.setFieldsValue({
                    fullName: data.full_name,
                    dob: data.date_of_birth ? dayjs(data.date_of_birth) : null,
                    gender: data.gender,
                    nationalId: data.national_id,
                    phone: data.phone,
                    email: data.email,
                    county: data.county,
                    subCounty: data.sub_county,
                    ward: data.ward,
                    village: data.village,
                    location: data.location,
                    subLocation: data.sub_location,
                    educationLevel: data.education?.[0]?.highest_level,
                    fieldOfStudy: data.education?.[0]?.field_of_study,
                    institution: data.education?.[0]?.institution,
                    yearCompleted: data.education?.[0]?.year_completed,
                    skills: data.skills?.map(skill => skill.name),
                    experienceYears: data.skills?.[0]?.years_of_experience,
                    employmentStatus: data.employment_history?.[0]?.current_status,
                    companyName: data.employment_history?.[0]?.company_name,
                    pastRoles: data.employment_history?.[0]?.role,
                    referenceName: data.employment_history?.[0]?.reference_name,
                    referenceContact: data.employment_history?.[0]?.reference_contact,
                    careerGoals: data.interests?.[0]?.career_goal,
                })
            } catch (error) {
                console.error('❌ Error fetching youth details:', error)
                message.error('Failed to load youth details.')
            } finally {
                setLoading(false)
            }
        }

        fetchYouth()
    }, [id, form])

    const steps = [
        {
            title: 'Personal Details',
            content: (
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="fullName" label="Full Name">
                            <Input disabled />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="dob" label="Date of Birth">
                            <DatePicker style={{ width: '100%' }} disabled />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="gender" label="Gender">
                            <Input disabled />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="nationalId" label="National ID">
                            <Input disabled />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="phone" label="Phone Number">
                            <Input disabled />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="email" label="Email">
                            <Input disabled />
                        </Form.Item>
                    </Col>
                </Row>
            ),
        },
        {
            title: 'Location',
            content: (
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="county" label="County">
                            <Input disabled />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="subCounty" label="Sub-County">
                            <Input disabled />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="ward" label="Ward">
                            <Input disabled />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="location" label="Location">
                            <Input disabled />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="subLocation" label="Sub-Location">
                            <Input disabled />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="village" label="Village">
                            <Input disabled />
                        </Form.Item>
                    </Col>
                </Row>
            ),
        },
        {
            title: 'Education & Skills',
            content: (
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="educationLevel" label="Highest Education Level">
                            <Input disabled />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="fieldOfStudy" label="Field of Study">
                            <Input disabled />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="institution" label="Institution">
                            <Input disabled />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="yearCompleted" label="Year Completed">
                            <Input disabled />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="skills" label="Skills">
                            <Select mode="tags" disabled />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="experienceYears" label="Years of Experience">
                            <Input disabled />
                        </Form.Item>
                    </Col>
                </Row>
            ),
        },
        {
            title: 'Employment & Goals',
            content: (
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="employmentStatus" label="Current Status">
                            <Input disabled />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="companyName" label="Company Name">
                            <Input disabled />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="pastRoles" label="Role / Position">
                            <Input disabled />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="referenceName" label="Reference Name">
                            <Input disabled />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="referenceContact" label="Reference Contact">
                            <Input disabled />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item name="careerGoals" label="Career Goals">
                            <TextArea rows={3} disabled />
                        </Form.Item>
                    </Col>
                </Row>
            ),
        },
    ]

    if (loading) {
        return (
            <div className="text-center my-5">
                <Spin size="large" tip="Loading youth details..." />
            </div>
        )
    }

    return (
        <>
            <PageHeaderAlt className="border-bottom">
                <div className="container-fluid">
                    <Flex justifyContent="space-between" alignItems="center" className="py-4">
                        <h2>Youth Details</h2>
                        <Button onClick={() => navigate(-1)}>Back</Button>
                    </Flex>
                </div>
            </PageHeaderAlt>

            <Card>
                <div className="container my-5">
                    <Steps current={current} className="mb-4">
                        {steps.map((item, index) => (
                            <Step key={index} title={item.title} />
                        ))}
                    </Steps>

                    <Form form={form} layout="vertical">
                        {steps.map((step, index) => (
                            <div key={index} style={{ display: index === current ? 'block' : 'none' }}>
                                {step.content}
                            </div>
                        ))}

                        <div className="mt-4">
                            {current > 0 && (
                                <Button style={{ marginRight: 8 }} onClick={() => setCurrent(current - 1)}>
                                    Previous
                                </Button>
                            )}
                            {current < steps.length - 1 && (
                                <Button type="primary" onClick={() => setCurrent(current + 1)}>
                                    Next
                                </Button>
                            )}
                        </div>
                    </Form>
                </div>
            </Card>
        </>
    )
}

export default YouthDetailsView
