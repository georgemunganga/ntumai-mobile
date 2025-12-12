/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: [
    "./App.tsx",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#08AF97",
        secondary: "#FFE536",
      },
      fontFamily: {
        ubuntu: ["Ubuntu-Regular"],
        "ubuntu-bold": ["Ubuntu-Bold"],
        "ubuntu-light": ["Ubuntu-Light"],
        "ubuntu-medium": ["Ubuntu-Medium"],
      },
    },
  },
  plugins: [],
};
