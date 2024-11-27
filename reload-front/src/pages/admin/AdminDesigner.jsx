import React, { useEffect, useState } from 'react';
import { Card, List, Button, Tag, Typography, message, Modal, Form, Input, Select } from 'antd';
import '../../CSS/admin/AdminDesigner.css';

const { Paragraph, Text, Title } = Typography;
const { Option } = Select;

const AdminDesigner = () => {
  const [designers, setDesigners] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingDesigner, setEditingDesigner] = useState(null);

  // 디자이너 목록 가져오기
  useEffect(() => {
    const fetchDesigners = async () => {
      try {
        const response = await fetch('https://refresh-f5-server.o-r.kr/api/account/designer/all-designer', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setDesigners(
            data.map((item) => ({
              key: item.id,
              profile: item.image,
              name: item.name,
              email: item.email,
              phone: item.phone,
              experience: item.career,
              category: item.category,
              description: item.pr,
              status: item.empStatus ? '재직 중' : '퇴사',
            }))
          );
        } else {
          message.error('디자이너 목록을 불러오는 데 실패했습니다.');
        }
      } catch (error) {
        console.error('디자이너 목록 로드 오류:', error);
        message.error('서버 연결에 실패했습니다.');
      }
    };

    fetchDesigners();
  }, []);

  // 디자이너 등록 핸들러
  const handleAddDesigner = async (values) => {
    try {
      const response = await fetch('https://refresh-f5-server.o-r.kr/api/account/designer/add-designer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: 'default-image',
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

 // 디자이너 수정 핸들러
const handleEditDesigner = async (values) => {
  const token = localStorage.getItem('token'); // 액세스 토큰 가져오기
  try {
    const response = await fetch(`https://refresh-f5-server.o-r.kr//api/pickup/update-pickup`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Bearer 토큰 추가
      },
      body: JSON.stringify({
        id: editingDesigner.key,
        name: values.name,
        email: values.email,
        phone: values.phone,
        career: values.experience,
        category: values.category,
        pr: values.description,
      }),
    });

    if (response.ok) {
      setDesigners(
        designers.map((designer) =>
          designer.key === editingDesigner.key
            ? { ...designer, ...values }
            : designer
        )
      );
      message.success('디자이너 정보가 성공적으로 수정되었습니다.');
      setIsEditModalOpen(false);
    } else {
      message.error('디자이너 정보 수정에 실패했습니다.');
    }
  } catch (error) {
    console.error('디자이너 수정 오류:', error);
    message.error('디자이너 정보 수정 중 오류가 발생했습니다.');
  }
};


  return (
    <div className="designer-container">
      <Card
        title={<Title level={4}>디자이너 목록</Title>}
        extra={<Button type="primary" onClick={() => setIsModalOpen(true)}>디자이너 등록</Button>}
        className="designer-card"
      >
        <List
          grid={{ gutter: 16, column: 3 }}
          dataSource={designers}
          renderItem={(designer) => (
            <List.Item>
              <Card className="designer-item">
                <Tag color={designer.status === '재직 중' ? 'green' : 'red'}>{designer.status}</Tag>
                <div className="designer-body">
                  <Paragraph>
                    <Text strong>이름:</Text> {designer.name}
                  </Paragraph>
                  <Paragraph>
                    <Text strong>이메일:</Text> {designer.email}
                  </Paragraph>
                  <Paragraph>
                    <Text strong>전화번호:</Text> {designer.phone}
                  </Paragraph>
                  <Paragraph>
                    <Text strong>경력:</Text> {designer.experience}
                  </Paragraph>
                  <Paragraph>
                    <Text strong>카테고리:</Text> {designer.category}
                  </Paragraph>
                  <Paragraph>
                    <Text strong>소개:</Text> {designer.description}
                  </Paragraph>
                </div>
                <Button type="link" onClick={() => {
                  setEditingDesigner(designer);
                  setIsEditModalOpen(true);
                }}>
                  정보 수정
                </Button>
              </Card>
            </List.Item>
          )}
        />
      </Card>

      {/* 디자이너 등록 모달 */}
      <Modal
        title="디자이너 등록"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        centered
      >
        <Form layout="vertical" onFinish={handleAddDesigner}>
          <Form.Item
            label="디자이너 이름"
            name="name"
            rules={[{ required: true, message: '이름을 입력해주세요.' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="이메일"
            name="email"
            rules={[{ required: true, type: 'email', message: '유효한 이메일을 입력해주세요.' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="전화번호"
            name="phone"
            rules={[{ required: true, message: '전화번호를 입력해주세요.' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="경력 (년)"
            name="experience"
            rules={[{ required: true, message: '경력을 입력해주세요.' }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="주요 카테고리"
            name="category"
            rules={[{ required: true, message: '카테고리를 선택해주세요.' }]}
          >
            <Select placeholder="카테고리를 선택해주세요">
              <Option value="의류">의류</Option>
              <Option value="가방">가방</Option>
              <Option value="신발">신발</Option>
              <Option value="액세서리">액세서리</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="소개"
            name="description"
          >
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginRight: '10px' }}>
              등록하기
            </Button>
            <Button onClick={() => setIsModalOpen(false)}>취소하기</Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* 디자이너 정보 수정 모달 */}
      {editingDesigner && (
        <Modal
          title="정보 수정"
          open={isEditModalOpen}
          onCancel={() => setIsEditModalOpen(false)}
          footer={null}
          centered
        >
          <Form
            layout="vertical"
            onFinish={handleEditDesigner}
            initialValues={editingDesigner}
          >
            <Form.Item label="이름" name="name">
              <Input />
            </Form.Item>
            <Form.Item label="이메일" name="email">
              <Input />
            </Form.Item>
            <Form.Item label="전화번호" name="phone">
              <Input />
            </Form.Item>
            <Form.Item label="경력" name="experience">
              <Input />
            </Form.Item>
            <Form.Item label="카테고리" name="category">
              <Input />
            </Form.Item>
            <Form.Item label="소개" name="description">
              <Input.TextArea />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">저장</Button>
            </Form.Item>
          </Form>
        </Modal>
      )}
    </div>
  );
};

export default AdminDesigner;
