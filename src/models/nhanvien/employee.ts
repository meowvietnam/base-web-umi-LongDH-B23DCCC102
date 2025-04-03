export interface Employee {
    id: string;
    name: string;
    position: string;
    department: string;
    salary: number;
    status: EmployeeStatus;
  }
  export enum EmployeeStatus {
    Probation = "Thử việc",
    ContractSigned = "Đã ký hợp đồng",
    OnLeave = "Nghỉ phép",
    Resigned = "Đã thôi việc",
  }
  const STORAGE_KEY = "employees";
  export const getEmployees = (): Employee[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  };
  
  export const saveEmployees = (employees: Employee[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
  };
  
  export const addEmployee = (employee: Employee) => {
    const employees = getEmployees();
    const newEmployee: Employee = {
      ...employee,
      status: employee.status as EmployeeStatus,
    };
    employees.push(newEmployee);
    saveEmployees(employees);
  };
  
  export const updateEmployee = (employee: Employee) => {
    const employees = getEmployees().map(e =>
      e.id === employee.id
        ? {
            ...employee,
            status: employee.status as EmployeeStatus, 
          }
        : e
    );
    saveEmployees(employees);
  };
  
  
  