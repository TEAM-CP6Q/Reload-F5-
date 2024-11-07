import React, { useState } from 'react';
import { Button, Card, Modal, Form, Input, Table, Upload, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import '../../CSS/admin/AdminProduct.css'; 

const { Option } = Select;

const AdminProduct = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [fileList, setFileList] = useState([]);

  const showModal = () => setIsModalOpen(true);
  const handleCancel = () => {
    setIsModalOpen(false);
    setFileList([]);
  };

  const handleFileChange = ({ fileList: newFileList }) => setFileList(newFileList);

  const handleAddProduct = (values) => {
    setProducts([
      ...products,
      {
        key: products.length + 1,
        image: values.image,
        name: values.name,
        price: values.price,
        designer: values.designer,
        category: values.category,
        description: values.description,
      },
    ]);
    setIsModalOpen(false);
  };

  const handleFinish = (values) => {
    handleAddProduct(values);
  };

  const columns = [
    { title: '대표 사진', dataIndex: 'image', key: 'image', render: () => <UploadOutlined /> },
    { title: '상품 설명 이미지', dataIndex: 'image-detail', key: 'image-detail', render: () => <UploadOutlined /> },
    { title: '상품명', dataIndex: 'name', key: 'name' },
    { title: '가격', dataIndex: 'price', key: 'price' },
    { title: '디자이너', dataIndex: 'designer', key: 'designer' },
    { title: '카테고리', dataIndex: 'category', key: 'category' },
    { title: '설명', dataIndex: 'description', key: 'description' },
  ];

  return (
    <div>
      <Card title="상품 목록" extra={<Button type="primary" onClick={showModal}>등록하기</Button>} style={{ marginBottom: '20px' }}>
        <Table dataSource={products} columns={columns} pagination={false} />
      </Card>

      {/* 상품 등록 모달 */}
      <Modal
        title="상품 등록"
        open={isModalOpen}
        centered
        onCancel={handleCancel}
        footer={null}
        className="custom-modal" // 모달 중앙 정렬을 위한 클래스 추가
      >
        <Form layout="vertical" onFinish={handleFinish}>
          <Form.Item label="대표 이미지" name="image" rules={[{ required: true, message: '이미지를 선택해주세요' }]}>
            <Upload
              listType="picture"
              maxCount={1}
              fileList={fileList}
              onChange={handleFileChange}
            >
              <Button icon={<UploadOutlined />}>이미지 업로드</Button>
            </Upload>
          </Form.Item>

          <Form.Item label="상품 설명 이미지" name="image-detail" rules={[{ required: true, message: '이미지를 선택해주세요' }]}>
            <Upload
              listType="picture"
              maxCount={1}
              fileList={fileList}
              onChange={handleFileChange}
            >
              <Button icon={<UploadOutlined />}>이미지 업로드</Button>
            </Upload>
          </Form.Item>


          <Form.Item label="상품명" name="name" rules={[{ required: true, message: '상품명을 입력해주세요' }]}>
            <Input />
          </Form.Item>

          <Form.Item label="상품 가격" name="price" rules={[{ required: true, message: '가격을 입력해주세요' }]}>
            <Input type="number" />
          </Form.Item>

          <Form.Item label="디자이너" name="designer" rules={[{ required: true, message: '디자이너를 입력해주세요' }]}>
            <Input />
          </Form.Item>

          <Form.Item label="카테고리" name="category">
            <Select placeholder="카테고리를 선택해주세요">
              <Option value="의류">의류</Option>
              <Option value="가방">가방</Option>
              <Option value="신발">신발</Option>
              <Option value="액세서리">액세서리</Option>
            </Select>
          </Form.Item>

          <Form.Item label="상품 설명" name="description">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginRight: '10px' }}>
              등록하기
            </Button>
            <Button onClick={handleCancel}>취소하기</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminProduct;
