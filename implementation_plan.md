# Full Implementation Plan: GiftLane E-Commerce & Admin Platform

This document outlines the complete roadmap to transform **GiftLane 110** from a basic prototype into a fully functional, production-ready, mobile-first retail storefront and management portal.

---

## 🛠️ Phase 1: Database & Authentication Setup (Supabase)

### 1.1 Complete Database Schema Setup
We will establish a multi-table relational schema on Supabase.
*   **`users`**: Profiles extending Supabase Auth (`id`, `name`, `phone`, `address`).
*   **`categories`**: Grouping products/kits (`id`, `name`, `slug`, `type` [product/ready_made_kit], `is_active`).
*   **`products`**: Catalogue items for custom boxes and general browsing (`id`, `category_id`, `name`, `sku`, `price`, `stock_quantity`, `image_url`, `is_active`).
*   **`ready_made_kits`**: Pre-curated gift boxes (`id`, `name`, `price`, `stock_quantity`, `image_url`).
*   **`ready_made_kit_items`**: Mapping table detailing what products go into each kit.
*   **`cart` / `cart_items`**: Server-side persistence of shopping carts (syncs with local storage for guests).
*   **`coupons`**: Discount rules (`code`, `discount_type` [flat/percentage], `discount_value`, `min_order_value`, `is_active`).
*   **`orders` / `order_items`**: Comprehensive order archiving and details for status tracking.
*   **`wishlist`**: Customer wishlist storage.
*   **`inventory_logs`**: Stock movement logs for auditing.

### 1.2 Authentication Integration
*   Configure **Supabase Auth** on the frontend using email/password signup.
*   Create an `AuthContext` to manage auth sessions globally in React.
*   Implement clean Login/Signup UI pages.

---

## 🛍️ Phase 2: Storefront & Ready-Made Kits Catalog

### 2.1 Dynamic Product Catalog
*   Fetch categories and products dynamically from Supabase instead of local mocks.
*   Add filtering, search, and loading skeleton states.

### 2.2 Ready-Made Kits Page
*   Create a specialized browse flow for the kits:
    *   ₹299 Kits, ₹399 Kits, ₹499 Kits
*   Show active stock status and prevent adding out-of-stock items to the cart.

---

## 📦 Phase 3: Custom Box Flow & Cart Upgrade

### 3.1 Step-by-Step Custom Box Page (`/custom-box`)
*   Add packaging/box selection (standard vs. premium).
*   Implement real-time pricing summing up selected items + chosen box price.
*   Allow saving the custom box structure (`custom_boxes` table) so users can share or reload it later.

### 3.2 Advanced Cart Page
*   Support mixed carts: ready-made kits, standalone products, and custom boxes together.
*   Enable delivery slot selection (e.g., Morning, Afternoon, Evening).
*   Add coupon application logic that queries Supabase for active, non-expired codes and applies rules (minimum cart value).

### 3.3 Dynamic WhatsApp Order Generation
*   Format the checkout payload into a clear, premium message showing:
    *   Customer Details & Address
    *   Delivery Slot
    *   Itemized breakdown (standalone products, custom box elements)
    *   Applied coupons & discount summary
    *   Final Total

---

## 👥 Phase 4: Account Portal & Order Tracking

### 4.1 Wishlist
*   Implement the heart icon toggle on all product cards.
*   Persistent storage in Supabase for logged-in users.

### 4.2 Account Dashboard
*   "My Profile" area to edit address and phone number.
*   "Order History" displaying past purchases with detailed packing lists.
*   "Order Tracking": Status indicators (Pending ➔ Confirmed ➔ Packed ➔ Out for Delivery ➔ Delivered).

---

## 👑 Phase 5: Power-User Admin Dashboard

### 5.1 Product & Kit Management
*   Full CRUD forms to upload images, set stock, edit prices, and categorize products.
*   Toggle visibility (hide/show) of products and categories in real time.

### 5.2 Order Management Portal
*   Central queue showing all orders placed.
*   One-click order status updates that automatically log changes and trigger inventory adjustments.

### 5.3 Coupon Manager
*   Add, edit, disable, or delete coupon codes easily.
*   Configure parameters (discount amount, usage limit, expiry date).

---

## 📐 Verification & Testing Strategy
*   **API Verification**: Unit test all database requests in post-deployment staging.
*   **Security Policies**: Apply Supabase Row Level Security (RLS) to ensure users can only access their own profile, cart, and orders.
*   **Mobile Experience**: Emulate and verify interactive elements on iOS/Android viewports.
