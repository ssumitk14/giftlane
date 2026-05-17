import React from 'react';
import { Heart, LayoutDashboard, ShoppingCart, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';

const Navbar = () => {
  const { cartCount, wishlist } = useShop();

  return (
    <header className="site-header">
      <div className="container nav-shell">
        <Link to="/" className="brand">
          <span className="brand-mark">GL</span>
          <span>
            <strong>GiftLane</strong>
            <small>Gift kits & custom boxes</small>
          </span>
        </Link>

        <nav className="desktop-nav">
          <a href="/#kits">Gift Kits</a>
          <Link to="/catalogue">Product Catalogue</Link>
          <Link to="/custom-box">Custom Box</Link>
          <Link to="/wishlist">Wishlist</Link>
          <Link to="/account">My Account</Link>
        </nav>

        <div className="nav-actions">
          <Link className="icon-btn desktop-only" to="/wishlist" aria-label="Wishlist">
            <Heart size={21} />
            {wishlist.length > 0 && <span>{wishlist.length}</span>}
          </Link>
          <Link className="icon-btn desktop-only" to="/account" aria-label="Account"><UserRound size={21} /></Link>
          <Link className="icon-btn desktop-only" to="/admin" aria-label="Admin"><LayoutDashboard size={21} /></Link>
          <Link className="icon-btn" to="/cart" aria-label="Cart">
            <ShoppingCart size={22} />
            {cartCount > 0 && <span>{cartCount}</span>}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
