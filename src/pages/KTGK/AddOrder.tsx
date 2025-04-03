import React, { useState } from 'react';
import { Form, Input, Button, Select, Table, InputNumber, message } from 'antd';
import type { Order, Product} from './types';
import { OrderStatus } from './types';
import { getOrdersFromLocalStorage, saveOrdersToLocalStorage } from './OrderService';

const { Option } = Select;

const AddOrder: React.FC = () => {
  const [form] = Form.useForm();
  const [products, setProducts] = useState<Product[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  const handleAddProduct = (product: Product) => {
    setProducts([...products, product]);
    setTotalAmount(totalAmount + product.price * product.quantity);
  };

  const handleRemoveProduct = (id: string) => {
    const updatedProducts = products.filter((product) => product.id !== id);
    const removedProduct = products.find((product) => product.id === id);
    if (removedProduct) {
      setTotalAmount(totalAmount - removedProduct.price * removedProduct.quantity);
    }
    setProducts(updatedProducts);
  };

  const handleSubmit = (values: any) => {
    const orders = getOrdersFromLocalStorage();
    const isDuplicateId = orders.some((order: Order) => order.id === values.id);

    if (isDuplicateId) {
      message.error('Mã đơn hàng đã tồn tại!');
      return;
    }

    const newOrder: Order = {
      id: values.id,
      customer: values.customer,
      orderDate: new Date().toISOString(),
      totalAmount,
      status: values.status,
      products,
    };

    saveOrdersToLocalStorage([...orders, newOrder]);
    message.success('Thêm đơn hàng thành công!');
    form.resetFields();
    setProducts([]);
    setTotalAmount(0);
  };

  const productColumns = [
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `${price.toLocaleString()} VND`,
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Thành tiền',
      key: 'total',
      render: (text: any, record: Product) => `${(record.price * record.quantity).toLocaleString()} VND`,
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (text: any, record: Product) => (
        <Button danger onClick={() => handleRemoveProduct(record.id)}>
          Xóa
        </Button>
      ),
    },
  ];

  return (
    <div>
      <h2>Thêm mới đơn hàng</h2>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Mã đơn hàng"
          name="id"
          rules={[{ required: true, message: 'Vui lòng nhập mã đơn hàng!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Khách hàng"
          name="customer"
          rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Trạng thái"
          name="status"
          rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
        >
          <Select>
            <Option value={OrderStatus.PENDING}>{OrderStatus.PENDING}</Option>
            <Option value={OrderStatus.SHIPPING}>{OrderStatus.SHIPPING}</Option>
            <Option value={OrderStatus.COMPLETED}>{OrderStatus.COMPLETED}</Option>
            <Option value={OrderStatus.CANCELLED}>{OrderStatus.CANCELLED}</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <h3>Danh sách sản phẩm</h3>
          <Table
            dataSource={products}
            columns={productColumns}
            rowKey="id"
            pagination={false}
          />
        </Form.Item>
        <Form.Item>
          <h3>Thêm sản phẩm</h3>
          <Form.Item
            name="productName"
            label="Tên sản phẩm"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="productPrice"
            label="Giá"
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="productQuantity"
            label="Số lượng"
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Button
            type="dashed"
            onClick={() => {
              const productName = form.getFieldValue('productName');
              const productPrice = form.getFieldValue('productPrice');
              const productQuantity = form.getFieldValue('productQuantity');

              if (productName && productPrice && productQuantity) {
                handleAddProduct({
                  id: `${Date.now()}`,
                  name: productName,
                  price: productPrice,
                  quantity: productQuantity,
                });
                form.resetFields(['productName', 'productPrice', 'productQuantity']);
              } else {
                message.error('Vui lòng nhập đầy đủ thông tin sản phẩm!');
              }
            }}
          >
            Thêm sản phẩm
          </Button>
        </Form.Item>
        <Form.Item>
          <h3>Tổng tiền: {totalAmount.toLocaleString()} VND</h3>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Lưu đơn hàng
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddOrder;