const Footer: React.FC = () => {
    return (
      <footer className="bg-gray-800 text-white py-6 mt-10">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm">
            © {new Date().getFullYear()} Job Board & Freelance Marketplace. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a
              href="#"
              className="text-gray-400 hover:text-white transition"
              aria-label="Twitter"
            >
              Twitter
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition"
              aria-label="Facebook"
            >
              Facebook
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition"
              aria-label="LinkedIn"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  