// ── Ingredient Image Mapping ──────────────────────────────────────────────────
// All images are AI-generated, HD food photography style

const BASE = 'https://media.base44.com/images/public/69ab1bdf5518ce71465536ba/';

const INGREDIENT_IMAGES = {
  // Vegetables
  'bell pepper':      BASE + 'bd8551348_generated_image.png',
  'peas':             BASE + '7393b7c8b_generated_image.png',
  'celery':           BASE + '1544e4aad_generated_image.png',
  'carrot':           BASE + '560498206_generated_image.png',
  'onion':            'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=300&q=80',
  'garlic':           'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?w=300&q=80',
  'tomato':           'https://images.unsplash.com/photo-1607305387299-a3d9611cd469?w=300&q=80',
  'cucumber':         BASE + '14413b069_generated_image.png',
  'spinach':          BASE + 'f86d93fe0_generated_image.png',
  'broccoli':         BASE + '5450459ca_generated_image.png',
  'lettuce':          'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=300&q=80',
  'kale':             'https://images.unsplash.com/photo-1524179091875-bf99a9a6af57?w=300&q=80',
  'zucchini':         'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&q=80',
  'mushroom':         BASE + 'ff171f3f3_generated_image.png',
  'asparagus':        BASE + '2201d15f6_generated_image.png',
  'eggplant':         'https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=300&q=80',
  'potato':           'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=300&q=80',
  'sweet potato':     'https://images.unsplash.com/photo-1596097635121-14b38c5d7a20?w=300&q=80',
  'corn':             'https://images.unsplash.com/photo-1601648764658-cf37e8c89b70?w=300&q=80',
  'cauliflower':      BASE + 'e2f993518_generated_image.png',
  'cabbage':          'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=300&q=80',
  'green beans':      'https://images.unsplash.com/photo-1567375698348-5d9d5ae99de0?w=300&q=80',
  'artichoke':        'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=300&q=80',

  // Fruits
  'avocado':          BASE + 'ad1f7f8f5_generated_image.png',
  'banana':           BASE + '0f7b7132d_generated_image.png',
  'apple':            BASE + '0b2d462ca_generated_image.png',
  'orange':           BASE + '3040c51c2_generated_image.png',
  'lemon':            'https://images.unsplash.com/photo-1587496679742-bad502958fbf?w=300&q=80',
  'lime':             'https://images.unsplash.com/photo-1590502160462-58b41354f588?w=300&q=80',
  'strawberry':       BASE + 'dcfa2d232_generated_image.png',
  'blueberry':        BASE + 'c628cb9e9_generated_image.png',
  'mango':            BASE + '388eb1792_generated_image.png',
  'pineapple':        'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=300&q=80',
  'grape':            'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=300&q=80',
  'peach':            'https://images.unsplash.com/photo-1595743825637-cd8f30e70e86?w=300&q=80',
  'cherry':           'https://images.unsplash.com/photo-1528821128474-27f963b062bf?w=300&q=80',

  // Proteins
  'chicken breast':   BASE + '485aa6541_generated_image.png',
  'chicken':          BASE + '485aa6541_generated_image.png',
  'salmon':           'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=300&q=80',
  'tuna':             'https://images.unsplash.com/photo-1611599537845-1c7aca0091c0?w=300&q=80',
  'shrimp':           'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=300&q=80',
  'beef':             'https://images.unsplash.com/photo-1558030006-450675393462?w=300&q=80',
  'ground beef':      'https://images.unsplash.com/photo-1558030006-450675393462?w=300&q=80',
  'turkey':           'https://images.unsplash.com/photo-1574672280600-4accfa5b6f98?w=300&q=80',
  'pork':             'https://images.unsplash.com/photo-1432139509613-5c4255815697?w=300&q=80',
  'egg':              BASE + 'b451f7867_generated_image.png',
  'eggs':             BASE + 'b451f7867_generated_image.png',
  'tofu':             'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&q=80',
  'lentils':          'https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=300&q=80',
  'chickpeas':        'https://images.unsplash.com/photo-1515543904379-3d757afe72e4?w=300&q=80',
  'black beans':      'https://images.unsplash.com/photo-1611270629569-8b357cb88da9?w=300&q=80',
  'beans':            'https://images.unsplash.com/photo-1611270629569-8b357cb88da9?w=300&q=80',

  // Grains & Pantry
  'rice':             'https://images.unsplash.com/photo-1536304993881-ff86e0c9b22f?w=300&q=80',
  'brown rice':       'https://images.unsplash.com/photo-1536304993881-ff86e0c9b22f?w=300&q=80',
  'white rice':       'https://images.unsplash.com/photo-1536304993881-ff86e0c9b22f?w=300&q=80',
  'quinoa':           'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&q=80',
  'oats':             BASE + '1ca92bde3_generated_image.png',
  'oatmeal':          BASE + '1ca92bde3_generated_image.png',
  'pasta':            BASE + 'b1d1d7b90_generated_image.png',
  'bread':            'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&q=80',
  'whole wheat bread':'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&q=80',
  'tortilla':         'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=300&q=80',

  // Dairy
  'milk':             'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300&q=80',
  'cheese':           'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=300&q=80',
  'yogurt':           'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=300&q=80',
  'greek yogurt':     'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=300&q=80',
  'butter':           'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=300&q=80',
  'cream':            'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300&q=80',

  // Oils & Condiments
  'olive oil':        'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&q=80',
  'oil':              'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&q=80',
  'soy sauce':        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300&q=80',
  'honey':            'https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=300&q=80',

  // Nuts & Seeds
  'almonds':          'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=300&q=80',
  'walnuts':          'https://images.unsplash.com/photo-1563412580-fdfe4e7de3f4?w=300&q=80',
  'peanut butter':    'https://images.unsplash.com/photo-1542990253-0b4a3b12d8ca?w=300&q=80',
  'chia seeds':       'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=300&q=80',
  'flax seeds':       'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=300&q=80',

  // Meals (cooked)
  'salad':            BASE + '8c59e2ee9_generated_image.png',
  'jollof rice':      BASE + '3b7e28397_generated_image.png',
  'beans and plantain': BASE + '3a5035f4e_generated_image.png',
};

