create extension if not exists "uuid-ossp";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  phone text,
  email text unique,
  address text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz default timezone('utc', now()) not null,
  updated_at timestamptz default timezone('utc', now()) not null
);

create or replace view public.users as
select id, name, phone, email, address, created_at, updated_at
from public.profiles;

create table if not exists public.categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique not null,
  description text,
  image_url text,
  type text not null check (type in ('product', 'ready_made_kit')),
  is_active boolean default true,
  sort_order integer default 0,
  created_at timestamptz default timezone('utc', now()) not null,
  updated_at timestamptz default timezone('utc', now()) not null
);

create table if not exists public.products (
  id uuid default uuid_generate_v4() primary key,
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  slug text unique not null,
  sku text unique,
  description text,
  image_url text,
  price numeric not null default 0,
  stock_quantity integer not null default 0,
  is_active boolean default true,
  is_featured boolean default false,
  created_at timestamptz default timezone('utc', now()) not null,
  updated_at timestamptz default timezone('utc', now()) not null
);

create table if not exists public.ready_made_kits (
  id uuid default uuid_generate_v4() primary key,
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  slug text unique not null,
  description text,
  image_url text,
  price numeric not null default 0,
  stock_quantity integer not null default 0,
  is_active boolean default true,
  is_featured boolean default false,
  created_at timestamptz default timezone('utc', now()) not null,
  updated_at timestamptz default timezone('utc', now()) not null
);

create table if not exists public.ready_made_kit_items (
  id uuid default uuid_generate_v4() primary key,
  kit_id uuid not null references public.ready_made_kits(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  quantity integer not null default 1,
  created_at timestamptz default timezone('utc', now()) not null
);

create table if not exists public.custom_boxes (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  box_name text not null,
  box_type text not null,
  box_price numeric not null default 0,
  total_price numeric not null default 0,
  share_token text unique not null,
  created_at timestamptz default timezone('utc', now()) not null,
  updated_at timestamptz default timezone('utc', now()) not null
);

create table if not exists public.custom_box_items (
  id uuid default uuid_generate_v4() primary key,
  custom_box_id uuid not null references public.custom_boxes(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  quantity integer not null default 1,
  price_at_time numeric not null default 0,
  created_at timestamptz default timezone('utc', now()) not null
);

create table if not exists public.cart (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  created_at timestamptz default timezone('utc', now()) not null,
  updated_at timestamptz default timezone('utc', now()) not null
);

create table if not exists public.cart_items (
  id uuid default uuid_generate_v4() primary key,
  cart_id uuid not null references public.cart(id) on delete cascade,
  item_type text not null check (item_type in ('product', 'ready_made_kit', 'custom_box')),
  item_id uuid not null,
  quantity integer not null default 1,
  price_at_time numeric not null default 0,
  created_at timestamptz default timezone('utc', now()) not null
);

create table if not exists public.coupons (
  id uuid default uuid_generate_v4() primary key,
  code text unique not null,
  discount_type text not null check (discount_type in ('flat', 'percentage')),
  discount_value numeric not null default 0,
  min_order_value numeric not null default 0,
  max_discount_value numeric,
  usage_limit integer,
  used_count integer default 0,
  expiry_date timestamptz,
  is_active boolean default true,
  created_at timestamptz default timezone('utc', now()) not null,
  updated_at timestamptz default timezone('utc', now()) not null
);

create table if not exists public.orders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete set null,
  customer_name text not null,
  customer_phone text not null,
  customer_address text not null,
  delivery_slot text not null,
  subtotal numeric not null default 0,
  discount_amount numeric not null default 0,
  total_amount numeric not null default 0,
  coupon_code text,
  order_status text not null default 'Pending' check (order_status in ('Pending', 'Confirmed', 'Packed', 'Out for delivery', 'Delivered', 'Cancelled')),
  whatsapp_message text,
  created_at timestamptz default timezone('utc', now()) not null,
  updated_at timestamptz default timezone('utc', now()) not null
);

create table if not exists public.order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid not null references public.orders(id) on delete cascade,
  item_type text not null check (item_type in ('product', 'ready_made_kit', 'custom_box')),
  item_id uuid,
  item_name text not null,
  quantity integer not null default 1,
  price_at_time numeric not null default 0,
  total_price numeric not null default 0,
  created_at timestamptz default timezone('utc', now()) not null
);

create table if not exists public.wishlist (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz default timezone('utc', now()) not null,
  unique (user_id, product_id)
);

