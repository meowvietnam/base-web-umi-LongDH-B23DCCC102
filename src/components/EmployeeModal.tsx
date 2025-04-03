import React from "react";
import { Modal, Form, Input, Select } from "antd";
import { EmployeeStatus } from "@/models/nhanvien/employee";

const { Option } = Select;

interface EmployeeModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (values: any) => void;
  form: any;
  positions: string[];
  departments: string[];
}

const EmployeeModal: React.FC<EmployeeModalProps> = ({
  visible,
  onClose,
  onSave,
  form,
  positions,
  departments,
}) => {
  return (
    <Modal
      title={form.getFieldValue("id") ? "Chỉnh sửa nhân viên" : "Thêm nhân viên"}
      visible={visible}
      onOk={() => form.submit()}
      onCancel={onClose}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onSave}
      >
        <Form.Item
          name="name"
          label="Họ tên"
          rules={[{ required: true, message: "Nhập họ tên!" }]}
        >
          <Input placeholder="Nhập họ tên" />
        </Form.Item>
        <Form.Item
          name="position"
          label="Chức vụ"
          rules={[{ required: true, message: "Chọn chức vụ!" }]}
        >
          <Select placeholder="Chọn chức vụ">
            {positions.map((pos) => (
              <Option key={pos} value={pos}>
                {pos}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="department"
          label="Phòng ban"
          rules={[{ required: true, message: "Chọn phòng ban!" }]}
        >
          <Select placeholder="Chọn phòng ban">
            {departments.map((dep) => (
              <Option key={dep} value={dep}>
                {dep}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="salary"
          label="Lương"
          rules={[{ required: true, message: "Nhập lương!" }]}
        >
          <Input type="number" placeholder="Nhập lương" />
        </Form.Item>
        <Form.Item
          name="status"
          label="Trạng thái"
          rules={[{ required: true, message: "Chọn trạng thái!" }]}
        >
          <Select placeholder="Chọn trạng thái">
            {Object.values(EmployeeStatus).map((status) => (
              <Option key={status} value={status}>
                {status}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EmployeeModal;