// Default fallback image
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=300&q=80';

// ── Normalization rules ───────────────────────────────────────────────────────
const NORMALIZE_RULES = [
  // Bell pepper variants
  [/\bred\s+bell\s+pepper/i,    'bell pepper'],
  [/\bgreen\s+bell\s+pepper/i,  'bell pepper'],
  [/\byellow\s+bell\s+pepper/i, 'bell pepper'],
  [/\borange\s+bell\s+pepper/i, 'bell pepper'],
  [/\bbell\s+peppers?/i,        'bell pepper'],
  [/\bgreen\s+peppers?/i,       'bell pepper'],
  [/\bsweet\s+peppers?/i,       'bell pepper'],

  // Carrot variants
  [/\bsliced\s+carrots?/i, 'carrot'],
  [/\bbaby\s+carrots?/i,   'carrot'],
  [/\bcarrots?/i,          'carrot'],

  // Pea variants
  [/\bgreen\s+peas?/i,        'peas'],
  [/\bfrozen\s+peas?/i,       'peas'],
  [/\bsnow\s+peas?/i,         'peas'],
  [/\bsugar\s+snap\s+peas?/i, 'peas'],
  [/\bpeas?/i,                'peas'],

  // Celery
  [/\bcelery\s+stalks?/i, 'celery'],
  [/\bcelery\b/i,         'celery'],

  // Chicken
  [/\bchicken\s+breasts?/i,     'chicken breast'],
  [/\bgrilled\s+chicken/i,      'chicken breast'],
  [/\bcooked\s+chicken/i,       'chicken breast'],
  [/\bchicken\s+thighs?/i,      'chicken'],
  [/\bchicken\b/i,              'chicken breast'],

  // Egg
  [/\beggs?\b/i, 'eggs'],

  // Tomato
  [/\bcherry\s+tomatoes?/i, 'tomato'],
  [/\bdiced\s+tomatoes?/i,  'tomato'],
  [/\btomatoes?/i,          'tomato'],

  // Onion
  [/\bgreen\s+onions?/i,   'onion'],
  [/\bred\s+onions?/i,     'onion'],
  [/\byellow\s+onions?/i,  'onion'],
  [/\bspring\s+onions?/i,  'onion'],
  [/\bscallions?/i,        'onion'],
  [/\bonions?/i,           'onion'],

  // Garlic
  [/\bgarlic\s+cloves?/i,   'garlic'],
  [/\bminced\s+garlic/i,    'garlic'],
  [/\bgarlic\s+powder/i,    'garlic'],
  [/\bgarlic\b/i,           'garlic'],

  // Spinach
  [/\bbaby\s+spinach/i, 'spinach'],
  [/\bspinach\b/i,      'spinach'],

  // Cucumber
  [/\bcucumbers?/i, 'cucumber'],

  // Broccoli
  [/\bbroccoli\s+florets?/i, 'broccoli'],
  [/\bbroccoli\b/i,          'broccoli'],

  // Avocado
  [/\bavocados?/i, 'avocado'],

  // Rice variants
  [/\bbrown\s+rice/i,  'brown rice'],
  [/\bwhite\s+rice/i,  'white rice'],
  [/\brice\b/i,        'rice'],

  // Quinoa
  [/\bquinoa\b/i, 'quinoa'],

  // Salmon
  [/\bsalmon\s+fillet/i, 'salmon'],
  [/\bsmoked\s+salmon/i, 'salmon'],
  [/\bsalmon\b/i,        'salmon'],

  // Mushroom
  [/\bmushrooms?/i, 'mushroom'],

  // Potato
  [/\bsweet\s+potatoes?/i, 'sweet potato'],
  [/\bpotatoes?/i,         'potato'],

  // Oats
  [/\brolled\s+oats?/i, 'oats'],
  [/\boatmeal\b/i,      'oatmeal'],
  [/\boats?\b/i,        'oats'],

  // Pasta
  [/\bspaghetti\b/i, 'pasta'],
  [/\bpenne\b/i,     'pasta'],
  [/\bpasta\b/i,     'pasta'],
  [/\bnoodles?\b/i,  'pasta'],

  // Greek yogurt
  [/\bgreek\s+yogurt/i, 'greek yogurt'],
  [/\byogurt\b/i,       'yogurt'],

  // Beans
  [/\bblack\s+beans?/i,  'black beans'],
  [/\bkidney\s+beans?/i, 'beans'],
  [/\bbeans?\b/i,        'beans'],

  // Ground beef
  [/\bground\s+beef\b/i, 'ground beef'],
  [/\bbeef\b/i,          'beef'],

  // Tuna
  [/\bcanned\s+tuna/i, 'tuna'],
  [/\btuna\b/i,        'tuna'],

  // Olive oil
  [/\bolive\s+oil/i, 'olive oil'],

  // Lemon/lime
  [/\blemon\s+juice/i, 'lemon'],
  [/\blemon\b/i,       'lemon'],
  [/\blime\s+juice/i,  'lime'],
  [/\blime\b/i,        'lime'],

  // Strawberry
  [/\bstrawberries?\b/i, 'strawberry'],

  // Blueberry
  [/\bblueberries?\b/i, 'blueberry'],

  // Kale
  [/\bkale\b/i, 'kale'],

  // Asparagus
  [/\basparagus\b/i, 'asparagus'],

  // Cauliflower
  [/\bcauliflower\b/i, 'cauliflower'],

  // Green beans
  [/\bgreen\s+beans?/i, 'green beans'],

  // Lettuce
  [/\bromaine\s+lettuce/i, 'lettuce'],
  [/\biceberg\s+lettuce/i, 'lettuce'],
  [/\blettuce\b/i,         'lettuce'],

  // Cheese
  [/\bparmesan\b/i,      'cheese'],
  [/\bcheddar\b/i,       'cheese'],
  [/\bmozzarella\b/i,    'cheese'],
  [/\bcottage\s+cheese/i,'cheese'],
  [/\bcheese\b/i,        'cheese'],

  // Milk
  [/\balmond\s+milk/i, 'milk'],
  [/\boat\s+milk/i,    'milk'],
  [/\bmilk\b/i,        'milk'],

  // Bread
  [/\bwhole\s+wheat\s+bread/i, 'whole wheat bread'],
  [/\bbread\b/i,               'bread'],

  // Peanut butter
  [/\bpeanut\s+butter/i, 'peanut butter'],

  // Almonds
  [/\balmonds?\b/i, 'almonds'],

  // Shrimp
  [/\bshrimps?\b/i, 'shrimp'],
  [/\bprawns?\b/i,  'shrimp'],

  // Tofu
  [/\btofu\b/i, 'tofu'],

  // Lentils
  [/\bred\s+lentils?/i, 'lentils'],
  [/\blentils?\b/i,     'lentils'],

  // Chickpeas
  [/\bchickpeas?\b/i,    'chickpeas'],
  [/\bgarbanzo\s+beans?/i, 'chickpeas'],

  // Zucchini
  [/\bzucchinis?\b/i, 'zucchini'],
  [/\bcourgettes?\b/i, 'zucchini'],

  // Corn
  [/\bcorn\b/i, 'corn'],

  // Eggplant
  [/\beggplants?\b/i, 'eggplant'],
  [/\baubergine\b/i,  'eggplant'],

  // Cabbage
  [/\bcabbage\b/i, 'cabbage'],

  // Honey
  [/\bhoney\b/i, 'honey'],

  // Soy sauce
  [/\bsoy\s+sauce\b/i,  'soy sauce'],
  [/\btamari\b/i,       'soy sauce'],

  // Oil
  [/\bcoconut\s+oil/i,  'oil'],
  [/\bvegetable\s+oil/i,'oil'],
  [/\boil\b/i,          'oil'],

  // Butter
  [/\bbutter\b/i, 'butter'],

  // Tortilla
  [/\btortillas?\b/i, 'tortilla'],
  [/\bwraps?\b/i,     'tortilla'],

  // Turkey
  [/\bground\s+turkey/i, 'turkey'],
  [/\bturkey\b/i,        'turkey'],

  // Pork
  [/\bpork\s+loin/i, 'pork'],
  [/\bpork\b/i,      'pork'],

  // Banana
  [/\bbananas?\b/i, 'banana'],

  // Apple
  [/\bapples?\b/i, 'apple'],

  // Mango
  [/\bmangoes?\b/i, 'mango'],

  // Pineapple
  [/\bpineapples?\b/i, 'pineapple'],

  // Chia seeds
  [/\bchia\s+seeds?\b/i, 'chia seeds'],

  // Walnuts
  [/\bwalnuts?\b/i, 'walnuts'],

  // Salad
  [/\bsalad\b/i, 'salad'],

  // Jollof rice
  [/\bjollof\s+rice/i, 'jollof rice'],

  // Beans and plantain
  [/\bbeans\s+and\s+plantain/i, 'beans and plantain'],
  [/\bplantain/i, 'beans and plantain'],
];

function normalizeIngredient(raw) {
  const cleaned = raw
    .replace(/^\d+[\d./]*\s*/,  '')
    .replace(/^(cup|tbsp?|tsp?|oz|lb|g|kg|ml|l|clove|slice|handful|pinch)s?\s+/i, '')
    .replace(/^(diced|chopped|sliced|minced|cooked|raw|fresh|frozen|canned|dried|shredded|grated|peeled|halved|quartered|steamed|roasted|boiled|grilled|whole)\s+/i, '')
    .trim()
    .toLowerCase();

  for (const [pattern, canonical] of NORMALIZE_RULES) {
    if (pattern.test(cleaned) || pattern.test(raw.toLowerCase())) {
      return canonical;
    }
  }

  const words = cleaned.split(' ');
  for (let len = Math.min(words.length, 3); len >= 1; len--) {
    const attempt = words.slice(0, len).join(' ');
    if (INGREDIENT_IMAGES[attempt]) return attempt;
  }

  return null;
}

export function getIngredientImage(ingredientText) {
  const key = normalizeIngredient(ingredientText || '');
  return (key && INGREDIENT_IMAGES[key]) || DEFAULT_IMAGE;
}

export default INGREDIENT_IMAGES;