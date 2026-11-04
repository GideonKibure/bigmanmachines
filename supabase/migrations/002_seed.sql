-- Sample workshop content. Safe to run once. Existing rows are left as they are.
-- Homepage claims such as "10+" are editable later in Settings. They are not calculated.

insert into business_settings (
  id, business_name, tagline, hero_eyebrow, hero_headline, hero_highlight, hero_subtext, about,
  phone, whatsapp, email, address, map_url, hours, currency_code, facebook, instagram,
  stat_years, stat_projects, hero_image_url, about_image_url, feature_image_url,
  feature_title, feature_text, callout_title, callout_text, why_choose, testimonials
) values (
  1,
  'Mkushi Metal Works',
  'Welding and metal fabrication',
  'Workshop fabrication',
  'Every joint made to',
  'hold',
  'Gates, frames, furniture, and steel structures — measured, welded, and finished for homes, shops, and work sites.',
  'Mkushi Metal Works is a welding and fabrication workshop. We take measurements, cut and assemble steel, and finish the job so it is ready to fit. Tell us the opening, the material, and the date you need.',
  '', '', '', '', '',
  '[{"days":"Monday – Friday","hours":"08:00 – 17:00"},{"days":"Saturday","hours":"08:00 – 13:00"},{"days":"Sunday","hours":"Closed"}]'::jsonb,
  'TZS', '', '',
  '10+', '120+',
  'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=1800&q=80',
  'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1565008576549-57569a49371d?auto=format&fit=crop&w=1400&q=80',
  'The same crew from measure to finish',
  'Design, cutting, welding, grinding, and paint stay in one workshop. You deal with the people who build the job.',
  'A price before we cut',
  'Send the size, material, and photos. We reply with a quotation you can accept before any steel is used.',
  '[{"title":"Measured properly","text":"We size the work to the opening, not to a guess."},{"title":"Priced before cutting","text":"Materials, labour, transport, and margin are written down first."},{"title":"Built in the workshop","text":"Cutting, welding, grinding, and paint happen under one roof."},{"title":"Finished for fitting","text":"Jobs leave the shop cleaned, checked, and ready to install."}]'::jsonb,
  '[{"quote":"The gate was measured, built, and fitted on the day they promised. The frame sits square and the paint has held.","name":"Amina K.","role":"Homeowner"},{"quote":"The window bars were straight, and the centre panel still comes out when we take a delivery.","name":"Joseph M.","role":"Shop owner"},{"quote":"They sent a written price before cutting, and the shade frame arrived ready to bolt on.","name":"Neema L.","role":"Site supervisor"}]'::jsonb
) on conflict (id) do nothing;

