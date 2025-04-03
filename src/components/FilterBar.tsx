import React from "react";
import { Input, Select } from "antd";

const { Option } = Select;

interface FilterBarProps {
  positions: string[];
  departments: string[];
  onSearch: (value: string) => void;
  onFilterPosition: (value: string) => void;
  onFilterDepartment: (value: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  positions,
  departments,
  onSearch,
  onFilterPosition,
  onFilterDepartment,
}) => {
  return (
    <div style={{ marginBottom: 16 }}>
      <Input
        placeholder="Tìm kiếm theo mã, họ tên"
        onChange={(e) => onSearch(e.target.value)}
        style={{ width: 200, marginRight: 10 }}
      />
      <Select
        placeholder="Lọc theo chức vụ"
        onChange={onFilterPosition}
        allowClear
        style={{ width: 150, marginRight: 10 }}
      >
        {positions.map((pos) => (
          <Option key={pos} value={pos}>
            {pos}
          </Option>
        ))}
      </Select>
      <Select
        placeholder="Lọc theo phòng ban"
        onChange={onFilterDepartment}
        allowClear
        style={{ width: 150, marginRight: 10 }}
      >
        {departments.map((dep) => (
          <Option key={dep} value={dep}>
            {dep}
          </Option>
        ))}
      </Select>
    </div>
  );
};

export default FilterBar;