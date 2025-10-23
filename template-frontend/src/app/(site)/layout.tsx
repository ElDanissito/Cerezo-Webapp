'use client';

import { useState, useEffect } from 'react';

// ⚠️ Si estos CSS son globales, muévelos al layout raíz (ver punto 2).
// import './css/euclid-circular-a-font.css';
// import './css/style.css';

import Header from '@/components/site/Header';
import HeaderSpacer from '@/components/site/HeaderSpacer';
import Footer from '@/components/site/Footer';

import { ModalProvider } from './context/QuickViewModalContext';
import { CartModalProvider } from './context/CartSidebarModalContext';
import { ReduxProvider } from '@/features/site/redux/provider';
import QuickViewModal from '@/components/site/Common/QuickViewModal';
import CartSidebarModal from '@/components/site/Common/CartSidebarModal';
import { PreviewSliderProvider } from './context/PreviewSliderContext';
import PreviewSliderModal from '@/components/site/Common/PreviewSlider';

import ScrollToTop from '@/components/site/Common/ScrollToTop';
import PreLoader from '@/components/site/Common/PreLoader';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(t);
  }, []);

  // Importante: nada de <html>/<body> aquí
  return loading ? (
    <PreLoader />
  ) : (
    <>
      <ReduxProvider>
        <CartModalProvider>
          <ModalProvider>
            <PreviewSliderProvider>
              <Header />
              <HeaderSpacer />
              {/* Calculate header height and set a CSS variable so main can offset dynamically */}
              <div
                id="site-main-wrapper"
                style={{
                  // default fallback in case JS doesn't run yet
                  paddingTop: '6rem',
                }}
              >
                {children}
              </div>

              <QuickViewModal />
              <CartSidebarModal />
              <PreviewSliderModal />
            </PreviewSliderProvider>
          </ModalProvider>
        </CartModalProvider>
      </ReduxProvider>

      <ScrollToTop />
      <Footer />
    </>
  );
}
