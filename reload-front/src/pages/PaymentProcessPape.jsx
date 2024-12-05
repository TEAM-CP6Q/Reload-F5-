import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentProcessPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const orderData = location.state?.orderData;

    useEffect(() => {
        console.log('Payment Process Started', { 
            orderData,
            merchantUid: orderData.merchantUid // merchantUid 확인
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
            script.onerror = (error) => {
                console.error('Failed to load IMP script:', error);
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

            const data = {
                pg: 'html5_inicis.INIpayTest',
                pay_method: 'card',
                merchant_uid: orderData.merchantUid ?? null, // null이면 그대로 null로 유지
                name: `주문 상품 (${orderData?.orderItemList?.length || 0}개)`,
                amount: orderData?.orderDTO?.totalPrice || 0,
                buyer_name: orderData?.orderDTO?.consumer || '',
                buyer_email: orderData?.orderDTO?.email || '',
                buyer_tel: orderData?.orderDTO?.phoneNumber || '',
                m_redirect_url: window.location.origin + '/payment-complete',
                currency: 'KRW',
                language: 'ko'
            };

            console.log('Payment request data:', data);

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

                        if (result.status === 200) {
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
                            alert(`결제 내역 생성 실패: ${resultData}`);
                            navigate('/payment-failed');
                        }
                    } catch (error) {
                        console.error('Payment process error:', {
                            error,
                            message: error.message,
                            stack: error.stack
                        });
                        alert(`결제 처리 중 오류 발생: ${error.message}`);
                        navigate('/payment-failed');
                    }
                } else {
                    console.error('Payment failed:', {
                        error_code: response.error_code,
                        error_msg: response.error_msg,
                        response
                    });
                    alert(`결제 실패: [${response.error_code}] ${response.error_msg}`);
                    navigate('/payment-failed');
                }
            });
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
                {process.env.NODE_ENV === 'development' && (
                    <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
                        <p>주문 정보:</p>
                        <pre>{JSON.stringify(orderData, null, 2)}</pre>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentProcessPage;