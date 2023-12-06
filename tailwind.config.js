// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     './pages/**/*.{js,ts,jsx,tsx,mdx}',
//     './components/**/*.{js,ts,jsx,tsx,mdx}',
//     './app/**/*.{js,ts,jsx,tsx,mdx}',
//   ],
//   theme: {
//     screens: {
//       // 'mob': '640px',
//       // => @media (min-width: 640px) { ... }

//     },
//     extend: {
//       // backgroundImage: {
//       //   'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
//       //   'gradient-conic':
//       //     'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
//       // },
      
//     },
//   },
//   plugins: [],

//   // plugins: {
//   //   'postcss-import': {},
//   //   'tailwindcss/nesting': {},
//   //   tailwindcss: {},
//   //   autoprefixer: {},
//   // }
// }



/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
    // screens: {
    //         'mob': '400px',
    //         // => @media (min-width: 640px) { ... }
      
    //       },
  },
  plugins: [],
}
