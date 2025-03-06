import { useState, useEffect } from 'react';
import { Button, Card, Form, Input, InputNumber, Table, Typography, Modal, Select } from 'antd';

const { Title } = Typography;
const { Option } = Select;
const { Search } = Input;

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
    const [searchKeyword, setSearchKeyword] = useState('');
    const [searchSubject, setSearchSubject] = useState('');
    const [searchDifficulty, setSearchDifficulty] = useState('');
    const [searchKnowledgeBlock, setSearchKnowledgeBlock] = useState('');

    useEffect(() => {
        const storedSubjects = localStorage.getItem('hocPhan');
        const storedQuestions = localStorage.getItem('cauHoi');
        const storedExamStructures = localStorage.getItem('examStructures');
        if (storedSubjects) setSubjects(JSON.parse(storedSubjects));
        if (storedQuestions) setQuestions(JSON.parse(storedQuestions));
        if (storedExamStructures) setExamStructures(JSON.parse(storedExamStructures));
    }, []);

    useEffect(() => {
        localStorage.setItem('hocPhan', JSON.stringify(subjects));
    }, [subjects]);

    useEffect(() => {
        localStorage.setItem('cauHoi', JSON.stringify(questions));
    }, [questions]);

    useEffect(() => {
        localStorage.setItem('examStructures', JSON.stringify(examStructures));
    }, [examStructures]);

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

    const handleSearch = () => {
        let filtered = questions;
        if (searchKeyword) {
            filtered = filtered.filter(question =>
                question.content.toLowerCase().includes(searchKeyword.toLowerCase())
            );
        }
        if (searchSubject) {
            filtered = filtered.filter(question => question.subject === searchSubject);
        }
        if (searchDifficulty) {
            filtered = filtered.filter(question => question.difficulty === searchDifficulty);
        }
        if (searchKnowledgeBlock) {
            filtered = filtered.filter(question => question.knowledgeBlock === searchKnowledgeBlock);
        }
        setFilteredQuestions(filtered);
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

    return (
        <div style={{ padding: 20, background: '#f0f2f5', minHeight: '100vh' }}>
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
                <div>
                    <Search
                        placeholder="Tìm kiếm câu hỏi theo nội dung"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        onSearch={handleSearch}
                        style={{ marginBottom: 20, width:'400px', marginRight: 10}}
                    />
                    <Select
                        placeholder="Chọn môn học"
                        value={searchSubject}
                        onChange={(value) => setSearchSubject(value)}
                        style={{ width: 200, marginBottom: 20, marginRight: 10 }}
                    >
                        {subjects.map((subject) => (
                            <Option key={subject.key} value={subject.name}>
                                {subject.name}
                            </Option>
                        ))}
                    </Select>
                    <Select
                        placeholder="Chọn mức độ khó"
                        value={searchDifficulty}
                        onChange={(value) => setSearchDifficulty(value)}
                        style={{ width: 200, marginBottom: 20, marginRight: 10 }}
                    >
                        <Option value="Dễ">Dễ</Option>
                        <Option value="Trung bình">Trung bình</Option>
                        <Option value="Khó">Khó</Option>
                        <Option value="Rất khó">Rất khó</Option>
                    </Select>
                    <Input
                        placeholder="Khối kiến thức"
                        value={searchKnowledgeBlock}
                        onChange={(e) => setSearchKnowledgeBlock(e.target.value)}
                        style={{ width: 200, marginBottom: 20, marginRight: 10 }}
                    />
                    <Button type="primary" onClick={handleSearch} style={{ marginBottom: 20 }}>
                        Tìm kiếm
                    </Button>
                </div>
                <Table dataSource={filteredQuestions.length > 0 ? filteredQuestions : questions} columns={questionColumns} pagination={false} />
            </Card>

            <Card title="Danh sách cấu trúc đề thi" style={{ marginBottom: 20 }}>
                <Table dataSource={examStructures} columns={examStructureColumns} pagination={false} />
            </Card>
        </div>
    );
}