create table if not exists public.inventory_logs (
  id uuid default uuid_generate_v4() primary key,
  product_id uuid references public.products(id) on delete set null,
  change_type text not null check (change_type in ('manual_update', 'order_placed', 'order_cancelled', 'order_fulfilled')),
  quantity_changed integer not null,
  old_quantity integer not null,
  new_quantity integer not null,
  remarks text,
  created_at timestamptz default timezone('utc', now()) not null
);

create table if not exists public.delivery_slots (
  id uuid default uuid_generate_v4() primary key,
  label text not null,
  start_time time,
  end_time time,
  is_active boolean default true,
  sort_order integer default 0,
  created_at timestamptz default timezone('utc', now()) not null,
  updated_at timestamptz default timezone('utc', now()) not null
);

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

create or replace function public.reserve_checkout_inventory(
  item_table text,
  item_uuid uuid,
  item_quantity integer
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  old_stock integer;
  new_stock integer;
begin
  if item_quantity <= 0 then
    raise exception 'Quantity must be positive';
  end if;

  if item_table = 'products' then
    select stock_quantity into old_stock from public.products where id = item_uuid for update;
    if old_stock is null then raise exception 'Product not found'; end if;
    if old_stock < item_quantity then raise exception 'Insufficient product stock'; end if;
    new_stock := old_stock - item_quantity;
    update public.products set stock_quantity = new_stock, updated_at = timezone('utc', now()) where id = item_uuid;
    insert into public.inventory_logs (product_id, change_type, quantity_changed, old_quantity, new_quantity, remarks)
    values (item_uuid, 'order_placed', -item_quantity, old_stock, new_stock, 'Reserved by WhatsApp checkout');
  elsif item_table = 'ready_made_kits' then
    select stock_quantity into old_stock from public.ready_made_kits where id = item_uuid for update;
    if old_stock is null then raise exception 'Kit not found'; end if;
    if old_stock < item_quantity then raise exception 'Insufficient kit stock'; end if;
    new_stock := old_stock - item_quantity;
    update public.ready_made_kits set stock_quantity = new_stock, updated_at = timezone('utc', now()) where id = item_uuid;
  else
    raise exception 'Unsupported inventory table';
  end if;
end;
$$;

create or replace function public.increment_coupon_usage(coupon_uuid uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.coupons
  set used_count = coalesce(used_count, 0) + 1,
      updated_at = timezone('utc', now())
  where id = coupon_uuid;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, name, phone, address, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', ''),
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'address',
    'customer'
  )
  on conflict (id) do update
  set email = excluded.email,
      name = coalesce(nullif(excluded.name, ''), public.profiles.name),
      phone = coalesce(excluded.phone, public.profiles.phone),
      address = coalesce(excluded.address, public.profiles.address),
      updated_at = timezone('utc', now());

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.create_checkout_order(
  p_user_id uuid,
  p_customer_name text,
  p_customer_phone text,
  p_customer_address text,
  p_delivery_slot text,
  p_subtotal numeric,
  p_discount_amount numeric,
  p_total_amount numeric,
  p_coupon_id uuid,
  p_coupon_code text,
  p_whatsapp_message text,
  p_items jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_order_id uuid;
  item jsonb;
  item_type text;
  item_uuid uuid;
  item_name text;
  item_qty integer;
  item_price numeric;
  old_stock integer;
  new_stock integer;
begin
  if coalesce(trim(p_customer_name), '') = '' then raise exception 'Customer name is required'; end if;
  if coalesce(trim(p_customer_phone), '') = '' then raise exception 'Customer phone is required'; end if;
  if coalesce(trim(p_customer_address), '') = '' then raise exception 'Customer address is required'; end if;
  if jsonb_array_length(p_items) = 0 then raise exception 'Cart is empty'; end if;

  if p_user_id is not null and p_user_id <> auth.uid() and not public.is_admin() then
    raise exception 'Invalid checkout user';
  end if;

  insert into public.orders (
    user_id,
    customer_name,
    customer_phone,
    customer_address,
    delivery_slot,
    subtotal,
    discount_amount,
    total_amount,
    coupon_code,
    order_status,
    whatsapp_message
  )
  values (
    p_user_id,
    p_customer_name,
    p_customer_phone,
    p_customer_address,
    p_delivery_slot,
    p_subtotal,
    p_discount_amount,
    p_total_amount,
    p_coupon_code,
    'Pending',
    p_whatsapp_message
  )
  returning id into new_order_id;

  for item in select * from jsonb_array_elements(p_items)
  loop
    item_type := coalesce(item->>'item_type', 'product');
    item_uuid := nullif(item->>'item_id', '')::uuid;
    item_name := item->>'item_name';
    item_qty := greatest(1, coalesce((item->>'quantity')::integer, 1));
    item_price := coalesce((item->>'price_at_time')::numeric, 0);

    if item_type = 'product' then
      select stock_quantity into old_stock from public.products where id = item_uuid and is_active = true for update;
      if old_stock is null then raise exception 'Product not found: %', item_name; end if;
      if old_stock < item_qty then raise exception 'Insufficient stock for %', item_name; end if;
      new_stock := old_stock - item_qty;
      update public.products set stock_quantity = new_stock, updated_at = timezone('utc', now()) where id = item_uuid;
      insert into public.inventory_logs (product_id, change_type, quantity_changed, old_quantity, new_quantity, remarks)
      values (item_uuid, 'order_placed', -item_qty, old_stock, new_stock, 'Reserved by WhatsApp checkout');
    elsif item_type = 'ready_made_kit' then
      select stock_quantity into old_stock from public.ready_made_kits where id = item_uuid and is_active = true for update;
      if old_stock is null then raise exception 'Kit not found: %', item_name; end if;
      if old_stock < item_qty then raise exception 'Insufficient stock for %', item_name; end if;
      new_stock := old_stock - item_qty;
      update public.ready_made_kits set stock_quantity = new_stock, updated_at = timezone('utc', now()) where id = item_uuid;
    elsif item_type <> 'custom_box' then
      raise exception 'Unsupported item type: %', item_type;
    end if;

    insert into public.order_items (
      order_id,
      item_type,
      item_id,
      item_name,
      quantity,
      price_at_time,
      total_price
    )
    values (
      new_order_id,
      item_type,
      case when item_type = 'custom_box' then null else item_uuid end,
      item_name,
      item_qty,
      item_price,
      item_price * item_qty
    );
  end loop;

  if p_coupon_id is not null then
    update public.coupons
    set used_count = coalesce(used_count, 0) + 1,
        updated_at = timezone('utc', now())
    where id = p_coupon_id;
  end if;

  return new_order_id;
end;
$$;

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.ready_made_kits enable row level security;
alter table public.ready_made_kit_items enable row level security;
alter table public.custom_boxes enable row level security;
alter table public.custom_box_items enable row level security;
alter table public.cart enable row level security;
alter table public.cart_items enable row level security;
alter table public.coupons enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.wishlist enable row level security;
alter table public.inventory_logs enable row level security;
alter table public.delivery_slots enable row level security;

grant select on public.categories to anon, authenticated;
grant select on public.products to anon, authenticated;
grant select on public.ready_made_kits to anon, authenticated;
grant select on public.ready_made_kit_items to anon, authenticated;
grant select on public.coupons to anon, authenticated;
grant select on public.delivery_slots to anon, authenticated;
grant select, insert, update on public.profiles to authenticated;
grant insert, select on public.orders to anon, authenticated;
grant insert, select on public.order_items to anon, authenticated;
grant execute on function public.reserve_checkout_inventory(text, uuid, integer) to anon, authenticated;
grant execute on function public.increment_coupon_usage(uuid) to anon, authenticated;
grant execute on function public.handle_new_user() to service_role;
grant execute on function public.create_checkout_order(uuid, text, text, text, text, numeric, numeric, numeric, uuid, text, text, jsonb) to anon, authenticated;

drop policy if exists "Users can read own profile" on public.profiles;
drop policy if exists "Users can insert own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Public can read active categories" on public.categories;
drop policy if exists "Public can read active products" on public.products;
drop policy if exists "Public can read active kits" on public.ready_made_kits;
drop policy if exists "Public can read kit items" on public.ready_made_kit_items;
drop policy if exists "Public can read active coupons" on public.coupons;
drop policy if exists "Public can read active delivery slots" on public.delivery_slots;
drop policy if exists "Admin categories" on public.categories;
drop policy if exists "Admin products" on public.products;
drop policy if exists "Admin kits" on public.ready_made_kits;
drop policy if exists "Admin kit items" on public.ready_made_kit_items;
drop policy if exists "Admin coupons" on public.coupons;
drop policy if exists "Admin orders" on public.orders;
drop policy if exists "Admin order items" on public.order_items;
drop policy if exists "Admin inventory logs" on public.inventory_logs;
drop policy if exists "Admin delivery slots" on public.delivery_slots;
drop policy if exists "Users manage own custom boxes" on public.custom_boxes;
drop policy if exists "Users manage own custom box items" on public.custom_box_items;
drop policy if exists "Users manage own carts" on public.cart;
drop policy if exists "Users manage own cart items" on public.cart_items;
drop policy if exists "Users manage own wishlist" on public.wishlist;
drop policy if exists "Users read own orders" on public.orders;
drop policy if exists "Customers can create checkout orders" on public.orders;
drop policy if exists "Users read own order items" on public.order_items;
drop policy if exists "Users insert order items" on public.order_items;

create policy "Users can read own profile" on public.profiles for select using (auth.uid() = id or public.is_admin());
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id or public.is_admin());
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id or public.is_admin()) with check (auth.uid() = id or public.is_admin());

