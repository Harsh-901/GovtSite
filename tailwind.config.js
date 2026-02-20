/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'govt-blue': '#1e3a8a',
                'govt-saffron': '#ff9933',
                'govt-green': '#138808',
            },
        },
    },
    plugins: [],
}
