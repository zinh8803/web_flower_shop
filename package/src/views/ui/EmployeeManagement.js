import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
} from "reactstrap";
import FormOriginUD from "../forms/FormOriginUD";
import FormCate from "../forms/FormCate";
import Forms from "../forms/Forms";
import FormSP from "../forms/FormSP";
import FormAdd from "../forms/FormAdd";
import ProductList from "../forms/test";
import axios from "axios";
import FormOrigin from "../forms/FormOrigin";
import EmployeeList from "../forms/EmployeeList";
import FormAddEmployee from "../forms/FormAddNV";

const EmployeeManagement = () => {
  const [cSelected, setCSelected] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeForm, setActiveForm] = useState("");

  const handleChange = (event) => {
    setCSelected(event.target.value);
  };

 

  return (
    <div>
      <Card>
        <CardTitle tag="h6" className="border-bottom p-3 mb-0">
          <i className="bi fs-3 bi-newspaper me-2"> </i>
          <span className="fs-3"> Quản lý Nhân viên</span>
        </CardTitle>
        <CardBody>
          <div className="mt-3">
            <Button
              className="btn btn-info"
              onClick={() => setActiveForm(activeForm === "AddEmployee" ? "" : "AddEmployee")}>
              {activeForm === "AddEmployee" ? "Đóng Form Thêm" : "Thêm Nhân viên"}
            </Button>
          </div>

          {activeForm === "AddEmployee" && <FormAddEmployee />}
          <EmployeeList />
        </CardBody>
      </Card>


    </div>
  );
};

export default EmployeeManagement;
