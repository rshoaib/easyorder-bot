import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
            },
            typography: {
                DEFAULT: {
                    css: {
                        color: 'rgb(71 85 105)', // text-slate-600
                        p: {
                            color: 'rgb(71 85 105)', // text-slate-600
                            lineHeight: '1.625',
                            marginBottom: '2rem', // mb-8
                            fontSize: '1.125rem', // text-lg
                        },
                        h2: {
                            color: 'rgb(15 23 42)', // text-slate-900
                            fontWeight: '700',
                            marginTop: '3rem', // mt-12
                            marginBottom: '1rem', // mb-4
                            fontSize: '1.5rem', // text-2xl
                        },
                        h3: {
                            color: 'rgb(15 23 42)', // text-slate-900
                            fontWeight: '700',
                            marginTop: '2rem', // mt-8
                            marginBottom: '1rem', // mb-4
                            fontSize: '1.25rem', // text-xl
                        },
                        strong: {
                            color: 'rgb(15 23 42)', // text-slate-900
                            fontWeight: '700',
                        },
                        a: {
                            color: 'rgb(79 70 229)', // text-indigo-600
                            fontWeight: '600',
                            textDecoration: 'none',
                            '&:hover': {
                                textDecoration: 'underline',
                            },
                        },
                        ul: {
                            listStyleType: 'none',
                            paddingLeft: '0',
                        },
                        li: {
                            marginTop: '0.5rem',
                            marginBottom: '0.5rem',
                        },
                    },
                },
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
};
export default config;
