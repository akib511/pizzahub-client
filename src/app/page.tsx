import FeaturedMenu from '@/components/home/FeaturedMenu';
import Hero from '@/components/home/Hero';
import Navbar from '@/components/shared/Navbar';
import React from 'react';

const page = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <FeaturedMenu />
    </div>
  );
};

export default page;