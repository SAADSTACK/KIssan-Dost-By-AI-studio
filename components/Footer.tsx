import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-earth-900 text-earth-100 py-6 mt-8">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <p className="text-sm opacity-80">
          © 2024 Kissan Dost AI. Empowering Farmers.
        </p>
        <p className="text-xs opacity-50 mt-2">
          Powered by Gemini 2.5 Flash & React
        </p>
      </div>
    </footer>
  );
};

export default Footer;