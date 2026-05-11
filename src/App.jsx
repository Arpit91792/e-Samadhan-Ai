import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Departments from './components/Departments';
import HowItWorks from './components/HowItWorks';
import Analytics from './components/Analytics';
import WhyChooseUs from './components/WhyChooseUs';
import Testimonials from './components/Testimonials';
import CTA from './components/CTA';
import Footer from './components/Footer';

export default function App() {
      return (
            <div className="min-h-screen font-sans">
                  <Navbar />
                  <main>
                        <Hero />
                        <Features />
                        <Departments />
                        <HowItWorks />
                        <Analytics />
                        <WhyChooseUs />
                        <Testimonials />
                        <CTA />
                  </main>
                  <Footer />
            </div>
      );
}
