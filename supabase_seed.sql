-- Run after supabase_schema.sql. Safe to rerun.

insert into public.categories (name, slug, description, image_url, type, is_active, sort_order) values
('Stationery', 'stationery', 'Stationery catalogue products', 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=900', 'product', true, 1),
('Pooja', 'pooja', 'Pooja catalogue products', 'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?auto=format&fit=crop&q=80&w=900', 'product', true, 2),
('Shringar', 'shringar', 'Shringar catalogue products', 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=900', 'product', true, 3),
('Utility', 'utility', 'Utility catalogue products', 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=900', 'product', true, 4),
('Kids Return Gifts', 'kids-return-gifts', 'Birthday return packs by budget', 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=900', 'ready_made_kit', true, 5),
('Festival & Pooja Kits', 'festival-pooja-kits', 'Rakhi, Diwali and pooja essentials', 'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?auto=format&fit=crop&q=80&w=900', 'ready_made_kit', true, 6),
('Corporate & Bulk Gifting', 'corporate-bulk-gifting', 'Polished kits for teams and clients', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=900', 'ready_made_kit', true, 7),
('Utility Kits', 'utility-kits', 'Useful everyday bundles', 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=900', 'ready_made_kit', true, 8)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  image_url = excluded.image_url,
  type = excluded.type,
  is_active = true,
  sort_order = excluded.sort_order,
  updated_at = timezone('utc', now());

with seed(category_slug, name, sku_prefix, image_url, base_price, sort_index) as (
  values
  ('stationery', 'Pencil box', 'STA', 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=900', 45, 1),
  ('stationery', 'Pencil', 'STA', 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=900', 12, 2),
  ('stationery', 'Eraser', 'STA', 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=900', 10, 3),
  ('stationery', 'Sharpener', 'STA', 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=900', 12, 4),
  ('stationery', 'Scale/ruler', 'STA', 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=900', 18, 5),
  ('stationery', 'Sketch pen', 'STA', 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=900', 55, 6),
  ('stationery', 'Crayons', 'STA', 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=900', 65, 7),
  ('stationery', 'Colour pencils', 'STA', 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=900', 75, 8),
  ('stationery', 'Ball pen', 'STA', 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=900', 15, 9),
  ('stationery', 'Gel pen', 'STA', 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=900', 20, 10),
  ('stationery', 'Cartoon pen', 'STA', 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=900', 35, 11),
  ('stationery', 'Mini diary', 'STA', 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=900', 45, 12),
  ('stationery', 'Cartoon notebook', 'STA', 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=900', 55, 13),
  ('stationery', 'Drawing book', 'STA', 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=900', 60, 14),
  ('stationery', 'Sticker sheet', 'STA', 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=900', 25, 15),
  ('stationery', 'Name label stickers', 'STA', 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=900', 35, 16),
  ('stationery', 'Geometry box', 'STA', 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=900', 85, 17),
  ('stationery', 'Glue stick', 'STA', 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=900', 25, 18),
  ('stationery', 'Small scissors', 'STA', 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=900', 35, 19),
  ('stationery', 'Highlighter', 'STA', 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=900', 30, 20),
  ('stationery', 'Marker', 'STA', 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=900', 25, 21),
  ('stationery', 'Sticky notes', 'STA', 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=900', 35, 22),
  ('stationery', 'Bookmark', 'STA', 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=900', 15, 23),
  ('stationery', 'Exam pad', 'STA', 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=900', 75, 24),
  ('stationery', 'Pencil grip', 'STA', 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=900', 20, 25),
  ('stationery', 'Correction tape', 'STA', 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=900', 45, 26),
  ('stationery', 'Mini stamp set', 'STA', 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=900', 60, 27),
  ('pooja', 'Roli', 'POO', 'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?auto=format&fit=crop&q=80&w=900', 18, 1),
  ('pooja', 'Chawal', 'POO', 'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?auto=format&fit=crop&q=80&w=900', 18, 2),
  ('pooja', 'Diya', 'POO', 'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?auto=format&fit=crop&q=80&w=900', 25, 3),
  ('pooja', 'Agarbatti', 'POO', 'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?auto=format&fit=crop&q=80&w=900', 35, 4),
  ('pooja', 'Camphor', 'POO', 'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?auto=format&fit=crop&q=80&w=900', 30, 5),
  ('pooja', 'Kumkum', 'POO', 'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?auto=format&fit=crop&q=80&w=900', 20, 6),
  ('pooja', 'Haldi', 'POO', 'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?auto=format&fit=crop&q=80&w=900', 20, 7),
  ('pooja', 'Rice', 'POO', 'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?auto=format&fit=crop&q=80&w=900', 18, 8),
  ('pooja', 'Cotton wicks', 'POO', 'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?auto=format&fit=crop&q=80&w=900', 20, 9),
  ('shringar', 'Bindi', 'SHR', 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=900', 25, 1),
  ('shringar', 'Hair clips', 'SHR', 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=900', 35, 2),
  ('shringar', 'Rubber bands', 'SHR', 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=900', 25, 3),
  ('shringar', 'Hair pins', 'SHR', 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=900', 25, 4),
  ('utility', 'Small pouch', 'UTI', 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=900', 65, 1),
  ('utility', 'Keychain', 'UTI', 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=900', 35, 2),
  ('utility', 'Hand towel', 'UTI', 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=900', 75, 3),
  ('utility', 'Mini mirror', 'UTI', 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=900', 45, 4),
  ('utility', 'Comb', 'UTI', 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=900', 30, 5),
  ('utility', 'Nail cutter', 'UTI', 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=900', 55, 6),
  ('utility', 'Safety pins', 'UTI', 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=900', 20, 7),
  ('utility', 'Sewing kit', 'UTI', 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=900', 85, 8),
  ('utility', 'Mini torch', 'UTI', 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=900', 95, 9),
  ('utility', 'Water bottle', 'UTI', 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=900', 120, 10),
  ('utility', 'Lunch box', 'UTI', 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=900', 135, 11),
  ('utility', 'Tiffin box', 'UTI', 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=900', 135, 12),
  ('utility', 'Small storage box', 'UTI', 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=900', 80, 13),
  ('utility', 'Coin pouch', 'UTI', 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=900', 45, 14),
  ('utility', 'Travel pouch', 'UTI', 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=900', 95, 15),
  ('utility', 'Tissue pack', 'UTI', 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=900', 20, 16),
  ('utility', 'Wet wipes', 'UTI', 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=900', 35, 17),
  ('utility', 'Sanitizer bottle', 'UTI', 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=900', 55, 18),
  ('utility', 'Soap case', 'UTI', 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=900', 45, 19),
  ('utility', 'Toothbrush cover', 'UTI', 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=900', 35, 20)
)
insert into public.products (category_id, name, slug, sku, description, image_url, price, stock_quantity, is_active, is_featured)
select
  categories.id,
  seed.name,
  lower(regexp_replace(seed.name, '[^a-zA-Z0-9]+', '-', 'g')),
  seed.sku_prefix || '-' || lpad(seed.sort_index::text, 3, '0'),
  seed.name || ' for custom gift boxes and curated kits.',
  seed.image_url,
  seed.base_price,
  case when seed.sort_index in (1, 10, 19) then 3 else 20 + seed.sort_index end,
  true,
  seed.sort_index <= 2
from seed
join public.categories on categories.slug = seed.category_slug
on conflict (slug) do update set
  category_id = excluded.category_id,
  name = excluded.name,
  sku = excluded.sku,
  description = excluded.description,
  image_url = excluded.image_url,
  price = excluded.price,
  stock_quantity = excluded.stock_quantity,
  is_active = true,
  is_featured = excluded.is_featured,
  updated_at = timezone('utc', now());

with seed(category_slug, name, price, description, image_url, stock_quantity, is_featured) as (
  values
  ('kids-return-gifts', 'Kids Return Gift Kit', 299, 'Colourful stationery picks for party return gifts.', 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=900', 18, false),
  ('kids-return-gifts', 'Kids Creative Kit', 399, 'Sketch pens, stickers, diary and playful stationery.', 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&q=80&w=900', 9, true),
  ('kids-return-gifts', 'Kids Premium Activity Kit', 499, 'A larger birthday kit with art supplies and utility items.', 'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?auto=format&fit=crop&q=80&w=900', 4, true),
  ('festival-pooja-kits', 'Pooja Essentials Kit', 299, 'Roli, chawal, diya, agarbatti and cotton wicks.', 'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?auto=format&fit=crop&q=80&w=900', 22, false),
  ('festival-pooja-kits', 'Festival Blessing Kit', 399, 'A festive pooja bundle with kumkum, haldi and camphor.', 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?auto=format&fit=crop&q=80&w=900', 12, true),
  ('festival-pooja-kits', 'Premium Pooja Hamper', 499, 'Elegant festive hamper for family gifting.', 'https://images.unsplash.com/photo-1602867741746-6df80f40b3f6?auto=format&fit=crop&q=80&w=900', 6, true),
  ('corporate-bulk-gifting', 'Desk Utility Kit', 299, 'Compact stationery and daily desk essentials.', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=900', 30, false),
  ('corporate-bulk-gifting', 'Client Thank You Kit', 399, 'Smart everyday gifts for teams and customers.', 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&q=80&w=900', 16, true),
  ('corporate-bulk-gifting', 'Premium Bulk Gift Box', 499, 'A refined gift kit for events, teams and bulk orders.', 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=900', 7, true),
  ('utility-kits', 'Travel Utility Kit', 299, 'Pouch, wipes, sanitizer and compact travel essentials.', 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=900', 20, false),
  ('utility-kits', 'Daily Utility Kit', 399, 'Useful home and personal care accessories.', 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&q=80&w=900', 11, true),
  ('utility-kits', 'Premium Utility Box', 499, 'A fuller utility kit for practical everyday gifting.', 'https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&q=80&w=900', 5, true)
)
insert into public.ready_made_kits (category_id, name, slug, description, image_url, price, stock_quantity, is_active, is_featured)
select
  categories.id,
  seed.name,
  lower(regexp_replace(seed.name, '[^a-zA-Z0-9]+', '-', 'g')),
  seed.description,
  seed.image_url,
  seed.price,
  seed.stock_quantity,
  true,
  seed.is_featured
from seed
join public.categories on categories.slug = seed.category_slug
on conflict (slug) do update set
  category_id = excluded.category_id,
  name = excluded.name,
  description = excluded.description,
  image_url = excluded.image_url,
  price = excluded.price,
  stock_quantity = excluded.stock_quantity,
  is_active = true,
  is_featured = excluded.is_featured,
  updated_at = timezone('utc', now());

insert into public.coupons (code, discount_type, discount_value, min_order_value, max_discount_value, usage_limit, used_count, is_active) values
('FESTIVE10', 'percentage', 10, 499, 250, null, 0, true),
('BULK150', 'flat', 150, 1499, 150, null, 0, true),
('WELCOME50', 'flat', 50, 399, 50, null, 0, true)
on conflict (code) do update set
  discount_type = excluded.discount_type,
  discount_value = excluded.discount_value,
  min_order_value = excluded.min_order_value,
  max_discount_value = excluded.max_discount_value,
  is_active = true,
  updated_at = timezone('utc', now());

insert into public.delivery_slots (label, is_active, sort_order) values
('Morning: 9 AM - 12 PM', true, 1),
('Afternoon: 12 PM - 4 PM', true, 2),
('Evening: 4 PM - 8 PM', true, 3)
on conflict do nothing;