create policy "Public can read active categories" on public.categories for select using (is_active = true);
create policy "Public can read active products" on public.products for select using (is_active = true);
create policy "Public can read active kits" on public.ready_made_kits for select using (is_active = true);
create policy "Public can read kit items" on public.ready_made_kit_items for select using (true);
create policy "Public can read active coupons" on public.coupons for select using (is_active = true);
create policy "Public can read active delivery slots" on public.delivery_slots for select using (is_active = true);

create policy "Admin categories" on public.categories for all using (public.is_admin()) with check (public.is_admin());
create policy "Admin products" on public.products for all using (public.is_admin()) with check (public.is_admin());
create policy "Admin kits" on public.ready_made_kits for all using (public.is_admin()) with check (public.is_admin());
create policy "Admin kit items" on public.ready_made_kit_items for all using (public.is_admin()) with check (public.is_admin());
create policy "Admin coupons" on public.coupons for all using (public.is_admin()) with check (public.is_admin());
create policy "Admin orders" on public.orders for all using (public.is_admin()) with check (public.is_admin());
create policy "Admin order items" on public.order_items for all using (public.is_admin()) with check (public.is_admin());
create policy "Admin inventory logs" on public.inventory_logs for all using (public.is_admin()) with check (public.is_admin());
create policy "Admin delivery slots" on public.delivery_slots for all using (public.is_admin()) with check (public.is_admin());

