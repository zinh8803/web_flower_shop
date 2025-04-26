import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const RevenueCharts = () => {
  const [invoices, setInvoices] = useState([]);
  const [filterType, setFilterType] = useState("week");
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/invoices");
        setInvoices(response.data.data);
      } catch (error) {
        console.error("Error fetching invoices:", error);
      }
    };

    fetchInvoices();
  }, []);

  useEffect(() => {
    const filtered = filterInvoices(invoices, filterType);

    const cashTotal = calculateTotal(filterByPaymentMethod(filtered, "cash"));
    const vnpayTotal = calculateTotal(filterByPaymentMethod(filtered, "vnpay"));

    setChartData([
      { name: "Cash", revenue: cashTotal },
      { name: "VNPAY", revenue: vnpayTotal },
    ]);
  }, [invoices, filterType]);

  const isThisWeek = (date) => {
    const now = new Date();
    const firstDayOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 1));
    firstDayOfWeek.setHours(0, 0, 0, 0);
    const lastDayOfWeek = new Date(firstDayOfWeek);
    lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
    lastDayOfWeek.setHours(23, 59, 59, 999);
    return date >= firstDayOfWeek && date <= lastDayOfWeek;
  };

  const isThisMonth = (date) => {
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  };

  const isThisYear = (date) => {
    const now = new Date();
    return date.getFullYear() === now.getFullYear();
  };

  const filterInvoices = (invoices, type) => {
    return invoices.filter((invoice) => {
      const date = new Date(invoice.created_at);
      if (type === "week") return isThisWeek(date);
      if (type === "month") return isThisMonth(date);
      if (type === "year") return isThisYear(date);
      return false;
    });
  };

  const filterByPaymentMethod = (invoices, method) => {
    return invoices.filter(
      (invoice) => invoice.order_id && invoice.order_id.payment_method === method
    );
  };

  const calculateTotal = (invoices) => {
    return invoices.reduce((sum, invoice) => {
      const totalPrice = invoice.order_id ? parseFloat(invoice.order_id.total_price) : 0;
      return sum + totalPrice;
    }, 0);
  };

  return (
    <div>
      <h2 className="text-center mb-4">Doanh thu theo phương thức thanh toán</h2>
      <div className="text-center mb-3">
        <button
          className={`btn btn-${filterType === "week" ? "primary" : "outline-primary"} mx-1`}
          onClick={() => setFilterType("week")}
        >
          Tuần này
        </button>
        <button
          className={`btn btn-${filterType === "month" ? "success" : "outline-success"} mx-1`}
          onClick={() => setFilterType("month")}
        >
          Tháng này
        </button>
        <button
          className={`btn btn-${filterType === "year" ? "warning" : "outline-warning"} mx-1`}
          onClick={() => setFilterType("year")}
        >
          Năm nay
        </button>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value) => `${value.toLocaleString()} VNĐ`} />
          <Legend />
          <Bar dataKey="revenue" fill="#8884d8" name="Doanh thu" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueCharts;