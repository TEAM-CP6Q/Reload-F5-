import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Header from '../components/Header';
import '../CSS/OrderList.css';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 전체 상품 목록 가져오기
  const fetchProducts = async () => {
    try {
      const response = await fetch('https://refresh-f5-server.o-r.kr/api/product/latest-product-list', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  };

  // 디자이너 정보 가져오기
  const fetchDesigner = async (designerId) => {
    try {
      const response = await fetch(`https://refresh-f5-server.o-r.kr/api/account/designer/get-designer/${designerId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching designer:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchOrdersAndProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');

        if (!token || !username) {
          navigate('/login');
          return;
        }

        const orderResponse = await fetch(
          `https://refresh-f5-server.o-r.kr/api/payment/order/order-detail/${username}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          }
        );

        if (!orderResponse.ok) {
          throw new Error('Failed to fetch orders');
        }

        const orderData = await orderResponse.json();
        const productsList = await fetchProducts();
        setProducts(productsList);

        const ordersWithDetails = await Promise.all(
          orderData.orderDetails.map(async (order) => {
            const productsWithDetails = await Promise.all(
              order.products.map(async (orderProduct) => {
                const productDetail = productsList.find(p => p.pid === orderProduct.orderProductId);

                if (productDetail) {
                  const designerInfo = await fetchDesigner(productDetail.designerIndex);

                  return {
                    ...orderProduct,
                    name: productDetail.name,
                    content: productDetail.content,
                    imageUrl: productDetail.imageUrls[0],
                    designerName: designerInfo ? designerInfo.name : '알 수 없음',
                    categoryName: productDetail.categoryIndex.value,
                    soldOut: productDetail.soldOut
                  };
                }
                return orderProduct;
              })
            );

            return {
              ...order,
              products: productsWithDetails
            };
          })
        );

        const sortedOrders = ordersWithDetails.sort(
          (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
        );

        setOrders(sortedOrders);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersAndProducts();
  }, [navigate]);

  if (loading) {
    return (
      <div className="order-loading">
        <div className="order-spinner"></div>
      </div>
    );
  }

  return (
    <div className="order-container">
      <Header />
      <div className="order-content">
        {orders.length === 0 ? (
          <div className="order-empty">
            <p>주문 내역이 없습니다</p>
          </div>
        ) : (
          <div className="order-list">
            {orders.map((order) => (
              <div key={order.merchantUid} className="order-card">
                <div className="order-date-section">
                  <span>{formatDate(order.orderDate)}</span>
                </div>
                <div className="order-main">
                  <div className="order-header-section">
                    <span className="order-number">주문번호: {order.orderId}</span>
                  </div>
                  <div className="order-products">
                    {order.products.map((product) => (
                      <div key={product.orderProductId} className="order-product">
                        <div className="order-product-content">
                          <div className="order-product-image-wrapper">
                            {product.imageUrl && (
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="order-product-image"
                              />
                            )}
                          </div>
                          <div className="order-product-details">
                            <span className="order-product-name">{product.name}</span>
                            <div className="order-product-info">
                              <span className="order-product-designer">{product.designerName}</span>
                              <span className="order-product-category">{product.categoryName}</span>
                              <span className="order-product-quantity">수량: {product.amount}개 &#40;개당 {product.price}원&#41;</span>
                            </div>
                          </div>
                          <div className="order-product-price-detail">
                            {/* <div className="order-product-price">
                              {product.price.toLocaleString()}원
                            </div> */}
                            <div className="order-product-price">
                              {product.price * product.amount.toLocaleString()}원
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="order-total-section">
                    <span style={{ fontWeight: '600' }}>총 결제금액</span>
                    <span className="order-total-price">
                      {order.totalPrice.toLocaleString()}원
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderList;