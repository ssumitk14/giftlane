# Product Description:
I want to create a website (similar to e-commerce sites) where i will be selling ready made gift kits (from 299, 399, 499, ..). There will also be an option to make your own box/kit by selecting the items you want to add in the box. (Whatsapp number for checkout - +91 92047 99288)

## Home Page:
The home page should display the following:
- Hero section with a banner and a call to action button.
- Featured products section.

### Ready made gift kits:
- User can select the category of the gift kit and view the products.
- User can select the quantity of the gift kit and add it to the cart.
- User can view the products in the cart and checkout.

### Custom box flow:
- User clicks on "create your own box" button on the home page.
- User is redirected to the custom box page.
- User can add products to the box.
- User can select the quantity of the products.
- User can view the products in the box and checkout.

### Cart page:
- User can view the products in the cart and checkout.
- User can apply coupon code to get discount.
- Checkout should be done via whatsapp by sending a message to the owner.

### Database schema:
- Create a database schema for the products and coupons.
- The database should be hosted on supabase.

## Ready made Gift Kits
- Kids Return Gifts kits (3 categories - 299, 399, 499)
- Festival & Pooja kits (3 categories - 299, 399, 499)
- Corporate & Bulk Gifting kits (3 categories - 299, 399, 499)
- Utility kits (3 categories - 299, 399, 499)


## Custom Product Catalogue Categories (Make your own kit)

### Stationery
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

### Pooja
- Roli
- Chawal
- Diya
- Agarbatti
- Camphor
- Kumkum
- Haldi
- Rice
- Cotton wicks

### Shringar
- Bindi
- Hair clips
- Rubber bands
- Hair pins

### Utility
- ...

## Admin Section
- There should be an admin portal where i can manage the products and coupons.
- This should be customizable where I can add/remove/update the categories and products.
- The products and categories should be able to be hidden or shown.
- All the products and categories should be able to be edited in real time.
- All the products and categories should be able to be deleted in real time.


## UI
- Clean and modern UI.
- Responsive for mobile first
- Easy to navigate.
- Visually appealing.

### Use cases:
- Also I want to add a feature where in the custom box flow I can select the box and then add products to the box and the price should be calculated automatically and then it should show the total price.
- Add real time stock updates
- There should be a cusotmer login page where users can create their own account and save their details. They should also be able to view their order history and track their orders.
- There should be a wishlist feature where users can add products to their wishlist and checkout later.
- The users should be able to save and share their custom boxes.


### Important aspects
- It not mandatory to login. Users or customers should be able to checkout as guests. 
- For delivery, there should be date and time slot selection not just the time slot selection.
- While creating the custom box, remove the add to cart button from the product cards. Instead, there should be a quantity selector and the product should be added to the custom box directly.
- The price of the custom box should be the sum of the prices of the products added to the box + price of the box selected.


## Future scope
- Add payment gateway integration
- Add chat integration (for products suggestions/customization ideas)

