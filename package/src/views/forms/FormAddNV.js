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
  const [soDienThoai, setSoDienThoai] = useState("");
  const [diaChi, setDiaChi] = useState("");
  const [positionId, setPositionId] = useState("");
  const [positions, setPositions] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [existingEmployees, setExistingEmployees] = useState([]);

  // Fetch employees & positions
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/employees", {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${sessionStorage.getItem("authToken")}`,
          },
        });
        setExistingEmployees(response.data.data || []);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    const fetchPositions = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/positions",
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${sessionStorage.getItem("authToken")}`,
            },
          }
        );
        setPositions(response.data.data || []);
      } catch (error) {
        console.error("Error fetching positions:", error);
      }
    };

    fetchEmployees();
    fetchPositions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for duplicate email
    const emailExists = existingEmployees.some(
      (emp) => emp.email?.toLowerCase() === email.toLowerCase()
    );

    if (emailExists) {
      setErrorMessage("Email đã tồn tại.");
      return;
    }

    const employeeData = {
      password: Matkhau,
      email: email,
      name: tenKhachHang,
      phone_number: soDienThoai,
      address: diaChi,
      position_id: positionId,
    };

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/employees/register",
        employeeData,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${sessionStorage.getItem("authToken")}`,
          },
        }
      );

      if (response.status === 201) {
        toast.success("Thêm nhân viên thành công!");
        setIsSuccess(true);
        setErrorMessage("");
        setTaiKhoan("");
        setMatkhau("");
        setEmail("");
        setTenKhachHang("");
        setSoDienThoai("");
        setDiaChi("");
        setPositionId("");
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
          <Label for="matKhau">Mật khẩu</Label>
          <Input
            id="matKhau"
            type="password"
            value={Matkhau}
            onChange={(e) => setMatkhau(e.target.value)}
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
        <FormGroup>
          <Label for="position">Chức vụ</Label>
          <Input
            id="position"
            type="select"
            value={positionId}
            onChange={(e) => setPositionId(e.target.value)}
            required
          >
            <option value="">-- Chọn chức vụ --</option>
            {positions.map((pos) => (
              <option key={pos.id} value={pos.id}>
                {pos.name}
              </option>
            ))}
          </Input>
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
