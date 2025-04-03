import React, { useState, useEffect } from "react";
import { Table, Input, Select, Button, Space, Tag, Modal, Form } from "antd";
import { Order, Product, OrderStatus } from "./types";
import { getOrdersFromLocalStorage } from "./OrderService";

const { Search } = Input;
const { Option } = Select;

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const storedOrders = getOrdersFromLocalStorage();
    setOrders(storedOrders);
    setFilteredOrders(storedOrders);
  }, []);

  const handleSearch = (value: string) => {
    setSearchKeyword(value);
    const filtered = orders.filter(
      (order) =>
        order.id.includes(value) || order.customer.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredOrders(filtered);
  };

  const handleFilter = (value: string | null) => {
    setStatusFilter(value);
    const filtered = orders.filter((order) => (value ? order.status === value : true));
    setFilteredOrders(filtered);
  };

  const handleEdit = (order: Order) => {
    setEditingOrder(order);
    form.setFieldsValue(order); // Set giá trị ban đầu cho form
    setIsModalVisible(true);
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      // Tính tổng tiền từ danh sách sản phẩm
      const totalAmount = editingOrder?.products.reduce(
        (sum, product) => sum + product.price * product.quantity,
        0
      ) || 0;
  
      // Tạo đơn hàng mới với thông tin đã chỉnh sửa
      const updatedOrder: Order = {
        ...editingOrder!,
        ...values,
        totalAmount, // Cập nhật tổng tiền
        products: editingOrder?.products || [],
      };
  
      // Kiểm tra và cập nhật danh sách đơn hàng
      const updatedOrders = orders.map((order) =>
        order.id === updatedOrder.id ? updatedOrder : order
      );
  
      // Lưu danh sách đơn hàng vào state và localStorage
      setOrders(updatedOrders);
      setFilteredOrders(updatedOrders);
      localStorage.setItem("orders", JSON.stringify(updatedOrders));
  
      // Đóng modal và reset trạng thái
      setIsModalVisible(false);
      setEditingOrder(null);
      form.resetFields();
    }).catch((error) => {
      console.error("Validation failed:", error);
    });
  };

  const handleDeleteProduct = (productId: string) => {
    if (editingOrder) {
      const updatedProducts = editingOrder.products.filter(
        (product) => product.id !== productId
      );
      const totalAmount = updatedProducts.reduce(
        (sum, product) => sum + product.price * product.quantity,
        0
      );
      const updatedOrder = { ...editingOrder, products: updatedProducts, totalAmount };
      setEditingOrder(updatedOrder);
      form.setFieldsValue(updatedOrder); // Cập nhật giá trị form
    }
  };

  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Khách hàng",
      dataIndex: "customer",
      key: "customer",
    },
    {
      title: "Ngày đặt hàng",
      dataIndex: "orderDate",
      key: "orderDate",
      sorter: (a: Order, b: Order) => new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime(),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      sorter: (a: Order, b: Order) => a.totalAmount - b.totalAmount,
      render: (amount: number) => `${amount.toLocaleString()} VND`,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: OrderStatus) => {
        const color =
          status === OrderStatus.PENDING
            ? "orange"
            : status === OrderStatus.SHIPPING
            ? "blue"
            : status === OrderStatus.COMPLETED
            ? "green"
            : "red";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: Order) => (
        <Button type="link" onClick={() => handleEdit(record)}>
          Chỉnh sửa
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Search
          placeholder="Tìm kiếm theo mã đơn hàng hoặc khách hàng"
          onSearch={handleSearch}
          style={{ width: 300 }}
        />
        <Select
          placeholder="Lọc theo trạng thái"
          onChange={handleFilter}
          allowClear
          style={{ width: 200 }}
        >
          <Option value={OrderStatus.PENDING}>{OrderStatus.PENDING}</Option>
          <Option value={OrderStatus.SHIPPING}>{OrderStatus.SHIPPING}</Option>
          <Option value={OrderStatus.COMPLETED}>{OrderStatus.COMPLETED}</Option>
          <Option value={OrderStatus.CANCELLED}>{OrderStatus.CANCELLED}</Option>
        </Select>
      </Space>
      <Table columns={columns} dataSource={filteredOrders} rowKey="id" />

      {/* Modal chỉnh sửa */}
      <Modal
  title="Chỉnh sửa đơn hàng"
  visible={isModalVisible}
  onOk={handleSave}
  onCancel={() => {
    setIsModalVisible(false);
    form.resetFields(); // Reset form khi đóng popup
  }}
  okText="Lưu"
  cancelText="Hủy"
>
  <Form form={form} layout="vertical">
    {/* Trường Mã đơn hàng */}
    <Form.Item
      name="id"
      label="Mã đơn hàng"
      rules={[{ required: true, message: "Vui lòng nhập mã đơn hàng!" }]}
    >
      <Input placeholder="Nhập mã đơn hàng" disabled />
    </Form.Item>

    {/* Trường Khách hàng */}
    <Form.Item
      name="customer"
      label="Khách hàng"
      rules={[{ required: true, message: "Vui lòng nhập tên khách hàng!" }]}
    >
      <Input placeholder="Nhập tên khách hàng" />
    </Form.Item>

    {/* Trường Ngày đặt hàng */}
    <Form.Item
      name="orderDate"
      label="Ngày đặt hàng"
      rules={[{ required: true, message: "Vui lòng nhập ngày đặt hàng!" }]}
    >
      <Input type="date" />
    </Form.Item>

    {/* Trường Trạng thái */}
    <Form.Item
      name="status"
      label="Trạng thái"
      rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
    >
      <Select placeholder="Chọn trạng thái">
        <Option value={OrderStatus.PENDING}>{OrderStatus.PENDING}</Option>
        <Option value={OrderStatus.SHIPPING}>{OrderStatus.SHIPPING}</Option>
        <Option value={OrderStatus.COMPLETED}>{OrderStatus.COMPLETED}</Option>
        <Option value={OrderStatus.CANCELLED}>{OrderStatus.CANCELLED}</Option>
      </Select>
    </Form.Item>

    {/* Trường Sản phẩm */}
    <Form.Item label="Danh sách sản phẩm">
  <Table
    dataSource={editingOrder?.products || []}
    columns={[
      {
        title: "Tên sản phẩm",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Giá",
        dataIndex: "price",
        key: "price",
        render: (price: number) => `${price.toLocaleString()} VND`,
      },
      {
        title: "Số lượng",
        dataIndex: "quantity",
        key: "quantity",
      },
      {
        title: "Thành tiền",
        key: "total",
        render: (_: any, record: Product) =>
          `${(record.price * record.quantity).toLocaleString()} VND`,
      },
      {
        title: "Hành động",
        key: "action",
        render: (_: any, record: Product) => (
          <Button
            type="link"
            danger
            onClick={() => handleDeleteProduct(record.id)}
          >
            Xóa
          </Button>
        ),
      },
    ]}
    rowKey="id"
    pagination={false}
  />
</Form.Item>
<Form.Item>
  <h3>Tổng tiền: {editingOrder?.products.reduce((sum, product) => sum + product.price * product.quantity, 0).toLocaleString()} VND</h3>
</Form.Item>
  </Form>
</Modal>
    </div>
  );
};

export default OrderList;