import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow } from "swiper/modules";

const FoodCardSwiperSkeleton: React.FC<{ title?: string }> = ({ title }) => {
  return (
    <div className="w-full py-12">
      {/* Title Skeleton */}
      <div className="h-7 w-56 bg-gray-200 rounded-md mb-6 animate-pulse" />

      <Swiper
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={"auto"}
        loop={true}
        coverflowEffect={{
          rotate: 30,
          stretch: 0,
          depth: 200,
          modifier: 1,
          slideShadows: false,
        }}
        modules={[EffectCoverflow]}
        className="mySwiper !flex items-stretch"
      >
        {[...Array(5)].map((_, index) => (
          <SwiperSlide
            key={index}
            style={{ width: "300px" }}
            className="!h-auto flex"
          >
            <div className="flex h-full items-center justify-center px-3 py-5 w-full">
              <div className="w-full h-full max-w-md mx-auto bg-white rounded-3xl shadow-lg overflow-hidden animate-pulse">
                
                {/* Image Skeleton */}
                <div className="w-full h-44 bg-gray-200" />

                {/* Content Skeleton */}
                <div className="p-4 sm:p-6 space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                  <div className="h-5 bg-gray-200 rounded w-1/3" />

                  <div className="space-y-2 mt-4">
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-4 bg-gray-200 rounded w-5/6" />
                    <div className="h-4 bg-gray-200 rounded w-4/6" />
                  </div>
                </div>

              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default FoodCardSwiperSkeleton;
