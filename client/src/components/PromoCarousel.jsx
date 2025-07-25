import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules"; // Removed Navigation
import "swiper/css";
import "swiper/css/pagination";

const slides = [
  {
    title: "₱5,000 OFF on iPhone 16",
    subtitle: "Limited-time offer. Get yours before it’s gone.",
    image: "/promo1.png",
    button: "Shop Now",
  },
  {
    title: "50% OFF on Galaxy Buds",
    subtitle: "Premium sound for half the price.",
    image: "/promo2.png",
    button: "Browse Deals",
  },
  {
    title: "Exclusive Deals for Realme Fans",
    subtitle: "Save big on your next Realme device.",
    image: "/promo3.jpg",
    button: "Explore Now",
  },
];

const PromoCarousel = () => {
  return (
    <div className="relative w-full h-[80vh] cursor-grab active:cursor-grabbing select-none">
      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={0}
        slidesPerView={1}
        loop
        autoplay={{ delay: 5000 }}
        pagination={{
          clickable: true,
          bulletClass: "swiper-pagination-bullet custom-bullet",
          bulletActiveClass: "swiper-pagination-bullet-active custom-bullet-active",
        }}
        className="w-full h-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div
              className="w-full h-full bg-cover bg-center relative flex items-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
      
              <div className="relative z-10 text-white pl-20 pr-6 sm:pl-32 sm:pr-10 md:pl-40 md:pr-12 max-w-2xl">
                <h2 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4 drop-shadow-lg">
                  {slide.title}
                </h2>
                <p className="text-lg md:text-xl mb-6 text-white/90">
                  {slide.subtitle}
                </p>
                <a
                  href="#products"
                  className="inline-block bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
                >
                  {slide.button}
                </a>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Swiper Pagination Styling */}
      <style jsx>{`
        .custom-bullet {
          background-color: #ffffff66;
          width: 10px;
          height: 10px;
          margin: 0 4px !important;
          border-radius: 9999px;
          opacity: 0.6;
          transition: background-color 0.3s, transform 0.3s;
        }

        .custom-bullet-active {
          background-color: #ffffff;
          transform: scale(1.2);
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default PromoCarousel;
