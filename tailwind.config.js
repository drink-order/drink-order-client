/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
	  "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
	  "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
	  "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
	  extend: {
		colors: {
		  background: "var(--background)",
		  foreground: "var(--foreground)",
		  primary: "var(--primary)",
		  secondary: "var(--secondary)",
		  black: "var(--black)",
		  black1: "var(--black1)",
		  black2: "var(--black2)",
		  white: "var(--white)",
		  gray1: "var(--gray1)",
		  gray2: "var(--gray2)",
		  gray3: "var(--gray3)",
		  gray4: "var(--gray4)",
		  gray5: "var(--gray5)",
		},
	  },
	},
	plugins: [require("tailwindcss-animate")],
  };