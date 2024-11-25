import React, { useState, useEffect } from 'react';
import { Table, Typography } from 'antd';
import '../../CSS/admin/AdminAllUser.css'; // CSS 파일을 별도로 만들어 중앙 정렬 스타일 적용

const { Text } = Typography;

const AdminAllUser = ({ showTopUsers }) => {
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('https://refresh-f5-server.o-r.kr/api/account/user-list');
        const data = await response.json();
        const formattedData = Object.values(data).map((user) => ({
          key: user.id,
          email: Object.keys(data).find((email) => data[email].id === user.id),
          ...user,
        }));
        setUserData(formattedData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const columns = [
    { title: '이름', dataIndex: 'name', key: 'name' },
    { title: '이메일', dataIndex: 'email', key: 'email' },
    { title: '전화번호', dataIndex: 'phoneNumber', key: 'phoneNumber' },
    { title: '우편번호', dataIndex: 'postalCode', key: 'postalCode' },
    { title: '도로명 주소', dataIndex: 'roadNameAddress', key: 'roadNameAddress' },
    { title: '상세 주소', dataIndex: 'detailedAddress', key: 'detailedAddress' },
  ];

  const dataSource = showTopUsers ? userData.slice(0, 5) : userData;

  return (
    <>
      <Text style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>전체 유저 정보</Text>
      <Table
       dataSource={dataSource}
        columns={columns}
        pagination={{
          pageSize: 10,
          showSizeChanger: false,
          showQuickJumper: true,
          position: ["bottomCenter"], // 페이지네이션을 하단 중앙에 배치
        }}
        className="custom-pagination-table"
      />
    </>
  );
};

export default AdminAllUser;
