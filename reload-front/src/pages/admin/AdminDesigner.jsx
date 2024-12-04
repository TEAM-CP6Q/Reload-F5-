import React, { useEffect, useState } from 'react';
import { Card, List, Button, Tag, Typography, message, Modal, Form, Input, Select, Upload ,Avatar,Space} from 'antd';
import { PlusOutlined,UserOutlined, EditOutlined  } from '@ant-design/icons';
import '../../CSS/admin/AdminDesigner.css';
import styled from '@emotion/styled';

const { Paragraph, Text, Title } = Typography;
const { Option } = Select;

const StyledCard = styled(Card)`
  .ant-card-body {
    padding: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

const InfoItem = ({ label, value }) => (
  <div style={{ 
    width: '100%', 
    display: 'flex', 
    justifyContent: 'space-between',
    margin: '4px 0'
  }}>
    <Text strong style={{ color: '#666', minWidth: '30%', textAlign: 'start' }}>{label}:</Text>
    <Text style={{ maxWidth: '70%', textAlign: 'right' }}>
      {value}
    </Text>
  </div>
);
const AdminDesigner = () => {
  const [designers, setDesigners] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingDesigner, setEditingDesigner] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // 이미지 ID 추출 함수
  const getImageId = (imageUrl) => {
    if (imageUrl && typeof imageUrl === 'string') {
      const parts = imageUrl.split('/');
      return parts[parts.length - 1];
    }
    return null;
  };

  // 이미지 업로드 설정
  const uploadProps = {
    name: 'images',
    showUploadList: true,
    listType: 'picture-card',
    maxCount: 1,
    customRequest: async ({ file, onSuccess, onError }) => {
      const formData = new FormData();
      formData.append('images', file);
  
      try {
        const response = await fetch('https://refresh-f5-server.o-r.kr/api/image/upload', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: formData,
        });
  
        if (response.ok) {
          const data = await response.json();
          console.log('서버 응답 데이터:', data);
          console.log('응답 데이터 키:', Object.keys(data));
          
          // images 배열의 첫 번째 URL을 가져옴
          const imageUrl = data.images[0];
          console.log('찾은 이미지 URL:', imageUrl);
          
          if (imageUrl) {
            setImageUrl(imageUrl);
            onSuccess(data, file);
            message.success(`${file.name} 업로드 성공`);
          } else {
            console.error('이미지 URL을 찾을 수 없습니다:', data);
            throw new Error('이미지 URL을 찾을 수 없습니다');
          }
        } else {
          const errorData = await response.json().catch(() => null);
          console.error('응답 에러:', errorData);
          throw new Error('이미지 업로드 실패');
        }
      } catch (error) {
        console.error('이미지 업로드 에러:', error);
        onError(error);
        message.error(`${file.name} 업로드 실패`);
      }
    },
    onRemove: () => {
      setImageUrl('');
      return true;
    }
  };

  // 이미지 미리보기 컴포넌트
  const ImagePreview = ({ imageUrl }) => {
    const imageId = getImageId(imageUrl);
    return imageId ? (
      <img
        src={`https://refresh-f5-server.o-r.kr/api/image/download/${imageId}`}
        alt="디자이너 프로필"
        style={{ width: '100%', maxWidth: '200px', marginBottom: '20px' }}
      />
    ) : null;
  };

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
              profile: item.image, // 서버에서 받은 이미지 ID
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
          image: imageUrl, // 이미지 ID만 전송
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
            profile: newDesigner.image, // 서버에서 받은 이미지 ID
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
        setImageUrl('');
        form.resetFields();
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
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch('https://refresh-f5-server.o-r.kr/api/account/designer/update-designer', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: editingDesigner.key,
          name: values.name,
          image: imageUrl || editingDesigner.profile, // 새 이미지 ID 또는 기존 이미지 ID
          email: values.email,
          phone: values.phone,
          career: values.experience,
          category: values.category,
          pr: values.description,
          empStatus: values.empStatus,
        }),
      });

      if (response.ok) {
        setDesigners(
          designers.map((designer) =>
            designer.key === editingDesigner.key
              ? {
                  ...designer,
                  ...values,
                  profile: imageUrl || designer.profile, // 새 이미지 ID 또는 기존 이미지 ID
                  status: values.empStatus ? '재직 중' : '퇴사',
                }
              : designer
          )
        );
        message.success('디자이너 정보가 성공적으로 수정되었습니다.');
        setIsEditModalOpen(false);
        setImageUrl('');
      } else {
        const errorResponse = await response.json();
        console.error("Response Error:", errorResponse);
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
    grid={{ gutter: 24, column: 3 }}
    dataSource={designers}
    renderItem={(designer) => (
      <List.Item>
        <StyledCard
          hoverable
          actions={[
            <Button 
              type="link" 
              icon={<EditOutlined />}
              onClick={() => {
                setEditingDesigner(designer);
                setIsEditModalOpen(true);
              }}
            >
              정보 수정
            </Button>
          ]}
        >
          <Avatar
            size={100}
            icon={!designer.profile && <UserOutlined />}
            src={designer.profile ? `https://refresh-f5-server.o-r.kr/api/image/download/${getImageId(designer.profile)}` : null}
            style={{
              marginBottom: 16,
              border: '2px solid #f0f0f0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}
          />
          
          <Space direction="vertical" size={2} style={{ width: '100%', textAlign: 'center' }}>
            <Text strong style={{ fontSize: 18, marginBottom: 8 }}>
              {designer.name}
            </Text>
            
            <Tag 
              color={designer.status === '재직 중' ? 'green' : 'red'}
              style={{ marginBottom: 16 }}
            >
              {designer.status}
            </Tag>

            <div style={{ width: '100%', padding: '0 12px' }}>
              <InfoItem label="이메일" value={designer.email} />
              <InfoItem label="전화번호" value={designer.phone} />
              <InfoItem label="경력" value={designer.experience} />
              <InfoItem label="카테고리" value={designer.category} />
              <InfoItem 
                label="소개" 
                value={
                  <Text 
                    style={{ 
                      maxWidth: '200px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                    title={designer.description} // 마우스 호버 시 전체 텍스트 표시
                  >
                    {designer.description}
                  </Text>
                } 
              />
            </div>
          </Space>
        </StyledCard>
      </List.Item>
    )}
  />
      </Card>

      {/* 디자이너 등록 모달 */}
      <Modal
        title="디자이너 등록"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setImageUrl('');
          form.resetFields();
        }}
        footer={null}
        centered
      >
        <Form form={form} layout="vertical" onFinish={handleAddDesigner}>
        <Form.Item label="프로필 이미지">
      <Upload {...uploadProps}>
        {imageUrl ? null : (
          <div>
            {loading ? (
              <div>업로드 중...</div>
            ) : (
              <>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </>
            )}
          </div>
        )}
      </Upload>
    
    </Form.Item>
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
            <Button onClick={() => {
              setIsModalOpen(false);
              setImageUrl('');
              form.resetFields();
            }}>
              취소하기
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* 디자이너 정보 수정 모달 */}
      {editingDesigner && (
        <Modal
          title="정보 수정"
          open={isEditModalOpen}
          onCancel={() => {
            setIsEditModalOpen(false);
            setImageUrl('');
          }}
          footer={null}
          centered
        >
          <Form
            layout="vertical"
            onFinish={handleEditDesigner}
            initialValues={{
              ...editingDesigner,
              empStatus: editingDesigner.status === '재직 중',
            }}
          >
            <Form.Item label="프로필 이미지">
              <ImagePreview imageUrl={imageUrl || editingDesigner.profile} />
              <Upload {...uploadProps} listType="picture-card" maxCount={1}>
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              </Upload>
            </Form.Item>
            <Form.Item label="이름" name="name" rules={[{ required: true, message: '이름을 입력해주세요.' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="이메일" name="email" rules={[{ required: true, type: 'email', message: '유효한 이메일을 입력해주세요.' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="전화번호" name="phone" rules={[{ required: true, message: '전화번호를 입력해주세요.' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="경력 (년)" name="experience" rules={[{ required: true, message: '경력을 입력해주세요.' }]}>
              <Input type="number" />
            </Form.Item>
            <Form.Item label="카테고리" name="category" rules={[{ required: true, message: '카테고리를 입력해주세요.' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="소개" name="description">
              <Input.TextArea rows={3} />
            </Form.Item>
            <Form.Item label="재직 상태" name="empStatus" rules={[{ required: true, message: '재직 상태를 선택해주세요.' }]}>
              <Select>
                <Option value={true}>재직 중</Option>
                <Option value={false}>퇴사</Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                저장
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      )}
    </div>
  );
};

export default AdminDesigner;