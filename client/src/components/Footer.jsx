const Footer = () => {
  return (
    <footer className="bg-black text-white mt-12">
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <h3 className="text-xl font-bold mb-4">TechStore</h3>
          <p className="text-sm text-gray-400">
            Your one-stop shop for the latest gadgets and unbeatable deals. Shop with confidence.
          </p>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-3">Explore</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><a href="#products" className="hover:text-white">Products</a></li>
            <li><a href="#brands" className="hover:text-white">Brands</a></li>
            <li><a href="/cart" className="hover:text-white">Cart</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-3">Support</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><a href="#" className="hover:text-white">Contact Us</a></li>
            <li><a href="#" className="hover:text-white">FAQs</a></li>
            <li><a href="#" className="hover:text-white">Returns</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-3">Stay Connected</h4>
          <form className="flex flex-col gap-2">
            <input
              type="email"
              placeholder="Your email"
              className="px-4 py-2 rounded bg-gray-800 text-sm placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button className="bg-primary text-primary-foreground py-2 px-4 rounded font-medium hover:bg-primary/90 transition">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-gray-800 mt-6 py-4 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} TechStore. All rights reserved.
      </div>
    </footer>
  );
};


export default Footer;
