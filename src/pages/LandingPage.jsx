import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';
import WhatsAppButton from '../components/landing/WhatsAppButton';
import MapSection from '../components/landing/MapSection';
import ProductHeroSlider from '../components/landing/ProductHeroSlider';
import FeaturedProducts from '../components/landing/FeaturedProducts';
import StoreHero from '../components/store/StoreHero';
import CategoriesSection from '../components/store/CategoriesSection';
import GymCrossPromo from '../components/store/GymCrossPromo';

// Landing principal — marca LariusSport (LOJA).
// O lado ginásio (Hard Rock) vive em /ginasio.
export default function LandingPage() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        base44.entities.Product.list('-created_date', 50)
            .then(setProducts)
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
            <StoreHero />
            <ProductHeroSlider products={products} />
            <CategoriesSection />
            <FeaturedProducts products={products} />
            <GymCrossPromo />
            <MapSection />
            <Footer />
            <WhatsAppButton />
        </div>
    );
}
