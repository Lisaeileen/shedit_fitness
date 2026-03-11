// ── Ingredient Image Mapping ──────────────────────────────────────────────────
// All images are from Unsplash (valid, fast-loading URLs)

const INGREDIENT_IMAGES = {
  // Vegetables
  'bell pepper':      'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=120&q=70',
  'peas':             'https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=120&q=70',
  'celery':           'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=120&q=70',
  'carrot':           'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=120&q=70',
  'onion':            'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=120&q=70',
  'garlic':           'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?w=120&q=70',
  'tomato':           'https://images.unsplash.com/photo-1607305387299-a3d9611cd469?w=120&q=70',
  'cucumber':         'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=120&q=70',
  'spinach':          'https://media.base44.com/images/public/69ab1bdf5518ce71465536ba/f658cb60f_6a5ddec2-abcc-42c0-bac4-f93e5947e2a4.jpg',
  'broccoli':         'https://media.base44.com/images/public/69ab1bdf5518ce71465536ba/119e6907e_95651b4f-c821-4412-aff2-1de0204219c3.jpg',
  'lettuce':          'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=120&q=70',
  'kale':             'https://images.unsplash.com/photo-1524179091875-bf99a9a6af57?w=120&q=70',
  'zucchini':         'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=120&q=70',
  'mushroom':         'https://images.unsplash.com/photo-1543158266-0066955047b1?w=120&q=70',
  'asparagus':        'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=120&q=70',
  'eggplant':         'https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=120&q=70',
  'potato':           'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=120&q=70',
  'sweet potato':     'https://images.unsplash.com/photo-1596097635121-14b38c5d7a20?w=120&q=70',
  'corn':             'https://images.unsplash.com/photo-1601648764658-cf37e8c89b70?w=120&q=70',
  'cauliflower':      'https://images.unsplash.com/photo-1568584711271-6bf7699c3ce9?w=120&q=70',
  'cabbage':          'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=120&q=70',
  'green beans':      'https://images.unsplash.com/photo-1567375698348-5d9d5ae99de0?w=120&q=70',
  'artichoke':        'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=120&q=70',

  // Fruits
  'avocado':          'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=120&q=70',
  'banana':           'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=120&q=70',
  'apple':            'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=120&q=70',
  'orange':           'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=120&q=70',
  'lemon':            'https://images.unsplash.com/photo-1587496679742-bad502958fbf?w=120&q=70',
  'lime':             'https://images.unsplash.com/photo-1590502160462-58b41354f588?w=120&q=70',
  'strawberry':       'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=120&q=70',
  'blueberry':        'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=120&q=70',
  'mango':            'https://images.unsplash.com/photo-1553279768-865429fa0078?w=120&q=70',
  'pineapple':        'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=120&q=70',
  'grape':            'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=120&q=70',
  'peach':            'https://images.unsplash.com/photo-1595743825637-cd8f30e70e86?w=120&q=70',
  'cherry':           'https://images.unsplash.com/photo-1528821128474-27f963b062bf?w=120&q=70',

  // Proteins
  'chicken breast':   'https://images.unsplash.com/photo-1604503468506-a8da13d11bea?w=120&q=70',
  'chicken':          'https://images.unsplash.com/photo-1604503468506-a8da13d11bea?w=120&q=70',
  'salmon':           'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=120&q=70',
  'tuna':             'https://images.unsplash.com/photo-1611599537845-1c7aca0091c0?w=120&q=70',
  'shrimp':           'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=120&q=70',
  'beef':             'https://images.unsplash.com/photo-1558030006-450675393462?w=120&q=70',
  'ground beef':      'https://images.unsplash.com/photo-1558030006-450675393462?w=120&q=70',
  'turkey':           'https://images.unsplash.com/photo-1574672280600-4accfa5b6f98?w=120&q=70',
  'pork':             'https://images.unsplash.com/photo-1432139509613-5c4255815697?w=120&q=70',
  'egg':              'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=120&q=70',
  'eggs':             'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=120&q=70',
  'tofu':             'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120&q=70',
  'lentils':          'https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=120&q=70',
  'chickpeas':        'https://images.unsplash.com/photo-1515543904379-3d757afe72e4?w=120&q=70',
  'black beans':      'https://images.unsplash.com/photo-1611270629569-8b357cb88da9?w=120&q=70',
  'beans':            'https://images.unsplash.com/photo-1611270629569-8b357cb88da9?w=120&q=70',

  // Grains & Pantry
  'rice':             'https://images.unsplash.com/photo-1536304993881-ff86e0c9b22f?w=120&q=70',
  'brown rice':       'https://images.unsplash.com/photo-1536304993881-ff86e0c9b22f?w=120&q=70',
  'white rice':       'https://images.unsplash.com/photo-1536304993881-ff86e0c9b22f?w=120&q=70',
  'quinoa':           'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=120&q=70',
  'oats':             'https://images.unsplash.com/photo-1517673408984-a46153dd75db?w=120&q=70',
  'oatmeal':          'https://images.unsplash.com/photo-1517673408984-a46153dd75db?w=120&q=70',
  'pasta':            'https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=120&q=70',
  'bread':            'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=120&q=70',
  'whole wheat bread':'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=120&q=70',
  'tortilla':         'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=120&q=70',

  // Dairy
  'milk':             'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=120&q=70',
  'cheese':           'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=120&q=70',
  'yogurt':           'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=120&q=70',
  'greek yogurt':     'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=120&q=70',
  'butter':           'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=120&q=70',
  'cream':            'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=120&q=70',

  // Oils & Condiments
  'olive oil':        'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=120&q=70',
  'oil':              'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=120&q=70',
  'soy sauce':        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=120&q=70',
  'honey':            'https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=120&q=70',

  // Nuts & Seeds
  'almonds':          'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=120&q=70',
  'walnuts':          'https://images.unsplash.com/photo-1563412580-fdfe4e7de3f4?w=120&q=70',
  'peanut butter':    'https://images.unsplash.com/photo-1542990253-0b4a3b12d8ca?w=120&q=70',
  'chia seeds':       'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=120&q=70',
  'flax seeds':       'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=120&q=70',
};