insert into services (id, name, slug, category, summary, description, image_url, highlights, is_featured, is_active, sort_order)
values
  ('10000000-0000-4000-8000-000000000001', 'Gate and door fabrication', 'gates-and-doors', 'Gates', 'Driveway gates, pedestrian doors, and steel frames built to the opening.', 'Swing gates, sliding gates, and pedestrian doors, measured on site and finished for daily use.', 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=1400&q=80', '["Measured to the opening","Swing or sliding","Primed or painted"]'::jsonb, true, true, 1),
  ('10000000-0000-4000-8000-000000000002', 'Window frames and grills', 'window-frames-and-grills', 'Windows', 'Burglar bars and window frames that stay straight and lock up properly.', 'Window grills, burglar bars, and light frames for homes and shops.', 'https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=1400&q=80', '["Security bars","Window frames","Site fitting"]'::jsonb, true, true, 2),
  ('10000000-0000-4000-8000-000000000003', 'Metal furniture', 'metal-furniture', 'Furniture', 'Tables, benches, shelves, and frames made for workshops and homes.', 'Steel furniture built to a size you choose, with a finish that can live indoors or out.', 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1400&q=80', '["Custom sizes","Indoor or outdoor","Strong frames"]'::jsonb, true, true, 3),
  ('10000000-0000-4000-8000-000000000004', 'Roofing structures', 'roofing-structures', 'Structures', 'Trusses and roof steel cut and assembled for the span you need.', 'Roof trusses and supporting steel, fabricated from your measurements or drawings.', 'https://images.unsplash.com/photo-1565008576549-57569a49371d?auto=format&fit=crop&w=1400&q=80', '["Trusses","Purlins","Site measurements"]'::jsonb, false, true, 4),
  ('10000000-0000-4000-8000-000000000005', 'Steel structures', 'steel-structures', 'Structures', 'Sheds, mezzanines, and small structural frames.', 'Columns, beams, and frames for sheds, shades, and light industrial buildings.', 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=1400&q=80', '["Columns and beams","Shed frames","Bolted or welded"]'::jsonb, false, true, 5),
  ('10000000-0000-4000-8000-000000000006', 'Machine fabrication', 'machine-fabrication', 'Machines', 'Brackets, guards, frames, and one-off machine parts.', 'We fabricate guards, stands, hoppers, and replacement parts from a sample or a sketch.', 'https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=1400&q=80', '["One-off parts","Guards and stands","Repair sections"]'::jsonb, false, true, 6),
  ('10000000-0000-4000-8000-000000000007', 'Welding repairs', 'welding-repairs', 'Repairs', 'Cracked frames, broken hinges, and worn steel put back to work.', 'Repair welding for gates, trailers, furniture, and workshop equipment.', 'https://images.unsplash.com/photo-1565008576549-57569a49371d?auto=format&fit=crop&w=1400&q=80', '["Crack repairs","Hinge rebuilds","On the piece or in the shop"]'::jsonb, false, true, 7),
  ('10000000-0000-4000-8000-000000000008', 'Custom metal fabrication', 'custom-metal-fabrication', 'Custom', 'If it can be drawn and welded, we can price it.', 'Bring a photo, a sketch, or a broken sample. We will quote the materials and the labour.', 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1400&q=80', '["From a sketch or sample","Your dimensions","Quoted before we start"]'::jsonb, false, true, 8)
on conflict (id) do nothing;

insert into products (id, name, slug, description, image_url, price, availability, specifications, is_featured, is_active)
values
  ('20000000-0000-4000-8000-000000000001', 'Driveway swing gate', 'driveway-swing-gate', 'A double-leaf steel gate for a standard driveway, primed and ready for colour.', 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=1400&q=80', 850000, 'made_to_order', '{"Width":"3.2 m","Height":"2.1 m","Material":"Mild steel","Finish":"Primed"}'::jsonb, true, true),
  ('20000000-0000-4000-8000-000000000002', 'Window security grill', 'window-security-grill', 'A fixed window grill with a centre bar pattern. Size can be adjusted when you order.', 'https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=1400&q=80', 180000, 'made_to_order', '{"Width":"1.2 m","Height":"1.2 m","Material":"Square tube","Finish":"Gloss black"}'::jsonb, true, true),
  ('20000000-0000-4000-8000-000000000003', 'Workshop table', 'workshop-table', 'A heavy steel table for a workshop or shop floor.', 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1400&q=80', 420000, 'in_stock', '{"Length":"1.8 m","Width":"0.8 m","Top":"Sheet steel","Frame":"50 mm tube"}'::jsonb, true, true),
  ('20000000-0000-4000-8000-000000000004', 'Door burglar bars', 'door-burglar-bars', 'A security screen for a single door opening.', 'https://images.unsplash.com/photo-1565008576549-57569a49371d?auto=format&fit=crop&w=1400&q=80', 250000, 'made_to_order', '{"Width":"0.9 m","Height":"2.1 m","Lock":"Padlock hasp","Finish":"Primed"}'::jsonb, false, true)
on conflict (id) do nothing;

insert into portfolio_projects (id, title, category, description, completion_date, materials, cover_image_url, is_featured, is_published)
values
  ('30000000-0000-4000-8000-000000000001', 'Compound swing gate', 'Gates', 'A double swing gate with a pedestrian leaf, built to a sloped driveway.', '2026-02-18', '40 mm square tube, sheet infill, gloss black paint', 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=1400&q=80', true, true),
  ('30000000-0000-4000-8000-000000000002', 'Shopfront window bars', 'Windows', 'Security bars across a shopfront, with a removable centre panel for deliveries.', '2026-01-09', '25 mm square bar, round bar infill', 'https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=1400&q=80', true, true),
  ('30000000-0000-4000-8000-000000000003', 'Shade roof frame', 'Structures', 'A steel shade frame for an outdoor work area, bolted to existing columns.', '2025-11-22', 'Rectangular hollow section, purlins, primer', 'https://images.unsplash.com/photo-1565008576549-57569a49371d?auto=format&fit=crop&w=1400&q=80', true, true),
  ('30000000-0000-4000-8000-000000000004', 'Trailer frame repair', 'Repairs', 'A cracked trailer drawbar cut out and replaced, then checked under load.', '2025-10-03', 'Channel section, reinforcing plate', 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1400&q=80', false, true)
on conflict (id) do nothing;

insert into portfolio_images (id, portfolio_project_id, image_url, sort_order)
values
  ('31000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000001', 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=1400&q=80', 1),
  ('31000000-0000-4000-8000-000000000002', '30000000-0000-4000-8000-000000000001', 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1400&q=80', 2),
  ('31000000-0000-4000-8000-000000000003', '30000000-0000-4000-8000-000000000002', 'https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=1400&q=80', 1),
  ('31000000-0000-4000-8000-000000000004', '30000000-0000-4000-8000-000000000003', 'https://images.unsplash.com/photo-1565008576549-57569a49371d?auto=format&fit=crop&w=1400&q=80', 1),
  ('31000000-0000-4000-8000-000000000005', '30000000-0000-4000-8000-000000000004', 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1400&q=80', 1)
on conflict (id) do nothing;

insert into suppliers (id, name, phone)
values ('40000000-0000-4000-8000-000000000001', 'General supplier', '')
on conflict (id) do nothing;

insert into inventory_items (id, name, category, unit, quantity_available, minimum_stock, purchase_price, supplier_id)
values
  ('50000000-0000-4000-8000-000000000001', 'Steel pipes', 'Steel', 'pcs', 40, 10, 25000, '40000000-0000-4000-8000-000000000001'),
  ('50000000-0000-4000-8000-000000000002', 'Metal sheets', 'Steel', 'sheet', 12, 5, 85000, '40000000-0000-4000-8000-000000000001'),
  ('50000000-0000-4000-8000-000000000003', 'Welding electrodes', 'Consumables', 'kg', 8, 5, 6000, '40000000-0000-4000-8000-000000000001'),
  ('50000000-0000-4000-8000-000000000004', 'Cutting discs', 'Consumables', 'pc', 2, 15, 3500, '40000000-0000-4000-8000-000000000001'),
  ('50000000-0000-4000-8000-000000000005', 'Grinding discs', 'Consumables', 'pc', 18, 10, 4000, '40000000-0000-4000-8000-000000000001'),
  ('50000000-0000-4000-8000-000000000006', 'Paint', 'Finishing', 'litre', 6, 8, 12000, '40000000-0000-4000-8000-000000000001'),
  ('50000000-0000-4000-8000-000000000007', 'Bolts and nuts', 'Fasteners', 'kg', 20, 5, 4500, '40000000-0000-4000-8000-000000000001')
on conflict (id) do nothing;
