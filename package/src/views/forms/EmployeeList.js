import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [employeeData, setEmployeeData] = useState({
    email: "",
    name: "",
    phone_number: "",
    address: "",
    position_id: "",
  });

  const [deleteModal, setDeleteModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);
  const token = sessionStorage.getItem("authToken");
  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/employees"
        , {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );
      setEmployees(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching employees:", error);
      setLoading(false);
    }
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setEmployeeData({
      email: employee.email,
      name: employee.name,
      phone: employee.phone,
      address: employee.address,
      position_id: employee.position_id,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://127.0.0.1:8000/api/employees/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success("Xóa nhân viên thành công!");
        setEmployees(employees.filter((emp) => emp.id !== id));
        setDeleteModal(false);
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi xóa nhân viên.");
      setDeleteModal(false);
    }
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/employees/${editingEmployee.id}`,
        employeeData,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success("Cập nhật nhân viên thành công!");
        setEmployees((prev) =>
          prev.map((emp) =>
            emp.id === editingEmployee.id ? { ...emp, ...employeeData } : emp
          )
        );
        setEditingEmployee(null);
      }
    } catch (error) {
      console.error("Error updating employee:", error);
      toast.error("Cập nhật nhân viên thất bại.");
    }
  };

  const handleCancel = () => {
    setEditingEmployee(null);
  };

  const toggleDeleteModal = (employee) => {
    setEmployeeToDelete(employee);
    setDeleteModal(!deleteModal);
  };

  if (loading) {
    return <p>Loading employees...</p>;
  }

  return (
    <div className="employee-container">
      <h1>Danh sách nhân viên</h1>
      <Table striped>
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Họ và tên</th>
            <th>Chức vụ</th>
            <th>Số điện thoại</th>
            <th>Địa chỉ</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.id}</td>
              <td>{employee.email}</td>
              <td>{employee.name}</td>
              <td>{employee.position.name}</td>
              <td>{employee.phone}</td>
              <td>{employee.address}</td>
              <td>
                <Button color="warning" onClick={() => handleEdit(employee)} className="me-2">
                  Sửa
                </Button>
                <Button color="danger" onClick={() => toggleDeleteModal(employee)}>
                  Xóa
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Edit Modal */}
      <Modal isOpen={editingEmployee !== null} toggle={handleCancel}>
        <ModalHeader toggle={handleCancel}>Sửa thông tin nhân viên</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="email">Email</Label>
              <Input
                type="email"
                name="email" // ✅ đúng
                value={employeeData.email}
                onChange={handleInputChange}
              />
            </FormGroup>

            <FormGroup>
              <Label for="name">Họ và tên</Label>
              <Input
                type="text"
                name="name" // ✅ đúng
                value={employeeData.name}
                onChange={handleInputChange}
              />
            </FormGroup>

            <FormGroup>
              <Label for="phone">Số điện thoại</Label>
              <Input
                type="text"
                name="phone" // ✅ đúng
                value={employeeData.phone}
                onChange={handleInputChange}
              />
            </FormGroup>

            <FormGroup>
              <Label for="address">Địa chỉ</Label>
              <Input
                type="text"
                name="address" // ✅ đúng
                value={employeeData.address}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="position_id">Chức vụ</Label>
              <Input
                type="select"
                name="position_id"
                value={employeeData.position_id}
                onChange={handleInputChange}
              >
                <option value="">-- Chọn chức vụ --</option>
                {employees[0]?.position &&
                  [...new Set(employees.map((e) => JSON.stringify(e.position)))]
                    .map((str) => JSON.parse(str))
                    .map((pos) => (
                      <option key={pos.id} value={pos.id}>
                        {pos.name}
                      </option>
                    ))}
              </Input>
            </FormGroup>

          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleSave}>
            Lưu
          </Button>
          <Button color="secondary" onClick={handleCancel}>
            Hủy
          </Button>
        </ModalFooter>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={deleteModal} toggle={() => setDeleteModal(!deleteModal)}>
        <ModalHeader toggle={() => setDeleteModal(!deleteModal)}>
          Xác nhận xóa nhân viên
        </ModalHeader>
        <ModalBody>
          Bạn có chắc chắn muốn xóa nhân viên{" "}
          <strong>{employeeToDelete?.name}</strong> không?
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={() => handleDelete(employeeToDelete.id)}>
            Xóa
          </Button>
          <Button color="secondary" onClick={() => setDeleteModal(false)}>
            Hủy
          </Button>
        </ModalFooter>
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default EmployeeList;
