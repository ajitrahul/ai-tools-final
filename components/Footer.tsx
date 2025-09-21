const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-secondary mt-12 py-6">
      <div className="container mx-auto px-4 text-center text-text-secondary">
        <p>&copy; {currentYear} AI Tools Directory. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;