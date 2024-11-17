// AdminDesigner.jsx

import React, { useEffect, useState } from 'react';
import { Button, Card, Modal, Form, Input, Table, Upload, Select, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import '../../CSS/admin/AdminDesigner.css';

const { Option } = Select;

const AdminDesigner = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [designers, setDesigners] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [editingDesigner, setEditingDesigner] = useState(null);

  useEffect(() => {
    // 디자이너 목록 불러오기
    const fetchDesigners = async () => {
      try {
        const response = await fetch('http://3.37.122.192:8000/api/account/designer/all-designer', {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setDesigners(data.map((item) => ({
            key: item.id,
            profile: item.image,
            name: item.name,
            email: item.email,
            phone: item.phone,
            experience: item.career,
            category: item.category,
            description: item.pr,
            status: item.empStatus ? '재직 중' : '퇴사',
            productCount: 0,
          })));
        } else {
          message.error('디자이너 목록을 불러오는 데 실패했습니다.');
        }
      } catch (error) {
        console.error('디자이너 목록 로드 오류:', error);
      }
    };

    fetchDesigners();
  }, []);

  // 디자이너 등록 모달 열기/닫기 함수
  const showModal = () => setIsModalOpen(true);
  const handleCancel = () => {
    setIsModalOpen(false);
    setFileList([]);
  };

  // 파일 업로드 변화 처리 함수
  const handleFileChange = ({ fileList: newFileList }) => setFileList(newFileList);

  // 디자이너 등록 함수
  const handleAddDesigner = async (values) => {
    try {
      const response = await fetch('http://3.37.122.192:8000/api/account/designer/add-designer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: '1234', // 임시 프로필 이미지 데이터
          name: values.name,
          email: values.email,
          phone: values.phone,
          career: values.experience,
          category: values.category,
          pr: values.description,
          empStatus: true,
        }),
      });

      if (response.ok) {
        const newDesigner = await response.json();
        console.log('등록된 디자이너:', newDesigner);
        setDesigners([
          ...designers,
          {
            key: newDesigner.id,
            profile: newDesigner.image,
            name: newDesigner.name,
            email: newDesigner.email,
            phone: newDesigner.phone,
            experience: newDesigner.career,
            category: newDesigner.category,
            description: newDesigner.pr,
            status: newDesigner.empStatus ? '재직 중' : '퇴사',
            productCount: 0,
          },
        ]);
        message.success('디자이너가 성공적으로 등록되었습니다.');
        setIsModalOpen(false);
      } else {
        message.error('디자이너 등록에 실패했습니다.');
      }
    } catch (error) {
      console.error('디자이너 등록 오류:', error);
      message.error('디자이너 등록 중 오류가 발생했습니다.');
    }
  };

  // 디자이너 목록 테이블 컬럼 설정
  const columns = [
    { title: '프로필', dataIndex: 'profile', key: 'profile', render: () => <UploadOutlined /> },
    { title: '이름', dataIndex: 'name', key: 'name', className: 'designer-name' },
    { title: '이메일', dataIndex: 'email', key: 'email', className: 'designer-email' },
    { title: '전화번호', dataIndex: 'phone', key: 'phone', className: 'designer-phone' },
    { title: '경력', dataIndex: 'experience', key: 'experience' },
    { title: '카테고리', dataIndex: 'category', key: 'category', className: 'designer-category' },
    { title: '소개', dataIndex: 'description', key: 'description', className: 'designer-description' },
    { title: '재직 상태', dataIndex: 'status', key: 'status', className: 'designer-status' },
    { title: '등록한 상품 수', dataIndex: 'productCount', key: 'productCount', className: 'designer-product-count' },
    {
      title: '정보 수정',
      key: 'edit',
      render: (_, record) => (
        <Button onClick={() => console.log('정보 수정:', record)}>정보 수정</Button>
      ),
    },
  ];

  return (
    <div className="table-container">
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
      >
        <Form layout="vertical" onFinish={handleAddDesigner}>
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
    </div>
  );
};

export default AdminDesigner;
