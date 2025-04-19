import React, { useState, useEffect } from "react";
import image1 from "../../assets/images/banner/image_banner1.jpg";
import image2 from "../../assets/images/banner/image_banner2.jpg";
import image3 from "../../assets/images/banner/image_banner3.jpg";

function Banner() {
    const [activeIndex, setActiveIndex] = useState(0);

    const images = [
        { src: image1, alt: "Image 1" },
        { src: image2, alt: "Image 2" },
        { src: image3, alt: "Image 3" },
    ];

    const goToPrev = () => {
        setActiveIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    };

    const goToNext = () => {
        setActiveIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    };

    useEffect(() => {
        const interval = setInterval(() => {
            goToNext();
        }, 2000);

        return () => clearInterval(interval); 
    }, []);

    return (
        <div className="container">
            <div className="row">
                <div id="carouselExampleFade" className="carousel slide carousel-fade">
                    <div className="carousel-inner">
                        {images.map((image, index) => (
                            <div
                                key={index}
                                className={`carousel-item ${index === activeIndex ? "active" : ""}`}
                            >
                                <img
                                    src={image.src}
                                    className="d-block w-100 img-fluid"
                                    alt={image.alt}
                                    style={{
                                        maxHeight: "500px", // Giới hạn chiều cao tối đa
                                        objectFit: "cover",
                                    }}
                                />
                            </div>
                        ))}
                    </div>

                    <button
                        className="carousel-control-prev"
                        type="button"
                        onClick={goToPrev}
                        aria-label="Previous"
                    >
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>

                    <button
                        className="carousel-control-next"
                        type="button"
                        onClick={goToNext}
                        aria-label="Next"
                    >
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Banner;
