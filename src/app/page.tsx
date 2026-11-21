import AboutUs from '@/components/home/AboutUs';
import CTA from '@/components/home/CTA';
import FeaturedMenu from '@/components/home/FeaturedMenu';
import Hero from '@/components/home/Hero';
import HowItWorks from '@/components/home/HowItWorks';
import PizzaCategories from '@/components/home/PizzaCategories';

import WhyChooseUs from '@/components/home/WhyChooseUs';
import Footer from '@/components/shared/Footer';



const page = () => {
  return (
    <div>
      
      <Hero />
      <FeaturedMenu />
      <PizzaCategories />
      <WhyChooseUs />
      <HowItWorks />
      <AboutUs />
    
      <CTA />
      <Footer />
    </div>
  );
};

export default page;