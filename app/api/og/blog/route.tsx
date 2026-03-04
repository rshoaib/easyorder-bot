import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get('title') || 'OrderViaChat Blog';
    const category = searchParams.get('category') || 'Guide';

    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: 'linear-gradient(135deg, #312e81 0%, #4f46e5 40%, #818cf8 100%)',
                    padding: '60px',
                    fontFamily: 'sans-serif',
                }}
            >
                {/* Grid pattern overlay */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundImage:
                            'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
                        backgroundSize: '40px 40px',
                        display: 'flex',
                    }}
                />

                {/* Content card */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        justifyContent: 'center',
                        background: 'rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '32px',
                        padding: '60px 70px',
                        border: '1px solid rgba(255,255,255,0.2)',
                        maxWidth: '1000px',
                        width: '100%',
                    }}
                >
                    {/* Category badge */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            background: 'rgba(255,255,255,0.2)',
                            borderRadius: '999px',
                            padding: '10px 24px',
                            marginBottom: '30px',
                        }}
                    >
                        <span
                            style={{
                                color: '#ffffff',
                                fontSize: '22px',
                                fontWeight: 700,
                                letterSpacing: '0.05em',
                                textTransform: 'uppercase',
                            }}
                        >
                            {category}
                        </span>
                    </div>

                    {/* Title */}
                    <div
                        style={{
                            color: '#ffffff',
                            fontSize: title.length > 50 ? '48px' : '56px',
                            fontWeight: 800,
                            lineHeight: 1.2,
                            letterSpacing: '-0.02em',
                            display: 'flex',
                        }}
                    >
                        {title}
                    </div>
                </div>

                {/* Footer branding */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        marginTop: '40px',
                    }}
                >
                    {/* Logo square */}
                    <div
                        style={{
                            width: '48px',
                            height: '48px',
                            background: '#ffffff',
                            borderRadius: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '24px',
                            fontWeight: 800,
                            color: '#4f46e5',
                        }}
                    >
                        O
                    </div>
                    <span
                        style={{
                            color: 'rgba(255,255,255,0.85)',
                            fontSize: '28px',
                            fontWeight: 600,
                        }}
                    >
                        OrderViaChat
                    </span>
                </div>
            </div>
        ),
        {
            width: 1200,
            height: 630,
        }
    );
}
