import React, { useEffect, useRef, useState } from "react";
import { Row, Col, Card, CardBody, CardTitle } from "reactstrap";
import axios from "axios";
import Chart from "chart.js/auto";
import InvoiceTable from "./ui/listHoaDon"
const RevenueCharts = () => {
  const chartRef1 = useRef(null); // Ref cho biểu đồ 1
  const chartRef2 = useRef(null); // Ref cho biểu đồ 2
  const chartRef3 = useRef(null); // Ref cho biểu đồ 3

  const [dailyRevenue, setDailyRevenue] = useState({ labels: [], data: [] }); // Dữ liệu biểu đồ 1
  const [monthlyRevenue, setMonthlyRevenue] = useState({ labels: [], data: [] }); // Dữ liệu biểu đồ 2
  const [quarterlyRevenue, setQuarterlyRevenue] = useState({ labels: [], data: [] }); // Dữ liệu biểu đồ 3
  const [totalDailyRevenue, setTotalDailyRevenue] = useState(0); // Tổng doanh thu 7 ngày
  const [totalMonthlyRevenue, setTotalMonthlyRevenue] = useState(0); // Tổng doanh thu 30 ngày
  const [totalQuarterlyRevenue, setTotalQuarterlyRevenue] = useState(0); // Tổng doanh thu 4 tháng

  const destroyChart = (chartRef) => {
    if (chartRef.current && chartRef.current.chart) {
      chartRef.current.chart.destroy();
    }
  };

  const fetchData = async (url, setData, setTotal) => {
    try {
      const response = await axios.get(url);
      const { hoaDons } = response.data;

      const revenueByDay = hoaDons.reduce((acc, bill) => {
        const date = bill.ngayTao.split("T")[0];
        acc[date] = (acc[date] || 0) + bill.tongtien;
        return acc;
      }, {});

      const labels = Object.keys(revenueByDay);
      const data = Object.values(revenueByDay);
      const totalRevenue = data.reduce((sum, value) => sum + value, 0);

      setData({ labels, data });
      setTotal(totalRevenue);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData("http://localhost:7000/api/HoaDon/7days", setDailyRevenue, setTotalDailyRevenue);
    fetchData("http://localhost:7000/api/HoaDon/1month", setMonthlyRevenue, setTotalMonthlyRevenue);
    fetchData("http://localhost:7000/api/HoaDon/4months", setQuarterlyRevenue, setTotalQuarterlyRevenue);
  }, []);

  useEffect(() => {
    // Vẽ biểu đồ 1 (Line Chart - 7 ngày)
    destroyChart(chartRef1);
    if (dailyRevenue.labels.length > 0 && dailyRevenue.data.length > 0) {
      const ctx1 = chartRef1.current.getContext("2d");
      chartRef1.current.chart = new Chart(ctx1, {
        type: "line",
        data: {
          labels: dailyRevenue.labels,
          datasets: [
            {
              label: "Doanh thu theo ngày (7 ngày)",
              data: dailyRevenue.data,
              borderColor: "rgb(75, 192, 192)",
              tension: 0.1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              title: { display: true, text: "Ngày" },
            },
            y: {
              title: { display: true, text: "Doanh thu (VND)" },
              beginAtZero: true,
            },
          },
        },
      });
    }

    // Vẽ biểu đồ 2 (Bar Chart - 30 ngày)
    destroyChart(chartRef2);
    if (monthlyRevenue.labels.length > 0 && monthlyRevenue.data.length > 0) {
      const ctx2 = chartRef2.current.getContext("2d");
      chartRef2.current.chart = new Chart(ctx2, {
        type: "bar",
        data: {
          labels: monthlyRevenue.labels,
          datasets: [
            {
              label: "Doanh thu theo ngày (30 ngày)",
              data: monthlyRevenue.data,
              backgroundColor: "rgba(153, 102, 255, 0.6)",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              title: { display: true, text: "Ngày" },
            },
            y: {
              title: { display: true, text: "Doanh thu (VND)" },
              beginAtZero: true,
            },
          },
        },
      });
    }

    // Vẽ biểu đồ 3 (Line Chart - 4 tháng)
    destroyChart(chartRef3);
    if (quarterlyRevenue.labels.length > 0 && quarterlyRevenue.data.length > 0) {
      const ctx3 = chartRef3.current.getContext("2d");
      chartRef3.current.chart = new Chart(ctx3, {
        type: "line",
        data: {
          labels: quarterlyRevenue.labels,
          datasets: [
            {
              label: "Doanh thu theo ngày (4 tháng)",
              data: quarterlyRevenue.data,
              borderColor: "rgb(255, 159, 64)",
              tension: 0.1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              title: { display: true, text: "Ngày" },
            },
            y: {
              title: { display: true, text: "Doanh thu (VND)" },
              beginAtZero: true,
            },
          },
        },
      });
    }
  }, [dailyRevenue, monthlyRevenue, quarterlyRevenue]);

  return (
    <Row>

      <Row>
        {/* Biểu đồ 1 */}
        <Col md="4">
          <Card>
            <CardBody>
              <CardTitle tag="h5">Biểu đồ 1: Doanh thu 7 ngày (Line Chart)</CardTitle>
              <div style={{ height: "200px" }}>
                <canvas ref={chartRef1}></canvas>
              </div>
              <p className="text-center mt-3">
                <strong>Tổng doanh thu: {totalDailyRevenue.toLocaleString()} VND</strong>
              </p>
            </CardBody>
          </Card>
        </Col>

        {/* Biểu đồ 2 */}
        <Col md="4">
          <Card>
            <CardBody>
              <CardTitle tag="h5">Biểu đồ 2: Doanh thu 30 ngày (Bar Chart)</CardTitle>
              <div style={{ height: "200px" }}>
                <canvas ref={chartRef2}></canvas>
              </div>
              <p className="text-center mt-3">
                <strong>Tổng doanh thu: {totalMonthlyRevenue.toLocaleString()} VND</strong>
              </p>
            </CardBody>
          </Card>
        </Col>

        {/* Biểu đồ 3 */}
        <Col md="4">
          <Card>
            <CardBody>
              <CardTitle tag="h5">Biểu đồ 3: Doanh thu 4 tháng (Line Chart)</CardTitle>
              <div style={{ height: "200px" }}>
                <canvas ref={chartRef3}></canvas>
              </div>
              <p className="text-center mt-3">
                <strong>Tổng doanh thu: {totalQuarterlyRevenue.toLocaleString()} VND</strong>
              </p>
            </CardBody>
          </Card>
        </Col>

      </Row>
      <InvoiceTable />
    </Row>
  );
};

export default RevenueCharts;
