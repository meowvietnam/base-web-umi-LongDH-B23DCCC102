import { useState } from 'react';
import { Button, Card, Form, Input, InputNumber, Table, Typography, Modal, Select } from 'antd';

const { Title } = Typography;
const { Option } = Select;

interface Subject {
    key: string;
    code: string;
    name: string;
    credits: number;
}

interface Question {
    key: string;
    code: string;
    subject: string;
    content: string;
    difficulty: string;
    knowledgeBlock: string;
}

interface ExamStructure {
    key: string;
    subject: string;
    easy: number;
    medium: number;
    hard: number;
    veryHard: number;
}

export default function ManagementPage() {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
    const [examStructures, setExamStructures] = useState<ExamStructure[]>([]);
    const [subjectForm] = Form.useForm();
    const [questionForm] = Form.useForm();
    const [examStructureForm] = Form.useForm();
    const [searchForm] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState({
        subject: false,
        question: false,
        examStructure: false,
    });

    const addSubject = (values: Omit<Subject, 'key'>) => {
        const newSubject: Subject = {
            key: `${subjects.length + 1}`,
            ...values,
        };
        setSubjects([...subjects, newSubject]);
        subjectForm.resetFields();
        setIsModalVisible({ ...isModalVisible, subject: false });
    };

    const addQuestion = (values: Omit<Question, 'key'>) => {
        const newQuestion: Question = {
            key: `${questions.length + 1}`,
            ...values,
        };
        setQuestions([...questions, newQuestion]);
        setFilteredQuestions([...questions, newQuestion]);
        questionForm.resetFields();
        setIsModalVisible({ ...isModalVisible, question: false });
    };

    const addExamStructure = (values: Omit<ExamStructure, 'key'>) => {
        const newExamStructure: ExamStructure = {
            key: `${examStructures.length + 1}`,
            ...values,
        };
        setExamStructures([...examStructures, newExamStructure]);
        examStructureForm.resetFields();
        setIsModalVisible({ ...isModalVisible, examStructure: false });
    };

    const subjectColumns = [
        {
            title: 'Mã môn',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: 'Tên môn',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Số tín chỉ',
            dataIndex: 'credits',
            key: 'credits',
        },
    ];

    const questionColumns = [
        {
            title: 'Mã câu hỏi',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: 'Môn học',
            dataIndex: 'subject',
            key: 'subject',
        },
        {
            title: 'Nội dung câu hỏi',
            dataIndex: 'content',
            key: 'content',
        },
        {
            title: 'Mức độ khó',
            dataIndex: 'difficulty',
            key: 'difficulty',
        },
        {
            title: 'Khối kiến thức',
            dataIndex: 'knowledgeBlock',
            key: 'knowledgeBlock',
        },
    ];

    const examStructureColumns = [
        {
            title: 'Môn học',
            dataIndex: 'subject',
            key: 'subject',
        },
        {
            title: 'Dễ',
            dataIndex: 'easy',
            key: 'easy',
        },
        {
            title: 'Trung bình',
            dataIndex: 'medium',
            key: 'medium',
        },
        {
            title: 'Khó',
            dataIndex: 'hard',
            key: 'hard',
        },
        {
            title: 'Rất khó',
            dataIndex: 'veryHard',
            key: 'veryHard',
        },
    ];

    const handleSearch = (values: any) => {
        const filtered = questions.filter((question) => {
            return (
                (!values.subject || values.subject === 'All' || question.subject === values.subject) &&
                (!values.difficulty || values.difficulty === 'All' || question.difficulty === values.difficulty) &&
                (!values.knowledgeBlock || values.knowledgeBlock === 'All' || question.knowledgeBlock.includes(values.knowledgeBlock))
            );
        });
        setFilteredQuestions(filtered);
    };

    return (
        <div style={{ padding: 20, textAlign: 'center', background: '#f0f2f5', minHeight: '100vh' }}>
            <Title level={2}  >
                Ngân Hàng Câu Hỏi
            </Title>
            <div style={{ gap: 10, marginBottom: 20 }}>
                <Button type="primary" onClick={() => setIsModalVisible({ ...isModalVisible, subject: true })}>
                    Thêm môn học
                </Button>
                <Button type="primary" onClick={() => setIsModalVisible({ ...isModalVisible, question: true })} style={{ margin: '0 10px' }}>
                    Thêm câu hỏi
                </Button>
                <Button type="primary" onClick={() => setIsModalVisible({ ...isModalVisible, examStructure: true })}>
                    Thêm cấu trúc đề thi
                </Button>
            </div>

            <Card title="Tìm kiếm câu hỏi" style={{ marginBottom: 20 }}>
                <Form form={searchForm} layout="inline" onFinish={handleSearch}>
                    <Form.Item label="Môn học" name="subject">
                        <Select style={{ width: 200 }}>
                            <Option value="All">All</Option>
                            {subjects.map((subject) => (
                                <Option key={subject.key} value={subject.name}>
                                    {subject.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label="Mức độ khó" name="difficulty">
                        <Select style={{ width: 200 }}>
                            <Option value="All">All</Option>
                            <Option value="Dễ">Dễ</Option>
                            <Option value="Trung bình">Trung bình</Option>
                            <Option value="Khó">Khó</Option>
                            <Option value="Rất khó">Rất khó</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Khối kiến thức" name="knowledgeBlock">
                        <Select style={{ width: 200 }}>
                            <Option value="All">All</Option>
                            {questions.map((question) => (
                                <Option key={question.key} value={question.knowledgeBlock}>
                                    {question.knowledgeBlock}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Tìm kiếm
                        </Button>
                    </Form.Item>
                </Form>
            </Card>

            <Modal
                title="Thêm môn học"
                visible={isModalVisible.subject}
                onCancel={() => setIsModalVisible({ ...isModalVisible, subject: false })}
                footer={null}
            >
                <Form form={subjectForm} layout="vertical" onFinish={addSubject}>
                    <Form.Item
                        label="Mã môn"
                        name="code"
                        rules={[{ required: true, message: 'Vui lòng nhập mã môn!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Tên môn"
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng nhập tên môn!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Số tín chỉ"
                        name="credits"
                        rules={[{ required: true, message: 'Vui lòng nhập số tín chỉ!' }]}
                    >
                        <InputNumber min={1} max={10} style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Thêm môn học
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Thêm câu hỏi"
                visible={isModalVisible.question}
                onCancel={() => setIsModalVisible({ ...isModalVisible, question: false })}
                footer={null}
            >
                <Form form={questionForm} layout="vertical" onFinish={addQuestion}>
                    <Form.Item
                        label="Mã câu hỏi"
                        name="code"
                        rules={[{ required: true, message: 'Vui lòng nhập mã câu hỏi!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Môn học"
                        name="subject"
                        rules={[{ required: true, message: 'Vui lòng chọn môn học!' }]}
                    >
                        <Select>
                            {subjects.map((subject) => (
                                <Option key={subject.key} value={subject.name}>
                                    {subject.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Nội dung câu hỏi"
                        name="content"
                        rules={[{ required: true, message: 'Vui lòng nhập nội dung câu hỏi!' }]}
                    >
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item
                        label="Mức độ khó"
                        name="difficulty"
                        rules={[{ required: true, message: 'Vui lòng chọn mức độ khó!' }]}
                    >
                        <Select>
                            <Option value="Dễ">Dễ</Option>
                            <Option value="Trung bình">Trung bình</Option>
                            <Option value="Khó">Khó</Option>
                            <Option value="Rất khó">Rất khó</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Khối kiến thức"
                        name="knowledgeBlock"
                        rules={[{ required: true, message: 'Vui lòng nhập khối kiến thức!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Thêm câu hỏi
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Thêm cấu trúc đề thi"
                visible={isModalVisible.examStructure}
                onCancel={() => setIsModalVisible({ ...isModalVisible, examStructure: false })}
                footer={null}
            >
                <Form form={examStructureForm} layout="vertical" onFinish={addExamStructure}>
                    <Form.Item
                        label="Môn học"
                        name="subject"
                        rules={[{ required: true, message: 'Vui lòng chọn môn học!' }]}
                    >
                        <Select>
                            {subjects.map((subject) => (
                                <Option key={subject.key} value={subject.name}>
                                    {subject.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Số câu hỏi dễ"
                        name="easy"
                        rules={[{ required: true, message: 'Vui lòng nhập số câu hỏi dễ!' }]}
                    >
                        <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                        label="Số câu hỏi trung bình"
                        name="medium"
                        rules={[{ required: true, message: 'Vui lòng nhập số câu hỏi trung bình!' }]}
                    >
                        <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                        label="Số câu hỏi khó"
                        name="hard"
                        rules={[{ required: true, message: 'Vui lòng nhập số câu hỏi khó!' }]}
                    >
                        <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                        label="Số câu hỏi rất khó"
                        name="veryHard"
                        rules={[{ required: true, message: 'Vui lòng nhập số câu hỏi rất khó!' }]}
                    >
                        <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Thêm cấu trúc đề thi
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            <Card title="Danh sách môn học" style={{ marginBottom: 20 }}>
                <Table dataSource={subjects} columns={subjectColumns} pagination={false} />
            </Card>

            <Card title="Danh sách câu hỏi" style={{ marginBottom: 20 }}>
                <Table dataSource={filteredQuestions.length > 0 ? filteredQuestions : questions} columns={questionColumns} pagination={false} />
            </Card>

            <Card title="Danh sách cấu trúc đề thi" style={{ marginBottom: 20 }}>
                <Table dataSource={examStructures} columns={examStructureColumns} pagination={false} />
            </Card>
        </div>
    );
}