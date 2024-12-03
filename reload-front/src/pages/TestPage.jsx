import React, { useState } from 'react';

export default function TestPage() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const validateForm = async (formData) => {
    const errors = [];
    
    // Validate product data
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
        if (!productData.designerIndex) errors.push('디자이너 ID를 입력해주세요');
      } catch (e) {
        errors.push('상품 데이터 형식이 올바르지 않습니다');
        console.error('Product data parsing error:', e);
      }
    }

    // Validate images
    const hasImages = formData.getAll('images').length > 0;
    if (!hasImages) {
      errors.push('이미지를 최소 1개 이상 선택해주세요');
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const formData = new FormData();
      
      // Add product data as a Blob
      const productData = {
        name: e.target.name.value,
        content: e.target.description.value,
        price: parseInt(e.target.price.value),
        categoryIndex: {
          pcId: parseInt(e.target.category.value),
          value: getCategoryName(parseInt(e.target.category.value))
        },
        designerIndex: parseInt(e.target.designer.value)
      };

      console.log('Product Data being sent:', productData);
      const json = JSON.stringify(productData);
      const blob = new Blob([json], {type: "application/json"});
      formData.append("product", blob);

      // Add image files
      const imageFiles = e.target.images.files;
      console.log('Number of images selected:', imageFiles.length);
      for (let i = 0; i < imageFiles.length; i++) {
        formData.append('images', imageFiles[i]);
        console.log('Image file being added:', imageFiles[i].name, 'Size:', imageFiles[i].size);
      }

      // Validate form data before sending
      const validationErrors = await validateForm(formData);
      if (validationErrors.length > 0) {
        console.error('Validation errors:', validationErrors);
        throw new Error(validationErrors.join('\n'));
      }

      const accessToken = localStorage.getItem('token');
      if (!accessToken) {
        throw new Error('인증 토큰이 없습니다. 로그인이 필요합니다.');
      }

      console.log('Sending request to server...');

      // Log FormData contents for debugging
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ', pair[1]);
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

      // Log response details for debugging
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers));

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
      
    } catch (error) {
      console.error('Error details:', {
        message: error.message,
        type: error.name,
        stack: error.stack
      });

      if (error.message === 'Failed to fetch') {
        setMessage('오류: 서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요. CORS 설정을 확인해주세요.');
      } else if (error.message.includes('인증')) {
        setMessage('오류: ' + error.message);
      } else if (error.message.includes('\n')) {
        setMessage('오류: \n' + error.message);
      } else {
        setMessage('오류: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">간단 상품 등록</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">이미지</label>
          <input 
            type="file" 
            name="images" 
            accept="image/*" 
            multiple
            className="w-full" 
            required 
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">상품명</label>
          <input 
            type="text" 
            name="name" 
            required 
            className="w-full p-2 border rounded" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">가격</label>
          <input 
            type="number" 
            name="price" 
            required 
            min="1"
            className="w-full p-2 border rounded" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">디자이너 ID</label>
          <input 
            type="number" 
            name="designer" 
            required 
            min="1"
            className="w-full p-2 border rounded" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">카테고리</label>
          <select 
            name="category" 
            required 
            className="w-full p-2 border rounded"
          >
            <option value="">카테고리 선택</option>
            <option value="1">인테리어</option>
            <option value="2">수납/정리</option>
            <option value="3">문구/팬시</option>
            <option value="4">완구</option>
            <option value="5">패션/잡화</option>
            <option value="6">반려동물</option>
            <option value="7">가구</option>
            <option value="8">기타</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">상품 설명</label>
          <textarea 
            name="description" 
            required 
            className="w-full p-2 border rounded" 
            rows="3" 
          />
        </div>

        <button 
          type="submit" 
          disabled={loading} 
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? '처리중...' : '등록하기'}
        </button>

        {message && (
          <div 
            className={`p-2 rounded whitespace-pre-line ${
              message.includes('오류') ? 'bg-red-100' : 'bg-green-100'
            }`}
          >
            {message}
          </div>
        )}
      </form>
    </div>
  );
}