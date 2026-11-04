-- Mkushi Metal Works
-- Run this once in the Supabase SQL editor (or with the Supabase CLI) before 002_seed.sql.
-- The browser uses the anon key only. Money, stock, and reference numbers are changed
-- by these functions so a visitor cannot write them directly.

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  phone text not null default '',
  email text,
  role text not null default 'employee' check (role in ('admin', 'employee')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table employees (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid unique references profiles (id) on delete set null,
  full_name text not null,
  phone text not null default '',
  job_title text not null default 'Fabricator',
  default_daily_rate numeric(14, 2) not null default 0 check (default_daily_rate >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table business_settings (
  id integer primary key default 1 check (id = 1),
  business_name text not null default 'Mkushi Metal Works',
  tagline text not null default '',
  hero_eyebrow text not null default '',
  hero_headline text not null default '',
  hero_highlight text not null default '',
  hero_subtext text not null default '',
  about text not null default '',
  phone text not null default '',
  whatsapp text not null default '',
  email text not null default '',
  address text not null default '',
  map_url text not null default '',
  hours jsonb not null default '[]'::jsonb,
  currency_code text not null default 'TZS',
  facebook text not null default '',
  instagram text not null default '',
  stat_years text not null default '10+',
  stat_projects text not null default '120+',
  hero_image_url text not null default '',
  about_image_url text not null default '',
  feature_image_url text not null default '',
  feature_title text not null default '',
  feature_text text not null default '',
  callout_title text not null default '',
  callout_text text not null default '',
  why_choose jsonb not null default '[]'::jsonb,
  testimonials jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

create table customers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  email text not null default '',
  location text not null default '',
  notes text not null default '',
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table suppliers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null default '',
  email text not null default '',
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  category text not null default 'Custom',
  summary text not null default '',
  description text not null default '',
  image_url text not null default '',
  highlights jsonb not null default '[]'::jsonb,
  is_featured boolean not null default false,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  image_url text not null default '',
  price numeric(14, 2) check (price is null or price >= 0),
  availability text not null default 'made_to_order' check (availability in ('in_stock', 'made_to_order', 'out_of_stock')),
  specifications jsonb not null default '{}'::jsonb,
  is_featured boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table portfolio_projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default 'Custom',
  description text not null default '',
  completion_date date,
  materials text not null default '',
  cover_image_url text not null default '',
  is_featured boolean not null default false,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table portfolio_images (
  id uuid primary key default gen_random_uuid(),
  portfolio_project_id uuid not null references portfolio_projects (id) on delete cascade,
  image_url text not null,
  sort_order integer not null default 0
);

create table quotation_requests (
  id uuid primary key default gen_random_uuid(),
  reference_number text not null unique,
  customer_name text not null,
  phone text not null,
  email text,
  project_title text not null,
  fabrication_type text not null,
  description text not null,
  dimensions text,
  preferred_materials text,
  quantity numeric(12, 2) not null default 1 check (quantity > 0),
  location text,
  preferred_completion_date date,
  image_path text,
  status text not null default 'new' check (status in ('new', 'in_review', 'converted', 'closed')),
  customer_id uuid references customers (id) on delete set null,
  created_at timestamptz not null default now()
);

create table quotations (
  id uuid primary key default gen_random_uuid(),
  quotation_number text not null unique,
  quotation_request_id uuid references quotation_requests (id) on delete set null,
  customer_id uuid not null references customers (id),
  title text not null,
  description text not null default '',
  status text not null default 'under_review' check (status in ('pending', 'under_review', 'quotation_sent', 'accepted', 'rejected', 'expired')),
  material_cost numeric(14, 2) not null default 0 check (material_cost >= 0),
  labour_cost numeric(14, 2) not null default 0 check (labour_cost >= 0),
  transport_cost numeric(14, 2) not null default 0 check (transport_cost >= 0),
  other_cost numeric(14, 2) not null default 0 check (other_cost >= 0),
  profit_margin_percent numeric(8, 2) not null default 0,
  subtotal numeric(14, 2) not null default 0,
  total numeric(14, 2) not null default 0,
  valid_until date,
  notes text not null default '',
  created_by uuid references profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table quotation_items (
  id uuid primary key default gen_random_uuid(),
  quotation_id uuid not null references quotations (id) on delete cascade,
  description text not null,
  quantity numeric(12, 2) not null check (quantity > 0),
  unit text not null default 'pcs',
  unit_price numeric(14, 2) not null check (unit_price >= 0),
  line_total numeric(14, 2) generated always as (round(quantity * unit_price, 2)) stored
);

create table orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  quotation_id uuid unique references quotations (id),
  customer_id uuid not null references customers (id),
  description text not null,
  agreed_price numeric(14, 2) not null check (agreed_price >= 0),
  expected_completion_date date,
  status text not null default 'confirmed' check (status in ('pending', 'confirmed', 'in_production', 'ready_for_delivery', 'delivered', 'cancelled')),
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table projects (
  id uuid primary key default gen_random_uuid(),
  project_number text not null unique,
  order_id uuid unique references orders (id),
  customer_id uuid not null references customers (id),
  assigned_employee_id uuid references employees (id),
  description text not null,
  start_date date not null default current_date,
  expected_completion_date date,
  budget numeric(14, 2) not null default 0 check (budget >= 0),
  labour_cost numeric(14, 2) not null default 0 check (labour_cost >= 0),
  progress_percent integer not null default 0 check (progress_percent between 0 and 100),
  notes text not null default '',
  status text not null default 'active' check (status in ('active', 'on_hold', 'completed', 'cancelled')),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table project_stages (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects (id) on delete cascade,
  stage_key text not null,
  stage_name text not null,
  sort_order integer not null,
  status text not null default 'pending' check (status in ('pending', 'in_progress', 'done')),
  completed_at timestamptz,
  notes text not null default '',
  unique (project_id, stage_key)
);

create table inventory_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null default 'General',
  unit text not null default 'pcs',
  quantity_available numeric(14, 2) not null default 0 check (quantity_available >= 0),
  minimum_stock numeric(14, 2) not null default 0 check (minimum_stock >= 0),
  purchase_price numeric(14, 2) not null default 0 check (purchase_price >= 0),
  supplier_id uuid references suppliers (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table inventory_transactions (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references inventory_items (id),
  movement_type text not null check (movement_type in ('purchase', 'usage', 'adjustment', 'allocation', 'return')),
  quantity numeric(14, 2) not null,
  unit_cost numeric(14, 2) not null default 0 check (unit_cost >= 0),
  project_id uuid references projects (id) on delete set null,
  supplier_id uuid references suppliers (id) on delete set null,
  note text not null default '',
  created_by uuid references profiles (id),
  created_at timestamptz not null default now()
);

create table project_materials (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects (id) on delete cascade,
  inventory_item_id uuid not null references inventory_items (id),
  quantity numeric(14, 2) not null check (quantity > 0),
  unit_cost_at_time numeric(14, 2) not null default 0,
  allocated_at timestamptz not null default now(),
  allocated_by uuid references profiles (id)
);

create table project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects (id) on delete cascade,
  image_path text not null,
  caption text not null default '',
  created_at timestamptz not null default now()
);

create table transactions (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('income', 'expense')),
  category text not null,
  amount numeric(14, 2) not null check (amount > 0),
  transaction_date date not null default current_date,
  description text not null default '',
  payment_method text not null default 'cash' check (payment_method in ('cash', 'mobile_money', 'bank', 'other')),
  customer_id uuid references customers (id) on delete set null,
  order_id uuid references orders (id) on delete set null,
  project_id uuid references projects (id) on delete set null,
  receipt_path text,
  created_by uuid default auth.uid() references profiles (id),
  created_at timestamptz not null default now()
);

create table deliveries (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders (id) on delete cascade,
  delivered_at timestamptz not null default now(),
  received_by text not null default '',
  notes text not null default ''
);

create table contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  message text not null,
  created_at timestamptz not null default now()
);

create table reference_counters (
  prefix text not null,
  year integer not null,
  last_number integer not null default 0,
  primary key (prefix, year)
);

create index customers_phone_idx on customers (phone);
create index customers_archived_idx on customers (archived_at);
create index quotation_requests_status_idx on quotation_requests (status, created_at desc);
create index quotations_customer_idx on quotations (customer_id);
create index quotations_status_idx on quotations (status);
create index orders_customer_idx on orders (customer_id);
create index orders_status_idx on orders (status);
create index projects_assignee_idx on projects (assigned_employee_id);
create index projects_status_idx on projects (status);
create index inventory_category_idx on inventory_items (category);
create index inventory_tx_item_idx on inventory_transactions (item_id, created_at desc);
create index money_date_idx on transactions (transaction_date);
create index money_order_idx on transactions (order_id);

create trigger profiles_updated before update on profiles
for each row execute function set_updated_at();
create trigger employees_updated before update on employees
for each row execute function set_updated_at();
create trigger settings_updated before update on business_settings
for each row execute function set_updated_at();
create trigger customers_updated before update on customers
for each row execute function set_updated_at();
create trigger suppliers_updated before update on suppliers
for each row execute function set_updated_at();
create trigger services_updated before update on services
for each row execute function set_updated_at();
create trigger products_updated before update on products
for each row execute function set_updated_at();
create trigger portfolio_updated before update on portfolio_projects
for each row execute function set_updated_at();
create trigger quotations_updated before update on quotations
for each row execute function set_updated_at();
create trigger orders_updated before update on orders
for each row execute function set_updated_at();
create trigger projects_updated before update on projects
for each row execute function set_updated_at();
create trigger inventory_updated before update on inventory_items
for each row execute function set_updated_at();

create or replace function is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role in ('admin', 'employee')
  );
$$;

create or replace function current_role_name()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from profiles where id = auth.uid();
$$;

create or replace function current_employee_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id from employees where profile_id = auth.uid() limit 1;
$$;

create or replace function next_reference(p_prefix text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  current_year integer := extract(year from now())::integer;
  next_number integer;
begin
  insert into reference_counters (prefix, year, last_number)
  values (p_prefix, current_year, 1)
  on conflict (prefix, year)
  do update set last_number = reference_counters.last_number + 1
  returning last_number into next_number;

  return p_prefix || '-' || current_year::text || '-' || lpad(next_number::text, 4, '0');
end;
$$;

create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into profiles (id, full_name, phone, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data ->> 'phone', ''),
    new.email,
    'employee'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function protect_project_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not is_admin() then
    new.assigned_employee_id := old.assigned_employee_id;
    new.budget := old.budget;
    new.labour_cost := old.labour_cost;
    new.order_id := old.order_id;
    new.customer_id := old.customer_id;
    new.project_number := old.project_number;
    new.description := old.description;
    if current_setting('app.project_stage', true) is distinct from 'on' then
      new.status := old.status;
      new.progress_percent := old.progress_percent;
      new.completed_at := old.completed_at;
    end if;
  end if;
  return new;
end;
$$;

create trigger projects_protect before update on projects
for each row execute function protect_project_fields();

create or replace function protect_stock_quantity()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.quantity_available is distinct from old.quantity_available
     and current_setting('app.stock_write', true) is distinct from 'on' then
    raise exception 'Stock can only change through a stock movement';
  end if;
  return new;
end;
$$;

create trigger inventory_protect before update on inventory_items
for each row execute function protect_stock_quantity();

create or replace function log_opening_stock()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.quantity_available > 0 then
    insert into inventory_transactions (item_id, movement_type, quantity, unit_cost, note, created_by)
    values (new.id, 'adjustment', new.quantity_available, new.purchase_price, 'Opening stock', auth.uid());
  end if;
  return new;
end;
$$;

create trigger inventory_opening after insert on inventory_items
for each row execute function log_opening_stock();

create or replace function submit_quotation_request(payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  new_id uuid := gen_random_uuid();
  ref text;
  qty numeric;
begin
  if coalesce(payload ->> 'customer_name', '') = '' or coalesce(payload ->> 'phone', '') = '' then
    raise exception 'Name and phone are required';
  end if;
  if coalesce(payload ->> 'project_title', '') = '' or coalesce(payload ->> 'description', '') = '' then
    raise exception 'Project title and description are required';
  end if;
  if length(payload ->> 'description') > 5000 or length(payload ->> 'customer_name') > 160 then
    raise exception 'One of the fields is too long';
  end if;
  if coalesce(payload ->> 'image_path', '') like 'http%' then
    raise exception 'Invalid image';
  end if;

  qty := coalesce(nullif(payload ->> 'quantity', '')::numeric, 1);
  if qty <= 0 or qty > 100000 then
    raise exception 'Quantity is not valid';
  end if;

  ref := next_reference('QR');
  insert into quotation_requests (
    id, reference_number, customer_name, phone, email, project_title, fabrication_type,
    description, dimensions, preferred_materials, quantity, location, preferred_completion_date, image_path
  ) values (
    new_id,
    ref,
    payload ->> 'customer_name',
    payload ->> 'phone',
    nullif(payload ->> 'email', ''),
    payload ->> 'project_title',
    coalesce(nullif(payload ->> 'fabrication_type', ''), 'Custom metal fabrication'),
    payload ->> 'description',
    nullif(payload ->> 'dimensions', ''),
    nullif(payload ->> 'preferred_materials', ''),
    qty,
    nullif(payload ->> 'location', ''),
    nullif(payload ->> 'preferred_completion_date', '')::date,
    nullif(payload ->> 'image_path', '')
  );

  return jsonb_build_object('id', new_id, 'reference_number', ref);
end;
$$;

create or replace function submit_contact_message(payload jsonb)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_id uuid := gen_random_uuid();
begin
  if coalesce(payload ->> 'name', '') = '' or coalesce(payload ->> 'message', '') = '' then
    raise exception 'Name and message are required';
  end if;
  if length(payload ->> 'message') > 5000 then
    raise exception 'The message is too long';
  end if;

  insert into contact_messages (id, name, phone, email, message)
  values (
    new_id,
    payload ->> 'name',
    coalesce(payload ->> 'phone', ''),
    nullif(payload ->> 'email', ''),
    payload ->> 'message'
  );
  return new_id;
end;
$$;

create or replace function save_quotation(payload jsonb)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  qid uuid;
  customer uuid;
  request_id uuid;
  material numeric(14, 2);
  labour numeric(14, 2);
  transport numeric(14, 2);
  other_cost numeric(14, 2);
  costs numeric(14, 2);
  margin numeric(8, 2);
  selling numeric(14, 2);
  described bigint;
  priced bigint;
  selling_items numeric;
  next_status text;
  item_count integer;
begin
  if not is_admin() then
    raise exception 'Not allowed';
  end if;
  if coalesce(payload ->> 'customer_id', '') = '' then
    raise exception 'Choose a customer';
  end if;
  if coalesce(payload ->> 'title', '') = '' then
    raise exception 'Enter a title';
  end if;

  customer := (payload ->> 'customer_id')::uuid;
  request_id := nullif(payload ->> 'quotation_request_id', '')::uuid;
  material := round(coalesce((payload ->> 'material_cost')::numeric, 0), 2);
  labour := round(coalesce((payload ->> 'labour_cost')::numeric, 0), 2);
  transport := round(coalesce((payload ->> 'transport_cost')::numeric, 0), 2);
  other_cost := round(coalesce((payload ->> 'other_cost')::numeric, 0), 2);
  if material < 0 or labour < 0 or transport < 0 or other_cost < 0 then
    raise exception 'Costs cannot be negative';
  end if;

  select
    count(*) filter (where coalesce(value ->> 'description', '') <> ''),
    count(*) filter (
      where coalesce(value ->> 'description', '') <> ''
        and coalesce((value ->> 'unit_price')::numeric, 0) > 0
        and coalesce((value ->> 'quantity')::numeric, 0) > 0
    ),
    coalesce(sum(
      case
        when coalesce(value ->> 'description', '') <> ''
          and coalesce((value ->> 'unit_price')::numeric, 0) > 0
          and coalesce((value ->> 'quantity')::numeric, 0) > 0
        then (value ->> 'quantity')::numeric * (value ->> 'unit_price')::numeric
        else 0
      end
    ), 0)
  into described, priced, selling_items
  from jsonb_array_elements(coalesce(payload -> 'items', '[]'::jsonb));

  costs := material + labour + transport + other_cost;
  if described > 0 and priced = described then
    selling := round(selling_items, 2);
    margin := case when costs = 0 then 0 else round(((selling - costs) / costs) * 100, 2) end;
  else
    margin := round(coalesce((payload ->> 'profit_margin_percent')::numeric, 0), 2);
    if margin < 0 then
      raise exception 'Margin cannot be negative';
    end if;
    selling := round(costs * (1 + margin / 100), 2);
  end if;

  next_status := coalesce(nullif(payload ->> 'status', ''), 'under_review');
  if next_status not in ('pending', 'under_review', 'quotation_sent', 'accepted', 'rejected', 'expired') then
    raise exception 'Invalid status';
  end if;

  qid := nullif(payload ->> 'id', '')::uuid;
  if qid is not null and exists (select 1 from orders where quotation_id = qid) then
    raise exception 'This quotation already has an order';
  end if;

  if qid is null then
    qid := gen_random_uuid();
    insert into quotations (
      id, quotation_number, quotation_request_id, customer_id, title, description, status,
      material_cost, labour_cost, transport_cost, other_cost, profit_margin_percent,
      subtotal, total, valid_until, notes, created_by
    ) values (
      qid, next_reference('QT'), request_id, customer, payload ->> 'title',
      coalesce(payload ->> 'description', ''), next_status,
      material, labour, transport, other_cost, margin,
      costs, selling, nullif(payload ->> 'valid_until', '')::date,
      coalesce(payload ->> 'notes', ''), auth.uid()
    );
  else
    update quotations set
      quotation_request_id = request_id,
      customer_id = customer,
      title = payload ->> 'title',
      description = coalesce(payload ->> 'description', ''),
      status = next_status,
      material_cost = material,
      labour_cost = labour,
      transport_cost = transport,
      other_cost = other_cost,
      profit_margin_percent = margin,
      subtotal = costs,
      total = selling,
      valid_until = nullif(payload ->> 'valid_until', '')::date,
      notes = coalesce(payload ->> 'notes', '')
    where id = qid;
    if not found then
      raise exception 'Quotation not found';
    end if;
  end if;

  delete from quotation_items where quotation_id = qid;
  insert into quotation_items (quotation_id, description, quantity, unit, unit_price)
  select
    qid,
    left(value ->> 'description', 300),
    coalesce(nullif(value ->> 'quantity', '')::numeric, 1),
    coalesce(nullif(value ->> 'unit', ''), 'pcs'),
    round(coalesce(nullif(value ->> 'unit_price', '')::numeric, 0), 2)
  from jsonb_array_elements(coalesce(payload -> 'items', '[]'::jsonb))
  where coalesce(value ->> 'description', '') <> '';

  get diagnostics item_count = row_count;
  if item_count = 0 then
    insert into quotation_items (quotation_id, description, quantity, unit, unit_price)
    values (qid, left(payload ->> 'title', 300), 1, 'job', selling);
  end if;

  if request_id is not null then
    update quotation_requests
    set status = case when status = 'new' then 'in_review' else status end,
        customer_id = coalesce(customer_id, customer)
    where id = request_id;
  end if;

  return qid;
end;
$$;

create or replace function convert_quotation_to_order(p_quotation_id uuid, p_expected_completion date)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  quote quotations%rowtype;
  order_id uuid := gen_random_uuid();
  project_id uuid := gen_random_uuid();
  request_date date;
  due date;
begin
  if not is_admin() then
    raise exception 'Not allowed';
  end if;

  select * into quote from quotations where id = p_quotation_id;
  if not found then
    raise exception 'Quotation not found';
  end if;
  if quote.status <> 'accepted' then
    raise exception 'Accept the quotation before creating an order';
  end if;
  if exists (select 1 from orders where quotation_id = quote.id) then
    raise exception 'This quotation already has an order';
  end if;

  select preferred_completion_date into request_date
  from quotation_requests where id = quote.quotation_request_id;
  due := coalesce(p_expected_completion, request_date, current_date + 14);

  insert into orders (id, order_number, quotation_id, customer_id, description, agreed_price, expected_completion_date, status)
  values (
    order_id,
    next_reference('OR'),
    quote.id,
    quote.customer_id,
    quote.title || case when quote.description <> '' then E'\n\n' || quote.description else '' end,
    quote.total,
    due,
    'confirmed'
  );

  insert into projects (
    id, project_number, order_id, customer_id, description, start_date,
    expected_completion_date, budget, labour_cost, status
  ) values (
    project_id,
    next_reference('PR'),
    order_id,
    quote.customer_id,
    quote.title || case when quote.description <> '' then E'\n\n' || quote.description else '' end,
    current_date,
    due,
    quote.total,
    quote.labour_cost,
    'active'
  );

  insert into project_stages (project_id, stage_key, stage_name, sort_order)
  values
    (project_id, 'design', 'Design and measurements', 1),
    (project_id, 'materials', 'Material preparation', 2),
    (project_id, 'cutting', 'Cutting', 3),
    (project_id, 'welding', 'Welding and assembly', 4),
    (project_id, 'finishing', 'Grinding and finishing', 5),
    (project_id, 'painting', 'Painting', 6),
    (project_id, 'inspection', 'Quality inspection', 7),
    (project_id, 'delivery', 'Delivery', 8);

  if quote.quotation_request_id is not null then
    update quotation_requests set status = 'converted' where id = quote.quotation_request_id;
  end if;

  return order_id;
end;
$$;

create or replace function set_project_stage(p_project uuid, p_stage text, p_status text, p_notes text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  done_count integer;
begin
  if p_status not in ('pending', 'in_progress', 'done') then
    raise exception 'Invalid status';
  end if;
  if not is_admin() and not exists (
    select 1 from projects
    where id = p_project and assigned_employee_id = current_employee_id()
  ) then
    raise exception 'Not allowed';
  end if;
  if not exists (select 1 from project_stages where project_id = p_project and stage_key = p_stage) then
    raise exception 'Stage not found';
  end if;

  update project_stages
  set status = p_status,
      notes = coalesce(p_notes, notes),
      completed_at = case when p_status = 'done' then coalesce(completed_at, now()) else null end
  where project_id = p_project and stage_key = p_stage;

  if p_status = 'in_progress' then
    update project_stages
    set status = 'pending'
    where project_id = p_project and stage_key <> p_stage and status = 'in_progress';
  end if;

  select count(*) into done_count
  from project_stages
  where project_id = p_project and status = 'done';

  perform set_config('app.project_stage', 'on', true);
  update projects
  set progress_percent = round(100.0 * done_count / 8.0)::integer,
      status = case when done_count = 8 then 'completed' when status = 'completed' then 'active' else status end,
      completed_at = case when done_count = 8 then coalesce(completed_at, now()) else null end
  where id = p_project;
end;
$$;

create or replace function record_stock_movement(
  p_item uuid,
  p_type text,
  p_quantity numeric,
  p_unit_cost numeric,
  p_supplier uuid,
  p_project uuid,
  p_note text,
  p_record_expense boolean default false
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  delta numeric;
  current_qty numeric;
  movement_id uuid;
  cost numeric;
begin
  if not is_admin() then
    if p_type not in ('usage', 'allocation') or p_project is null then
      raise exception 'Not allowed';
    end if;
    if not exists (
      select 1 from projects
      where id = p_project and assigned_employee_id = current_employee_id()
    ) then
      raise exception 'Not allowed';
    end if;
  end if;

  if p_type not in ('purchase', 'usage', 'adjustment', 'allocation', 'return') then
    raise exception 'Invalid movement';
  end if;
  if p_quantity is null or p_quantity = 0 then
    raise exception 'Quantity is required';
  end if;

  if p_type in ('purchase', 'return') then
    delta := abs(p_quantity);
  elsif p_type in ('usage', 'allocation') then
    delta := -abs(p_quantity);
  else
    delta := p_quantity;
  end if;

  cost := greatest(coalesce(p_unit_cost, 0), 0);
  select quantity_available into current_qty from inventory_items where id = p_item for update;
  if not found then
    raise exception 'Material not found';
  end if;
  if current_qty + delta < 0 then
    raise exception 'Not enough stock';
  end if;

  perform set_config('app.stock_write', 'on', true);
  update inventory_items
  set quantity_available = quantity_available + delta,
      purchase_price = case when p_type = 'purchase' and cost > 0 then cost else purchase_price end,
      supplier_id = coalesce(p_supplier, supplier_id)
  where id = p_item;

  insert into inventory_transactions (item_id, movement_type, quantity, unit_cost, project_id, supplier_id, note, created_by)
  values (p_item, p_type, delta, cost, p_project, p_supplier, coalesce(p_note, ''), auth.uid())
  returning id into movement_id;

  if p_type in ('usage', 'allocation') and p_project is not null then
    insert into project_materials (project_id, inventory_item_id, quantity, unit_cost_at_time, allocated_by)
    values (
      p_project,
      p_item,
      abs(p_quantity),
      coalesce(nullif(cost, 0), (select purchase_price from inventory_items where id = p_item)),
      auth.uid()
    );
  end if;

  if p_type = 'purchase' and p_record_expense and abs(p_quantity) * cost > 0 then
    insert into transactions (type, category, amount, description, payment_method, created_by)
    values (
      'expense',
      'material_purchase',
      round(abs(p_quantity) * cost, 2),
      coalesce(nullif(p_note, ''), 'Material purchase'),
      'cash',
      auth.uid()
    );
  end if;

  return movement_id;
end;
$$;

create or replace function list_materials()
returns table (
  id uuid,
  name text,
  category text,
  unit text,
  quantity_available numeric,
  minimum_stock numeric,
  purchase_price numeric,
  supplier_id uuid,
  updated_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not is_staff() then
    raise exception 'Not allowed';
  end if;
  return query
  select
    item.id,
    item.name,
    item.category,
    item.unit,
    item.quantity_available,
    item.minimum_stock,
    case when is_admin() then item.purchase_price else null end,
    case when is_admin() then item.supplier_id else null end,
    item.updated_at
  from inventory_items item
  order by item.name;
end;
$$;

create or replace function list_project_materials(p_project uuid)
returns table (
  id uuid,
  material_name text,
  unit text,
  quantity numeric,
  unit_cost numeric,
  allocated_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not is_admin() and not exists (
    select 1 from projects
    where projects.id = p_project and assigned_employee_id = current_employee_id()
  ) then
    raise exception 'Not allowed';
  end if;

  return query
  select
    line.id,
    item.name,
    item.unit,
    line.quantity,
    case when is_admin() then line.unit_cost_at_time else null end,
    line.allocated_at
  from project_materials line
  join inventory_items item on item.id = line.inventory_item_id
  where line.project_id = p_project
  order by line.allocated_at desc;
end;
$$;

create or replace function get_dashboard_summary()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  result jsonb;
begin
  if not is_admin() then
    raise exception 'Not allowed';
  end if;

  select jsonb_build_object(
    'total_revenue', coalesce((select sum(amount) from transactions where type = 'income'), 0),
    'total_expenses', coalesce((select sum(amount) from transactions where type = 'expense'), 0),
    'estimated_profit',
      coalesce((select sum(amount) from transactions where type = 'income'), 0)
      - coalesce((select sum(amount) from transactions where type = 'expense'), 0),
    'agreed_value', coalesce((select sum(agreed_price) from orders where status <> 'cancelled'), 0),
    'pending_quotations',
      (select count(*) from quotations where status in ('pending', 'under_review'))
      + (select count(*) from quotation_requests where status = 'new'),
    'approved_orders', (select count(*) from orders where status <> 'cancelled'),
    'active_projects', (select count(*) from projects where status = 'active'),
    'completed_projects', (select count(*) from projects where status = 'completed'),
    'outstanding_payments', coalesce((
      select sum(greatest(o.agreed_price - coalesce(paid.amount, 0), 0))
      from orders o
      left join (
        select order_id, sum(amount) as amount
        from transactions
        where type = 'income' and order_id is not null
        group by order_id
      ) paid on paid.order_id = o.id
      where o.status <> 'cancelled'
    ), 0),
    'low_stock', (select count(*) from inventory_items where quantity_available <= minimum_stock),
    'monthly', coalesce((
      select jsonb_agg(jsonb_build_object(
        'month', to_char(bucket.month, 'Mon YYYY'),
        'revenue', bucket.revenue,
        'expenses', bucket.expenses
      ) order by bucket.month)
      from (
        select
          d::date as month,
          coalesce(sum(t.amount) filter (where t.type = 'income'), 0) as revenue,
          coalesce(sum(t.amount) filter (where t.type = 'expense'), 0) as expenses
        from generate_series(
          date_trunc('month', now()) - interval '5 months',
          date_trunc('month', now()),
          interval '1 month'
        ) as d
        left join transactions t
          on date_trunc('month', t.transaction_date::timestamp) = date_trunc('month', d)
        group by d
      ) bucket
    ), '[]'::jsonb),
    'recent_orders', coalesce((
      select jsonb_agg(to_jsonb(entry) order by entry.created_at desc)
      from (
        select o.id, o.order_number, o.status, o.agreed_price, o.created_at, c.full_name as customer_name
        from orders o
        join customers c on c.id = o.customer_id
        order by o.created_at desc
        limit 5
      ) entry
    ), '[]'::jsonb),
    'recent_requests', coalesce((
      select jsonb_agg(to_jsonb(entry) order by entry.created_at desc)
      from (
        select id, reference_number, customer_name, project_title, status, created_at
        from quotation_requests
        order by created_at desc
        limit 5
      ) entry
    ), '[]'::jsonb),
    'project_progress', coalesce((
      select jsonb_agg(to_jsonb(entry) order by entry.progress_percent)
      from (
        select p.id, p.project_number, p.description, p.progress_percent, p.status, c.full_name as customer_name
        from projects p
        join customers c on c.id = p.customer_id
        where p.status = 'active'
        order by p.updated_at desc
        limit 6
      ) entry
    ), '[]'::jsonb),
    'low_stock_items', coalesce((
      select jsonb_agg(to_jsonb(entry) order by entry.quantity_available)
      from (
        select id, name, unit, quantity_available, minimum_stock
        from inventory_items
        where quantity_available <= minimum_stock
        order by quantity_available
        limit 8
      ) entry
    ), '[]'::jsonb)
  ) into result;

  return result;
end;
$$;

create or replace function record_transaction(
  p_type text,
  p_category text,
  p_amount numeric,
  p_transaction_date date,
  p_description text,
  p_payment_method text,
  p_customer uuid,
  p_order uuid,
  p_project uuid,
  p_receipt text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_id uuid := gen_random_uuid();
begin
  if not is_admin() then
    raise exception 'Not allowed';
  end if;
  if p_type not in ('income', 'expense') then
    raise exception 'Invalid transaction type';
  end if;
  if p_type = 'income' and p_category not in ('deposit', 'final_payment', 'product_sale', 'other_income') then
    raise exception 'Invalid income category';
  end if;
  if p_type = 'expense' and p_category not in ('material_purchase', 'labour', 'transportation', 'electricity', 'maintenance', 'rent', 'other_expense') then
    raise exception 'Invalid expense category';
  end if;
  if p_amount is null or p_amount <= 0 then
    raise exception 'Amount must be greater than zero';
  end if;
  if coalesce(p_payment_method, '') not in ('cash', 'mobile_money', 'bank', 'other') then
    raise exception 'Invalid payment method';
  end if;

  insert into transactions (
    id, type, category, amount, transaction_date, description, payment_method,
    customer_id, order_id, project_id, receipt_path, created_by
  ) values (
    new_id,
    p_type,
    p_category,
    round(p_amount, 2),
    coalesce(p_transaction_date, current_date),
    coalesce(p_description, ''),
    p_payment_method,
    p_customer,
    p_order,
    p_project,
    nullif(p_receipt, ''),
    auth.uid()
  );
  return new_id;
end;
$$;

alter table profiles enable row level security;
alter table employees enable row level security;
alter table business_settings enable row level security;
alter table customers enable row level security;
alter table suppliers enable row level security;
alter table services enable row level security;
alter table products enable row level security;
alter table portfolio_projects enable row level security;
alter table portfolio_images enable row level security;
alter table quotation_requests enable row level security;
alter table quotations enable row level security;
alter table quotation_items enable row level security;
alter table orders enable row level security;
alter table projects enable row level security;
alter table project_stages enable row level security;
alter table inventory_items enable row level security;
alter table inventory_transactions enable row level security;
alter table project_materials enable row level security;
alter table project_images enable row level security;
alter table transactions enable row level security;
alter table deliveries enable row level security;
alter table contact_messages enable row level security;
alter table reference_counters enable row level security;

create policy profiles_select on profiles for select to authenticated
using (id = auth.uid() or is_admin());
create policy profiles_update_self on profiles for update to authenticated
using (id = auth.uid())
with check (id = auth.uid() and role = current_role_name());
create policy profiles_update_admin on profiles for update to authenticated
using (is_admin()) with check (is_admin());

create policy employees_admin on employees for all to authenticated
using (is_admin()) with check (is_admin());

create policy settings_read on business_settings for select to anon, authenticated
using (true);
create policy settings_update on business_settings for update to authenticated
using (is_admin()) with check (is_admin());

create policy customers_admin on customers for all to authenticated
using (is_admin()) with check (is_admin());
create policy customers_employee_read on customers for select to authenticated
using (id in (select customer_id from projects where assigned_employee_id = current_employee_id()));

create policy suppliers_admin on suppliers for all to authenticated
using (is_admin()) with check (is_admin());

create policy services_read on services for select to anon, authenticated
using (is_active or is_admin());
create policy services_admin on services for all to authenticated
using (is_admin()) with check (is_admin());

create policy products_read on products for select to anon, authenticated
using (is_active or is_admin());
create policy products_admin on products for all to authenticated
using (is_admin()) with check (is_admin());

create policy portfolio_read on portfolio_projects for select to anon, authenticated
using (is_published or is_admin());
create policy portfolio_admin on portfolio_projects for all to authenticated
using (is_admin()) with check (is_admin());

create policy portfolio_images_read on portfolio_images for select to anon, authenticated
using (
  is_admin() or exists (
    select 1 from portfolio_projects
    where portfolio_projects.id = portfolio_images.portfolio_project_id
      and portfolio_projects.is_published
  )
);
create policy portfolio_images_admin on portfolio_images for all to authenticated
using (is_admin()) with check (is_admin());

create policy requests_admin on quotation_requests for all to authenticated
using (is_admin()) with check (is_admin());
create policy quotations_admin on quotations for all to authenticated
using (is_admin()) with check (is_admin());
create policy quotation_items_admin on quotation_items for all to authenticated
using (is_admin()) with check (is_admin());
create policy orders_admin on orders for all to authenticated
using (is_admin()) with check (is_admin());

create policy projects_admin on projects for all to authenticated
using (is_admin()) with check (is_admin());
create policy projects_employee_read on projects for select to authenticated
using (assigned_employee_id = current_employee_id());
create policy projects_employee_update on projects for update to authenticated
using (assigned_employee_id = current_employee_id())
with check (assigned_employee_id = current_employee_id());

create policy stages_read on project_stages for select to authenticated
using (
  is_admin() or project_id in (
    select id from projects where assigned_employee_id = current_employee_id()
  )
);

create policy inventory_admin on inventory_items for all to authenticated
using (is_admin()) with check (is_admin());
create policy inventory_tx_admin on inventory_transactions for select to authenticated
using (is_admin());
create policy project_materials_admin on project_materials for select to authenticated
using (is_admin());

create policy project_images_read on project_images for select to authenticated
using (
  is_admin() or project_id in (
    select id from projects where assigned_employee_id = current_employee_id()
  )
);
create policy project_images_write on project_images for insert to authenticated
with check (
  is_admin() or project_id in (
    select id from projects where assigned_employee_id = current_employee_id()
  )
);
create policy project_images_admin_delete on project_images for delete to authenticated
using (is_admin());

create policy transactions_admin_read on transactions for select to authenticated
using (is_admin());
create policy deliveries_admin on deliveries for all to authenticated
using (is_admin()) with check (is_admin());
create policy messages_admin on contact_messages for select to authenticated
using (is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('public-assets', 'public-assets', true, 5242880, array['image/jpeg', 'image/png', 'image/webp']),
  ('quote-uploads', 'quote-uploads', false, 5242880, array['image/jpeg', 'image/png', 'image/webp']),
  ('receipts', 'receipts', false, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'application/pdf']),
  ('project-files', 'project-files', false, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

drop policy if exists assets_public_read on storage.objects;
drop policy if exists assets_admin_insert on storage.objects;
drop policy if exists quotes_anon_insert on storage.objects;
drop policy if exists quotes_admin_read on storage.objects;
drop policy if exists receipts_admin_write on storage.objects;
drop policy if exists receipts_admin_read on storage.objects;
drop policy if exists project_files_staff on storage.objects;
drop policy if exists storage_admin_delete on storage.objects;

create policy assets_public_read on storage.objects for select to anon, authenticated
using (bucket_id = 'public-assets');
create policy assets_admin_insert on storage.objects for insert to authenticated
with check (bucket_id = 'public-assets' and public.is_admin());
create policy quotes_anon_insert on storage.objects for insert to anon, authenticated
with check (bucket_id = 'quote-uploads');
create policy quotes_admin_read on storage.objects for select to authenticated
using (bucket_id = 'quote-uploads' and public.is_admin());
create policy receipts_admin_write on storage.objects for insert to authenticated
with check (bucket_id = 'receipts' and public.is_admin());
create policy receipts_admin_read on storage.objects for select to authenticated
using (bucket_id = 'receipts' and public.is_admin());
create policy project_files_staff on storage.objects for all to authenticated
using (bucket_id = 'project-files' and public.is_staff())
with check (bucket_id = 'project-files' and public.is_staff());
create policy storage_admin_delete on storage.objects for delete to authenticated
using (
  bucket_id in ('public-assets', 'quote-uploads', 'receipts', 'project-files')
  and public.is_admin()
);

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on all tables in schema public to anon, authenticated;
grant usage, select on all sequences in schema public to anon, authenticated;

revoke all on function next_reference(text) from public, anon, authenticated;
revoke all on function handle_new_user() from public, anon, authenticated;
revoke all on function set_updated_at() from public, anon, authenticated;
revoke all on function protect_project_fields() from public, anon, authenticated;
revoke all on function protect_stock_quantity() from public, anon, authenticated;
revoke all on function log_opening_stock() from public, anon, authenticated;

revoke all on function is_admin() from public;
revoke all on function is_staff() from public;
revoke all on function current_role_name() from public;
revoke all on function current_employee_id() from public;
grant execute on function is_admin() to anon, authenticated;
grant execute on function is_staff() to anon, authenticated;
grant execute on function current_role_name() to anon, authenticated;
grant execute on function current_employee_id() to anon, authenticated;

revoke all on function submit_quotation_request(jsonb) from public;
revoke all on function submit_contact_message(jsonb) from public;
grant execute on function submit_quotation_request(jsonb) to anon, authenticated;
grant execute on function submit_contact_message(jsonb) to anon, authenticated;

revoke all on function save_quotation(jsonb) from public;
revoke all on function convert_quotation_to_order(uuid, date) from public;
revoke all on function set_project_stage(uuid, text, text, text) from public;
revoke all on function record_stock_movement(uuid, text, numeric, numeric, uuid, uuid, text, boolean) from public;
revoke all on function list_materials() from public;
revoke all on function list_project_materials(uuid) from public;
revoke all on function get_dashboard_summary() from public;
revoke all on function record_transaction(text, text, numeric, date, text, text, uuid, uuid, uuid, text) from public;

grant execute on function save_quotation(jsonb) to authenticated;
grant execute on function convert_quotation_to_order(uuid, date) to authenticated;
grant execute on function set_project_stage(uuid, text, text, text) to authenticated;
grant execute on function record_stock_movement(uuid, text, numeric, numeric, uuid, uuid, text, boolean) to authenticated;
grant execute on function list_materials() to authenticated;
grant execute on function list_project_materials(uuid) to authenticated;
grant execute on function get_dashboard_summary() to authenticated;
grant execute on function record_transaction(text, text, numeric, date, text, text, uuid, uuid, uuid, text) to authenticated;

-- After you add the first user in Authentication → Users, promote them:
-- update profiles set role = 'admin' where email = 'you@example.com';
