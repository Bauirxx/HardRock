import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';
import WhatsAppButton from '../components/landing/WhatsAppButton';
import LeadForm from '../components/landing/LeadForm';
import MapSection from '../components/landing/MapSection';
import ServicesSection from '../components/landing/ServicesSection';
import CoachesSection from '../components/landing/CoachesSection';
import TransformationsSection from '../components/landing/TransformationsSection';
import TestimonialsSection from '../components/landing/TestimonialsSection';
import GymHero from '../components/gym/GymHero';
import GymFeatures from '../components/gym/GymFeatures';
import GymScheduleCTA from '../components/gym/GymScheduleCTA';

// Página dedicada ao GINÁSIO (marca Hard Rock).
// Reúne planos, treinadores, transformações e depoimentos reais.
export default function HardRockPage() {
    const [testimonials, setTestimonials] = useState([]);
    const [config, setConfig] = useState(null);

    useEffect(() => {
        base44.entities.Testimonial.filter({ status: 'approved' })
            .then(setTestimonials)
            .catch(() => {});
        base44.entities.Tenant.list('-created_date', 1)
            .then(list => setConfig(list?.[0] || null))
            .catch(() => {});
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen relative">
            {/* Textura de grão subtil */}
            <div
                className="pointer-events-none fixed inset-0 z-[1] opacity-[0.03] mix-blend-overlay"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                    backgroundSize: '128px',
                }}
            />

            <Navbar />
            <GymHero />
            <GymFeatures />
            <div id="planos">
                <ServicesSection />
            </div>
            <CoachesSection />
            <TransformationsSection />
            <TestimonialsSection testimonials={testimonials} />
            <GymScheduleCTA horarios={config?.horarios} />
            <LeadForm />
            <MapSection />
            <Footer />
            <WhatsAppButton />
        </div>
    );
}
