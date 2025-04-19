import { Col, Row } from "reactstrap";
import SalesChart from "../components/dashboard/SalesChart";
import Feeds from "../components/dashboard/Feeds";
import ProjectTables from "../components/dashboard/ProjectTable";
import { Box, Typography, Grid, Card, CardMedia, CardContent, Container } from '@mui/material';
import Blog from "../components/dashboard/Blog";
import bg1 from "../assets/images/bg/bg1.jpg";
import bg2 from "../assets/images/bg/bg2.jpg";
import bg3 from "../assets/images/bg/bg3.jpg";
import bg4 from "../assets/images/bg/bg4.jpg";
import '../assets/css/home.css';
import { useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
  
const BlogData = [
  {
    image: bg1,
    title: "This is simple blog",
    subtitle: "2 comments, 1 Like",
    description:
      "This is a wider card with supporting text below as a natural lead-in to additional content.",
    btnbg: "primary",
  },
  {
    image: bg2,
    title: "Lets be simple blog",
    subtitle: "2 comments, 1 Like",
    description:
      "This is a wider card with supporting text below as a natural lead-in to additional content.",
    btnbg: "primary",
  },
  {
    image: bg3,
    title: "Don't Lamp blog",
    subtitle: "2 comments, 1 Like",
    description:
      "This is a wider card with supporting text below as a natural lead-in to additional content.",
    btnbg: "primary",
  },
  {
    image: bg4,
    title: "Simple is beautiful",
    subtitle: "2 comments, 1 Like",
    description:
      "This is a wider card with supporting text below as a natural lead-in to additional content.",
    btnbg: "primary",
  },
];

const Starter = () => {
  const location = useLocation();
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (location.state && location.state.message) {
      setMessage(location.state.message);

      // Xóa thông báo sau 5 giây
      const timer = setTimeout(() => {
        setMessage('');
      }, 5000);

      // Dọn dẹp timer khi component unmount
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  return (
    <Box sx={{ fontFamily: 'Arial, sans-serif', color: '#333' }}>
    {/* Phần giới thiệu */}
    <Box sx={{ textAlign: 'center', backgroundColor: '#FFF7E6', py: 5 }}>
      <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#D84315' }}>
        Chào Mừng Đến Với Shop Hoa Tươi
      </Typography>
      <Typography variant="h6" sx={{ mt: 2, color: '#6D4C41' }}>
        Mang đến những bó hoa tươi thắm cho mọi dịp đặc biệt của bạn!
      </Typography>
    </Box>

    {/* Giới thiệu cửa hàng */}
    <Container sx={{ my: 5 }}>
      <Grid container spacing={4} alignItems="center">
        <Grid item xs={12} md={6}>
          <Typography variant="h4" sx={{ mb: 2, color: '#8D6E63' }}>Giới Thiệu Về Chúng Tôi</Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8, color: '#555' }}>
            Shop Hoa Tươi được thành lập từ năm 2010, mang đến cho khách hàng những bó hoa tươi đẹp nhất. Chúng tôi cam kết sản phẩm hoa luôn tươi mới và dịch vụ giao hàng nhanh chóng, đúng giờ.
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <CardMedia
            component="img"
            image="https://bizweb.dktcdn.net/100/487/411/files/shop-hoa-tuoi-quan-7-hcm.jpg?v=1726122260430"
            alt="Giới thiệu cửa hàng"
            sx={{ borderRadius: 3, boxShadow: 3 }}
          />
        </Grid>
      </Grid>
    </Container>

    {/* Cam kết chất lượng */}
    {/* Cam kết chất lượng */}
<Box sx={{ backgroundColor: '#FBE9E7', py: 5 }}>
  <Container>
    <Typography variant="h4" sx={{ textAlign: 'center', mb: 4, color: '#BF360C' }}>
      Cam Kết Chất Lượng
    </Typography>
    <Grid container spacing={4}>
      {[
        {
          text: 'Hoa luôn tươi mới và được bảo quản cẩn thận.',
          image:
            'https://bizweb.dktcdn.net/thumb/large/100/487/411/products/7ce7dcae-4e2e-47fe-8457-a8ffe03fb4ad.jpg?v=1731985244440',
        },
        {
          text: 'Giao hàng miễn phí trong nội thành.',
          image:
            'https://hoatuoiciti.com/timthumb.php?src=upload/sanpham/4f04fa979dc84efc9cd17e21143fa170-1710822586.jpeg&w=273&h=280&zc=1&q=80',
        },
        {
          text: 'Thiết kế hoa độc đáo, phù hợp mọi sự kiện.',
          image:
            'https://hoatuoiciti.com/timthumb.php?src=upload/sanpham/z5817742168550a4904a2db9454a4dffe27fe32e3c4567-1725981606.jpg&w=273&h=280&zc=1&q=80',
        },
      ].map((item, index) => (
        <Grid item xs={12} md={4} key={index}>
          <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
            <CardMedia
              component="img"
              image={item.image}
              alt={item.text}
              sx={{
                height: 200,
                objectFit: 'cover', // Đảm bảo hình ảnh vừa khít với thẻ Card
                borderRadius: '8px 8px 0 0', // Bo góc trên
              }}
            />
            <CardContent>
              <Typography
                variant="body1"
                sx={{ textAlign: 'center', fontWeight: 'bold', color: '#6D4C41' }}
              >
                {item.text}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  </Container>
</Box>

    {/* Dịch vụ */}
    <Container sx={{ my: 5 }}>
      <Typography variant="h4" sx={{ textAlign: 'center', mb: 4, color: '#6D4C41' }}>Dịch Vụ Của Chúng Tôi</Typography>
      <Grid container spacing={4}>
        {[
          { title: 'Giao Hoa Tận Nơi', description: 'Dịch vụ giao hoa nhanh chóng, đúng hẹn và đảm bảo chất lượng.', image: 'https://hoatuoiciti.com/timthumb.php?src=upload/sanpham/img0519-1721119901.jpeg&w=273&h=280&zc=1&q=80' },
          { title: 'Cắm Hoa Sự Kiện', description: 'Dịch vụ trang trí hoa cho đám cưới, hội nghị và các sự kiện lớn nhỏ.', image: 'https://hoatuoiciti.com/timthumb.php?src=upload/sanpham/untitled-design-9-1725983767.png&w=273&h=280&zc=1&q=80' },
          { title: 'Đặt Hoa Online', description: 'Dễ dàng đặt hoa online với vài cú nhấp chuột.', image: 'https://hoatuoiciti.com/timthumb.php?src=upload/sanpham/z4335111134426a9ff61df06e69f76d900d12ac08e4e10-1710863854.jpg&w=273&h=280&zc=1&q=80' },
        ].map((service, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
              <CardMedia component="img" height="200" image={service.image} alt={service.title} />
              <CardContent>
                <Typography variant="h6" sx={{ color: '#D84315', mb: 1 }}>{service.title}</Typography>
                <Typography variant="body2" sx={{ color: '#555' }}>{service.description}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>

    {/* Ưu đãi và khuyến mãi */}
    <Box sx={{ backgroundColor: '#FFCCBC', py: 5, textAlign: 'center' }}>
      <Typography variant="h4" sx={{ color: '#BF360C', mb: 2 }}>Ưu Đãi & Khuyến Mãi</Typography>
      <Typography variant="body1" sx={{ color: '#6D4C41', maxWidth: '600px', mx: 'auto' }}>
        Nhận ưu đãi hấp dẫn khi mua hàng và đăng ký tài khoản thành viên. Đừng bỏ lỡ các chương trình khuyến mãi giảm giá từ chúng tôi!
      </Typography>
    </Box>
  </Box>
  );
};

export default Starter;
