import { Link } from "react-router-dom";

const NavBar = () => (
  <nav className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-4 shadow-lg">
    <div className="container mx-auto flex flex-wrap items-center justify-between">
      <Link to="/" className="text-white text-2xl font-bold tracking-wide">ShopEase</Link>
      <button className="block md:hidden text-white focus:outline-none" aria-label="Toggle Menu">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
      </button>
      <div className="w-full md:flex md:items-center md:w-auto hidden md:block">
        <ul className="flex flex-col md:flex-row md:space-x-6 mt-4 md:mt-0">
          <li><Link to="/products" className="text-white hover:text-yellow-300 transition-colors font-medium">Products</Link></li>
          <li><Link to="/cart" className="text-white hover:text-yellow-300 transition-colors font-medium">Cart</Link></li>
          <li><Link to="/orders" className="text-white hover:text-yellow-300 transition-colors font-medium">Orders</Link></li>
          <li><Link to="/login" className="text-white hover:text-yellow-300 transition-colors font-medium">Login</Link></li>
          <li><Link to="/register" className="text-white hover:text-yellow-300 transition-colors font-medium">Register</Link></li>
        </ul>
      </div>
    </div>
  </nav>
);

export default NavBar;
