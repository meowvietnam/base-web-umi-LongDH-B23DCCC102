// TODO FIX DASHBOARD CHART K RENDER DC

import React, { useState, useEffect } from 'react';
import { 
  Card, Row, Col, Statistic, DatePicker, 
  Table, Typography, Space, Divider, Select
} from 'antd';
import { 
  BookOutlined, 
  FileTextOutlined, 
  UserOutlined, 
  SearchOutlined,
  FormOutlined
} from '@ant-design/icons';
import moment from 'moment';
import { ColumnChart, DonutChart } from '@/components/Chart';
import { 
  GraduationDecision, 
  Certificate, 
  CertificateRegister,
  TemplateField
} from '../types';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const Dashboard: React.FC = () => {
  // state
  const [registers, setRegisters] = useState<CertificateRegister[]>([]);
  const [decisions, setDecisions] = useState<GraduationDecision[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [templateFields, setTemplateFields] = useState<TemplateField[]>([]);
  
  // filter
  const [dateRange, setDateRange] = useState<[moment.Moment, moment.Moment]>([
    moment().startOf('year'),
    moment()
  ]);
  const [selectedRegister, setSelectedRegister] = useState<string | null>(null);
  
  // localStorage
  useEffect(() => {
    const storedRegisters = localStorage.getItem('certificateRegisters');
    const storedDecisions = localStorage.getItem('graduationDecisions');
    const storedCertificates = localStorage.getItem('certificates');
    const storedTemplateFields = localStorage.getItem('templateFields');
    
    if (storedRegisters) {
      setRegisters(JSON.parse(storedRegisters));
    }
    
    if (storedDecisions) {
      setDecisions(JSON.parse(storedDecisions));
    }
    
    if (storedCertificates) {
      setCertificates(JSON.parse(storedCertificates));
    }
    
    if (storedTemplateFields) {
      setTemplateFields(JSON.parse(storedTemplateFields));
    }
  }, []);
  
  // filter ngay, reg
  const filteredCertificates = React.useMemo(() => {
    return certificates.filter(certificate => {
      const creationDate = moment(certificate.createdAt);
      const isInDateRange = creationDate.isBetween(dateRange[0], dateRange[1], undefined, '[]');
      
      if (!isInDateRange) return false;
      
      if (selectedRegister) {
        const decision = decisions.find(d => d.id === certificate.decisionId);
        return decision?.registerId === selectedRegister;
      }
      
      return true;
    });
  }, [certificates, decisions, dateRange, selectedRegister]);
  
  // thong so
  const stats = React.useMemo(() => {
    const totalRegisters = registers.length;
    const totalDecisions = decisions.length;
    const totalCertificates = filteredCertificates.length;
    
    // tong cong.
    const totalLookups = decisions.reduce((sum, decision) => sum + (decision.lookupCount || 0), 0);
    
    return {
      totalRegisters,
      totalDecisions,
      totalCertificates,
      totalLookups
    };
  }, [registers, decisions, filteredCertificates]);
  
  // chart theo quyet dinh
  const certificatesByDecision = React.useMemo(() => {
    const decisionCounts: Record<string, number> = {};
    
    decisions.forEach(decision => {
      decisionCounts[decision.decisionNumber] = 0;
    });
    
    filteredCertificates.forEach(certificate => {
      const decision = decisions.find(d => d.id === certificate.decisionId);
      if (decision) {
        decisionCounts[decision.decisionNumber] = (decisionCounts[decision.decisionNumber] || 0) + 1;
      }
    });
    
    // chuyen thanh array cho chart doc
    const labels: string[] = [];
    const values: number[] = [];
    
    Object.entries(decisionCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .forEach(([key, value]) => {
        labels.push(key);
        values.push(value);
      });
    
    return {
      xAxis: labels,
      yAxis: [values],
      yLabel: ['Số lượng văn bằng']
    };
  }, [filteredCertificates, decisions]);
  
  // chart theo thang
  const certificatesByMonth = React.useMemo(() => {
    const monthlyCounts: Record<string, number> = {};
    
    // thang trong range filter
    const startMonth = dateRange[0].clone().startOf('month');
    const endMonth = dateRange[1].clone().startOf('month');
    let currentMonth = startMonth.clone();
    
    while (currentMonth.isSameOrBefore(endMonth)) {
      monthlyCounts[currentMonth.format('YYYY-MM')] = 0;
      currentMonth.add(1, 'month');
    }
    
    // chung chi theo thang
    filteredCertificates.forEach(certificate => {
      const month = moment(certificate.createdAt).format('YYYY-MM');
      if (monthlyCounts[month] !== undefined) {
        monthlyCounts[month]++;
      }
    });
    
    // array theo chart
    const labels = Object.keys(monthlyCounts).map(month => moment(month).format('MM/YYYY'));
    const values = Object.values(monthlyCounts);
    
    return {
      xAxis: labels,
      yAxis: [values],
      yLabel: ['Số lượng văn bằng'],
      type: 'line'
    };
  }, [filteredCertificates, dateRange]);
  
  // lookup data cho chart
  const lookupsByDecision = React.useMemo(() => {
    const lookupCounts: {label: string, value: number}[] = decisions
      .filter(decision => decision.lookupCount && decision.lookupCount > 0)
      .map(decision => ({
        label: decision.decisionNumber,
        value: decision.lookupCount || 0
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
    
    return {
      xAxis: lookupCounts.map(item => item.label),
      yAxis: [lookupCounts.map(item => item.value)],
      yLabel: ['Lượt tra cứu']
    };
  }, [decisions]);
  
  // cert cho bang
  const columns = [
    {
      title: 'Số hiệu văn bằng',
      dataIndex: 'certificateNumber',
      key: 'certificateNumber',
    },
    {
      title: 'Họ và tên',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Mã sinh viên',
      dataIndex: 'studentId',
      key: 'studentId',
    },
    {
      title: 'Quyết định',
      key: 'decision',
      render: (_, record: Certificate) => {
        const decision = decisions.find(d => d.id === record.decisionId);
        return decision ? decision.decisionNumber : 'N/A';
      }
    },
    {
      title: 'Ngày cấp',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => moment(date).format('DD/MM/YYYY')
    }
  ];
  
  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>Tổng quan</Title>
      
      {/* Filters */}
      <Card style={{ marginBottom: 20 }}>
        <Space size="large">
          <div>
            <Text strong>Khoảng thời gian:</Text>
            <br />
            <RangePicker
              value={dateRange}
              onChange={(dates) => dates && setDateRange([dates[0], dates[1]])}
              format="DD/MM/YYYY"
              allowClear={false}
              style={{ marginTop: 8, marginBottom: 8 }}
            />
          </div>
          
          <div>
            <Text strong>Sổ văn bằng:</Text>
            <br />
            <Select
              placeholder="Tất cả sổ văn bằng"
              style={{ width: 200, marginTop: 8 }}
              allowClear
              onChange={value => setSelectedRegister(value)}
              value={selectedRegister}
            >
              {registers.map(register => (
                <Option key={register.id} value={register.id}>
                  {register.name} ({register.year})
                </Option>
              ))}
            </Select>
          </div>
        </Space>
      </Card>
      
      {/* Statistics */}
      <Row gutter={16}>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ marginBottom: 16 }}>
            <Statistic 
              title="Tổng số sổ văn bằng" 
              value={stats.totalRegisters} 
              prefix={<BookOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ marginBottom: 16 }}>
            <Statistic 
              title="Tổng số quyết định" 
              value={stats.totalDecisions} 
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ marginBottom: 16 }}>
            <Statistic 
              title="Tổng số văn bằng" 
              value={stats.totalCertificates} 
              prefix={<FormOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ marginBottom: 16 }}>
            <Statistic 
              title="Lượt tra cứu" 
              value={stats.totalLookups} 
              prefix={<SearchOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>
      
      {/* Charts */}
      <Row gutter={16}>
        <Col xs={24} lg={12}>
          <Card title="Số lượng văn bằng theo quyết định" style={{ marginBottom: 16 }}>
            <ColumnChart 
              xAxis={certificatesByDecision.xAxis} 
              yAxis={certificatesByDecision.yAxis} 
              yLabel={certificatesByDecision.yLabel} 
              height={300} 
              colors={['#1890ff']}
              formatY={(val) => val.toString()}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Lượt tra cứu theo quyết định" style={{ marginBottom: 16 }}>
            <DonutChart 
              xAxis={lookupsByDecision.xAxis} 
              yAxis={lookupsByDecision.yAxis} 
              yLabel={lookupsByDecision.yLabel} 
              height={300} 
              formatY={(val) => val.toString()}
              showTotal={true}
            />
          </Card>
        </Col>
      </Row>
      
      {/* Certificates by month chart */}
      <Card title="Số lượng văn bằng theo tháng" style={{ marginBottom: 16 }}>
        <ColumnChart 
          xAxis={certificatesByMonth.xAxis} 
          yAxis={certificatesByMonth.yAxis} 
          yLabel={certificatesByMonth.yLabel} 
          height={300} 
          type={certificatesByMonth.type}
          colors={['#52c41a']}
          formatY={(val) => val.toString()}
        />
      </Card>
      
      {/* Recent certificates */}
      <Card title="Văn bằng mới cấp" style={{ marginBottom: 16 }}>
        <Table 
          dataSource={filteredCertificates.slice(0, 10)} 
          columns={columns} 
          rowKey="id"
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default Dashboard;