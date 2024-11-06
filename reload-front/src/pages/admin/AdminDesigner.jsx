import React, { useState } from 'react';
import { Button, Card, Modal, Form, Input, Table, Upload, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;

const AdminDesigner = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [designers, setDesigners] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [editingDesigner, setEditingDesigner] = useState(null);

  // 디자이너 등록 모달 열기/닫기 함수
  const showModal = () => setIsModalOpen(true);
  const handleCancel = () => {
    setIsModalOpen(false);
    setFileList([]);
  };

  // 정보 수정 모달 열기/닫기 함수
  const showEditModal = (designer) => {
    setEditingDesigner(designer);
    setIsEditModalOpen(true);
  };
  const handleEditCancel = () => {
    setIsEditModalOpen(false);
    setEditingDesigner(null);
  };

  // 파일 업로드 변화 처리 함수
  const handleFileChange = ({ fileList: newFileList }) => setFileList(newFileList);

  // 디자이너 등록 함수
  const handleAddDesigner = (values) => {
    setDesigners([
      ...designers,
      {
        key: designers.length + 1,
        profile: values.profile,
        name: values.name,
        email: values.email,
        experience: values.experience,
        category: values.category,
        description: values.description,
        status: '재직 중',
        productCount: 0,
        phone: values.phone,
      },
    ]);
    setIsModalOpen(false);
  };

  // 상품 등록 시 해당 디자이너의 등록한 상품 수 증가
  const incrementProductCount = (designerKey) => {
    setDesigners((prevDesigners) =>
      prevDesigners.map((designer) =>
        designer.key === designerKey
          ? { ...designer, productCount: designer.productCount + 1 }
          : designer
      )
    );
  };

  // 폼 제출 처리
  const handleFinish = (values) => {
    handleAddDesigner(values);
  };

  // 정보 수정 폼 제출 처리
  const handleEditFinish = (values) => {
    setDesigners((prevDesigners) =>
      prevDesigners.map((designer) =>
        designer.key === editingDesigner.key ? { ...designer, ...values } : designer
      )
    );
    setEditingDesigner(null);
    setIsEditModalOpen(false);
  };

  // 디자이너 목록 테이블 컬럼 설정
  const columns = [
    { title: '프로필', dataIndex: 'profile', key: 'profile', render: () => <UploadOutlined /> },
    { title: '이름', dataIndex: 'name', key: 'name' },
    { title: '이메일', dataIndex: 'email', key: 'email' },
    { title: '전화번호', dataIndex: 'phone', key: 'phone' },
    { title: '경력', dataIndex: 'experience', key: 'experience' },
    { title: '카테고리', dataIndex: 'category', key: 'category' },
    { title: '소개', dataIndex: 'description', key: 'description' },
    { title: '재직 상태', dataIndex: 'status', key: 'status' },
    { title: '등록한 상품 수', dataIndex: 'productCount', key: 'productCount' },
    {
      title: '정보 수정',
      key: 'edit',
      render: (_, record) => (
        <Button onClick={() => showEditModal(record)}>정보 수정</Button>
      ),
    },
  ];

  return (
    <div>
      <Card title="디자이너 목록" extra={<Button type="primary" onClick={showModal}>디자이너 등록</Button>} style={{ marginBottom: '20px' }}>
        <Table dataSource={designers} columns={columns} pagination={false} />
      </Card>

      {/* 디자이너 등록 모달 */}
      <Modal
        title="디자이너 등록"
        open={isModalOpen}
        centered
        onCancel={handleCancel}
        footer={null}
        className="custom-modal"
      >
        <Form layout="vertical" onFinish={handleFinish}>
          <Form.Item label="프로필 이미지" name="profile" rules={[{ required: true, message: '프로필 이미지를 선택해주세요' }]}>
            <Upload
              listType="picture"
              maxCount={1}
              fileList={fileList}
              onChange={handleFileChange}
            >
              <Button icon={<UploadOutlined />}>이미지 업로드</Button>
            </Upload>
          </Form.Item>

          <Form.Item label="디자이너 이름" name="name" rules={[{ required: true, message: '이름을 입력해주세요' }]}>
            <Input />
          </Form.Item>

          <Form.Item label="이메일" name="email" rules={[{ required: true, type: 'email', message: '유효한 이메일을 입력해주세요' }]}>
            <Input />
          </Form.Item>

          <Form.Item label="전화번호" name="phone" rules={[{ required: true, message: '전화번호를 입력해주세요' }]}>
            <Input />
          </Form.Item>

          <Form.Item label="경력 (년)" name="experience" rules={[{ required: true, message: '경력을 입력해주세요' }]}>
            <Input type="number" />
          </Form.Item>

          <Form.Item label="주요 카테고리" name="category" rules={[{ required: true, message: '카테고리를 선택해주세요' }]}>
            <Select placeholder="카테고리를 선택해주세요">
              <Option value="의류">의류</Option>
              <Option value="가방">가방</Option>
              <Option value="신발">신발</Option>
              <Option value="액세서리">액세서리</Option>
            </Select>
          </Form.Item>

          <Form.Item label="소개" name="description">
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

      {/* 정보 수정 모달 */}
      <Modal
        title="정보 수정"
        open={isEditModalOpen}
        centered
        onCancel={handleEditCancel}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleEditFinish} initialValues={editingDesigner}>
          <Form.Item label="디자이너 이름" name="name">
            <Input />
          </Form.Item>

          <Form.Item label="이메일" name="email">
            <Input />
          </Form.Item>

          <Form.Item label="전화번호" name="phone">
            <Input />
          </Form.Item>

          <Form.Item label="경력 (년)" name="experience">
            <Input type="number" />
          </Form.Item>

          <Form.Item label="재직 현황" name="status">
            <Select placeholder="재직 현황을 선택해주세요">
              <Option value="재직 중">재직 중</Option>
              <Option value="휴직">휴직</Option>
              <Option value="퇴사">퇴사</Option>
            </Select>
          </Form.Item>

          <Form.Item label="주요 카테고리" name="category">
            <Select placeholder="카테고리를 선택해주세요">
              <Option value="의류">의류</Option>
              <Option value="가방">가방</Option>
              <Option value="신발">신발</Option>
              <Option value="액세서리">액세서리</Option>
            </Select>
          </Form.Item>

          <Form.Item label="소개" name="description">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginRight: '10px' }}>
              수정하기
            </Button>
            <Button onClick={handleEditCancel}>취소하기</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminDesigner;
