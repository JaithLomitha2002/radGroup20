const Footer = () => {
    return (
      <div className="bg-gradient-to-r from-indigo-700 to-rose-700 py-8">
        <div className="container mx-auto flex justify-between items-center">
          <span className="text-3xl text-white font-bold tracking-tight">
            BookNinja.com
          </span>
          <span className="text-white font-bold tracking-tight flex gap-6">
            <p className="cursor-pointer">Privacy Policy</p>
            <p className="cursor-pointer">Terms of Service</p>
          </span>
        </div>
      </div>
    );
  };
  
  export default Footer;