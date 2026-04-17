import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import Navbar from '../components/landing/Navbar';
import HeroSection from '../components/landing/HeroSection';
import ServicesSection from '../components/landing/ServicesSection';
import FeaturedProducts from '../components/landing/FeaturedProducts';
import TestimonialsSection from '../components/landing/TestimonialsSection';
import LeadForm from '../components/landing/LeadForm';
import MapSection from '../components/landing/MapSection';
import Footer from '../components/landing/Footer';
import WhatsAppButton from '../components/landing/WhatsAppButton';

const HERO_IMAGE = "https://media.base44.com/images/public/69cae95a5b583fd843ebf030/0c854dd5f_generated_483a184e.png";

export default function LandingPage() {
    const [products, setProducts] = useState([]);
    const [testimonials, setTestimonials] = useState([]);
    const [heroSlides, setHeroSlides] = useState([]);

    useEffect(() => {
        // Fetch hero images from Tenant
        base44.entities.Tenant.list().then(tenants => {
            if (tenants && tenants.length > 0) {
                const tenant = tenants[0];
                if (tenant.hero_images && Array.isArray(tenant.hero_images)) {
                    setHeroSlides(tenant.hero_images);
                }
            }
        }).catch(() => { });

        base44.entities.Product.filter({ status: 'active', destaque: true }).then(setProducts).catch(() => { });
        base44.entities.Product.filter({ status: 'active' }).then(p => {
            if (products.length === 0) setProducts(p);
        }).catch(() => { });
        base44.entities.Testimonial.filter({ status: 'approved' }).then(setTestimonials).catch(() => { });
    }, []);

    return (
        <div className="min-h-screen">
            <Navbar />
            <HeroSection heroImage={HERO_IMAGE} slides={heroSlides} />
            <ServicesSection />
            <FeaturedProducts products={products} />
            <TestimonialsSection testimonials={testimonials} />
            <LeadForm />
            <MapSection />
            <Footer />
            <WhatsAppButton />
        </div>
    );
}