-- Master Location Dataset Migration
-- Replaces existing geography records with the 4-district master dataset

BEGIN;

-- Clear existing records to ensure clean relational setup
TRUNCATE TABLE public.supplier_records CASCADE;
TRUNCATE TABLE public.villages CASCADE;
TRUNCATE TABLE public.blocks CASCADE;
TRUNCATE TABLE public.districts CASCADE;

-- District: Gir Somnath
INSERT INTO public.districts (id, name, state, is_active) VALUES (gen_random_uuid(), 'Gir Somnath', 'Gujarat', true);

-- Taluka: Kodinar under Gir Somnath
INSERT INTO public.blocks (id, name, district_id, is_active)
SELECT gen_random_uuid(), 'Kodinar', id, true FROM public.districts WHERE name = 'Gir Somnath';

INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Anandpur', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kodinar' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Facharia', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kodinar' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Devalpur', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kodinar' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Arnej', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kodinar' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Sugala', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kodinar' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Sindhaj', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kodinar' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Jagatiya', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kodinar' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Chhachhar', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kodinar' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Shedhaya', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kodinar' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Valadar', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kodinar' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Adpokar', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kodinar' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Alidar', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kodinar' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Bodava', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kodinar' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Jamanvada', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kodinar' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Jithala', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kodinar' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Kareda', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kodinar' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Mitiyaj', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kodinar' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Morvad', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kodinar' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Fafani Nani', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kodinar' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Fafani Moti', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kodinar' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Sayaji Rajpura', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kodinar' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Arithya', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kodinar' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Chidivav', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kodinar' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Ghantwad', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kodinar' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Girdevli', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kodinar' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Govindpur Bhandaria', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kodinar' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Inchvad Nani', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kodinar' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Kantala', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kodinar' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Nagadla', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kodinar' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Pavati', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kodinar' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Ronaj', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kodinar' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Sandhnidhar', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kodinar' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Vithalpur', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kodinar' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Kaj', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kodinar' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Dolasa', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kodinar' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Velan', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kodinar' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Nanavada', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kodinar' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Jantrakhadi', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kodinar' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Panch Pipalva', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kodinar' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Malgam', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kodinar' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Piplava Bavana', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kodinar' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Malshram', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kodinar' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Sarakhadi', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kodinar' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Kadodara', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kodinar' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Devli Dedani', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kodinar' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Damali', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kodinar' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Chhara', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kodinar' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Pipali', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kodinar' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Kodinar', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kodinar' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Panadar', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kodinar' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Muldwarka', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kodinar' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Gohil Ni Khan', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kodinar' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Chauhan ni Khan', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kodinar' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Kadvasan', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kodinar' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Pedhavada', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kodinar' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Vadnagar', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kodinar' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Navagam', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kodinar' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Barada', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kodinar' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Dudana', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kodinar' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Advi', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kodinar' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Velva', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kodinar' AND d.name = 'Gir Somnath';

-- Taluka: Sutrapada under Gir Somnath
INSERT INTO public.blocks (id, name, district_id, is_active)
SELECT gen_random_uuid(), 'Sutrapada', id, true FROM public.districts WHERE name = 'Gir Somnath';

INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Virodar', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Sutrapada' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Alidra', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Sutrapada' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Bhuvatimbi', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Sutrapada' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Gangaetha', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Sutrapada' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Ghantiya', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Sutrapada' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Gorakhmadhi', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Sutrapada' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Khera', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Sutrapada' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Moradiya', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Sutrapada' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Pransli', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Sutrapada' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Vasavad', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Sutrapada' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Rangpur', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Sutrapada' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Mahobatpara', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Sutrapada' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Bhuvavada', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Sutrapada' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Pipalva', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Sutrapada' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Timbadi', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Sutrapada' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Amarapur', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Sutrapada' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Sara', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Sutrapada' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Bosan', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Sutrapada' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Umbari', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Sutrapada' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Vavdi (Sutra)', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Sutrapada' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Sundarpara', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Sutrapada' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Kadvar', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Sutrapada' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Lati', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Sutrapada' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Anandpara', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Sutrapada' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Tobra', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Sutrapada' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Khambha', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Sutrapada' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Kanjotar', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Sutrapada' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Rakhej', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Sutrapada' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Matana', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Sutrapada' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Solaj', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Sutrapada' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Kadasala', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Sutrapada' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Barula', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Sutrapada' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Thareli', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Sutrapada' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Padruka', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Sutrapada' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Chagiya', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Sutrapada' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Morasa', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Sutrapada' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Prashnavda', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Sutrapada' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Vadodara Zala', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Sutrapada' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Lodhava', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Sutrapada' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Barevla', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Sutrapada' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Singsar', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Sutrapada' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Thoradi', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Sutrapada' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Dhamlej', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Sutrapada' AND d.name = 'Gir Somnath';

