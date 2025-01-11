import Hero from '@/components/Hero';
import Categories from '@/components/Categories';
import FeaturedJobs from '@/components/FeaturedJobs';
import WhyChooseUs from '@/components/WhyChooseUs';
import Testimonials from '@/components/Testimonials';
import CallToAction from '@/components/CallToAction';

const Home: React.FC = () => {
  return (
    <div>
      <Hero />
      <Categories />
      <FeaturedJobs />
      <WhyChooseUs />
      <Testimonials />
      <CallToAction />
    </div>
  );
};

export default Home;
