# Website Development Requirement: Gift Kit & Custom Box E-commerce Website

## 1. Project Overview

I want to build an attractive, modern, and mobile-friendly e-commerce-style website for selling **ready-made gift kits** and **customizable gift boxes**.

The website should allow customers to:

- Browse pre-designed gift kits
- Create their own gift box by selecting products from a catalogue
- Add products/kits to cart
- Apply coupon discounts
- Place orders through WhatsApp checkout
- Login and save their details
- View order history
- Track orders
- Save wishlist items
- Save and share custom boxes

**Business WhatsApp number for checkout:** `+91 92047 99288`

The website should be clean, visually appealing, fast, easy to use, and designed with a **mobile-first approach**.

---

## 2. Core Website Features

### 2.1 Home Page

The home page should be visually attractive and conversion-focused.

#### Hero Section

The hero section should include:

- Attractive banner
- Clear headline
- Short description
- Call-to-action buttons:
  - `Shop Gift Kits`
  - `Create Your Own Box`

#### Featured Products Section

This section should display popular or recommended ready-made kits.

Each product card should show:

- Product image
- Product name
- Price
- Short description
- `Add to Cart` button

#### Category Section

The category section should display:

- Kids Return Gifts
- Festival & Pooja Kits
- Corporate & Bulk Gifting
- Utility Kits
- Custom Box

#### How It Works Section

This section should explain the customer journey in a simple way:

1. Choose a ready-made kit or create your own box.
2. Add products to cart.
3. Checkout via WhatsApp.
4. Get delivery in the selected time slot.

#### Promotional Banner Section

This section can show:

- Current offers
- Discounts
- Bulk order messaging
- Festival kits
- Seasonal promotions

---

## 3. Ready-Made Gift Kits

Customers should be able to browse and buy ready-made gift kits.

### 3.1 Ready-Made Kit Categories

#### Kids Return Gift Kits

- ₹299 Kit
- ₹399 Kit
- ₹499 Kit

#### Festival & Pooja Kits

- ₹299 Kit
- ₹399 Kit
- ₹499 Kit

#### Corporate & Bulk Gifting Kits

- ₹299 Kit
- ₹399 Kit
- ₹499 Kit

#### Utility Kits

- ₹299 Kit
- ₹399 Kit
- ₹499 Kit

### 3.2 Required Functionality

The ready-made gift kit section should allow users to:

- Select a gift kit category.
- View all kits under that category.
- View product image, name, price, description, and stock status.
- Select quantity.
- Add the gift kit to cart.
- View cart.
- Proceed to WhatsApp checkout.

Each product card should include:

- Product image
- Product name
- Price
- Short description
- Stock status
- Quantity selector
- `Add to Cart` button

---

## 4. Custom Box / Make Your Own Kit Flow

This is one of the most important features of the website.

### 4.1 User Flow

1. User clicks on the `Create Your Own Box` button from the home page.
2. User is redirected to the custom box page.
3. User first selects a box or packaging option.
4. User browses products from the product catalogue.
5. User adds products to the custom box.
6. User updates product quantities if needed.
7. The total price updates automatically in real time.
8. User views the final custom box summary.
9. User can save or share the custom box.
10. User can add the custom box to cart.
11. User can checkout through WhatsApp.

### 4.2 Required Functionality

The custom box flow should include:

- Box/packaging selection
- Category-wise product catalogue
- Add product to custom box
- Remove product from custom box
- Increase or decrease product quantity
- Automatic price calculation
- Final custom box summary
- Save custom box option
- Share custom box option
- Add custom box to cart
- WhatsApp checkout

The custom box summary should show:

- Selected box type
- Selected box price
- Selected products
- Product-wise quantity
- Product-wise price
- Subtotal
- Coupon discount, if applied
- Final total

---

## 5. Custom Product Catalogue Categories

The custom box product catalogue should include the following categories and items.

### 5.1 Stationery

- Pencil box
- Pencil
- Eraser
- Sharpener
- Scale/ruler
- Sketch pen
- Crayons
- Colour pencils
- Ball pen
- Gel pen
- Cartoon pen
- Mini diary
- Cartoon notebook
- Drawing book
- Sticker sheet
- Name label stickers
- Geometry box
- Glue stick
- Small scissors
- Highlighter
- Marker
- Sticky notes
- Bookmark
- Exam pad
- Pencil grip
- Correction tape
- Mini stamp set

### 5.2 Pooja

- Roli
- Chawal
- Diya
- Agarbatti
- Camphor
- Kumkum
- Haldi
- Rice
- Cotton wicks

### 5.3 Shringar

- Bindi
- Hair clips
- Rubber bands
- Hair pins

### 5.4 Utility

