import React, { useState, useEffect } from "react";
import { Button, message, Modal, Form } from "antd";
import { getEmployees, addEmployee, updateEmployee, deleteEmployee } from "@/services/nhanVien";
import { Employee, EmployeeStatus } from "@/models/nhanvien/employee";
import FilterBar from "@/components/FilterBar";
import EmployeeTable from "@/components/EmployeeTable";
import EmployeeModal from "@/components/EmployeeModal";

const positions = ["Nhân viên", "Trưởng phòng", "Giám đốc"];
const departments = ["Kế toán", "Nhân sự", "IT", "Kinh doanh"];
const nonDeletableStatuses: EmployeeStatus[] = [
  EmployeeStatus.ContractSigned,
  EmployeeStatus.OnLeave,
];

const EmployeeManagement: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterPosition, setFilterPosition] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [form] = Form.useForm(); 

  useEffect(() => {
    setEmployees(getEmployees());
  }, []);

  const openModal = (employee?: Employee) => {
    if (employee) {
      form.setFieldsValue(employee);
      setEditingEmployee(employee);
    } else {
      form.resetFields();
      setEditingEmployee(null);
    }
    setIsModalVisible(true);
  };

  const handleSave = (values: any) => {
    if (editingEmployee) {
      const updatedEmployee: Employee = { ...values, id: editingEmployee.id, status: values.status as EmployeeStatus };
      updateEmployee(updatedEmployee);
    } else {
      const newEmployee: Employee = { ...values, id: `NV${(employees.length + 1).toString().padStart(3, "0")}`, status: values.status as EmployeeStatus };
      addEmployee(newEmployee);
    }
    setEmployees([...getEmployees()]);
    setIsModalVisible(false);
  };

  const handleDelete = (id: string) => {
    const employee = employees.find((emp) => emp.id === id);
    if (employee && nonDeletableStatuses.includes(employee.status)) {
      message.error(`Không thể xóa nhân viên có trạng thái: ${employee.status}`);
      return;
    }

    Modal.confirm({
      title: "Xác nhận xóa",
      content: `Bạn có chắc chắn muốn xóa nhân viên ${employee?.name} không?`,
      okText: "Xóa",
      cancelText: "Hủy",
      onOk: () => {
        deleteEmployee(id);
        setEmployees([...getEmployees()]);
        message.success("Xóa nhân viên thành công!");
      },
    });
  };

  const filteredEmployees = employees.filter((emp) =>
    (filterPosition ? emp.position === filterPosition : true) &&
    (filterDepartment ? emp.department === filterDepartment : true) &&
    (searchText ? emp.id.includes(searchText) || emp.name.toLowerCase().includes(searchText.toLowerCase()) : true)
  );

  return (
    <>
      <FilterBar
        positions={positions}
        departments={departments}
        onSearch={setSearchText}
        onFilterPosition={setFilterPosition}
        onFilterDepartment={setFilterDepartment}
      />
      <Button type="primary" onClick={() => openModal()}>Thêm nhân viên</Button>
      <EmployeeTable
        employees={filteredEmployees}
        onEdit={(employee) => openModal(employee)}
        onDelete={handleDelete}
      />
      <EmployeeModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSave={handleSave}
        form={form}
        positions={positions}
        departments={departments}
      />
    </>
  );
};

export default EmployeeManagement;