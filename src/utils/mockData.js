const img = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&q=80&w=900`;

export const WHATSAPP_NUMBER = '919204799288';

export const deliverySlots = [
  'Morning: 9 AM - 12 PM',
  'Afternoon: 12 PM - 4 PM',
  'Evening: 4 PM - 8 PM'
];

export const coupons = [
  { code: 'FESTIVE10', discount_type: 'percentage', discount_value: 10, min_order_value: 499, max_discount_value: 250, active: true },
  { code: 'BULK150', discount_type: 'flat', discount_value: 150, min_order_value: 1499, max_discount_value: 150, active: true },
  { code: 'WELCOME50', discount_type: 'flat', discount_value: 50, min_order_value: 399, max_discount_value: 50, active: true }
];

export const categories = [
  { id: 'kids', name: 'Kids Return Gifts', type: 'ready_made_kit', description: 'Birthday return packs by budget', image: img('photo-1513201099705-a9746e1e201f') },
  { id: 'festival', name: 'Festival & Pooja Kits', type: 'ready_made_kit', description: 'Rakhi, Diwali and pooja essentials', image: img('photo-1608755728617-aefab37d2edd') },
  { id: 'corporate', name: 'Corporate & Bulk Gifting', type: 'ready_made_kit', description: 'Polished kits for teams and clients', image: img('photo-1516321318423-f06f85e504b3') },
  { id: 'utility', name: 'Utility Kits', type: 'ready_made_kit', description: 'Useful everyday bundles', image: img('photo-1524758631624-e2822e304c36') },
  { id: 'custom', name: 'Custom Box', type: 'custom_box', description: 'Build a box from the catalogue', image: img('photo-1549465220-1a8b9238cd48') }
];

export const readyMadeKits = [
  ['kids-299', 'Kids Return Gift Kit', 'Kids Return Gifts', 299, 'Colourful stationery picks for party return gifts.', 18, img('photo-1513542789411-b6a5d4f31634')],
  ['kids-399', 'Kids Creative Kit', 'Kids Return Gifts', 399, 'Sketch pens, stickers, diary and playful stationery.', 9, img('photo-1452860606245-08befc0ff44b')],
  ['kids-499', 'Kids Premium Activity Kit', 'Kids Return Gifts', 499, 'A larger birthday kit with art supplies and utility items.', 4, img('photo-1485546246426-74dc88dec4d9')],
  ['festival-299', 'Pooja Essentials Kit', 'Festival & Pooja Kits', 299, 'Roli, chawal, diya, agarbatti and cotton wicks.', 22, img('photo-1608755728617-aefab37d2edd')],
  ['festival-399', 'Festival Blessing Kit', 'Festival & Pooja Kits', 399, 'A festive pooja bundle with kumkum, haldi and camphor.', 12, img('photo-1607344645866-009c320b63e0')],
  ['festival-499', 'Premium Pooja Hamper', 'Festival & Pooja Kits', 499, 'Elegant festive hamper for family gifting.', 6, img('photo-1602867741746-6df80f40b3f6')],
  ['corporate-299', 'Desk Utility Kit', 'Corporate & Bulk Gifting', 299, 'Compact stationery and daily desk essentials.', 30, img('photo-1516321318423-f06f85e504b3')],
  ['corporate-399', 'Client Thank You Kit', 'Corporate & Bulk Gifting', 399, 'Smart everyday gifts for teams and customers.', 16, img('photo-1515378791036-0648a3ef77b2')],
  ['corporate-499', 'Premium Bulk Gift Box', 'Corporate & Bulk Gifting', 499, 'A refined gift kit for events, teams and bulk orders.', 7, img('photo-1556742049-0cfed4f6a45d')],
  ['utility-299', 'Travel Utility Kit', 'Utility Kits', 299, 'Pouch, wipes, sanitizer and compact travel essentials.', 20, img('photo-1524758631624-e2822e304c36')],
  ['utility-399', 'Daily Utility Kit', 'Utility Kits', 399, 'Useful home and personal care accessories.', 11, img('photo-1583947215259-38e31be8751f')],
  ['utility-499', 'Premium Utility Box', 'Utility Kits', 499, 'A fuller utility kit for practical everyday gifting.', 5, img('photo-1607082349566-187342175e2f')]
].map(([id, name, category, price, description, stock, image]) => ({
  id, sku: id.toUpperCase(), name, category, price, description, stock, image, itemType: 'ready_made_kit', is_featured: price >= 399
}));

const catalogueNames = {
  Stationery: ['Pencil box', 'Pencil', 'Eraser', 'Sharpener', 'Scale/ruler', 'Sketch pen', 'Crayons', 'Colour pencils', 'Ball pen', 'Gel pen', 'Cartoon pen', 'Mini diary', 'Cartoon notebook', 'Drawing book', 'Sticker sheet', 'Name label stickers', 'Geometry box', 'Glue stick', 'Small scissors', 'Highlighter', 'Marker', 'Sticky notes', 'Bookmark', 'Exam pad', 'Pencil grip', 'Correction tape', 'Mini stamp set'],
  Pooja: ['Roli', 'Chawal', 'Diya', 'Agarbatti', 'Camphor', 'Kumkum', 'Haldi', 'Rice', 'Cotton wicks'],
  Shringar: ['Bindi', 'Hair clips', 'Rubber bands', 'Hair pins'],
  Utility: ['Small pouch', 'Keychain', 'Hand towel', 'Mini mirror', 'Comb', 'Nail cutter', 'Safety pins', 'Sewing kit', 'Mini torch', 'Water bottle', 'Lunch box', 'Tiffin box', 'Small storage box', 'Coin pouch', 'Travel pouch', 'Tissue pack', 'Wet wipes', 'Sanitizer bottle', 'Soap case', 'Toothbrush cover']
};

const basePrices = { Stationery: 28, Pooja: 24, Shringar: 35, Utility: 55 };
const categoryImages = { Stationery: img('photo-1513542789411-b6a5d4f31634'), Pooja: img('photo-1608755728617-aefab37d2edd'), Shringar: img('photo-1522335789203-aabd1fc54bc9'), Utility: img('photo-1524758631624-e2822e304c36') };

export const products = Object.entries(catalogueNames).flatMap(([category, names]) =>
  names.map((name, index) => ({
    id: `${category.toLowerCase()}-${index + 1}`,
    sku: `${category.slice(0, 3).toUpperCase()}-${String(index + 1).padStart(3, '0')}`,
    name,
    category,
    price: basePrices[category] + ((index % 5) * 12),
    stock: index % 9 === 0 ? 3 : 12 + index,
    description: `${name} for custom gift boxes and curated kits.`,
    image: categoryImages[category],
    itemType: 'product',
    active: true,
    is_featured: index < 2
  }))
);

export const packagingOptions = [
  { id: 'classic', name: 'Classic Gift Box', price: 49, description: 'Clean kraft-style box for simple gifting.' },
  { id: 'premium', name: 'Premium Gift Box', price: 99, description: 'Rigid box with festive wrap and ribbon.' },
  { id: 'basket', name: 'Decor Basket', price: 149, description: 'Reusable basket for premium hampers.' }
];

export const orderHistory = [
  { id: 'GL-1024', date: '2026-05-10', status: 'Packed', total: 898, items: 'Kids Creative Kit x 2' },
  { id: 'GL-1019', date: '2026-04-28', status: 'Delivered', total: 548, items: 'Custom stationery box' }
];
