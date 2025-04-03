import React, { useState, useEffect } from "react";
import { Table, Button, Modal, message, Tag } from "antd";
import { Order, Product, OrderStatus } from "./types";
import { getOrdersFromLocalStorage, saveOrdersToLocalStorage } from "./OrderService";

const CancelOrder: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const storedOrders = getOrdersFromLocalStorage();
    setOrders(storedOrders);
  }, []);

  const handleCancelOrder = (order: Order) => {
    if (order.status !== OrderStatus.PENDING) {
      message.error("Chỉ có thể hủy đơn hàng ở trạng thái 'Chờ xác nhận'!");
      return;
    }
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

  const confirmCancelOrder = () => {
    if (selectedOrder) {
      const updatedOrders = orders.map((order) =>
        order.id === selectedOrder.id ? { ...order, status: OrderStatus.CANCELLED } : order
      );
      saveOrdersToLocalStorage(updatedOrders);
      setOrders(updatedOrders);
      message.success("Đơn hàng đã được hủy!");
    }
    setIsModalVisible(false);
    setSelectedOrder(null);
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
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
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
      render: (text: any, record: Order) => (
        <Button danger onClick={() => handleCancelOrder(record)}>
          Hủy đơn hàng
        </Button>
      ),
    },
  ];

  return (
    <div>
      <h2>Hủy đơn hàng</h2>
      <Table columns={columns} dataSource={orders} rowKey="id" />
      <Modal
        title="Xác nhận hủy đơn hàng"
        visible={isModalVisible}
        onOk={confirmCancelOrder}
        onCancel={() => setIsModalVisible(false)}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        <p>Bạn có chắc chắn muốn hủy đơn hàng này không?</p>
        <p>Mã đơn hàng: {selectedOrder?.id}</p>
        <p>Khách hàng: {selectedOrder?.customer}</p>
      </Modal>
    </div>
  );
};

export default CancelOrder;