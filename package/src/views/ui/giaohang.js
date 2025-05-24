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
import DeliveryReceiptPage from "../forms/listgiaohang"
import FormPositionUD from "../forms/FormPosition";
import Calendar from "../forms/FormSchedules";
import FormPosition from "../forms/FormthemPosition";
import FormSchedule from "../forms/schedules";
const Giaohang = () => {
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
          <span className="fs-3"> Quản lý chức vụ và lịch trình</span>
        </CardTitle>
        <CardBody>
          <div className="mt-3">

          </div>

          <Card>
            <CardTitle tag="h6" className="border-bottom p-3 mb-0">
              <i className="bi fs-3 bi-newspaper me-2"> </i>
              <span className="fs-3"> Quản lý chức vụ </span>
            </CardTitle>
            <CardBody>
              <Button
                className="btn btn-info ms-5"
                onClick={() => setActiveForm(activeForm === "addchucvu" ? "" : "addchucvu")}>
                {activeForm === "addchucvu" ? "Đóng Form Chức vụ" : "Thêm Chức vụ"}
              </Button>

              <FormPositionUD />
              {activeForm === "addchucvu" && <FormPosition />}
            </CardBody>
          </Card>



          <Card>
            <CardTitle tag="h6" className="border-bottom p-3 mb-0">
              <i className="bi fs-3 bi-newspaper me-2"> </i>
              <span className="fs-3"> Quản lý lịch trình </span>
            </CardTitle>
            <CardBody>
              <Button
                className="btn btn-info ms-5"
                onClick={() => setActiveForm(activeForm === "addlichtrinh" ? "" : "addlichtrinh")}>
                {activeForm === "addlichtrinh" ? "Đóng Form Thêm lịch trình" : "Thêm lịch trình"}

              </Button>
              {activeForm === "addlichtrinh" && <FormSchedule />}
              <Calendar />

            </CardBody>
          </Card>
        </CardBody>
      </Card>


    </div>
  );
};

export default Giaohang;
