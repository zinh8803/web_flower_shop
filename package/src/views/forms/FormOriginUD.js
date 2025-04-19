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

const FormOriginUD = () => {
  const [origins, setOrigins] = useState([]);
  const [selectedOrigin, setSelectedOrigin] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [originName, setOriginName] = useState("");
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchOrigins();
  }, []);

  const fetchOrigins = async () => {
    try {
      const response = await axios.get("http://localhost:7000/api/XuatXu");
      setOrigins(response.data || []);
    } catch (error) {
      console.error("Error fetching origins:", error);
    }
  };

  const handleEdit = (origin) => {
    setSelectedOrigin(origin);
    setOriginName(origin.tenXuatXu);
    setModalOpen(true);
  };

  const handleDeleteClick = (origin) => {
    setSelectedOrigin(origin);
    setConfirmDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:7000/api/XuatXu/${selectedOrigin.idXuatXu}`);
      toast.success("Xóa nguồn gốc thành công!");
      fetchOrigins();
      setConfirmDeleteModal(false);
    } catch (error) {
      setErrorMessage("Có lỗi xảy ra khi xóa nguồn gốc.");
      console.error("Error deleting origin:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!originName.trim()) {
      setErrorMessage("Tên nguồn gốc không thể trống.");
      return;
    }

    try {
        // Send PUT request to the API
        const response = await axios.put(
          `http://localhost:7000/api/XuatXu/${selectedOrigin.idXuatXu}`,
          originName, // Send the updated name as a string
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
  
        if (response.status === 200) {
          toast.success("Cập nhật xuất xứ thành công!");
          setModalOpen(false); // Close the modal after successful update
          fetchOrigins(); // Refresh the origins list
       
        }
      } catch (error) {
        const errorMsg =
          error.response?.data || "Có lỗi xảy ra khi cập nhật xuất xứ.";
        setErrorMessage(errorMsg);
      }
    
  };

  return (
    <div>
      <h4>Quản lý nguồn gốc sản phẩm</h4>
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      <Table striped>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên nguồn gốc</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {origins.map((origin) => (
            <tr key={origin.idXuatXu}>
              <td>{origin.idXuatXu}</td>
              <td>{origin.tenXuatXu}</td>
              <td>
                <Button color="warning" onClick={() => handleEdit(origin)} className="me-2">
                  Sửa
                </Button>
                <Button color="danger" onClick={() => handleDeleteClick(origin)}>
                  Xóa
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Edit Modal */}
      <Modal isOpen={modalOpen} toggle={() => setModalOpen(false)}>
        <ModalHeader toggle={() => setModalOpen(false)}>Sửa nguồn gốc sản phẩm</ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="originName">Tên nguồn gốc</Label>
              <Input
                id="originName"
                type="text"
                value={originName}
                onChange={(e) => setOriginName(e.target.value)}
                required
              />
            </FormGroup>
            <ModalFooter>
              <Button color="primary" type="submit" >
                Lưu thay đổi
              </Button>{" "}
              <Button color="secondary" onClick={() => setModalOpen(false)}>
                Hủy
              </Button>
            </ModalFooter>
          </Form>
        </ModalBody>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={confirmDeleteModal} toggle={() => setConfirmDeleteModal(false)}>
        <ModalHeader toggle={() => setConfirmDeleteModal(false)}>Xác nhận xóa nguồn gốc</ModalHeader>
        <ModalBody>
          Bạn chắc chắn muốn xóa nguồn gốc <strong>{selectedOrigin?.tenXuatXu}</strong> không?
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={handleDelete}>
            Xóa
          </Button>{" "}
          <Button color="secondary" onClick={() => setConfirmDeleteModal(false)}>
            Hủy
          </Button>
        </ModalFooter>
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default FormOriginUD;
