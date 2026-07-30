import type { District, Block, Village } from '../types';

export const MASTER_LOCATION_DATA: Record<string, Record<string, string[]>> = {
  "Gir Somnath": {
    "Kodinar": [
      "Anandpur", "Facharia", "Devalpur", "Arnej", "Sugala", "Sindhaj", "Jagatiya", "Chhachhar", 
      "Shedhaya", "Valadar", "Adpokar", "Alidar", "Bodava", "Jamanvada", "Jithala", "Kareda", 
      "Mitiyaj", "Morvad", "Fafani Nani", "Fafani Moti", "Sayaji Rajpura", "Arithya", "Chidivav", 
      "Ghantwad", "Girdevli", "Govindpur Bhandaria", "Inchvad Nani", "Kantala", "Nagadla", "Pavati", 
      "Ronaj", "Sandhnidhar", "Vithalpur", "Kaj", "Dolasa", "Velan", "Nanavada", "Jantrakhadi", 
      "Panch Pipalva", "Malgam", "Piplava Bavana", "Malshram", "Sarakhadi", "Kadodara", "Devli Dedani", 
      "Damali", "Chhara", "Pipali", "Kodinar", "Panadar", "Muldwarka", "Gohil Ni Khan", "Chauhan ni Khan", 
      "Kadvasan", "Pedhavada", "Vadnagar", "Navagam", "Barada", "Dudana", "Advi", "Velva"
    ],
    "Sutrapada": [
      "Virodar", "Alidra", "Bhuvatimbi", "Gangaetha", "Ghantiya", "Gorakhmadhi", "Khera", "Moradiya", 
      "Pransli", "Vasavad", "Rangpur", "Mahobatpara", "Bhuvavada", "Pipalva", "Timbadi", "Amarapur", 
      "Sara", "Bosan", "Umbari", "Vavdi (Sutra)", "Sundarpara", "Kadvar", "Lati", "Anandpara", 
      "Tobra", "Khambha", "Kanjotar", "Rakhej", "Matana", "Solaj", "Kadasala", "Barula", "Thareli", 
      "Padruka", "Chagiya", "Morasa", "Prashnavda", "Vadodara Zala", "Lodhava", "Barevla", "Singsar", 
      "Thoradi", "Dhamlej"
    ],
    "Veraval": [
      "Bhetali", "Kodidra", "Kukras", "Rampara", "Bolas", "Indroi", "Khanderi", "Nakhada", 
      "Navdra", "Pandva", "Savni", "Meghapur", "Ajotha", "Mathasuriya", "Lumbha", "Bherala", 
      "Gunvantpur", "Mandor"
    ],
    "Gir Gadhada": [
      "Harmadia", "Pichhva", "Pichhvi", "Rasulpara", "Thordi", "Bodidar", "Sonpara", "Jhanjhriya"
    ],
    "Una": [
      "Kob", "Kajaradi", "Bhingaran", "Tad", "Paladi", "Olvan", "Bhadasi", "Lamdhar", 
      "Mota desar", "Nathal", "Shahdesar", "Siloj", "Rampara", "Nandan", "Khapat", "Kalapan", 
      "Khan", "Vasoj", "Khandhera"
    ]
  },
  "Amreli": {
    "Amreli": [
      "Devaliya", "Rajthali", "Chhakargadh", "Vithalpur", "Champathal", "Taraktalav", "Gokharvala Nana", 
      "Gokhavala Mota", "Lapaliya", "Pithavajal", "Khad Khambhaliya", "Shambhupara", "Sonariya", 
      "Devrajiya", "Malila", "Kathama", "Pipallag", "Dahida", "Malavan", "Mota Ankadiya", "Nana Bhandariya", "Mota Bhandariya"
    ],
    "Bagasara": [
      "Kagadadi", "Lunghiya", "Juna Zazjariya", "Nava Zanzariya", "Hamapur", "Samadhiyala", "Bagasara", 
      "Shapar", "Juni Haliyad", "Adapur", "Halariya", "Shilana", "Haliyad Navi", "Jethiyavadar", "Jamka", 
      "Khijadiya", "Sanaliya", "Kadaya", "Sudavad", "Mota-Munjiyasar", "Nana-Munjiyasar", "Mavajinjava", 
      "Hadala", "Pithdiya", "Balapur", "Juna-Vaghaniya", "Ghantiyan", "Dery Pipaliya", "Manekavada", "Rafala", 
      "Khari", "Nava Vaghaniya", "Nava Pipariya", "Charan Pipali", "Natvarnagar"
    ],
    "Dhari": [
      "Kathivadar", "Nava Charkha", "Juna Charkha", "Ditala", "Ingorala Dungari", "Garamli (Charakha)", 
      "Samathiyala Nana", "Bordi", "Bhader", "Dangavadar", "Kathrota"
    ],
    "Jafrabad": [
      "Kanthariya Khalsa", "Kanthariya Koli", "Sarovada"
    ],
    "Khambha": [
      "Dadhiyali", "Daldi", "Dedan", "Gorana", "Hanumanpur", "Jivapar", "Juna Malaknesh", "Katarpara", 
      "Munjiyasar", "Nava Malaknesh", "Talada", "Vangadhra", "Samadhiyala No-2", "Nesadi No-2", "Pati", 
      "Ningala No-2", "Bhundani", "Trakuda", "Barman Mota", "Barman Nana", "Jamka", "Kodiya", "Raningpara", 
      "Sarakadiya Diwan", "Sarakadiya", "Bhavaradi", "Nanudi", "Khambha", "Pipalava", "Khadadhar", "Borala", 
      "Babarpur", "Kantala", "Chakrava", "Dhundhavana", "Pachapachiya"
    ],
    "Kunkavav Vadia": [
      "Amrapur", "Bambhaniya", "Bantwa-Devli", "Barvala Baval", "Barvala Bavishi", "Bhukhli-Santhali", 
      "Devgam", "Jithudi", "Jungar", "Khijadiya Khan", "Kolda", "Kunkavav Moti", "Kunkavav Nani", 
      "Luni-Dhar", "Megha-pipaliya", "Najapur", "Rampur", "Sanali", "Talali", "Tori", "Vadia", 
      "Vavdi Road", "Badalpur Nava", "Arjansukh", "Devalki", "Khajuri", "Targhari", "Badanpur Juna", 
      "Dadva (Randal)", "Sarangpur", "Mayapadar", "Lakhapadar", "Sanala", "Bhayavadar", "Ujala Mota", 
      "Khajuri pipaliya", "Khadkhad", "Morvada", "Khijdiya Hanuman", "Dhundhiya Pipaliya", "Khakhriya", 
      "Suryapratapgadh", "Anida", "Nava Ujala", "Ishvariya"
    ],
    "Liliya": [
      "Kankot Mota", "Amba", "Sedhavadar"
    ],
    "Rajula": [
      "Vavdi", "Chotra", "Bhakshi", "Navagam Mariana", "Agariya Mota", "Khari", "Katar", 
      "agariya nava", "samokheti vallabhnagar", "Nani Kherali"
    ],
    "Savarkundala": [
      "Adsang", "Ambardi", "Navi Ambardi", "Detad", "Giniya", "Khodiyana", "Badhada", "Thoradi", 
      "Surajvadi", "Vanot", "Luvara", "Jambuda", "Dhajadi", "Gadhakada", "Sakarpara", "Krushnagadh", 
      "Ramgadh", "Bhamar", "Chikhali", "Dadhiya", "Ghandla", "Hadida", "Meriyana", "Goradka", 
      "Vijapadi", "Bagoya", "Khadkala", "Kanatalav", "Karjala", "Oliya", "Hathashani", "Nana Bhamodra", 
      "Borala", "Simaran", "Charkhadiya", "Jira", "Nesdi", "Juna Savar", "Piyava", "Likhala", 
      "Mevasha", "Moladi", "Bhuva", "Dhar", "Mota Zinzuda", "Senjal", "Pithavadi", "Fifad", 
      "Jejad", "Vashiyali", "Vanda", "Shelana", "Bhokarava", "Nani Vadal", "Bhenkra", "Vijyanagar", 
      "Madhada", "Chhapari", "Khadasali", "Dedakadi", "Thavi", "Fachariya", "Mota Bhamodra", 
      "Nana Zinzuda", "Khalpar", "Mekda", "Kerala", "Ankolada", "Viradi", "Mitiyala"
    ]
  },
  "Junagadh": {
    "Visavadar": [
      "Juni Chavand", "Chaparada", "Khambhaliya(Ojjat)", "Virpur", "Khijadiya", "Mota Kotda", 
      "Mangnath Pipali", "Shirvaniya", "Vajadi", "Nana Kotda", "Chhalda", "Mota Hadmatiya", 
      "Vichhavad", "Ishvariya (Mandavad)", "Sukhpur", "Jambudi", "Piyava (Gir)", "Dudhala", 
      "Premapara", "Shobha Vadla(Gir)", "Moti Monpari", "Jambala", "Sarsai", "Baradiya (Gir)", 
      "Nani Monpari", "Ishwariya (Gir)", "Dadar (Gir)", "Miya Vadla", "Liliya", "Vadala (Shetranj)", 
      "Haripur", "Visavadar", "Jhanjesar", "Mandavad", "Kalasari", "Rajpara", "Kuba", "Ravni Kuba", 
      "Moniya", "Leriya", "Desai Vadala", "Jetalvad", "Moti Pindakhai", "Nani Pindakhai", "Bhalagam", 
      "Dhebar", "Ambala", "Mahudi", "Jambuda", "Chhelanka", "Hajani-Pipaliya", "Kankchyala", 
      "Bhutadi", "Ghodasan", "Mundiya Ravni", "Hasanapur", "Rabarika", "Kanavadala", "Lalpur", 
      "Kalavad", "Vekariya", "Govindpara", "Shobha Vadla (Lashkar)", "Pirvad", "Navaniya", 
      "Khambha (Gir)", "Nana Hadmatiya"
    ],
    "Mendarada": [
      "Itali"
    ],
    "Junagadh": [
      "Semrala"
    ]
  },
  "Chhotaudepur": {
    "Kavant": [
      "Asar", "Athadungari", "Baladgam", "Bhairatha", "Bhekhadiya", "Bhumasvada", "Chapariya", 
      "Chhipan", "Chhodvani", "Chichaba", "Chiliyavant", "Devat", "Dhanivadi", "Dhanpur", 
      "Dungargam", "Gaidetha", "Jamba", "Jamli(Musat)", "Jaroi", "Kakanpur", "Katkavant", 
      "Kanabeda", "Kanalva", "Karajvant", "Khandibara", "Kharamda", "Khatiyavant", "Kherka", 
      "Koshta", "Kotbi", "Lalpur", "Manavant", "Mandavada", "Manka", "Mankodi", "Morangana", 
      "Motavanta", "Motaghoda", "Moti sakal", "Moti tokari", "Motikadai", "Motizaduli", "Mundamor", 
      "Munglavant", "Musat", "Nakvindhiya", "Nana vanta", "Nanighodi", "Nanitokari", "Narukot", 
      "Navalaja", "Padvani", "Panvad", "Rangpur", "Renda", "Rumadiya", "Saidivasan", "Singalda", 
      "Singalkuva", "Sodhvad", "Tava", "Thadgam", "Titod", "Ucheda", "Vagudan", "Vijali", "Zalavant", "Zilava"
    ]
  }
};

