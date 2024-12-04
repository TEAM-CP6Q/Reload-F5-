import React, { useState, useEffect } from 'react';
import { Button, Card, Modal, Form, Input, Table, Upload, Select, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import '../../CSS/admin/AdminProduct.css';

const { Option } = Select;

const AdminProduct = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [tableLoading, setTableLoading] = useState(true);
  const [designers, setDesigners] = useState([]); // 디자이너 목록 상태 추가

  useEffect(() => {
    fetchProducts();
    fetchDesigners(); // 컴포넌트 마운트 시 디자이너 목록 가져오기
  }, []);

  const fetchDesigners = async () => {
    try {
      const response = await fetch('https://refresh-f5-server.o-r.kr/api/account/designer/all-designer', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`서버 오류: ${response.status}`);
      }

      const data = await response.json();
      setDesigners(data);
    } catch (error) {
      console.error('디자이너 목록 조회 중 오류 발생:', error);
      message.error('디자이너 목록을 불러오는데 실패했습니다.');
    }
  };

  const fetchProducts = async () => {
    setTableLoading(true);
    try {
      const accessToken = localStorage.getItem('token');
      if (!accessToken) {
        throw new Error('인증 토큰이 없습니다. 로그인이 필요합니다.');
      }

      const response = await fetch('https://refresh-f5-server.o-r.kr/api/product/latest-product-list', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        }
      });

      if (!response.ok) {
        throw new Error(`서버 오류: ${response.status}`);
      }

      const data = await response.json();
      const productsWithKeys = data.map((product, index) => ({
        ...product,
        key: product.pid || index,
      }));
      setProducts(productsWithKeys);
    } catch (error) {
      console.error('상품 목록 조회 중 오류 발생:', error);
      message.error('상품 목록을 불러오는데 실패했습니다.');
    } finally {
      setTableLoading(false);
    }
  };

  const showModal = () => setIsModalOpen(true);
  const handleCancel = () => {
    setIsModalOpen(false);
    setFileList([]);
    setMessage('');
  };

  const validateForm = async (formData) => {
    const errors = [];
    
    if (!formData.get('product')) {
      errors.push('Product data is missing');
    } else {
      try {
        const productBlob = formData.get('product');
        const productData = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            try {
              resolve(JSON.parse(reader.result));
            } catch (e) {
              reject(new Error('JSON 파싱 오류'));
            }
          };
          reader.onerror = () => reject(new Error('파일 읽기 오류'));
          reader.readAsText(productBlob);
        });
        
        if (!productData.name) errors.push('상품명이 누락되었습니다');
        if (!productData.content) errors.push('상품 설명이 누락되었습니다');
        if (!productData.price || productData.price <= 0) errors.push('올바른 가격을 입력해주세요');
        if (!productData.categoryIndex?.pcId) errors.push('카테고리를 선택해주세요');
        if (!productData.designerIndex) errors.push('디자이너를 선택해주세요');
      } catch (e) {
        errors.push('상품 데이터 형식이 올바르지 않습니다');
        console.error('Product data parsing error:', e);
      }
    }

    const hasImages = formData.getAll('images').length > 0;
    if (!hasImages) {
      errors.push('이미지를 최소 1개 이상 선택해주세요');
    }

    return errors;
  };

  const getCategoryName = (id) => {
    const categories = {
      1: '인테리어',
      2: '수납/정리',
      3: '문구/팬시',
      4: '완구',
      5: '패션/잡화',
      6: '반려동물',
      7: '가구',
      8: '기타'
    };
    return categories[id];
  };

  const handleFinish = async (values) => {
    setLoading(true);
    setMessage('');

    try {
      const formData = new FormData();
      
      const productData = {
        name: values.name,
        content: values.description,
        price: parseInt(values.price),
        categoryIndex: {
          pcId: parseInt(values.category),
          value: getCategoryName(parseInt(values.category))
        },
        designerIndex: parseInt(values.designer)
      };

      console.log('Product Data being sent:', productData);
      const json = JSON.stringify(productData);
      const blob = new Blob([json], {type: "application/json"});
      formData.append("product", blob);

      if (fileList.length > 0) {
        fileList.forEach(file => {
          formData.append('images', file.originFileObj);
        });
      }

      const validationErrors = await validateForm(formData);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join('\n'));
      }

      const accessToken = localStorage.getItem('token');
      if (!accessToken) {
        throw new Error('인증 토큰이 없습니다. 로그인이 필요합니다.');
      }

      const response = await fetch('https://refresh-f5-server.o-r.kr/api/product/add-product', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        mode: 'cors',
        credentials: 'include',
        body: formData
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('인증이 만료되었거나 유효하지 않습니다.');
        }
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `서버 오류: ${response.status}`);
      }

      const responseData = await response.json();
      console.log('Server response data:', responseData);
      
      setMessage('상품이 성공적으로 등록되었습니다.');
      setIsModalOpen(false);
      setFileList([]);
      
      fetchProducts();
      
    } catch (error) {
      console.error('Error details:', error);

      if (error.message === 'Failed to fetch') {
        setMessage('오류: 서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.');
      } else {
        setMessage('오류: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { 
      title: '대표 사진', 
      dataIndex: 'imageUrls', 
      key: 'image',
    
      height: 50,
      render: (imageUrls) => imageUrls && imageUrls.length > 0 ? 
        <img src={imageUrls[0]} alt="product" style={{ width: 50, height: 50 }} /> : 
        <UploadOutlined />
    },
    { title: '상품명', dataIndex: 'name', key: 'name' },
    { 
      title: '가격', 
      dataIndex: 'price', 
      key: 'price',
      render: (price) => `${price.toLocaleString()}원`
    },
    { 
      title: '디자이너', 
      dataIndex: 'designerIndex', 
      key: 'designer',
      render: (designerId) => {
        const designer = designers.find(d => d.id === designerId);
        return designer ? designer.name : designerId;
      }
    },
    { title: '카테고리', dataIndex: ['categoryIndex', 'value'], key: 'category' },
    { 
      title: '설명', 
      dataIndex: 'content', 
      key: 'description',
      ellipsis: true 
    },
  ];

  return (
    <div>
      <Card 
        title="상품 목록" 
        extra={<Button type="primary" onClick={showModal}>등록하기</Button>} 
        style={{ marginBottom: '20px' }}
      >
        <Table 
          dataSource={products} 
          columns={columns} 
          loading={tableLoading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title="상품 등록"
        open={isModalOpen}
        centered
        onCancel={handleCancel}
        footer={null}
        className="custom-modal"
      >
        <Form layout="vertical" onFinish={handleFinish}>
          <Form.Item 
            label="상품 이미지(1MB 미만)" 
            name="images" 
            rules={[{ required: true, message: '이미지를 선택해주세요' }]}
          >
            <Upload
              listType="picture"
              multiple
              fileList={fileList}
              onChange={({ fileList: newFileList }) => setFileList(newFileList)}
              beforeUpload={() => false}
            >
              <Button icon={<UploadOutlined />}>이미지 업로드</Button>
            </Upload>
          </Form.Item>

          <Form.Item 
            label="상품명" 
            name="name" 
            rules={[{ required: true, message: '상품명을 입력해주세요' }]}
          >
            <Input placeholder="상품명을 입력해주세요" />
          </Form.Item>

          <Form.Item 
            label="상품 가격" 
            name="price" 
            rules={[{ required: true, message: '가격을 입력해주세요' }]}
          >
            <Input type="number" min="1" placeholder="상품의 가격을 입력해주세요" />
          </Form.Item>

          <Form.Item 
            label="디자이너" 
            name="designer" 
            rules={[{ required: true, message: '디자이너를 선택해주세요' }]}
          >
            <Select placeholder="디자이너를 선택해주세요">
              {designers.map(designer => (
                <Option key={designer.id} value={designer.id}>
                  {designer.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item 
            label="카테고리" 
            name="category"
            rules={[{ required: true, message: '카테고리를 선택해주세요' }]}
          >
            <Select placeholder="카테고리를 선택해주세요">
              <Option value="1">인테리어</Option>
              <Option value="2">수납/정리</Option>
              <Option value="3">문구/팬시</Option>
              <Option value="4">완구</Option>
              <Option value="5">패션/잡화</Option>
              <Option value="6">반려동물</Option>
              <Option value="7">가구</Option>
              <Option value="8">기타</Option>
            </Select>
          </Form.Item>

          <Form.Item 
            label="상품 설명" 
            name="description"
            rules={[{ required: true, message: '상품 설명을 입력해주세요' }]}
          >
            <Input.TextArea rows={3} placeholder="상품의 설명을 입력해주세요" />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              style={{ marginRight: '10px' }}
            >
              등록하기
            </Button>
            <Button onClick={handleCancel}>취소하기</Button>
          </Form.Item>
        </Form>

        {message && (
          <div 
            style={{ 
              padding: '10px', 
              marginTop: '10px',
              backgroundColor: message.includes('오류') ? '#fff2f0' : '#f6ffed',
              border: `1px solid ${message.includes('오류') ? '#ffccc7' : '#b7eb8f'}`,
              borderRadius: '4px'
            }}
          >
            {message}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminProduct;