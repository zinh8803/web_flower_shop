import { useState } from "react";
import {
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FormPosition = () => {
  const [positionName, setPositionName] = useState("");
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmitPosition = async (e) => {
    e.preventDefault();

    if (!positionName.trim() || !description.trim()) {
      setErrorMessage("Vui lòng nhập đầy đủ tên chức vụ và mô tả.");
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/positions",
        {
          name: positionName,
          description: description,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("Thêm chức vụ thành công!");
        setPositionName("");
        setDescription("");
        setErrorMessage("");
      }
    } catch (error) {
      console.error("Error adding position:", error);
      setErrorMessage("Có lỗi xảy ra khi thêm chức vụ.");
      toast.error("Thêm chức vụ thất bại.");
    }
  };

  return (
    <div className="mt-4">
      <h4>Thêm Chức Vụ</h4>

      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      <Form onSubmit={handleSubmitPosition}>
        <FormGroup row>
          <Label for="positionName" sm={2}>
            Tên chức vụ
          </Label>
          <Col sm={10}>
            <Input
              id="positionName"
              name="positionName"
              placeholder="Nhập tên chức vụ"
              type="text"
              value={positionName}
              onChange={(e) => {
                setPositionName(e.target.value);
                setErrorMessage(""); // Clear error when typing
              }}
              required
            />
          </Col>
        </FormGroup>

        <FormGroup row>
          <Label for="description" sm={2}>
            Mô tả
          </Label>
          <Col sm={10}>
            <Input
              id="description"
              name="description"
              placeholder="Nhập mô tả chức vụ"
              type="text"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setErrorMessage("");
              }}
              required
            />
          </Col>
        </FormGroup>

        <Button className="btn btn-success">Lưu</Button>
      </Form>

      <ToastContainer />
    </div>
  );
};

export default FormPosition;