create policy "Users manage own custom boxes" on public.custom_boxes for all using (auth.uid() = user_id or public.is_admin()) with check (auth.uid() = user_id or public.is_admin());
create policy "Users manage own custom box items" on public.custom_box_items for all using (
  exists (select 1 from public.custom_boxes where custom_boxes.id = custom_box_items.custom_box_id and (custom_boxes.user_id = auth.uid() or public.is_admin()))
) with check (
  exists (select 1 from public.custom_boxes where custom_boxes.id = custom_box_items.custom_box_id and (custom_boxes.user_id = auth.uid() or public.is_admin()))
);
create policy "Users manage own carts" on public.cart for all using (auth.uid() = user_id or public.is_admin()) with check (auth.uid() = user_id or public.is_admin());
create policy "Users manage own cart items" on public.cart_items for all using (
  exists (select 1 from public.cart where cart.id = cart_items.cart_id and (cart.user_id = auth.uid() or public.is_admin()))
) with check (
  exists (select 1 from public.cart where cart.id = cart_items.cart_id and (cart.user_id = auth.uid() or public.is_admin()))
);
create policy "Users manage own wishlist" on public.wishlist for all using (auth.uid() = user_id or public.is_admin()) with check (auth.uid() = user_id or public.is_admin());
create policy "Users read own orders" on public.orders for select using (auth.uid() = user_id or public.is_admin());
create policy "Customers can create checkout orders" on public.orders for insert with check (
  order_status = 'Pending'
  and customer_name <> ''
  and customer_phone <> ''
  and customer_address <> ''
  and (user_id is null or auth.uid() = user_id or public.is_admin())
);
create policy "Users read own order items" on public.order_items for select using (
  exists (select 1 from public.orders where orders.id = order_items.order_id and (orders.user_id = auth.uid() or public.is_admin()))
);
create policy "Users insert order items" on public.order_items for insert with check (
  exists (select 1 from public.orders where orders.id = order_items.order_id and (orders.user_id = auth.uid() or orders.user_id is null or public.is_admin()))
);
