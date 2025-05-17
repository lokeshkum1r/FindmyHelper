import React, { useState, useEffect } from "react";

const Slider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slides = [
    { id: 1, img: "/Air.jpg", alt: "Image 1" },
    { id: 2, img: "/Appliance.jpg", alt: "Image 2" },
    { id: 3, img: "/Carpenter.jpg", alt: "Image 3" },
    { id: 4, img: "/bike.jpg", alt: "Image 4" },
    { id: 5, img: "/Painter.jpg", alt: "Image 5" },
  ];

  const slidesPerView = 3; // Show 3 slides at a time

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length); // Ensure smooth looping
    }, 3000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
  };

  return (
    <section>
      <div className="slider-container">
        <div
          className="slider"
          style={{
            transform: `translateX(-${(currentIndex * 100) / slidesPerView}%)`,
            width: `${(slides.length * 100) / slidesPerView}%`,
          }}
        >
          {slides.map((slide) => (
            <div key={slide.id} className="slide">
              <div className="box">
                <img src={slide.img} alt={slide.alt} />
              </div>
            </div>
          ))}
        </div>
        <button className="prev" onClick={handlePrev}>
          &#10094;
        </button>
        <button className="next" onClick={handleNext}>
          &#10095;
        </button>
      </div>
    </section>
  );
};

export default Slider;
