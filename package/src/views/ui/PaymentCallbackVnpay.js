import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Alert, Button, Container, Row, Col } from "reactstrap";

const PaymentCallbackVnpay = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [txnRef, setTxnRef] = useState(null);
  const [amount, setAmount] = useState(null);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const status = query.get("vnp_TransactionStatus");
    const txnRef = query.get("vnp_TxnRef");
    const amount = query.get("vnp_Amount");
    const orderDetails = JSON.parse(localStorage.getItem("orderDetails")) || {};
    const userData = JSON.parse(sessionStorage.getItem("user")) || {};

    setTxnRef(txnRef);
    setAmount(amount);

    const placeVNpayOrder = async () => {
      const orderData = {
        khachhangId: userData.id,
        tenKhachHang: userData.tenKhachHang || "Khách hàng chưa xác định",
        diaChi: orderDetails.address || "Địa chỉ chưa xác định",
        sodienthoai: orderDetails.phone || "Số điện thoại chưa xác định",
        phuongThucThanhToan: "Vnpay",
        tongtien: amount / 100, 
        chiTietDonHangs: orderDetails.cart.map((item) => ({
          hangHoaId: item.idSanPham,
          soLuong: item.quantity,
        })),
      };

      try {
        await axios.post("http://localhost:7000/api/DonHang", orderData);
        localStorage.removeItem("cart");
        localStorage.removeItem("orderDetails");
      } catch (error) {
        console.error("Có lỗi khi lưu đơn hàng VNPay:", error);
      }
    };

    if (status === "00" || status === "200") {
      placeVNpayOrder();
      setPaymentStatus("success");
    } else {
      console.log(status);
      setPaymentStatus("failure");
    }
  }, [location.search]);

  const handleRedirect = () => {
    navigate("/");
  };

  return (
    <Container className="text-center mt-5">
      <Row>
        <Col>
          {paymentStatus === "success" ? (
            <Alert color="success">
              <h4>Thanh toán thành công!</h4>
              <p>
                Giao dịch <strong>{txnRef}</strong> đã được xử lý thành công.
              </p>
              <p>
                Số tiền thanh toán:{" "}
                <strong>{(amount / 100).toLocaleString()} VND</strong>
              </p>
              <Button color="primary" onClick={handleRedirect}>
                Quay lại trang chủ
              </Button>
            </Alert>
          ) : paymentStatus === "failure" ? (
            <Alert color="danger">
              <h4>Thanh toán thất bại!</h4>
              <p>
                Giao dịch <strong>{txnRef}</strong> không thành công. Vui lòng thử
                lại.
              </p>
              <Button color="danger" onClick={handleRedirect}>
                Quay lại trang chủ
              </Button>
            </Alert>
          ) : (
            <Alert color="info">
              <h4>Đang xử lý...</h4>
              <p>Vui lòng đợi trong khi chúng tôi xử lý giao dịch của bạn.</p>
            </Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default PaymentCallbackVnpay;