-- Taluka: Veraval under Gir Somnath
INSERT INTO public.blocks (id, name, district_id, is_active)
SELECT gen_random_uuid(), 'Veraval', id, true FROM public.districts WHERE name = 'Gir Somnath';

INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Bhetali', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Veraval' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Kodidra', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Veraval' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Kukras', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Veraval' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Rampara', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Veraval' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Bolas', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Veraval' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Indroi', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Veraval' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Khanderi', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Veraval' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Nakhada', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Veraval' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Navdra', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Veraval' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Pandva', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Veraval' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Savni', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Veraval' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Meghapur', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Veraval' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Ajotha', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Veraval' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Mathasuriya', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Veraval' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Lumbha', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Veraval' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Bherala', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Veraval' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Gunvantpur', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Veraval' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Mandor', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Veraval' AND d.name = 'Gir Somnath';

-- Taluka: Gir Gadhada under Gir Somnath
INSERT INTO public.blocks (id, name, district_id, is_active)
SELECT gen_random_uuid(), 'Gir Gadhada', id, true FROM public.districts WHERE name = 'Gir Somnath';

INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Harmadia', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Gir Gadhada' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Pichhva', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Gir Gadhada' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Pichhvi', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Gir Gadhada' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Rasulpara', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Gir Gadhada' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Thordi', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Gir Gadhada' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Bodidar', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Gir Gadhada' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Sonpara', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Gir Gadhada' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Jhanjhriya', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Gir Gadhada' AND d.name = 'Gir Somnath';

-- Taluka: Una under Gir Somnath
INSERT INTO public.blocks (id, name, district_id, is_active)
SELECT gen_random_uuid(), 'Una', id, true FROM public.districts WHERE name = 'Gir Somnath';

INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Kob', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Una' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Kajaradi', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Una' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Bhingaran', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Una' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Tad', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Una' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Paladi', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Una' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Olvan', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Una' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Bhadasi', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Una' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Lamdhar', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Una' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Mota desar', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Una' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Nathal', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Una' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Shahdesar', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Una' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Siloj', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Una' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Rampara', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Una' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Nandan', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Una' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Khapat', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Una' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Kalapan', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Una' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Khan', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Una' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Vasoj', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Una' AND d.name = 'Gir Somnath';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Khandhera', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Una' AND d.name = 'Gir Somnath';

-- District: Amreli
INSERT INTO public.districts (id, name, state, is_active) VALUES (gen_random_uuid(), 'Amreli', 'Gujarat', true);

-- Taluka: Amreli under Amreli
INSERT INTO public.blocks (id, name, district_id, is_active)
SELECT gen_random_uuid(), 'Amreli', id, true FROM public.districts WHERE name = 'Amreli';

INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Devaliya', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Amreli' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Rajthali', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Amreli' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Chhakargadh', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Amreli' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Vithalpur', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Amreli' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Champathal', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Amreli' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Taraktalav', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Amreli' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Gokharvala Nana', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Amreli' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Gokhavala Mota', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Amreli' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Lapaliya', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Amreli' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Pithavajal', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Amreli' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Khad Khambhaliya', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Amreli' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Shambhupara', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Amreli' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Sonariya', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Amreli' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Devrajiya', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Amreli' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Malila', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Amreli' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Kathama', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Amreli' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Pipallag', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Amreli' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Dahida', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Amreli' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Malavan', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Amreli' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Mota Ankadiya', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Amreli' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Nana Bhandariya', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Amreli' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Mota Bhandariya', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Amreli' AND d.name = 'Amreli';

-- Taluka: Bagasara under Amreli
INSERT INTO public.blocks (id, name, district_id, is_active)
SELECT gen_random_uuid(), 'Bagasara', id, true FROM public.districts WHERE name = 'Amreli';

INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Kagadadi', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Bagasara' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Lunghiya', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Bagasara' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Juna Zazjariya', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Bagasara' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Nava Zanzariya', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Bagasara' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Hamapur', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Bagasara' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Samadhiyala', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Bagasara' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Bagasara', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Bagasara' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Shapar', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Bagasara' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Juni Haliyad', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Bagasara' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Adapur', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Bagasara' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Halariya', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Bagasara' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Shilana', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Bagasara' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Haliyad Navi', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Bagasara' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Jethiyavadar', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Bagasara' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Jamka', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Bagasara' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Khijadiya', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Bagasara' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Sanaliya', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Bagasara' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Kadaya', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Bagasara' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Sudavad', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Bagasara' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Mota-Munjiyasar', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Bagasara' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Nana-Munjiyasar', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Bagasara' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Mavajinjava', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Bagasara' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Hadala', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Bagasara' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Pithdiya', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Bagasara' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Balapur', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Bagasara' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Juna-Vaghaniya', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Bagasara' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Ghantiyan', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Bagasara' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Dery Pipaliya', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Bagasara' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Manekavada', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Bagasara' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Rafala', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Bagasara' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Khari', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Bagasara' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Nava Vaghaniya', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Bagasara' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Nava Pipariya', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Bagasara' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Charan Pipali', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Bagasara' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Natvarnagar', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Bagasara' AND d.name = 'Amreli';

-- Taluka: Dhari under Amreli
INSERT INTO public.blocks (id, name, district_id, is_active)
SELECT gen_random_uuid(), 'Dhari', id, true FROM public.districts WHERE name = 'Amreli';

INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Kathivadar', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Dhari' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Nava Charkha', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Dhari' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Juna Charkha', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Dhari' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Ditala', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Dhari' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Ingorala Dungari', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Dhari' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Garamli (Charakha)', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Dhari' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Samathiyala Nana', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Dhari' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Bordi', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Dhari' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Bhader', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Dhari' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Dangavadar', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Dhari' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Kathrota', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Dhari' AND d.name = 'Amreli';

-- Taluka: Jafrabad under Amreli
INSERT INTO public.blocks (id, name, district_id, is_active)
SELECT gen_random_uuid(), 'Jafrabad', id, true FROM public.districts WHERE name = 'Amreli';

INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Kanthariya Khalsa', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Jafrabad' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Kanthariya Koli', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Jafrabad' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Sarovada', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Jafrabad' AND d.name = 'Amreli';

-- Taluka: Khambha under Amreli
INSERT INTO public.blocks (id, name, district_id, is_active)
SELECT gen_random_uuid(), 'Khambha', id, true FROM public.districts WHERE name = 'Amreli';

INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Dadhiyali', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Khambha' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Daldi', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Khambha' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Dedan', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Khambha' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Gorana', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Khambha' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Hanumanpur', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Khambha' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Jivapar', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Khambha' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Juna Malaknesh', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Khambha' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Katarpara', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Khambha' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Munjiyasar', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Khambha' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Nava Malaknesh', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Khambha' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Talada', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Khambha' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Vangadhra', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Khambha' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Samadhiyala No-2', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Khambha' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Nesadi No-2', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Khambha' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Pati', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Khambha' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Ningala No-2', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Khambha' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Bhundani', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Khambha' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Trakuda', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Khambha' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Barman Mota', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Khambha' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Barman Nana', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Khambha' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Jamka', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Khambha' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Kodiya', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Khambha' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Raningpara', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Khambha' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Sarakadiya Diwan', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Khambha' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Sarakadiya', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Khambha' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Bhavaradi', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Khambha' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Nanudi', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Khambha' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Khambha', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Khambha' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Pipalava', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Khambha' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Khadadhar', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Khambha' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Borala', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Khambha' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Babarpur', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Khambha' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Kantala', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Khambha' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Chakrava', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Khambha' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Dhundhavana', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Khambha' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Pachapachiya', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Khambha' AND d.name = 'Amreli';

-- Taluka: Kunkavav Vadia under Amreli
INSERT INTO public.blocks (id, name, district_id, is_active)
SELECT gen_random_uuid(), 'Kunkavav Vadia', id, true FROM public.districts WHERE name = 'Amreli';

INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Amrapur', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kunkavav Vadia' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Bambhaniya', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kunkavav Vadia' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Bantwa-Devli', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kunkavav Vadia' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Barvala Baval', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kunkavav Vadia' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Barvala Bavishi', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kunkavav Vadia' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Bhukhli-Santhali', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kunkavav Vadia' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Devgam', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kunkavav Vadia' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Jithudi', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kunkavav Vadia' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Jungar', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kunkavav Vadia' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Khijadiya Khan', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kunkavav Vadia' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Kolda', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kunkavav Vadia' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Kunkavav Moti', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kunkavav Vadia' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Kunkavav Nani', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kunkavav Vadia' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Luni-Dhar', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kunkavav Vadia' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Megha-pipaliya', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kunkavav Vadia' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Najapur', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kunkavav Vadia' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Rampur', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kunkavav Vadia' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Sanali', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kunkavav Vadia' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Talali', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kunkavav Vadia' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Tori', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kunkavav Vadia' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Vadia', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kunkavav Vadia' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Vavdi Road', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kunkavav Vadia' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Badalpur Nava', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kunkavav Vadia' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Arjansukh', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kunkavav Vadia' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Devalki', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kunkavav Vadia' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Khajuri', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kunkavav Vadia' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Targhari', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kunkavav Vadia' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Badanpur Juna', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kunkavav Vadia' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Dadva (Randal)', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kunkavav Vadia' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Sarangpur', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kunkavav Vadia' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Mayapadar', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kunkavav Vadia' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Lakhapadar', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kunkavav Vadia' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Sanala', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kunkavav Vadia' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Bhayavadar', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kunkavav Vadia' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Ujala Mota', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kunkavav Vadia' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Khajuri pipaliya', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kunkavav Vadia' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Khadkhad', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kunkavav Vadia' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Morvada', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kunkavav Vadia' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Khijdiya Hanuman', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kunkavav Vadia' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Dhundhiya Pipaliya', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kunkavav Vadia' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Khakhriya', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kunkavav Vadia' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Suryapratapgadh', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kunkavav Vadia' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Anida', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kunkavav Vadia' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Nava Ujala', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kunkavav Vadia' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Ishvariya', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kunkavav Vadia' AND d.name = 'Amreli';

-- Taluka: Liliya under Amreli
INSERT INTO public.blocks (id, name, district_id, is_active)
SELECT gen_random_uuid(), 'Liliya', id, true FROM public.districts WHERE name = 'Amreli';

INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Kankot Mota', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Liliya' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Amba', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Liliya' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Sedhavadar', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Liliya' AND d.name = 'Amreli';

-- Taluka: Rajula under Amreli
INSERT INTO public.blocks (id, name, district_id, is_active)
SELECT gen_random_uuid(), 'Rajula', id, true FROM public.districts WHERE name = 'Amreli';

INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Vavdi', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Rajula' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Chotra', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Rajula' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Bhakshi', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Rajula' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Navagam Mariana', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Rajula' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Agariya Mota', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Rajula' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Khari', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Rajula' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Katar', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Rajula' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'agariya nava', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Rajula' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'samokheti vallabhnagar', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Rajula' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Nani Kherali', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Rajula' AND d.name = 'Amreli';

-- Taluka: Savarkundala under Amreli
INSERT INTO public.blocks (id, name, district_id, is_active)
SELECT gen_random_uuid(), 'Savarkundala', id, true FROM public.districts WHERE name = 'Amreli';

INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Adsang', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Savarkundala' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Ambardi', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Savarkundala' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Navi Ambardi', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Savarkundala' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Detad', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Savarkundala' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Giniya', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Savarkundala' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Khodiyana', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Savarkundala' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Badhada', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Savarkundala' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Thoradi', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Savarkundala' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Surajvadi', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Savarkundala' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Vanot', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Savarkundala' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Luvara', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Savarkundala' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Jambuda', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Savarkundala' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Dhajadi', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Savarkundala' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Gadhakada', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Savarkundala' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Sakarpara', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Savarkundala' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Krushnagadh', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Savarkundala' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Ramgadh', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Savarkundala' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Bhamar', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Savarkundala' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Chikhali', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Savarkundala' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Dadhiya', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Savarkundala' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Ghandla', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Savarkundala' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Hadida', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Savarkundala' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Meriyana', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Savarkundala' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Goradka', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Savarkundala' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Vijapadi', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Savarkundala' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Bagoya', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Savarkundala' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Khadkala', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Savarkundala' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Kanatalav', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Savarkundala' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Karjala', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Savarkundala' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Oliya', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Savarkundala' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Hathashani', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Savarkundala' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Nana Bhamodra', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Savarkundala' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Borala', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Savarkundala' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Simaran', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Savarkundala' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Charkhadiya', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Savarkundala' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Jira', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Savarkundala' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Nesdi', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Savarkundala' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Juna Savar', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Savarkundala' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Piyava', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Savarkundala' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Likhala', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Savarkundala' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Mevasha', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Savarkundala' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Moladi', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Savarkundala' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Bhuva', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Savarkundala' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Dhar', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Savarkundala' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Mota Zinzuda', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Savarkundala' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Senjal', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Savarkundala' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Pithavadi', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Savarkundala' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Fifad', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Savarkundala' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Jejad', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Savarkundala' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Vashiyali', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Savarkundala' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Vanda', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Savarkundala' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Shelana', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Savarkundala' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Bhokarava', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Savarkundala' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Nani Vadal', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Savarkundala' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Bhenkra', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Savarkundala' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Vijyanagar', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Savarkundala' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Madhada', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Savarkundala' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Chhapari', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Savarkundala' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Khadasali', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Savarkundala' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Dedakadi', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Savarkundala' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Thavi', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Savarkundala' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Fachariya', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Savarkundala' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Mota Bhamodra', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Savarkundala' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Nana Zinzuda', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Savarkundala' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Khalpar', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Savarkundala' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Mekda', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Savarkundala' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Kerala', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Savarkundala' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Ankolada', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Savarkundala' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Viradi', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Savarkundala' AND d.name = 'Amreli';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Mitiyala', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Savarkundala' AND d.name = 'Amreli';

-- District: Junagadh
INSERT INTO public.districts (id, name, state, is_active) VALUES (gen_random_uuid(), 'Junagadh', 'Gujarat', true);

-- Taluka: Visavadar under Junagadh
INSERT INTO public.blocks (id, name, district_id, is_active)
SELECT gen_random_uuid(), 'Visavadar', id, true FROM public.districts WHERE name = 'Junagadh';

INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Juni Chavand', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Visavadar' AND d.name = 'Junagadh';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Chaparada', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Visavadar' AND d.name = 'Junagadh';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Khambhaliya(Ojjat)', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Visavadar' AND d.name = 'Junagadh';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Virpur', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Visavadar' AND d.name = 'Junagadh';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Khijadiya', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Visavadar' AND d.name = 'Junagadh';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Mota Kotda', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Visavadar' AND d.name = 'Junagadh';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Mangnath Pipali', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Visavadar' AND d.name = 'Junagadh';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Shirvaniya', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Visavadar' AND d.name = 'Junagadh';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Vajadi', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Visavadar' AND d.name = 'Junagadh';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Nana Kotda', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Visavadar' AND d.name = 'Junagadh';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Chhalda', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Visavadar' AND d.name = 'Junagadh';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Mota Hadmatiya', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Visavadar' AND d.name = 'Junagadh';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Vichhavad', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Visavadar' AND d.name = 'Junagadh';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Ishvariya (Mandavad)', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Visavadar' AND d.name = 'Junagadh';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Sukhpur', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Visavadar' AND d.name = 'Junagadh';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Jambudi', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Visavadar' AND d.name = 'Junagadh';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Piyava (Gir)', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Visavadar' AND d.name = 'Junagadh';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Dudhala', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Visavadar' AND d.name = 'Junagadh';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Premapara', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Visavadar' AND d.name = 'Junagadh';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Shobha Vadla(Gir)', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Visavadar' AND d.name = 'Junagadh';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Moti Monpari', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Visavadar' AND d.name = 'Junagadh';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Jambala', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Visavadar' AND d.name = 'Junagadh';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Sarsai', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Visavadar' AND d.name = 'Junagadh';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Baradiya (Gir)', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Visavadar' AND d.name = 'Junagadh';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Nani Monpari', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Visavadar' AND d.name = 'Junagadh';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Ishwariya (Gir)', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Visavadar' AND d.name = 'Junagadh';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Dadar (Gir)', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Visavadar' AND d.name = 'Junagadh';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Miya Vadla', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Visavadar' AND d.name = 'Junagadh';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Liliya', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Visavadar' AND d.name = 'Junagadh';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Vadala (Shetranj)', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Visavadar' AND d.name = 'Junagadh';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Haripur', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Visavadar' AND d.name = 'Junagadh';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Visavadar', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Visavadar' AND d.name = 'Junagadh';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Jhanjesar', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Visavadar' AND d.name = 'Junagadh';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Mandavad', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Visavadar' AND d.name = 'Junagadh';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Kalasari', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Visavadar' AND d.name = 'Junagadh';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Rajpara', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Visavadar' AND d.name = 'Junagadh';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Kuba', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Visavadar' AND d.name = 'Junagadh';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Ravni Kuba', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Visavadar' AND d.name = 'Junagadh';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Moniya', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Visavadar' AND d.name = 'Junagadh';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Leriya', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Visavadar' AND d.name = 'Junagadh';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Desai Vadala', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Visavadar' AND d.name = 'Junagadh';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Jetalvad', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Visavadar' AND d.name = 'Junagadh';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Moti Pindakhai', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Visavadar' AND d.name = 'Junagadh';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Nani Pindakhai', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Visavadar' AND d.name = 'Junagadh';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Bhalagam', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Visavadar' AND d.name = 'Junagadh';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Dhebar', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Visavadar' AND d.name = 'Junagadh';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Ambala', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Visavadar' AND d.name = 'Junagadh';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Mahudi', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Visavadar' AND d.name = 'Junagadh';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Jambuda', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Visavadar' AND d.name = 'Junagadh';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Chhelanka', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Visavadar' AND d.name = 'Junagadh';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Hajani-Pipaliya', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Visavadar' AND d.name = 'Junagadh';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Kankchyala', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Visavadar' AND d.name = 'Junagadh';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Bhutadi', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Visavadar' AND d.name = 'Junagadh';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Ghodasan', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Visavadar' AND d.name = 'Junagadh';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Mundiya Ravni', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Visavadar' AND d.name = 'Junagadh';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Hasanapur', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Visavadar' AND d.name = 'Junagadh';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Rabarika', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Visavadar' AND d.name = 'Junagadh';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Kanavadala', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Visavadar' AND d.name = 'Junagadh';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Lalpur', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Visavadar' AND d.name = 'Junagadh';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Kalavad', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Visavadar' AND d.name = 'Junagadh';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Vekariya', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Visavadar' AND d.name = 'Junagadh';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Govindpara', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Visavadar' AND d.name = 'Junagadh';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Shobha Vadla (Lashkar)', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Visavadar' AND d.name = 'Junagadh';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Pirvad', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Visavadar' AND d.name = 'Junagadh';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Navaniya', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Visavadar' AND d.name = 'Junagadh';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Khambha (Gir)', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Visavadar' AND d.name = 'Junagadh';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Nana Hadmatiya', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Visavadar' AND d.name = 'Junagadh';

-- Taluka: Mendarada under Junagadh
INSERT INTO public.blocks (id, name, district_id, is_active)
SELECT gen_random_uuid(), 'Mendarada', id, true FROM public.districts WHERE name = 'Junagadh';

INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Itali', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Mendarada' AND d.name = 'Junagadh';

-- Taluka: Junagadh under Junagadh
INSERT INTO public.blocks (id, name, district_id, is_active)
SELECT gen_random_uuid(), 'Junagadh', id, true FROM public.districts WHERE name = 'Junagadh';

INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Semrala', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Junagadh' AND d.name = 'Junagadh';

-- District: Chhotaudepur
INSERT INTO public.districts (id, name, state, is_active) VALUES (gen_random_uuid(), 'Chhotaudepur', 'Gujarat', true);

-- Taluka: Kavant under Chhotaudepur
INSERT INTO public.blocks (id, name, district_id, is_active)
SELECT gen_random_uuid(), 'Kavant', id, true FROM public.districts WHERE name = 'Chhotaudepur';

INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Asar', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kavant' AND d.name = 'Chhotaudepur';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Athadungari', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kavant' AND d.name = 'Chhotaudepur';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Baladgam', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kavant' AND d.name = 'Chhotaudepur';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Bhairatha', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kavant' AND d.name = 'Chhotaudepur';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Bhekhadiya', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kavant' AND d.name = 'Chhotaudepur';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Bhumasvada', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kavant' AND d.name = 'Chhotaudepur';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Chapariya', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kavant' AND d.name = 'Chhotaudepur';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Chhipan', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kavant' AND d.name = 'Chhotaudepur';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Chhodvani', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kavant' AND d.name = 'Chhotaudepur';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Chichaba', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kavant' AND d.name = 'Chhotaudepur';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Chiliyavant', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kavant' AND d.name = 'Chhotaudepur';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Devat', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kavant' AND d.name = 'Chhotaudepur';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Dhanivadi', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kavant' AND d.name = 'Chhotaudepur';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Dhanpur', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kavant' AND d.name = 'Chhotaudepur';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Dungargam', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kavant' AND d.name = 'Chhotaudepur';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Gaidetha', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kavant' AND d.name = 'Chhotaudepur';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Jamba', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kavant' AND d.name = 'Chhotaudepur';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Jamli(Musat)', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kavant' AND d.name = 'Chhotaudepur';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Jaroi', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kavant' AND d.name = 'Chhotaudepur';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Kakanpur', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kavant' AND d.name = 'Chhotaudepur';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Katkavant', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kavant' AND d.name = 'Chhotaudepur';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Kanabeda', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kavant' AND d.name = 'Chhotaudepur';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Kanalva', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kavant' AND d.name = 'Chhotaudepur';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Karajvant', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kavant' AND d.name = 'Chhotaudepur';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Khandibara', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kavant' AND d.name = 'Chhotaudepur';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Kharamda', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kavant' AND d.name = 'Chhotaudepur';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Khatiyavant', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kavant' AND d.name = 'Chhotaudepur';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Kherka', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kavant' AND d.name = 'Chhotaudepur';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Koshta', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kavant' AND d.name = 'Chhotaudepur';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Kotbi', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kavant' AND d.name = 'Chhotaudepur';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Lalpur', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kavant' AND d.name = 'Chhotaudepur';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Manavant', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kavant' AND d.name = 'Chhotaudepur';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Mandavada', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kavant' AND d.name = 'Chhotaudepur';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Manka', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kavant' AND d.name = 'Chhotaudepur';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Mankodi', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kavant' AND d.name = 'Chhotaudepur';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Morangana', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kavant' AND d.name = 'Chhotaudepur';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Motavanta', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kavant' AND d.name = 'Chhotaudepur';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Motaghoda', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kavant' AND d.name = 'Chhotaudepur';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Moti sakal', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kavant' AND d.name = 'Chhotaudepur';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Moti tokari', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kavant' AND d.name = 'Chhotaudepur';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Motikadai', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kavant' AND d.name = 'Chhotaudepur';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Motizaduli', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kavant' AND d.name = 'Chhotaudepur';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Mundamor', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kavant' AND d.name = 'Chhotaudepur';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Munglavant', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kavant' AND d.name = 'Chhotaudepur';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Musat', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kavant' AND d.name = 'Chhotaudepur';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Nakvindhiya', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kavant' AND d.name = 'Chhotaudepur';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Nana vanta', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kavant' AND d.name = 'Chhotaudepur';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Nanighodi', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kavant' AND d.name = 'Chhotaudepur';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Nanitokari', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kavant' AND d.name = 'Chhotaudepur';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Narukot', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kavant' AND d.name = 'Chhotaudepur';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Navalaja', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kavant' AND d.name = 'Chhotaudepur';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Padvani', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kavant' AND d.name = 'Chhotaudepur';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Panvad', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kavant' AND d.name = 'Chhotaudepur';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Rangpur', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kavant' AND d.name = 'Chhotaudepur';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Renda', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kavant' AND d.name = 'Chhotaudepur';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Rumadiya', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kavant' AND d.name = 'Chhotaudepur';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Saidivasan', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kavant' AND d.name = 'Chhotaudepur';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Singalda', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kavant' AND d.name = 'Chhotaudepur';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Singalkuva', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kavant' AND d.name = 'Chhotaudepur';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Sodhvad', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kavant' AND d.name = 'Chhotaudepur';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Tava', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kavant' AND d.name = 'Chhotaudepur';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Thadgam', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kavant' AND d.name = 'Chhotaudepur';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Titod', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kavant' AND d.name = 'Chhotaudepur';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Ucheda', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kavant' AND d.name = 'Chhotaudepur';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Vagudan', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kavant' AND d.name = 'Chhotaudepur';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Vijali', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kavant' AND d.name = 'Chhotaudepur';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Zalavant', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kavant' AND d.name = 'Chhotaudepur';
INSERT INTO public.villages (id, name, block_id, is_active)
SELECT gen_random_uuid(), 'Zilava', b.id, true FROM public.blocks b JOIN public.districts d ON b.district_id = d.id WHERE b.name = 'Kavant' AND d.name = 'Chhotaudepur';

COMMIT;