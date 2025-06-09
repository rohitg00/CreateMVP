import PricingSection from '../components/PricingSection';
import { Helmet } from 'react-helmet';
import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';

export default function PricingPage() {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Set visibility after component mount for animations
    setIsVisible(true);
  }, []);

  return (
    <>
      <Helmet>
        <title>Pricing - CreateMVP</title>
        <meta 
          name="description" 
          content="Choose the plan that fits your needs. Start with our free tier and upgrade anytime to access premium features." 
        />
      </Helmet>
      
      <Layout hideFooter={true}>
        <main className="flex-grow">
          <PricingSection isVisible={isVisible} />
        </main>
      </Layout>
    </>
  );
}