- Small pouch
- Keychain
- Hand towel
- Mini mirror
- Comb
- Nail cutter
- Safety pins
- Sewing kit
- Mini torch
- Water bottle
- Lunch box
- Tiffin box
- Small storage box
- Coin pouch
- Travel pouch
- Tissue pack
- Wet wipes
- Sanitizer bottle
- Soap case
- Toothbrush cover

---

## 6. Cart Page

The cart page should be simple, clear, and easy to use.

### 6.1 Required Functionality

The cart page should allow users to:

- View all selected products, ready-made kits, and custom boxes.
- Update quantity.
- Remove items from cart.
- Apply coupon code.
- View subtotal.
- View discount amount.
- View final total.
- Proceed to WhatsApp checkout.

### 6.2 WhatsApp Checkout

On checkout, the website should generate a WhatsApp message and redirect the customer to WhatsApp.

The WhatsApp message should include:

- Customer name
- Phone number
- Address
- Selected delivery slot
- Product details
- Quantity
- Price
- Coupon applied
- Final total
- Order type:
  - Ready-made kit
  - Custom box

#### Example WhatsApp Message

```txt
Hello, I want to place an order.

Customer Details:
Name:
Phone:
Address:
Delivery Slot:

Order Details:
1. Kids Return Gift Kit - ₹299 x 2
2. Custom Box:
   - Box Type: Premium Gift Box
   - Pencil Box x 1
   - Crayons x 2
   - Mini Diary x 1

Coupon Applied: FESTIVE10
Total Amount: ₹850

Please confirm the order.
````

---

## 7. Customer Login and Account Section

The website should have a customer login and signup feature.

### 7.1 Required Functionality

Customers should be able to:

* Create an account.
* Login.
* Logout.
* Save personal details:

  * Name
  * Phone number
  * Address
* View order history.
* Track order status.
* Save wishlist products.
* Save custom boxes.
* Share custom boxes.

---

## 8. Wishlist Feature

Customers should be able to add products to their wishlist and checkout later.

### 8.1 Required Functionality

The wishlist feature should allow users to:

* Add products to wishlist.
* Remove products from wishlist.
* Move wishlist items to cart.
* Save wishlist for logged-in users.

---

## 9. Admin Portal

There should be a separate admin portal or dashboard where I can manage the website data.

### 9.1 Product Management

Admin should be able to:

* Add new products.
* Edit existing products.
* Delete products.
* Hide or show products.
* Update product images.
* Update product price.
* Update product description.
* Update stock quantity.
* Mark product as in stock or out of stock.
* Assign product to a category.
* Mark products as featured.

### 9.2 Category Management

Admin should be able to:

* Add new categories.
* Edit categories.
* Delete categories.
* Hide or show categories.
* Reorder categories.
* Add category image or banner.

### 9.3 Ready-Made Kit Management

Admin should be able to:

* Create ready-made kits.
* Add products inside a kit.
* Set kit price.
* Set kit category.
* Update kit images.
* Update available stock.
* Hide or show kits.
* Mark kits as featured.

### 9.4 Coupon Management

Admin should be able to:

* Create coupon codes.
* Edit coupon codes.
* Delete coupon codes.
* Enable or disable coupon codes.
* Set discount type:

  * Flat discount
  * Percentage discount
* Set minimum order value.
* Set maximum discount value.
* Set expiry date.
* Set usage limit.

### 9.5 Order Management

Admin should be able to:

* View all orders.
* View customer details.
* View product details.
* Update order status.
* Filter orders by status, date, or customer.
* Search orders.

Order statuses should include:

* Pending
* Confirmed
* Packed
* Out for delivery
* Delivered
* Cancelled

### 9.6 Inventory Management

Inventory should update automatically when an order is placed or fulfilled.

Admin should also be able to manually update stock.

Required inventory features:

* Real-time stock updates.
* Low stock warning.
* Out-of-stock label on website.
* Prevent checkout if stock is unavailable.
* Manual stock correction from admin panel.
* Inventory history or logs, if possible.

---

## 10. Database Requirement

Use **Supabase** as the backend database.

### 10.1 Suggested Database Tables

#### users

Stores customer details.

Fields:

* id
* name
* phone
* email
* address
* created_at
* updated_at

#### categories

Stores product and kit categories.

Fields:

* id
* name
* slug
* description
* image_url
* type:

  * product
  * ready_made_kit
* is_active
* sort_order
* created_at
* updated_at

#### products

Stores individual catalogue products.

Fields:

* id
* category_id
* name
* slug
* description
* image_url
* price
* stock_quantity
* is_active
* is_featured
* created_at
* updated_at

#### ready_made_kits

Stores ready-made gift kits.

Fields:

* id
* category_id
* name
* slug
* description
* image_url
* price
* stock_quantity
* is_active
* is_featured
* created_at
* updated_at

#### ready_made_kit_items

Stores products included inside each ready-made kit.

Fields:

* id
* kit_id
* product_id
* quantity
* created_at

#### custom_boxes

Stores saved custom boxes.

Fields:

* id
* user_id
* box_name
* box_type
* box_price
* total_price
* share_token
* created_at
* updated_at

#### custom_box_items

Stores products added inside a custom box.

Fields:

* id
* custom_box_id
* product_id
* quantity
* price_at_time
* created_at

#### cart

Stores user cart details.

Fields:

* id
* user_id
* created_at
* updated_at

#### cart_items

Stores cart products, kits, and custom boxes.

Fields:

* id
* cart_id
* item_type:

  * product
  * ready_made_kit
  * custom_box
* item_id
* quantity
* price_at_time
* created_at

#### coupons

Stores coupon details.

Fields:

* id
* code
* discount_type:

  * flat
  * percentage
* discount_value
* min_order_value
* max_discount_value
* usage_limit
* used_count
* expiry_date
* is_active
* created_at
* updated_at

#### orders

Stores order details.

Fields:

* id
* user_id
* customer_name
* customer_phone
* customer_address
* delivery_slot
* subtotal
* discount_amount
* total_amount
* coupon_code
* order_status
* whatsapp_message
* created_at
* updated_at

#### order_items

Stores products, kits, and custom boxes in each order.

Fields:

* id
* order_id
* item_type:

  * product
  * ready_made_kit
  * custom_box
* item_id
* item_name
* quantity
* price_at_time
* total_price
* created_at

#### wishlist

Stores customer wishlist items.

Fields:

* id
* user_id
* product_id
* created_at

#### inventory_logs

Stores stock changes.

Fields:

* id
* product_id
* change_type:

  * manual_update
  * order_placed
  * order_cancelled
  * order_fulfilled
* quantity_changed
* old_quantity
* new_quantity
* remarks
* created_at

---

## 11. UI and UX Requirements

The website should feel like a modern gift-shopping platform.

### 11.1 Design Style

The website should have:

* Clean and modern UI
* Mobile-first responsive design
* Bright and festive visual feel
* Easy navigation
* Smooth customer journey
* Attractive product cards
* Clear pricing
* Prominent call-to-action buttons
* Simple checkout flow
* Fast loading experience

### 11.2 Recommended Pages

The website should include the following pages:

* Home
* Ready-Made Kits
* Product Catalogue
* Create Your Own Box
* Cart
* Wishlist
* Login/Signup
* My Account
* My Orders
* Order Tracking
* Admin Dashboard
* Admin Products
* Admin Categories
* Admin Kits
* Admin Coupons
* Admin Orders
* Admin Inventory

---

## 12. Delivery Slot Feature

Since delivery will be handled locally, the website should allow customers to select delivery slots.

Example delivery slots:

* Morning: 9 AM – 12 PM
* Afternoon: 12 PM – 4 PM
* Evening: 4 PM – 8 PM

Admin should be able to manage delivery slots in the future.

---

## 13. Important Business Rules

The website should follow these business rules:

* If a product is out of stock, customers should not be able to checkout with that product.
* If stock is low, show `Only X left` on the product card.
* Coupon should only apply if it is active and valid.
* Coupon should not apply after expiry.
* Coupon should respect minimum order value.
* Custom box total should update automatically when products are added or removed.
* WhatsApp checkout message should be generated dynamically.
* Admin changes should reflect on the website in real time or near real time.
* Hidden products and categories should not be visible to customers.
* Deleted products should be handled carefully so old orders are not affected.

---

## 14. Future Scope

The project should be structured in a way that these features can be added later:

* Online payment gateway integration
* Razorpay or UPI payment
* Chatbot for product suggestions
* AI-based gift recommendation
* Product recommendation engine
* Bulk order enquiry form
* Delivery partner integration
* WhatsApp order status notifications
* Customer reviews and ratings
* Festival-specific landing pages
* Referral system

---

## 15. Expected Tech Stack

Preferred backend/database:

* Supabase for database and authentication

Frontend can be built using:

* React or Next.js
* Tailwind CSS or any similar modern UI framework

You can also use python with FastAPI for thr backend.

The final website should be:

* Fast
* Scalable
* SEO-friendly
* Easy to maintain
* Mobile-friendly

---

## 16. Final Goal

Build a polished, mobile-friendly, e-commerce-style website where customers can:

1. Buy ready-made gift kits.
2. Create their own customized gift box.
3. Add products to cart.
4. Apply coupons.
5. Checkout through WhatsApp.
6. Login and save their details.
7. View order history.
8. Track orders.
9. Save wishlist items.
10. Save and share custom boxes.

The admin should be able to manage:

* Products
* Categories
* Ready-made kits
* Coupons
* Orders
* Inventory

All of this should be manageable from a clean and easy-to-use admin dashboard.

```

