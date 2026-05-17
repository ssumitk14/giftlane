import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useShop } from '../context/ShopContext';

const WishlistPage = () => {
  const { wishlist, addToCart, toggleWishlist } = useShop();

  return (
    <div>
      <Navbar />
      <main className="catalogue-page">
        <div className="container">
          <div className="catalogue-hero">
            <div>
              <span className="eyebrow">Wishlist</span>
              <h1>Saved items</h1>
              <p>Move saved products into cart when you are ready to order.</p>
            </div>
            <Link className="btn btn-primary" to="/catalogue">Open catalogue</Link>
          </div>
          {wishlist.length === 0 ? (
            <section className="empty-cart-page"><Heart size={42} /><h2>No wishlist items yet</h2><p>Use the heart button on product cards to save products.</p></section>
          ) : (
            <section className="product-grid">
              {wishlist.map(item => (
                <article className="product-card" key={item.id}>
                  <div className="product-media"><img src={item.image} alt={item.name} /></div>
                  <div className="product-body">
                    <small>{item.category}</small>
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    <div className="product-bottom"><strong>₹{item.price}</strong></div>
                    <div className="custom-product-actions">
                      <button className="btn btn-primary" onClick={() => addToCart(item)}><ShoppingBag size={16} /> Move to Cart</button>
                      <button className="btn btn-outline" onClick={() => toggleWishlist(item)}><Trash2 size={16} /> Remove</button>
                    </div>
                  </div>
                </article>
              ))}
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default WishlistPage;