/**
 * Fallback static loader for Districts
 */
export function getFallbackDistricts(): District[] {
  return Object.keys(MASTER_LOCATION_DATA).map((dName, idx) => ({
    id: `dist-${idx + 1}`,
    name: dName,
    code: null,
    state: 'Gujarat',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));
}

/**
 * Fallback static loader for Talukas (Blocks) by District Name or District ID
 */
export function getFallbackBlocks(districtNameOrId: string): Block[] {
  let dName = districtNameOrId;
  const districts = getFallbackDistricts();
  const matched = districts.find((d) => d.id === districtNameOrId || d.name.toLowerCase() === districtNameOrId.toLowerCase());
  if (matched) {
    dName = matched.name;
  }

  const talukas = MASTER_LOCATION_DATA[dName];
  if (!talukas) return [];

  return Object.keys(talukas).map((tName, idx) => ({
    id: `blk-${dName.toLowerCase().replace(/\s+/g, '-')}-${idx + 1}`,
    name: tName,
    code: null,
    district_id: matched?.id || districtNameOrId,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));
}

/**
 * Fallback static loader for Villages by Taluka (Block) Name or Block ID
 */
export function getFallbackVillages(blockNameOrId: string): Village[] {
  let foundTalukaName = blockNameOrId;
  let districtName = '';

  // Try to locate in MASTER_LOCATION_DATA
  for (const [dName, tMap] of Object.entries(MASTER_LOCATION_DATA)) {
    for (const tName of Object.keys(tMap)) {
      if (tName === blockNameOrId || blockNameOrId.includes(tName.toLowerCase().replace(/\s+/g, '-'))) {
        foundTalukaName = tName;
        districtName = dName;
        break;
      }
    }
    if (districtName) break;
  }

  if (!districtName || !MASTER_LOCATION_DATA[districtName]?.[foundTalukaName]) {
    return [];
  }

  return MASTER_LOCATION_DATA[districtName][foundTalukaName].map((vName, idx) => ({
    id: `vil-${foundTalukaName.toLowerCase().replace(/\s+/g, '-')}-${idx + 1}`,
    name: vName,
    code: null,
    block_id: blockNameOrId,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));
}