// Default fallback image if no match found
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=120&q=70';

// ── Normalization rules ───────────────────────────────────────────────────────
// Maps raw ingredient text patterns → canonical key in INGREDIENT_IMAGES
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
  [/\bgreen\s+peas?/i,   'peas'],
  [/\bfrozen\s+peas?/i,  'peas'],
  [/\bsnow\s+peas?/i,    'peas'],
  [/\bsugar\s+snap\s+peas?/i, 'peas'],
  [/\bpeas?/i,           'peas'],

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
  [/\bgarlic\s+cloves?/i,    'garlic'],
  [/\bminced\s+garlic/i,     'garlic'],
  [/\bgarlic\s+powder/i,     'garlic'],
  [/\bgarlic\b/i,            'garlic'],

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
  [/\bparmesan\b/i,     'cheese'],
  [/\bcheddar\b/i,      'cheese'],
  [/\bmozzarella\b/i,   'cheese'],
  [/\bcottage\s+cheese/i,'cheese'],
  [/\bcheese\b/i,       'cheese'],

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
  [/\bsoy\s+sauce\b/i,   'soy sauce'],
  [/\btamari\b/i,        'soy sauce'],

  // Oil
  [/\bcoconut\s+oil/i, 'oil'],
  [/\bvegetable\s+oil/i, 'oil'],
  [/\boil\b/i,           'oil'],

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
];

/**
 * Normalizes an ingredient string to a canonical key.
 * Strips leading quantities, measurements, and prep words before matching.
 */
function normalizeIngredient(raw) {
  // Remove quantities and measurements from the start
  // e.g. "1 cup diced bell pepper" → "bell pepper"
  const cleaned = raw
    .replace(/^\d+[\d./]*\s*/,  '')                         // leading numbers
    .replace(/^(cup|tbsp?|tsp?|oz|lb|g|kg|ml|l|clove|slice|handful|pinch)s?\s+/i, '') // units
    .replace(/^(diced|chopped|sliced|minced|cooked|raw|fresh|frozen|canned|dried|shredded|grated|peeled|halved|quartered|steamed|roasted|boiled|grilled|whole)\s+/i, '') // prep words
    .trim()
    .toLowerCase();

  for (const [pattern, canonical] of NORMALIZE_RULES) {
    if (pattern.test(cleaned) || pattern.test(raw.toLowerCase())) {
      return canonical;
    }
  }

  // Last attempt: direct key lookup on first 2 words
  const words = cleaned.split(' ');
  for (let len = Math.min(words.length, 3); len >= 1; len--) {
    const attempt = words.slice(0, len).join(' ');
    if (INGREDIENT_IMAGES[attempt]) return attempt;
  }

  return null;
}

/**
 * Returns the best Unsplash image URL for a given ingredient string.
 * Falls back to a generic food image if no match is found.
 */
export function getIngredientImage(ingredientText) {
  const key = normalizeIngredient(ingredientText || '');
  return (key && INGREDIENT_IMAGES[key]) || DEFAULT_IMAGE;
}

export default INGREDIENT_IMAGES;