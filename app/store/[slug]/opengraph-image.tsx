import { ImageResponse } from 'next/og';
import { getTenantRepository } from '@/lib/repository';

export const runtime = 'nodejs';
export const alt = 'Store Preview';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: { slug: string } }) {
  const repo = getTenantRepository();
  const tenant = await repo.getTenantBySlug(params.slug);
  
  const name = tenant?.name || 'OrderViaChat Store';
  const themeColor = tenant?.themeColor || '#2563eb'; // Default blue

  return new ImageResponse(
    (
      <div
        style={{
          background: `linear-gradient(to bottom right, #0f172a, ${themeColor})`,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          color: 'white',
          textAlign: 'center',
          padding: '40px',
        }}
      >
        {/* Icon / Badge */}
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255,255,255,0.1)',
            padding: '12px 24px',
            borderRadius: '50px',
            marginBottom: '40px',
            border: '1px solid rgba(255,255,255,0.2)',
            fontSize: 24,
            fontWeight: 600,
        }}>
            🛍️ OrderViaChat
        </div>

        {/* Store Name */}
        <div style={{ 
            fontSize: 80, 
            fontWeight: 900, 
            lineHeight: 1.1,
            marginBottom: '30px',
            textShadow: '0 4px 10px rgba(0,0,0,0.3)',
            backgroundImage: 'linear-gradient(to bottom, #ffffff, #e2e8f0)',
            backgroundClip: 'text',
            color: 'transparent',
        }}>
            {name}
        </div>

        {/* Tagline / CTA */}
        <div style={{ 
            fontSize: 32, 
            color: '#94a3b8',
            maxWidth: '800px',
            lineHeight: 1.5,
        }}>
           Browse our menu and order directly on WhatsApp.
        </div>

        {/* Footer */}
        <div style={{
            position: 'absolute',
            bottom: 40,
            fontSize: 20,
            opacity: 0.6,
        }}>
            {process.env.NEXT_PUBLIC_BASE_URL?.replace(/^https?:\/\//, '') || 'orderviachat.com'}/store/{params.slug}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
