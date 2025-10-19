import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Tag, Select, Empty } from 'antd';
import RegiondataWidget from 'components/shared-components/RegiondataWidget';
import DonutChartWidget from 'components/shared-components/DonutChartWidget';
import ChartWidget from 'components/shared-components/ChartWidget';
import { COLORS } from 'constants/ChartConstant';
import { useSelector } from 'react-redux';
import API from 'services/Api';

const { Option } = Select;

export const YouthDashboard = () => {
  const [regionData, setRegionData] = useState([]);
  const [summary, setSummary] = useState({});
  const [genderData, setGenderData] = useState([]);
  const [employmentData, setEmploymentData] = useState([]);
  const { direction } = useSelector(state => state.theme);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await API('summaries/', 'GET', []);
        const data = res.data;

        // 🌍 Region data
        setRegionData(data.region_data || []);
        setSummary({
          top_region: data.top_region || 'N/A',
          top_region_count: data.top_region_count || 0,
        });

        // 🧍 Gender summary (fetch or compute via separate API if needed)
        const genderRes = await API('summaries/gender/', 'GET', []);
        setGenderData(genderRes.data || []);

        // 💼 Employment summary
        const empRes = await API('summaries/employment/', 'GET', []);
        setEmploymentData(empRes.data || []);
      } catch (err) {
        console.error('Dashboard data fetch error:', err);
      }
    };

    fetchSummary();
  }, []);

  return (
    <>
      {/* HEADER SUMMARY */}
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Top Registration County"
              value={summary.top_region}
              valueStyle={{ color: COLORS[0], fontWeight: 600 }}
            />
            <Tag color="blue" className="mt-2">
              {summary.top_region_count} Youths
            </Tag>
          </Card>
        </Col>

        <Col span={8}>
          <Card>
            <Statistic
              title="Total Registered Youths"
              value={regionData.reduce((acc, curr) => acc + curr.value, 0)}
              valueStyle={{ color: COLORS[1], fontWeight: 600 }}
            />
          </Card>
        </Col>

        <Col span={8}>
          <Card>
            <Statistic
              title="Regions Covered"
              value={regionData.length}
              valueStyle={{ color: COLORS[2], fontWeight: 600 }}
            />
          </Card>
        </Col>
      </Row>

      {/* REGION DISTRIBUTION */}
      <Row gutter={16} className="mt-4">
        <Col xs={24} sm={24} md={24} lg={16}>
          <RegiondataWidget
            title="Youth Registrations by County"
            data={regionData}
          />

        </Col>

        {/* GENDER DISTRIBUTION */}
        <Col xs={24} sm={24} md={24} lg={8}>
          <DonutChartWidget
            series={genderData.map(g => g.count)}
            labels={genderData.map(g => g.gender)}
            title="Gender Distribution"
            bodyClass="my-3"
            customOptions={{ colors: [COLORS[0], COLORS[1], COLORS[2]] }}
          />
        </Col>
      </Row>

      {/* EMPLOYMENT STATUS CHART */}
      <Row gutter={16} className="mt-4">
        <Col span={24}>
          {employmentData.length > 0 ? (
            <ChartWidget
              series={[
                {
                  name: 'Count',
                  data: employmentData.map(e => e.count),
                },
              ]}
              xAxis={employmentData.map(e => e.status)}
              title="Employment Status Distribution"
              height={400}
              type="bar"
              direction={direction}
              customOptions={{
                colors: [COLORS[3]],
                plotOptions: { bar: { horizontal: false, borderRadius: 4 } },
              }}
            />
          ) : (
            <Empty description="No employment data yet" />
          )}
        </Col>
      </Row>
    </>
  );
};

export default YouthDashboard;
