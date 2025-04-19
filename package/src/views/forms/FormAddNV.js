import React, { useState, useEffect } from "react";
import { Form, FormGroup, Label, Input, Button, Alert } from "reactstrap";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

const FormAddEmployee = () => {
  const [taiKhoan, setTaiKhoan] = useState("");
  const [Matkhau, setMatkhau] = useState("");
  const [email, setEmail] = useState("");
  const [tenKhachHang, setTenKhachHang] = useState("");
  const [gioiTinh, setGioiTinh] = useState("Nam"); // Default to "Nam"
  const [soDienThoai, setSoDienThoai] = useState("");
  const [diaChi, setDiaChi] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [existingEmployees, setExistingEmployees] = useState([]);

  // Fetch existing employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("http://localhost:7000/api/NhanVien");
        setExistingEmployees(response.data || []);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchEmployees();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for duplicate username or email
    const usernameExists = existingEmployees.some(
      (emp) => emp.taiKhoan.toLowerCase() === taiKhoan.toLowerCase()
    );
    const emailExists = existingEmployees.some(
      (emp) => emp.email.toLowerCase() === email.toLowerCase()
    );

    if (usernameExists) {
      setErrorMessage("Tài khoản đã tồn tại.");
      return;
    }

    if (emailExists) {
      setErrorMessage("Email đã tồn tại.");
      return;
    }

    const employeeData = {
      TaiKhoan: taiKhoan,
      Matkhau: Matkhau,
      Email: email,
      tenKhachHang: tenKhachHang,
      GioiTinh: gioiTinh,
      SoDienThoai: soDienThoai,
      DiaChi: diaChi,
    };

    try {
      const response = await axios.post(
        "http://localhost:7000/api/NhanVien",
        employeeData
      );
      if (response.status === 200) {
        toast.success("Thêm nhân viên thành công!");
        setIsSuccess(true);
        setErrorMessage("");
        setTaiKhoan("");
        setEmail("");
        setTenKhachHang("");
        setGioiTinh("Nam"); // Reset to default value
        setSoDienThoai("");
        setDiaChi("");
      }
    } catch (error) {
      setIsSuccess(false);
      setErrorMessage(
        error.response?.data?.message || "Có lỗi xảy ra khi thêm nhân viên."
      );
      toast.error("Thêm nhân viên thất bại.");
    }
  };

  return (
    <div className="mt-3">
      <h4>Thêm nhân viên mới</h4>

      {errorMessage && <Alert color="danger">{errorMessage}</Alert>}

      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label for="taiKhoan">Tài khoản</Label>
          <Input
            id="taiKhoan"
            type="text"
            value={taiKhoan}
            onChange={(e) => setTaiKhoan(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for="taiKhoan">Mật khẩu</Label>
          <Input
            id="taiKhoan"
            type="password"
            value={Matkhau}
            onChange={(e) => setMatkhau(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for="tenKhachHang">Tên đầy đủ</Label>
          <Input
            id="tenKhachHang"
            type="text"
            value={tenKhachHang}
            onChange={(e) => setTenKhachHang(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for="gioiTinh">Giới tính</Label>
          <Input
            id="gioiTinh"
            type="select"
            value={gioiTinh}
            onChange={(e) => setGioiTinh(e.target.value)}
          >
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
          </Input>
        </FormGroup>
        <FormGroup>
          <Label for="soDienThoai">Số điện thoại</Label>
          <Input
            id="soDienThoai"
            type="text"
            value={soDienThoai}
            onChange={(e) => setSoDienThoai(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for="diaChi">Địa chỉ</Label>
          <Input
            id="diaChi"
            type="text"
            value={diaChi}
            onChange={(e) => setDiaChi(e.target.value)}
            required
          />
        </FormGroup>
        <Button color="primary" type="submit">
          Lưu
        </Button>
      </Form>
      <ToastContainer />
    </div>
  );
};

export default FormAddEmployee;
