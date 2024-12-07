import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import "../CSS/PaymentProcessPage.css";

const PaymentProcessPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const orderData = location.state?.orderData;

    const deleteFailedOrder = async (orderId) => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            
            const response = await fetch(`https://refresh-f5-server.o-r.kr/api/payment/order/delete-order-list/${orderId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (!response.ok) {
                console.error('Failed to delete order:', {
                    status: response.status,
                    statusText: response.statusText
                });
            }
            
            return response.ok;
        } catch (error) {
            console.error('Error deleting failed order:', error);
            return false;
        }
    };

    useEffect(() => {
        // URL에서 결제 상태 파라미터 확인
        const urlParams = new URLSearchParams(window.location.search);
        const paymentStatus = urlParams.get('imp_success');
        
        // 모바일 결제 후 리디렉션된 경우
        if (paymentStatus !== null) {
            const imp_uid = urlParams.get('imp_uid');
            const merchant_uid = urlParams.get('merchant_uid');
            
            if (paymentStatus === 'false') {
                // 결제 실패 또는 취소된 경우
                console.log('Mobile payment cancelled or failed');
                deleteFailedOrder(orderData?.orderId).then(() => {
                    navigate('/payment-failed', {
                        state: {
                            error: '결제가 취소되었거나 실패했습니다.'
                        }
                    });
                });
                return;
            }
        }

        console.log('Payment Process Started', { 
            orderData,
            merchantUid: orderData?.merchantUid
        });
        
        if (!orderData) {
            console.error('Order data is missing', { location });
            alert('주문 정보가 없습니다.');
            navigate('/cart');
            return;
        }

        const loadIamportScript = () => {
            console.log('Loading IMP script...');
            const script = document.createElement('script');
            script.src = 'https://cdn.iamport.kr/v1/iamport.js';
            script.async = true;
            script.onerror = async (error) => {
                console.error('Failed to load IMP script:', error);
                await deleteFailedOrder(orderData.orderId);
                alert('결제 모듈 로드에 실패했습니다.');
                navigate('/payment-failed');
            };
            document.body.appendChild(script);
            return script;
        };

        const script = loadIamportScript();

        script.onload = () => {
            console.log('IMP script loaded successfully');
            const IMP = window.IMP;
            IMP.init("imp87540676");

            // 모바일 환경 체크
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

            const data = {
                pg: 'html5_inicis.INIpayTest',
                pay_method: 'card',
                merchant_uid: orderData.merchantUid ?? null,
                name: `주문 상품 (${orderData?.orderItemList?.length || 0}개)`,
                amount: orderData?.orderDTO?.totalPrice || 0,
                buyer_name: orderData?.orderDTO?.consumer || '',
                buyer_email: orderData?.orderDTO?.email || '',
                buyer_tel: orderData?.orderDTO?.phoneNumber || '',
                m_redirect_url: `${window.location.origin}/payment-process`,
                currency: 'KRW',
                language: 'ko',
                // 모바일에서 결제 취소시 돌아올 URL 추가
                popup: !isMobile // 모바일에서는 popup: false로 설정
            };

            console.log('Payment request data:', data);

            // PC 환경에서의 콜백 처리
            if (!isMobile) {
                IMP.request_pay(data, async (response) => {
                    console.log('IMP payment response:', response);

                    if (response.success) {
                        try {
                            const paymentData = {
                                paymentUid: response.imp_uid,
                                orderUid: orderData.orderId
                            };
                            
                            console.log('Sending payment data to server:', paymentData);

                            const result = await fetch('https://refresh-f5-server.o-r.kr/api/payment/create', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(paymentData)
                            });

                            const resultData = await result.text();
                            console.log('Server response:', {
                                status: result.status,
                                data: resultData
                            });

                            if (result.status === 201) {
                                console.log('Payment process completed successfully');
                                navigate('/payment-complete', {
                                    state: {
                                        orderInfo: orderData,
                                        paymentInfo: response
                                    }
                                });
                            } else {
                                console.error('Payment creation failed:', {
                                    status: result.status,
                                    response: resultData
                                });
                                await deleteFailedOrder(orderData.orderId);
                                alert(`결제 내역 생성 실패: ${resultData}`);
                                navigate('/payment-failed');
                            }
                        } catch (error) {
                            console.error('Payment process error:', error);
                            await deleteFailedOrder(orderData.orderId);
                            alert(`결제 처리 중 오류 발생: ${error.message}`);
                            navigate('/payment-failed');
                        }
                    } else {
                        console.error('Payment failed:', {
                            error_code: response.error_code,
                            error_msg: response.error_msg
                        });
                        await deleteFailedOrder(orderData.orderId);
                        alert(`결제 실패: [${response.error_code}] ${response.error_msg}`);
                        navigate('/payment-failed');
                    }
                });
            } else {
                // 모바일 환경에서는 콜백 없이 리디렉션 방식으로 처리
                IMP.request_pay(data);
            }
        };

        return () => {
            console.log('Cleaning up payment process page');
            if (script.parentNode) {
                document.body.removeChild(script);
            }
        };
    }, [orderData, navigate, location]);

    return (
        <div className="payment-process-container">
            <div className="payment-process-content">
                <h2>결제 처리 중...</h2>
                <p>잠시만 기다려주세요. 결제 창이 나타납니다.</p>
            </div>
        </div>
    );
};

export default PaymentProcessPage;