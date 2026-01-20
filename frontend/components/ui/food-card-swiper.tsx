import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import { EffectCoverflow, Pagination } from 'swiper/modules';


interface MenuItems {
    _id: string;
    name: string;
    price: string;
    description: string;
    category: string;
    image: string;
    isAvailable: boolean;
}

interface Items {
    title?: string;
    items: MenuItems[];
}

const FoodCardSwiper: React.FC<Items> = ({title, items}) => {

    return (
        <div className="w-full py-12" style={{ padding: '50px 0' }}>
        <h3 className="text-2xl font-semibold mb-6 border-b-2 border-indigo-300 pb-2 text-indigo-900">
            {title}
        </h3>
        <Swiper
            effect={'coverflow'}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={'auto'}
            loop={true}
            autoHeight={false}
            coverflowEffect={{
            rotate: 30,
            stretch: 0,
            depth: 200,
            modifier: 1,
            slideShadows: false,
            }}
            modules={[EffectCoverflow, Pagination]}
            className="mySwiper !flex items-stretch"
        >
            {items.map((item, index) => (
            <SwiperSlide key={index} style={{ width: '300px' }} className="!h-auto flex">
            <div className='flex h-full items-center justify-center px-3 py-5'>
                <div className='w-full h-full max-w-md  mx-auto bg-white rounded-3xl shadow-lg overflow-hidden'>
                    <div className='max-w-md mx-auto'>
                    <div className='w-full h-full object-cover'>
                        <img src={`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/images/${item.image}`}alt={item.name} />
                    </div>
                    <div className='p-4 sm:p-6'>
                        <p className='font-bold text-gray-700 text-[22px] leading-7 mb-1'>{item.name}</p>
                        <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">{item.category}</span>
                        <div className='flex flex-row'>
                        {/* <p className='text-[#3C3C4399] text-[17px] mr-2 line-through'>MVR 700</p> */}
                        <p className='text-[17px] font-bold text-[#0FB478]'>৳ {item.price}</p>
                        </div>
                        <p className='text-[#7C7C80] font-[15px] mt-6'>{item.description}</p>


                        {/* <a target='_blank' href='foodiesapp://food/1001' className='block mt-10 w-full px-4 py-3 font-medium tracking-wide text-center capitalize transition-colors duration-300 transform bg-[#FFC933] rounded-[14px] hover:bg-[#FFC933DD] focus:outline-none focus:ring focus:ring-teal-300 focus:ring-opacity-80'>
                            View on foodies
                        </a>
                        <a target='_blank' href="https://apps.apple.com/us/app/id1493631471" className='block mt-1.5 w-full px-4 py-3 font-medium tracking-wide text-center capitalize transition-colors duration-300 transform rounded-[14px] hover:bg-[#F2ECE7] hover:text-[#000000dd] focus:outline-none focus:ring focus:ring-teal-300 focus:ring-opacity-80'>
                            Download app
                        </a> */}
                    </div>
                    </div>
                </div>
            </div>
            </SwiperSlide>
            ))}
        </Swiper>
        </div>
    );
}

export default FoodCardSwiper;

// https://swiperjs.com/demos