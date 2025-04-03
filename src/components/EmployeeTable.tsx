import React from "react";
import { Table, Button } from "antd";
import { Employee, EmployeeStatus } from "@/models/nhanvien/employee";

interface EmployeeTableProps {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (id: string) => void;
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  onEdit,
  onDelete,
}) => {
  const columns = [
    { title: "Mã NV", dataIndex: "id", key: "id" },
    { title: "Họ tên", dataIndex: "name", key: "name" },
    { title: "Chức vụ", dataIndex: "position", key: "position" },
    { title: "Phòng ban", dataIndex: "department", key: "department" },
    {
      title: "Lương",
      dataIndex: "salary",
      key: "salary",
      render: (salary: number) => `$${salary.toLocaleString("en-US")}`,
      sorter: (a: Employee, b: Employee) => b.salary - a.salary,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: EmployeeStatus) => <span>{status}</span>,
    },
    {
      title: "Hành động",
      render: (_: any, record: Employee) => (
        <>
          <Button onClick={() => onEdit(record)}>Sửa</Button>
          <Button onClick={() => onDelete(record.id)} danger>
            Xóa
          </Button>
        </>
      ),
    },
  ];

  return <Table columns={columns} dataSource={employees} rowKey="id" />;
};

export default EmployeeTable;