import axios from "axios";
import React, { useEffect, useState } from "react";
const CreatePayment = async () => {
    const [orderInfo, setOrderInfo] = useState('');
    const [amount, setAmount] = useState('');
    const [paymentUrl, setPaymentUrl] = useState('');

    const handlePayment = async () => {
        try {
            const response = await fetch('https://localhost:7000/api/payment/createPayment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    orderInfo,
                    amount,
                }),
            });

            const data = await response.json();
            if (data.paymentUrl) {
                setPaymentUrl(data.paymentUrl);
                window.location.href = data.paymentUrl; // Chuyển hướng đến URL thanh toán MoMo
            } else {
                alert('Lỗi tạo thanh toán!');
            }
        } catch (error) {
            alert('Đã có lỗi xảy ra!');
            console.error(error);
        }
    };

    return (
        <div>
            <h2>Thanh toán MoMo</h2>
            <div>
                <label>Mô tả đơn hàng:</label>
                <input
                    type="text"
                    value={orderInfo}
                    onChange={(e) => setOrderInfo(e.target.value)}
                />
            </div>
            <div>
                <label>Số tiền:</label>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
            </div>
            <button onClick={handlePayment}>Thanh toán MoMo</button>

            {paymentUrl && (
                <p>Chuyển hướng đến thanh toán: <a href={paymentUrl} target="_blank" rel="noopener noreferrer">{paymentUrl}</a></p>
            )}
        </div>
    );
};

export default CreatePayment;
