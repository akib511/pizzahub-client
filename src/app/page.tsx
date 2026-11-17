import AboutUs from '@/components/home/AboutUs';
import CTA from '@/components/home/CTA';
import FeaturedMenu from '@/components/home/FeaturedMenu';
import Hero from '@/components/home/Hero';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import Footer from '@/components/shared/Footer';
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
      <CTA />
      <Footer />
    </div>
  );
};

export default page;