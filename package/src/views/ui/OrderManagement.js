import React, { useState, useEffect } from "react";
import Orderlist from "../forms/orderlist";
import {
  Box,
  Typography,
  Container,
  Grid,
  TextField,
  Button,
  MenuItem,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  Paper,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import axios from "axios";

const OrderManagement = () => {




  return (
    <Container maxWidth="lg-6">
      <Typography variant="h4" align="center" gutterBottom>
        Quản lý đơn hàng
      </Typography>

      <Orderlist />
    </Container>
  );
};

export default OrderManagement;
