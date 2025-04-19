import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Grid,
  Alert,
} from '@mui/material';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submittedData, setSubmittedData] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !email || !message) {
      alert('Vui lòng điền đầy đủ thông tin.');
      return;
    }

    setSubmittedData({
      name,
      email,
      message,
    });

    // Reset form
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography
          variant="h4"
          sx={{ mb: 3, textAlign: 'center', color: '#D84315', fontWeight: 'bold' }}
        >
          Liên Hệ Với Chúng Tôi
        </Typography>

        {/* Hiển thị form nếu chưa gửi */}
        {!submittedData ? (
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={3}>
              {/* Họ và tên */}
              <Grid item xs={12}>
                <TextField
                  label="Họ và tên"
                  variant="outlined"
                  fullWidth
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nhập họ và tên của bạn"
                />
              </Grid>

              {/* Email */}
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  type="email"
                  variant="outlined"
                  fullWidth
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nhập email của bạn"
                />
              </Grid>

              {/* Tin nhắn */}
              <Grid item xs={12}>
                <TextField
                  label="Tin nhắn"
                  variant="outlined"
                  fullWidth
                  required
                  multiline
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Nhập tin nhắn của bạn"
                />
              </Grid>

              {/* Nút gửi */}
              <Grid item xs={12} sx={{ textAlign: 'center' }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{ px: 5, borderRadius: 2 }}
                >
                  Gửi
                </Button>
              </Grid>
            </Grid>
          </Box>
        ) : (
          // Hiển thị thông tin đã gửi
          <Box textAlign="center">
            <Alert severity="success" sx={{ mb: 3 }}>
              Cảm ơn bạn đã liên hệ với chúng tôi!
            </Alert>
            <Typography variant="h6">
              <strong>Họ và tên:</strong> {submittedData.name}
            </Typography>
            <Typography variant="h6">
              <strong>Email:</strong> {submittedData.email}
            </Typography>
            <Typography variant="h6">
              <strong>Tin nhắn:</strong> {submittedData.message}
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default Contact;
