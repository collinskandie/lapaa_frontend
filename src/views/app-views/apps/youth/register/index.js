import React, { useState } from 'react'
import { Form, Input, Button, DatePicker, Select, Card, Steps, Upload, message, Row, Col } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import PageHeaderAlt from 'components/layout-components/PageHeaderAlt'
import Flex from 'components/shared-components/Flex'
import Api from 'services/Api' // 👈 make sure this points to your axios instance
import dayjs from 'dayjs'
import API from 'services/Api'

const { Step } = Steps
const { Option } = Select
const { TextArea } = Input

const YouthRegistration = () => {
    const [current, setCurrent] = useState(0)
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)

    const next = () => setCurrent(current + 1)
    const prev = () => setCurrent(current - 1)

    // Ward, location, sub-location, Village

    const onFinish = async (values) => {
        try {
            setLoading(true)

            // 🧩 Transform form data into the backend’s expected structure
            const payload = {
                full_name: values.fullName || '',
                date_of_birth: values.dob ? dayjs(values.dob).format('YYYY-MM-DD') : null,
                gender: values.gender || '',
                national_id: values.nationalId || '',
                phone: values.phone || '',
                email: values.email || null,
                county: values.county || '',
                sub_county: values.subCounty || '',
                ward: values.ward || '',
                village: values.village || 'N/A',
                location: values.location || 'N/A',
                sub_location: values.subLocation || 'N/A',
                // gps_lat: values.gps_lat ? parseFloat(values.gps_lat) : null,
                // gps_long: values.gps_long ? parseFloat(values.gps_long) : null,

                education: [
                    {
                        highest_level: values.educationLevel || '',
                        field_of_study: values.fieldOfStudy || '',
                        institution: values.institution || '',
                        year_completed: values.yearCompleted
                            ? parseInt(values.yearCompleted)
                            : null,
                    },
                ],

                skills: (values.skills || []).map(skill => ({
                    name: skill,
                    proficiency: 'Intermediate',
                    years_of_experience: values.experienceYears
                        ? parseInt(values.experienceYears)
                        : 0,
                })),

                employment_history: [
                    {
                        current_status: values.employmentStatus || '',
                        company_name: values.companyName || '',
                        role: values.pastRoles || '',
                        start_date: values.startDate || null,
                        end_date: values.endDate || null,
                        reference_name: values.referenceName || '',
                        reference_contact: values.referenceContact || '',
                    },
                ],

                interests: [
                    {
                        interest_area: 'General',
                        career_goal: values.careerGoals || '',
                    },
                ],
            }


            console.log('📦 Sending payload:', payload)

            // 🔥 POST to your backend
            const response = await API('/youths/', 'POST', payload)
            message.success('🎉 Youth registered successfully!')
            console.log('✅ API response:', response.data)

            form.resetFields()
            setCurrent(0)
        } catch (error) {
            console.error('❌ Error submitting youth data:', error)
            message.error('Failed to register youth. Please check your data.')
        } finally {
            setLoading(false)
        }
    }

    const steps = [
        {
            title: 'Personal Details',
            content: (
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="fullName" label="Full Name" rules={[{ required: true }]}>
                            <Input placeholder="Enter full name" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="dob" label="Date of Birth" rules={[{ required: true }]}>
                            <DatePicker style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
                            <Select placeholder="Select gender">
                                <Option value="Male">Male</Option>
                                <Option value="Female">Female</Option>
                                <Option value="Other">Other</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="nationalId" label="National ID" rules={[{ required: true }]}>
                            <Input placeholder="Enter national ID" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="phone" label="Phone Number" rules={[{ required: true }]}>
                            <Input placeholder="e.g. 0712345678" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="email" label="Email" rules={[{
                            type: 'email', message: 'The input is not valid E-mail!',
                        }]}>
                            <Input type="email" placeholder="Enter email" rules={[{ type: 'email', message: 'The input is not valid E-mail!' }]} />
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
                        <Form.Item name="county" label="County" rules={[{ required: true }]}>
                            <Input placeholder="Enter county" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="subCounty" label="Sub-County" rules={[{ required: true }]}>
                            <Input placeholder="Enter sub-county" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="ward" label="Ward" rules={[{ required: true }]}>
                            <Input placeholder="Enter ward" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="location" label="Location" rules={[{ required: true }]}>
                            <Input placeholder="e.g. -1.28333" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="subLocation" label="Sub-Location" rules={[{ required: true }]}>
                            <Input placeholder="e.g. -1.28333" />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item name="village" label="Village" rules={[{ required: true }]}>
                            <Input placeholder="Enter village" />
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
                        <Form.Item
                            name="educationLevel"
                            label="Highest Education Level"
                            rules={[{ required: true }]}
                        >
                            <Select placeholder="Select level">
                                <Option value="Pre-Primary">Pre-Primary</Option>
                                <Option value="Primary">Primary (KCPE)</Option>
                                <Option value="Secondary">Secondary (KCSE)</Option>
                                <Option value="Artisan">Artisan / Craft Certificate</Option>
                                <Option value="Certificate">Certificate (TVET / College)</Option>
                                <Option value="Diploma">Diploma</Option>
                                <Option value="Degree">Degree (Undergraduate)</Option>
                                <Option value="Postgraduate Diploma">Postgraduate Diploma</Option>
                                <Option value="Masters">Masters</Option>
                                <Option value="PhD">PhD / Doctorate</Option>
                            </Select>
                        </Form.Item>

                    </Col>
                    <Col span={12}>
                        <Form.Item name="fieldOfStudy" label="Field of Study" rules={[{ required: true }]}>
                            <Input placeholder="e.g. Computer Science" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="institution" label="Institution Attended" rules={[{ required: true }]}>
                            <Input placeholder="Enter institution name" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="yearCompleted"
                            label="Year Completed"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please enter the year of completion',
                                },
                                {
                                    pattern: /^(19|20)\d{2}$/,
                                    message: 'Enter a valid year (e.g. 2022)',
                                },
                            ]}
                        >
                            <Input placeholder="e.g. 2022" />
                        </Form.Item>

                    </Col>
                    <Col span={24}>
                        <Form.Item name="skills" label="Skills & Abilities">
                            <Select mode="tags" placeholder="Enter or select skills">
                                <Option value="Carpentry">Carpentry</Option>
                                <Option value="Plumbing">Plumbing</Option>
                                <Option value="Programming">Programming</Option>
                                <Option value="Driving">Driving</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="experienceYears"
                            label="Years of Experience"
                            rules={[
                                {
                                    pattern: /^\d*$/,
                                    message: 'Must be a valid number',
                                },
                                {
                                    validator: (_, value) =>
                                        value === undefined || value === '' || parseInt(value, 10) >= 0
                                            ? Promise.resolve()
                                            : Promise.reject(new Error('Years of experience cannot be negative')),
                                },
                            ]}
                        >
                            <Input placeholder="e.g. 2" />
                        </Form.Item>
                    </Col>
                </Row>
            ),
        },
        {
            title: 'Employment & Uploads',
            content: (
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="employmentStatus" label="Current Status" rules={[{ required: true }]}>
                            <Select placeholder="Select status">
                                <Option value="Employed">Employed</Option>
                                <Option value="Unemployed">Unemployed</Option>
                                <Option value="Self-employed">Self-employed</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="companyName" label="Company Name">
                            <Input placeholder="Enter company name (if employed)" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="pastRoles" label="Role / Position">
                            <Input placeholder="e.g. Developer, Sales Assistant" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="referenceName" label="Reference Name">
                            <Input placeholder="Enter reference name" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="referenceContact" label="Reference Contact">
                            <Input placeholder="Enter reference phone/email" />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item name="careerGoals" label="Interests & Career Goals">
                            <TextArea rows={3} placeholder="Describe your goals..." />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="documents" label="Upload Documents">
                            <Upload beforeUpload={() => false} multiple>
                                <Button icon={<UploadOutlined />}>Upload Certificates / CV</Button>
                            </Upload>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="profilePhoto" label="Profile Photo">
                            <Upload beforeUpload={() => false} listType="picture">
                                <Button icon={<UploadOutlined />}>Upload Photo</Button>
                            </Upload>
                        </Form.Item>
                    </Col>
                </Row>
            ),
        },
    ]

    return (
        <>
            <PageHeaderAlt className="border-bottom">
                <div className="container-fluid">
                    <Flex justifyContent="space-between" alignItems="center" className="py-4">
                        <h2>Youth Registration</h2>
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

                    <Form form={form} layout="vertical" onFinish={onFinish} autoComplete="off">
                        {steps.map((step, index) => (
                            <div key={index} style={{ display: index === current ? 'block' : 'none' }}>
                                {step.content}
                            </div>
                        ))}

                        <div className="mt-4">
                            {current > 0 && (
                                <Button style={{ marginRight: 8 }} onClick={prev}>
                                    Previous
                                </Button>
                            )}
                            {current < steps.length - 1 && (
                                <Button type="primary" onClick={next}>
                                    Next
                                </Button>
                            )}
                            {current === steps.length - 1 && (
                                <Button type="primary" htmlType="submit" loading={loading}>
                                    Submit
                                </Button>
                            )}
                        </div>
                    </Form>
                </div>
            </Card>
        </>
    )
}

export default YouthRegistration
