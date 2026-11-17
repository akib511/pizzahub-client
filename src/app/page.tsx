import AboutUs from '@/components/home/AboutUs';
import FeaturedMenu from '@/components/home/FeaturedMenu';
import Hero from '@/components/home/Hero';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import Navbar from '@/components/shared/Navbar';
import React from 'react';

const page = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <FeaturedMenu />
      <WhyChooseUs />
      <AboutUs />
    </div>
  );
};

export default page;