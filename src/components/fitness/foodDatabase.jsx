/**
 * Global food database seed — covers proteins, carbs, dairy, vegetables, fruits,
 * snacks, beverages, and dishes from all major world cuisines.
 * Each entry: { name, calories, protein, carbs, fat, serving }
 * Values are per serving listed (100g unless noted).
 */
export const FOOD_DB = [
  // ── Proteins: Chicken ──────────────────────────────────────────────────────
  { name: 'Chicken Breast (raw)', calories: 120, protein: 23, carbs: 0, fat: 2.6, serving: '100g' },
  { name: 'Chicken Breast (grilled)', calories: 165, protein: 31, carbs: 0, fat: 3.6, serving: '100g' },
  { name: 'Chicken Breast (boiled)', calories: 150, protein: 30, carbs: 0, fat: 3, serving: '100g' },
  { name: 'Chicken Breast (baked)', calories: 158, protein: 30, carbs: 0, fat: 3.4, serving: '100g' },
  { name: 'Chicken Thigh (grilled)', calories: 209, protein: 26, carbs: 0, fat: 11, serving: '100g' },
  { name: 'Chicken Thigh (fried)', calories: 249, protein: 24, carbs: 3, fat: 15, serving: '100g' },
  { name: 'Chicken Drumstick (roasted)', calories: 175, protein: 27, carbs: 0, fat: 7, serving: '100g' },
  { name: 'Chicken Wing (fried)', calories: 290, protein: 27, carbs: 0, fat: 19, serving: '100g' },
  { name: 'Chicken Wing (baked)', calories: 203, protein: 30, carbs: 0, fat: 9, serving: '100g' },
  { name: 'Grilled Chicken Salad', calories: 290, protein: 28, carbs: 8, fat: 16, serving: '1 bowl' },
  { name: 'Chicken Wrap', calories: 380, protein: 30, carbs: 34, fat: 12, serving: '1 wrap' },
  { name: 'Chicken Alfredo', calories: 596, protein: 34, carbs: 48, fat: 22, serving: '1 serving' },
  { name: 'Chicken Stir Fry', calories: 220, protein: 25, carbs: 12, fat: 8, serving: '100g' },
  { name: 'Chicken Tikka Masala', calories: 340, protein: 28, carbs: 16, fat: 18, serving: '1 serving' },
  { name: 'Butter Chicken', calories: 360, protein: 30, carbs: 14, fat: 20, serving: '1 serving' },
  { name: 'Chicken Biryani', calories: 480, protein: 25, carbs: 60, fat: 14, serving: '1 serving' },
  { name: 'Chicken Shawarma', calories: 450, protein: 35, carbs: 30, fat: 18, serving: '1 wrap' },
  { name: 'Chicken Suya (Nigerian)', calories: 280, protein: 30, carbs: 4, fat: 15, serving: '100g' },
  { name: 'Chicken Jollof Rice', calories: 430, protein: 22, carbs: 55, fat: 12, serving: '1 plate' },
  { name: 'Teriyaki Chicken', calories: 250, protein: 26, carbs: 14, fat: 8, serving: '100g' },
  { name: 'Chicken Katsu', calories: 310, protein: 26, carbs: 20, fat: 14, serving: '100g' },
  { name: 'General Tso Chicken', calories: 430, protein: 28, carbs: 38, fat: 16, serving: '1 serving' },
  { name: 'Chicken Caesar Wrap', calories: 420, protein: 32, carbs: 35, fat: 16, serving: '1 wrap' },
  { name: 'Chicken Burrito', calories: 540, protein: 38, carbs: 55, fat: 16, serving: '1 burrito' },
  { name: 'Chicken Taco', calories: 210, protein: 18, carbs: 20, fat: 7, serving: '1 taco' },
  { name: 'Chicken Noodle Soup', calories: 120, protein: 10, carbs: 14, fat: 3, serving: '1 cup' },
  { name: 'Chicken Fried Rice', calories: 380, protein: 20, carbs: 50, fat: 10, serving: '1 serving' },

  // ── More Chicken variations ────────────────────────────────────────────────
  { name: 'Jerk Chicken', calories: 270, protein: 28, carbs: 6, fat: 14, serving: '100g' },
  { name: 'Honey Garlic Chicken', calories: 310, protein: 28, carbs: 18, fat: 12, serving: '100g' },
  { name: 'Baked Chicken Wings', calories: 203, protein: 30, carbs: 0, fat: 9, serving: '100g' },
  { name: 'Chicken Adobo', calories: 280, protein: 28, carbs: 5, fat: 16, serving: '100g' },
  { name: 'Chicken Sandwich', calories: 440, protein: 32, carbs: 40, fat: 14, serving: '1 sandwich' },
  { name: 'Chicken Soup', calories: 130, protein: 14, carbs: 10, fat: 4, serving: '1 cup' },
  { name: 'Chicken Pepper Soup (Nigerian)', calories: 185, protein: 24, carbs: 4, fat: 8, serving: '1 bowl' },
  { name: 'Whole Roasted Chicken', calories: 215, protein: 29, carbs: 0, fat: 11, serving: '100g' },
  { name: 'Chicken Salad', calories: 290, protein: 28, carbs: 8, fat: 16, serving: '1 bowl' },
  { name: 'Chicken Quesadilla', calories: 500, protein: 34, carbs: 42, fat: 20, serving: '1 serving' },
  { name: 'Chicken Parmigiana', calories: 520, protein: 40, carbs: 28, fat: 22, serving: '1 serving' },
  { name: 'Chicken Korma', calories: 350, protein: 28, carbs: 12, fat: 22, serving: '1 serving' },
  { name: 'Chicken Gyros', calories: 380, protein: 32, carbs: 28, fat: 14, serving: '1 wrap' },
  { name: 'Chicken Suya Skewers', calories: 260, protein: 30, carbs: 4, fat: 13, serving: '100g' },
  { name: 'Chicken and Rice (bowl)', calories: 450, protein: 36, carbs: 48, fat: 10, serving: '1 bowl' },
  { name: 'Chicken Stew (Nigerian)', calories: 320, protein: 28, carbs: 10, fat: 18, serving: '1 serving' },
  { name: 'Chicken Porridge', calories: 280, protein: 22, carbs: 34, fat: 6, serving: '1 bowl' },

  // ── Proteins: Turkey ──────────────────────────────────────────────────────
  { name: 'Turkey Breast (roasted)', calories: 135, protein: 30, carbs: 0, fat: 1, serving: '100g' },
  { name: 'Turkey Mince (lean)', calories: 170, protein: 22, carbs: 0, fat: 8, serving: '100g' },
  { name: 'Turkey Burger', calories: 300, protein: 28, carbs: 25, fat: 10, serving: '1 burger' },
  { name: 'Turkey Sandwich', calories: 380, protein: 26, carbs: 35, fat: 12, serving: '1 sandwich' },

  // ── Proteins: Beef ────────────────────────────────────────────────────────
  { name: 'Beef Steak (sirloin, grilled)', calories: 207, protein: 26, carbs: 0, fat: 11, serving: '100g' },
  { name: 'Beef Steak (ribeye, grilled)', calories: 291, protein: 24, carbs: 0, fat: 21, serving: '100g' },
  { name: 'Ground Beef (lean 90%)', calories: 196, protein: 26, carbs: 0, fat: 10, serving: '100g' },
  { name: 'Ground Beef (80%)', calories: 254, protein: 24, carbs: 0, fat: 17, serving: '100g' },
  { name: 'Beef Burger', calories: 540, protein: 34, carbs: 40, fat: 25, serving: '1 burger' },
  { name: 'Beef Meatballs', calories: 260, protein: 20, carbs: 6, fat: 18, serving: '100g' },
  { name: 'Beef Tacos', calories: 230, protein: 15, carbs: 22, fat: 10, serving: '1 taco' },
  { name: 'Beef Burrito', calories: 580, protein: 32, carbs: 60, fat: 18, serving: '1 burrito' },
  { name: 'Beef Chili', calories: 250, protein: 18, carbs: 22, fat: 8, serving: '1 cup' },
  { name: 'Beef Bolognese', calories: 350, protein: 22, carbs: 30, fat: 14, serving: '1 serving' },
  { name: 'Beef Stew', calories: 280, protein: 22, carbs: 18, fat: 12, serving: '1 cup' },
  { name: 'Roast Beef', calories: 215, protein: 27, carbs: 0, fat: 11, serving: '100g' },
  { name: 'Beef Shawarma', calories: 460, protein: 30, carbs: 35, fat: 22, serving: '1 wrap' },
  { name: 'Beef Suya (Nigerian)', calories: 295, protein: 28, carbs: 5, fat: 17, serving: '100g' },
  { name: 'Beef Kebab', calories: 280, protein: 24, carbs: 8, fat: 16, serving: '1 skewer' },
  { name: 'Beef Rendang', calories: 380, protein: 26, carbs: 8, fat: 28, serving: '100g' },

  // ── Proteins: Pork ────────────────────────────────────────────────────────
  { name: 'Pork Chop (grilled)', calories: 242, protein: 26, carbs: 0, fat: 14, serving: '100g' },
  { name: 'Bacon (cooked)', calories: 541, protein: 37, carbs: 1.4, fat: 42, serving: '100g' },
  { name: 'Bacon (2 strips)', calories: 86, protein: 6, carbs: 0.2, fat: 7, serving: '2 strips' },
  { name: 'Ham (sliced)', calories: 145, protein: 21, carbs: 1.5, fat: 6, serving: '100g' },
  { name: 'Pork Ribs (BBQ)', calories: 397, protein: 24, carbs: 14, fat: 28, serving: '100g' },
  { name: 'Pulled Pork', calories: 280, protein: 24, carbs: 10, fat: 16, serving: '100g' },
  { name: 'Pork Sausage', calories: 301, protein: 15, carbs: 3, fat: 26, serving: '100g' },
  { name: 'Char Siu (Chinese BBQ Pork)', calories: 290, protein: 22, carbs: 16, fat: 14, serving: '100g' },
  { name: 'Tonkatsu (Japanese Pork Cutlet)', calories: 380, protein: 26, carbs: 18, fat: 22, serving: '1 serving' },

  // ── Proteins: Lamb & Goat ─────────────────────────────────────────────────
  { name: 'Lamb Chop (grilled)', calories: 294, protein: 25, carbs: 0, fat: 21, serving: '100g' },
  { name: 'Lamb Mince', calories: 282, protein: 21, carbs: 0, fat: 22, serving: '100g' },
  { name: 'Lamb Kofta', calories: 270, protein: 20, carbs: 5, fat: 19, serving: '100g' },
  { name: 'Lamb Biryani', calories: 510, protein: 28, carbs: 58, fat: 16, serving: '1 serving' },
  { name: 'Goat Meat (stewed)', calories: 143, protein: 27, carbs: 0, fat: 3, serving: '100g' },
  { name: 'Goat Pepper Soup (Nigerian)', calories: 200, protein: 26, carbs: 4, fat: 8, serving: '1 bowl' },

  // ── Proteins: Fish & Seafood ──────────────────────────────────────────────
  { name: 'Salmon Fillet (grilled)', calories: 208, protein: 28, carbs: 0, fat: 10, serving: '100g' },
  { name: 'Salmon Fillet (baked)', calories: 195, protein: 27, carbs: 0, fat: 9, serving: '100g' },
  { name: 'Tuna (canned in water)', calories: 116, protein: 26, carbs: 0, fat: 1, serving: '100g' },
  { name: 'Tuna (canned in oil)', calories: 198, protein: 29, carbs: 0, fat: 9, serving: '100g' },
  { name: 'Tuna Steak (grilled)', calories: 184, protein: 30, carbs: 0, fat: 6, serving: '100g' },
  { name: 'Cod Fillet (baked)', calories: 105, protein: 23, carbs: 0, fat: 0.9, serving: '100g' },
  { name: 'Tilapia (grilled)', calories: 128, protein: 26, carbs: 0, fat: 2.7, serving: '100g' },
  { name: 'Mackerel (smoked)', calories: 305, protein: 19, carbs: 0, fat: 25, serving: '100g' },
  { name: 'Sardines (canned)', calories: 208, protein: 25, carbs: 0, fat: 11, serving: '100g' },
  { name: 'Shrimp (boiled)', calories: 99, protein: 24, carbs: 0, fat: 0.3, serving: '100g' },
  { name: 'Prawns (grilled)', calories: 115, protein: 24, carbs: 0, fat: 1.7, serving: '100g' },
  { name: 'Crab (steamed)', calories: 97, protein: 21, carbs: 0, fat: 0.8, serving: '100g' },
  { name: 'Lobster (boiled)', calories: 98, protein: 20, carbs: 1.3, fat: 0.6, serving: '100g' },
  { name: 'Scallops (pan-seared)', calories: 137, protein: 24, carbs: 5, fat: 3.5, serving: '100g' },
  { name: 'Mussels (steamed)', calories: 172, protein: 24, carbs: 7, fat: 4.5, serving: '100g' },
  { name: 'Fish & Chips', calories: 520, protein: 28, carbs: 50, fat: 22, serving: '1 serving' },
  { name: 'Fish Tacos', calories: 290, protein: 20, carbs: 30, fat: 10, serving: '1 serving (2 tacos)' },
  { name: 'Sushi Roll (California)', calories: 255, protein: 9, carbs: 38, fat: 7, serving: '8 pieces' },
  { name: 'Sushi Roll (Salmon)', calories: 240, protein: 10, carbs: 36, fat: 6, serving: '8 pieces' },
  { name: 'Sashimi (Salmon, 6 pcs)', calories: 155, protein: 22, carbs: 0, fat: 7, serving: '6 pieces' },
  { name: 'Fried Catfish', calories: 250, protein: 22, carbs: 10, fat: 14, serving: '100g' },
  { name: 'Grilled Tilapia', calories: 128, protein: 26, carbs: 0, fat: 2.7, serving: '100g' },
  { name: 'Jerk Fish (Jamaican)', calories: 240, protein: 28, carbs: 6, fat: 11, serving: '100g' },

  // ── Eggs ──────────────────────────────────────────────────────────────────
  { name: 'Egg (boiled, large)', calories: 78, protein: 6.3, carbs: 0.6, fat: 5.3, serving: '1 large egg' },
  { name: 'Egg (fried)', calories: 90, protein: 6.3, carbs: 0.4, fat: 7, serving: '1 egg' },
  { name: 'Scrambled Eggs (2 eggs)', calories: 182, protein: 13, carbs: 2, fat: 13, serving: '2 eggs' },
  { name: 'Egg White (raw)', calories: 17, protein: 3.6, carbs: 0.2, fat: 0.1, serving: '1 white' },
  { name: 'Omelette (2 eggs, plain)', calories: 178, protein: 12, carbs: 1, fat: 14, serving: '2 eggs' },
  { name: 'Omelette (cheese)', calories: 240, protein: 15, carbs: 2, fat: 19, serving: '2 eggs' },
  { name: 'Egg Benedict', calories: 410, protein: 20, carbs: 25, fat: 26, serving: '1 serving' },
  { name: 'Egg Fried Rice', calories: 350, protein: 12, carbs: 52, fat: 10, serving: '1 plate' },

  // ── Plant Proteins ────────────────────────────────────────────────────────
  { name: 'Tofu (firm)', calories: 144, protein: 17, carbs: 3, fat: 8, serving: '1/2 cup' },
  { name: 'Tofu (silken)', calories: 55, protein: 5, carbs: 2.4, fat: 2.5, serving: '100g' },
  { name: 'Tempeh', calories: 195, protein: 20, carbs: 9.4, fat: 11, serving: '100g' },
  { name: 'Seitan', calories: 370, protein: 75, carbs: 14, fat: 2, serving: '100g' },
  { name: 'Edamame', calories: 121, protein: 11, carbs: 9, fat: 5, serving: '1 cup' },
  { name: 'Lentils (cooked)', calories: 230, protein: 18, carbs: 40, fat: 0.8, serving: '1 cup' },
  { name: 'Chickpeas (cooked)', calories: 269, protein: 15, carbs: 45, fat: 4.2, serving: '1 cup' },
  { name: 'Black Beans (cooked)', calories: 227, protein: 15, carbs: 41, fat: 0.9, serving: '1 cup' },
  { name: 'Kidney Beans (cooked)', calories: 225, protein: 15, carbs: 40, fat: 0.9, serving: '1 cup' },
  { name: 'Pinto Beans (cooked)', calories: 245, protein: 15, carbs: 45, fat: 1, serving: '1 cup' },
  { name: 'Navy Beans (cooked)', calories: 255, protein: 15, carbs: 47, fat: 1, serving: '1 cup' },
  { name: 'Black-Eyed Peas (cooked)', calories: 200, protein: 13, carbs: 36, fat: 0.9, serving: '1 cup' },
  { name: 'Hummus', calories: 166, protein: 8, carbs: 18, fat: 8, serving: '1/4 cup' },

  // ── Dairy ─────────────────────────────────────────────────────────────────
  { name: 'Milk (whole, 3.5%)', calories: 149, protein: 8, carbs: 12, fat: 8, serving: '1 cup (240ml)' },
  { name: 'Milk (2%)', calories: 122, protein: 8, carbs: 12, fat: 5, serving: '1 cup' },
  { name: 'Milk (skimmed)', calories: 83, protein: 8, carbs: 12, fat: 0.2, serving: '1 cup' },
  { name: 'Soy Milk (unsweetened)', calories: 80, protein: 7, carbs: 4, fat: 4, serving: '1 cup' },
  { name: 'Almond Milk (unsweetened)', calories: 30, protein: 1, carbs: 1, fat: 2.5, serving: '1 cup' },
  { name: 'Oat Milk', calories: 120, protein: 3, carbs: 16, fat: 5, serving: '1 cup' },
  { name: 'Coconut Milk (canned)', calories: 445, protein: 4.6, carbs: 6, fat: 48, serving: '1 cup' },
  { name: 'Greek Yogurt (plain, 0%)', calories: 100, protein: 17, carbs: 6, fat: 0.7, serving: '1 cup' },
  { name: 'Greek Yogurt (plain, full fat)', calories: 190, protein: 11, carbs: 8, fat: 10, serving: '1 cup' },
  { name: 'Greek Yogurt (flavored)', calories: 150, protein: 10, carbs: 22, fat: 2, serving: '1 cup' },
  { name: 'Natural Yogurt (plain)', calories: 150, protein: 8, carbs: 17, fat: 4, serving: '1 cup' },
  { name: 'Cheddar Cheese', calories: 113, protein: 7, carbs: 0.4, fat: 9.3, serving: '1 oz (28g)' },
  { name: 'Mozzarella Cheese', calories: 85, protein: 6.3, carbs: 1, fat: 6.3, serving: '1 oz (28g)' },
  { name: 'Feta Cheese', calories: 75, protein: 4, carbs: 1.2, fat: 6, serving: '1 oz (28g)' },
  { name: 'Parmesan Cheese (grated)', calories: 122, protein: 11, carbs: 1, fat: 8, serving: '1 oz (28g)' },
  { name: 'Brie Cheese', calories: 95, protein: 5.9, carbs: 0.1, fat: 7.9, serving: '1 oz (28g)' },
  { name: 'Cottage Cheese (low fat)', calories: 163, protein: 28, carbs: 6.2, fat: 2.3, serving: '1 cup' },
  { name: 'Cottage Cheese (full fat)', calories: 206, protein: 25, carbs: 8, fat: 9, serving: '1 cup' },
  { name: 'Cream Cheese', calories: 99, protein: 1.7, carbs: 1.6, fat: 10, serving: '2 tbsp' },
  { name: 'Butter (salted)', calories: 102, protein: 0.1, carbs: 0, fat: 11.5, serving: '1 tbsp' },
  { name: 'Butter (unsalted)', calories: 102, protein: 0.1, carbs: 0, fat: 11.5, serving: '1 tbsp' },
  { name: 'Heavy Cream', calories: 51, protein: 0.4, carbs: 0.4, fat: 5.5, serving: '1 tbsp' },
  { name: 'Whipping Cream', calories: 44, protein: 0.3, carbs: 0.4, fat: 4.6, serving: '1 tbsp' },
  { name: 'Ice Cream (vanilla)', calories: 273, protein: 4.6, carbs: 31, fat: 14, serving: '1 cup' },
  { name: 'Gelato (chocolate)', calories: 265, protein: 5, carbs: 40, fat: 9, serving: '1 cup' },
  { name: 'Yogurt Drink (Kefir)', calories: 110, protein: 11, carbs: 12, fat: 2, serving: '1 cup' },

  // ── Grains & Carbs ────────────────────────────────────────────────────────
  { name: 'White Rice (cooked)', calories: 206, protein: 4.3, carbs: 44.5, fat: 0.4, serving: '1 cup' },
  { name: 'Brown Rice (cooked)', calories: 216, protein: 5, carbs: 45, fat: 1.8, serving: '1 cup' },
  { name: 'Jasmine Rice (cooked)', calories: 206, protein: 4.3, carbs: 45, fat: 0.4, serving: '1 cup' },
  { name: 'Basmati Rice (cooked)', calories: 191, protein: 4.4, carbs: 41, fat: 0.4, serving: '1 cup' },
  { name: 'Wild Rice (cooked)', calories: 166, protein: 6.5, carbs: 35, fat: 0.6, serving: '1 cup' },
  { name: 'Sushi Rice (seasoned)', calories: 240, protein: 4.3, carbs: 52, fat: 0.5, serving: '1 cup' },
  { name: 'Fried Rice', calories: 338, protein: 7, carbs: 55, fat: 10, serving: '1 cup' },
  { name: 'Jollof Rice', calories: 350, protein: 6, carbs: 58, fat: 10, serving: '1 cup' },
  { name: 'Pasta (cooked)', calories: 220, protein: 8, carbs: 43, fat: 1.3, serving: '1 cup' },
  { name: 'Spaghetti (cooked)', calories: 220, protein: 8, carbs: 43, fat: 1.3, serving: '1 cup' },
  { name: 'Penne (cooked)', calories: 220, protein: 8, carbs: 43, fat: 1.3, serving: '1 cup' },
  { name: 'Whole Wheat Pasta (cooked)', calories: 174, protein: 7.5, carbs: 37, fat: 0.8, serving: '1 cup' },
  { name: 'Gluten-Free Pasta (cooked)', calories: 209, protein: 4, carbs: 43, fat: 1, serving: '1 cup' },
  { name: 'Oats (dry rolled)', calories: 389, protein: 17, carbs: 66, fat: 7, serving: '100g dry' },
  { name: 'Oats (cooked porridge)', calories: 150, protein: 5, carbs: 27, fat: 3, serving: '1 cup' },
  { name: 'Granola', calories: 471, protein: 10, carbs: 64, fat: 20, serving: '100g' },
  { name: 'Muesli', calories: 363, protein: 10, carbs: 66, fat: 7, serving: '100g' },
  { name: 'Bread (white, sliced)', calories: 79, protein: 2.7, carbs: 15, fat: 1, serving: '1 slice' },
  { name: 'Bread (whole grain)', calories: 79, protein: 3.5, carbs: 15, fat: 1, serving: '1 slice' },
  { name: 'Bread (sourdough)', calories: 93, protein: 3.5, carbs: 18, fat: 0.5, serving: '1 slice' },
  { name: 'Rye Bread', calories: 83, protein: 2.7, carbs: 15.5, fat: 1.1, serving: '1 slice' },
  { name: 'Pita Bread', calories: 165, protein: 5.5, carbs: 33, fat: 1.7, serving: '1 small pita' },
  { name: 'Naan Bread', calories: 262, protein: 8.7, carbs: 45, fat: 5.1, serving: '1 piece' },
  { name: 'Chapati / Roti', calories: 120, protein: 3.5, carbs: 22, fat: 2.5, serving: '1 piece' },
  { name: 'Tortilla (flour, small)', calories: 146, protein: 3.7, carbs: 25, fat: 3.5, serving: '1 tortilla' },
  { name: 'Corn Tortilla', calories: 52, protein: 1.4, carbs: 10.7, fat: 0.7, serving: '1 tortilla' },
  { name: 'Bagel (plain)', calories: 270, protein: 11, carbs: 53, fat: 1.6, serving: '1 medium' },
  { name: 'English Muffin', calories: 132, protein: 4.4, carbs: 26, fat: 1.1, serving: '1 muffin' },
  { name: 'Croissant', calories: 406, protein: 8.2, carbs: 45, fat: 21, serving: '1 medium' },
  { name: 'Quinoa (cooked)', calories: 222, protein: 8, carbs: 39, fat: 3.5, serving: '1 cup' },
  { name: 'Couscous (cooked)', calories: 176, protein: 6, carbs: 36, fat: 0.3, serving: '1 cup' },
  { name: 'Millet (cooked)', calories: 207, protein: 6, carbs: 41, fat: 1.7, serving: '1 cup' },
  { name: 'Bulgur Wheat (cooked)', calories: 151, protein: 5.6, carbs: 34, fat: 0.4, serving: '1 cup' },
  { name: 'Farro (cooked)', calories: 220, protein: 8, carbs: 46, fat: 1.5, serving: '1 cup' },
  { name: 'Barley (cooked)', calories: 193, protein: 3.5, carbs: 44, fat: 0.7, serving: '1 cup' },
  { name: 'Cornmeal (dry)', calories: 440, protein: 10, carbs: 93, fat: 4.4, serving: '100g' },
  { name: 'Fufu (cassava)', calories: 330, protein: 2, carbs: 80, fat: 0.5, serving: '1 ball (~200g)' },
  { name: 'Eba / Garri (cooked)', calories: 300, protein: 1, carbs: 74, fat: 0.5, serving: '1 serving' },
  { name: 'Amala (yam flour)', calories: 280, protein: 2, carbs: 66, fat: 0.5, serving: '1 serving' },
  { name: 'Ugali / Posho (maize)', calories: 350, protein: 3.5, carbs: 82, fat: 1, serving: '1 serving' },
  { name: 'Tortilla Chips', calories: 490, protein: 7, carbs: 64, fat: 24, serving: '100g' },
  { name: 'Rice Cakes (plain)', calories: 35, protein: 0.7, carbs: 7.3, fat: 0.3, serving: '1 cake' },
  { name: 'Crackers (whole grain)', calories: 121, protein: 2.5, carbs: 20, fat: 3, serving: '5 crackers' },

  // ── Vegetables ────────────────────────────────────────────────────────────
  { name: 'Broccoli (raw)', calories: 34, protein: 2.8, carbs: 6.6, fat: 0.4, serving: '100g' },
  { name: 'Broccoli (steamed)', calories: 55, protein: 3.7, carbs: 11, fat: 0.6, serving: '1 cup' },
  { name: 'Spinach (raw)', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, serving: '1 cup' },
  { name: 'Spinach (sautéed)', calories: 44, protein: 5.4, carbs: 6.8, fat: 0.5, serving: '1 cup' },
  { name: 'Kale (raw)', calories: 33, protein: 2.9, carbs: 6, fat: 0.7, serving: '100g' },
  { name: 'Lettuce (romaine)', calories: 17, protein: 1.2, carbs: 3.3, fat: 0.3, serving: '1 cup' },
  { name: 'Lettuce (iceberg)', calories: 14, protein: 0.9, carbs: 2.9, fat: 0.1, serving: '1 cup' },
  { name: 'Cabbage (raw)', calories: 25, protein: 1.3, carbs: 5.8, fat: 0.1, serving: '100g' },
  { name: 'Sweet Potato (baked)', calories: 103, protein: 2.3, carbs: 24, fat: 0.1, serving: '1 medium' },
  { name: 'Sweet Potato (boiled)', calories: 90, protein: 2, carbs: 21, fat: 0.1, serving: '100g' },
  { name: 'White Potato (baked)', calories: 161, protein: 4.3, carbs: 36.6, fat: 0.2, serving: '1 medium' },
  { name: 'White Potato (boiled)', calories: 87, protein: 1.9, carbs: 20, fat: 0.1, serving: '100g' },
  { name: 'French Fries', calories: 312, protein: 3.4, carbs: 41, fat: 15, serving: '100g' },
  { name: 'Mashed Potato (with butter)', calories: 211, protein: 3.9, carbs: 26, fat: 10, serving: '1 cup' },
  { name: 'Bell Pepper (red)', calories: 31, protein: 1, carbs: 7.2, fat: 0.3, serving: '1 medium' },
  { name: 'Bell Pepper (green)', calories: 20, protein: 0.9, carbs: 4.6, fat: 0.2, serving: '1 medium' },
  { name: 'Bell Pepper (yellow)', calories: 27, protein: 1, carbs: 6.3, fat: 0.2, serving: '1 medium' },
  { name: 'Tomato (raw)', calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, serving: '1 medium' },
  { name: 'Cherry Tomatoes', calories: 27, protein: 1.3, carbs: 5.8, fat: 0.3, serving: '1 cup' },
  { name: 'Cucumber (raw)', calories: 16, protein: 0.7, carbs: 3.6, fat: 0.1, serving: '100g' },
  { name: 'Zucchini / Courgette', calories: 17, protein: 1.2, carbs: 3.1, fat: 0.3, serving: '100g' },
  { name: 'Carrot (raw)', calories: 41, protein: 0.9, carbs: 9.6, fat: 0.2, serving: '1 medium' },
  { name: 'Onion (raw)', calories: 40, protein: 1.1, carbs: 9.3, fat: 0.1, serving: '100g' },
  { name: 'Garlic (raw)', calories: 149, protein: 6.4, carbs: 33, fat: 0.5, serving: '100g' },
  { name: 'Mushrooms (raw)', calories: 22, protein: 3.1, carbs: 3.3, fat: 0.3, serving: '100g' },
  { name: 'Mushrooms (sautéed)', calories: 66, protein: 5, carbs: 8, fat: 2, serving: '1 cup' },
  { name: 'Corn (cooked)', calories: 132, protein: 4.9, carbs: 29, fat: 1.8, serving: '1 ear' },
  { name: 'Green Peas', calories: 134, protein: 8.6, carbs: 25, fat: 0.4, serving: '1 cup' },
  { name: 'Asparagus (steamed)', calories: 40, protein: 4.3, carbs: 7.4, fat: 0.4, serving: '1 cup' },
  { name: 'Cauliflower (raw)', calories: 25, protein: 1.9, carbs: 5, fat: 0.3, serving: '100g' },
  { name: 'Eggplant / Aubergine', calories: 25, protein: 0.9, carbs: 5.9, fat: 0.2, serving: '100g' },
  { name: 'Okra (cooked)', calories: 33, protein: 1.9, carbs: 7.5, fat: 0.2, serving: '100g' },
  { name: 'Plantain (fried)', calories: 255, protein: 1.3, carbs: 58, fat: 5, serving: '100g' },
  { name: 'Plantain (boiled)', calories: 122, protein: 1, carbs: 32, fat: 0.2, serving: '100g' },
  { name: 'Yam (boiled)', calories: 118, protein: 1.5, carbs: 27.9, fat: 0.2, serving: '100g' },
  { name: 'Bitter Leaf Soup (Egusi)', calories: 350, protein: 12, carbs: 15, fat: 26, serving: '1 bowl' },
  { name: 'Edikaikong Soup (Nigerian)', calories: 280, protein: 18, carbs: 8, fat: 18, serving: '1 bowl' },

  // ── Fruits ────────────────────────────────────────────────────────────────
  { name: 'Banana (medium)', calories: 89, protein: 1.1, carbs: 23, fat: 0.3, serving: '1 medium' },
  { name: 'Apple (medium)', calories: 52, protein: 0.3, carbs: 14, fat: 0.2, serving: '1 medium' },
  { name: 'Orange (medium)', calories: 62, protein: 1.2, carbs: 15.4, fat: 0.2, serving: '1 medium' },
  { name: 'Mango (diced)', calories: 99, protein: 1.4, carbs: 25, fat: 0.6, serving: '1 cup' },
  { name: 'Pineapple (chunks)', calories: 82, protein: 0.9, carbs: 22, fat: 0.2, serving: '1 cup' },
  { name: 'Watermelon (diced)', calories: 46, protein: 0.9, carbs: 11.5, fat: 0.2, serving: '1 cup' },
  { name: 'Grapes (red/green)', calories: 62, protein: 0.6, carbs: 16, fat: 0.3, serving: '1 cup' },
  { name: 'Strawberries', calories: 49, protein: 1, carbs: 11.7, fat: 0.5, serving: '1 cup' },
  { name: 'Blueberries', calories: 84, protein: 1.1, carbs: 21.4, fat: 0.5, serving: '1 cup' },
  { name: 'Raspberries', calories: 64, protein: 1.5, carbs: 14.7, fat: 0.8, serving: '1 cup' },
  { name: 'Blackberries', calories: 62, protein: 2, carbs: 13.8, fat: 0.7, serving: '1 cup' },
  { name: 'Kiwi', calories: 42, protein: 0.8, carbs: 10.1, fat: 0.4, serving: '1 medium' },
  { name: 'Pear (medium)', calories: 102, protein: 0.6, carbs: 27.5, fat: 0.2, serving: '1 medium' },
  { name: 'Peach (medium)', calories: 59, protein: 1.4, carbs: 14.3, fat: 0.4, serving: '1 medium' },
  { name: 'Plum (medium)', calories: 46, protein: 0.7, carbs: 11.4, fat: 0.3, serving: '1 medium' },
  { name: 'Cherries', calories: 87, protein: 1.5, carbs: 22, fat: 0.3, serving: '1 cup' },
  { name: 'Avocado (medium)', calories: 320, protein: 4, carbs: 17, fat: 29, serving: '1 whole' },
  { name: 'Avocado (half)', calories: 160, protein: 2, carbs: 8.5, fat: 14.7, serving: '1/2 avocado' },
  { name: 'Papaya', calories: 55, protein: 0.6, carbs: 14, fat: 0.4, serving: '1 cup' },
  { name: 'Pomegranate seeds', calories: 83, protein: 1.7, carbs: 18.7, fat: 1.2, serving: '1/2 cup' },
  { name: 'Lychee', calories: 66, protein: 0.8, carbs: 16.5, fat: 0.4, serving: '100g' },
  { name: 'Guava', calories: 68, protein: 2.6, carbs: 14.3, fat: 1, serving: '100g' },
  { name: 'Dragon Fruit', calories: 60, protein: 1.2, carbs: 13, fat: 0, serving: '100g' },
  { name: 'Jackfruit (ripe)', calories: 95, protein: 1.7, carbs: 23.5, fat: 0.6, serving: '100g' },
  { name: 'Coconut (fresh, shredded)', calories: 354, protein: 3.3, carbs: 15, fat: 33, serving: '100g' },
  { name: 'Dates (Medjool)', calories: 66, protein: 0.4, carbs: 18, fat: 0, serving: '1 date' },
  { name: 'Figs (fresh)', calories: 74, protein: 0.7, carbs: 19, fat: 0.3, serving: '100g' },
  { name: 'Raisins', calories: 299, protein: 3.1, carbs: 79, fat: 0.5, serving: '100g' },

  // ── Nuts & Seeds ──────────────────────────────────────────────────────────
  { name: 'Almonds (raw)', calories: 164, protein: 6, carbs: 6.1, fat: 14, serving: '1 oz (28g)' },
  { name: 'Walnuts', calories: 185, protein: 4.3, carbs: 3.9, fat: 18.5, serving: '1 oz (28g)' },
  { name: 'Cashews', calories: 157, protein: 5.2, carbs: 8.6, fat: 12.4, serving: '1 oz (28g)' },
  { name: 'Peanuts (dry roasted)', calories: 166, protein: 6.7, carbs: 6.1, fat: 14.1, serving: '1 oz (28g)' },
  { name: 'Peanut Butter (2 tbsp)', calories: 190, protein: 7, carbs: 6, fat: 16, serving: '2 tbsp' },
  { name: 'Almond Butter (2 tbsp)', calories: 196, protein: 6.7, carbs: 6, fat: 18, serving: '2 tbsp' },
  { name: 'Pistachios', calories: 159, protein: 6, carbs: 7.7, fat: 12.9, serving: '1 oz (28g)' },
  { name: 'Macadamia Nuts', calories: 204, protein: 2.2, carbs: 3.6, fat: 21.5, serving: '1 oz (28g)' },
  { name: 'Chia Seeds', calories: 138, protein: 4.7, carbs: 12, fat: 8.7, serving: '2 tbsp' },
  { name: 'Flaxseeds (ground)', calories: 74, protein: 2.6, carbs: 4, fat: 6, serving: '2 tbsp' },
  { name: 'Sunflower Seeds', calories: 163, protein: 5.5, carbs: 6.8, fat: 14, serving: '1 oz (28g)' },
  { name: 'Pumpkin Seeds', calories: 153, protein: 8.5, carbs: 5.5, fat: 13.2, serving: '1 oz (28g)' },
  { name: 'Sesame Seeds', calories: 160, protein: 5, carbs: 7.5, fat: 13.6, serving: '1 oz (28g)' },
  { name: 'Hemp Seeds', calories: 166, protein: 9.5, carbs: 2.6, fat: 14.6, serving: '3 tbsp' },

  // ── Oils & Fats ───────────────────────────────────────────────────────────
  { name: 'Olive Oil', calories: 119, protein: 0, carbs: 0, fat: 13.5, serving: '1 tbsp' },
  { name: 'Coconut Oil', calories: 121, protein: 0, carbs: 0, fat: 13.6, serving: '1 tbsp' },
  { name: 'Vegetable Oil', calories: 120, protein: 0, carbs: 0, fat: 13.6, serving: '1 tbsp' },
  { name: 'Avocado Oil', calories: 124, protein: 0, carbs: 0, fat: 14, serving: '1 tbsp' },
  { name: 'Ghee', calories: 112, protein: 0, carbs: 0, fat: 12.7, serving: '1 tbsp' },
  { name: 'Mayonnaise', calories: 94, protein: 0.1, carbs: 0.1, fat: 10.3, serving: '1 tbsp' },

  // ── World Dishes ──────────────────────────────────────────────────────────
  // Mediterranean
  { name: 'Greek Salad', calories: 230, protein: 5, carbs: 12, fat: 18, serving: '1 bowl' },
  { name: 'Falafel (3 pieces)', calories: 210, protein: 8, carbs: 22, fat: 10, serving: '3 pieces' },
  { name: 'Shawarma (chicken, wrap)', calories: 450, protein: 35, carbs: 30, fat: 18, serving: '1 wrap' },
  { name: 'Baba Ganoush', calories: 158, protein: 3.5, carbs: 14, fat: 10, serving: '1/4 cup' },
  { name: 'Tabbouleh', calories: 70, protein: 2, carbs: 10, fat: 2.5, serving: '1/2 cup' },
  { name: 'Tzatziki', calories: 50, protein: 3, carbs: 4, fat: 2.5, serving: '2 tbsp' },
  { name: 'Moussaka', calories: 350, protein: 18, carbs: 20, fat: 20, serving: '1 serving' },
  // Indian
  { name: 'Dal (lentil curry)', calories: 230, protein: 14, carbs: 35, fat: 5, serving: '1 cup' },
  { name: 'Palak Paneer', calories: 290, protein: 14, carbs: 12, fat: 20, serving: '1 cup' },
  { name: 'Paneer Tikka', calories: 310, protein: 18, carbs: 8, fat: 22, serving: '1 serving' },
  { name: 'Samosa (1 piece)', calories: 165, protein: 3.5, carbs: 20, fat: 8, serving: '1 samosa' },
  { name: 'Masala Chai', calories: 120, protein: 4.5, carbs: 14, fat: 4.5, serving: '1 cup (250ml)' },
  // Asian
  { name: 'Pad Thai', calories: 480, protein: 22, carbs: 60, fat: 16, serving: '1 serving' },
  { name: 'Tom Yum Soup', calories: 150, protein: 12, carbs: 8, fat: 6, serving: '1 bowl' },
  { name: 'Green Curry (chicken)', calories: 360, protein: 24, carbs: 14, fat: 22, serving: '1 serving' },
  { name: 'Red Curry (beef)', calories: 380, protein: 22, carbs: 15, fat: 26, serving: '1 serving' },
  { name: 'Bibimbap (Korean rice bowl)', calories: 580, protein: 26, carbs: 80, fat: 14, serving: '1 bowl' },
  { name: 'Korean BBQ (Bulgogi)', calories: 320, protein: 24, carbs: 14, fat: 18, serving: '100g' },
  { name: 'Kimchi', calories: 15, protein: 1.1, carbs: 2.4, fat: 0.5, serving: '1/2 cup' },
  { name: 'Miso Soup', calories: 40, protein: 2.5, carbs: 5.5, fat: 1, serving: '1 cup' },
  { name: 'Ramen (chicken broth)', calories: 450, protein: 22, carbs: 55, fat: 14, serving: '1 bowl' },
  { name: 'Udon Noodles', calories: 430, protein: 13, carbs: 83, fat: 1, serving: '1 serving' },
  { name: 'Dumplings / Gyoza (6 pcs)', calories: 240, protein: 10, carbs: 30, fat: 8, serving: '6 pieces' },
  { name: 'Spring Rolls (fried, 3 pcs)', calories: 270, protein: 6, carbs: 28, fat: 14, serving: '3 pieces' },
  { name: 'Nasi Goreng (Indonesian fried rice)', calories: 420, protein: 16, carbs: 58, fat: 14, serving: '1 plate' },
  // Latin American
  { name: 'Tacos (beef, 3)', calories: 480, protein: 25, carbs: 46, fat: 20, serving: '3 tacos' },
  { name: 'Burrito Bowl', calories: 620, protein: 35, carbs: 70, fat: 18, serving: '1 bowl' },
  { name: 'Guacamole', calories: 190, protein: 2.4, carbs: 10, fat: 16, serving: '1/4 cup' },
  { name: 'Nachos (with cheese)', calories: 380, protein: 10, carbs: 45, fat: 18, serving: '1 serving' },
  { name: 'Empanada (beef)', calories: 230, protein: 10, carbs: 26, fat: 10, serving: '1 piece' },
  { name: 'Pupusas (2 pieces)', calories: 380, protein: 11, carbs: 60, fat: 10, serving: '2 pieces' },
  { name: 'Ceviche', calories: 185, protein: 24, carbs: 12, fat: 5, serving: '1 serving' },
  // African
  { name: 'Jollof Rice (Nigerian)', calories: 350, protein: 6, carbs: 60, fat: 10, serving: '1 serving' },
  { name: 'Egusi Soup', calories: 380, protein: 14, carbs: 12, fat: 28, serving: '1 serving' },
  { name: 'Pounded Yam', calories: 290, protein: 2.5, carbs: 70, fat: 0.5, serving: '1 serving' },
  { name: 'Suya (spiced grilled meat)', calories: 285, protein: 28, carbs: 5, fat: 16, serving: '100g' },
  { name: 'Injera (Ethiopian flatbread)', calories: 90, protein: 2.7, carbs: 19, fat: 0.5, serving: '1 piece' },
  { name: 'Doro Wat (Ethiopian chicken)', calories: 340, protein: 28, carbs: 8, fat: 20, serving: '1 serving' },
  { name: 'Bunny Chow (South African)', calories: 580, protein: 22, carbs: 74, fat: 20, serving: '1/4 loaf' },
  { name: 'Bobotie (South African)', calories: 340, protein: 22, carbs: 20, fat: 18, serving: '1 serving' },
  // Middle Eastern
  { name: 'Mansaf (lamb and rice)', calories: 650, protein: 36, carbs: 68, fat: 24, serving: '1 plate' },
  { name: 'Foul Medames', calories: 214, protein: 13, carbs: 33, fat: 4, serving: '1 cup' },
  { name: 'Maqluba (upside-down rice)', calories: 520, protein: 22, carbs: 70, fat: 16, serving: '1 serving' },
  // European
  { name: 'Paella (seafood)', calories: 420, protein: 28, carbs: 52, fat: 10, serving: '1 serving' },
  { name: 'Pizza Margherita (2 slices)', calories: 570, protein: 24, carbs: 72, fat: 20, serving: '2 slices' },
  { name: 'Pizza Pepperoni (1 slice)', calories: 300, protein: 14, carbs: 32, fat: 13, serving: '1 slice' },
  { name: 'Lasagna (beef)', calories: 450, protein: 28, carbs: 38, fat: 20, serving: '1 serving' },
  { name: 'Fish and Chips', calories: 520, protein: 28, carbs: 50, fat: 22, serving: '1 serving' },
  { name: 'Full English Breakfast', calories: 780, protein: 46, carbs: 36, fat: 48, serving: '1 plate' },
  { name: 'Shepherd\'s Pie', calories: 480, protein: 24, carbs: 46, fat: 18, serving: '1 serving' },
  { name: 'Beef Goulash (Hungarian)', calories: 340, protein: 26, carbs: 18, fat: 18, serving: '1 serving' },
  // American
  { name: 'Hot Dog', calories: 290, protein: 11, carbs: 23, fat: 17, serving: '1 hot dog' },
  { name: 'Mac and Cheese', calories: 510, protein: 16, carbs: 66, fat: 20, serving: '1 cup' },
  { name: 'Pancakes (2, plain)', calories: 370, protein: 8, carbs: 58, fat: 12, serving: '2 medium' },
  { name: 'Waffles (2)', calories: 410, protein: 9, carbs: 56, fat: 15, serving: '2 waffles' },
  { name: 'French Toast (2 slices)', calories: 350, protein: 11, carbs: 40, fat: 14, serving: '2 slices' },

  // ── Snacks ────────────────────────────────────────────────────────────────
  { name: 'Chocolate (dark 70%)', calories: 170, protein: 2.2, carbs: 13, fat: 12, serving: '30g' },
  { name: 'Chocolate (milk)', calories: 153, protein: 2, carbs: 17, fat: 8.5, serving: '28g' },
  { name: 'Potato Chips', calories: 536, protein: 7, carbs: 53, fat: 34, serving: '100g' },
  { name: 'Popcorn (air-popped)', calories: 108, protein: 3.6, carbs: 22, fat: 1.2, serving: '1 oz (28g)' },
  { name: 'Protein Bar', calories: 200, protein: 20, carbs: 22, fat: 6, serving: '1 bar' },
  { name: 'Granola Bar', calories: 190, protein: 4, carbs: 29, fat: 7, serving: '1 bar' },
  { name: 'Rice Crackers', calories: 112, protein: 1.8, carbs: 24, fat: 0.6, serving: '28g' },
  { name: 'Pretzels', calories: 380, protein: 9.7, carbs: 80, fat: 3.3, serving: '100g' },
  { name: 'Pringles Original', calories: 153, protein: 1.5, carbs: 15, fat: 9, serving: '1 oz (28g)' },
  { name: 'Doritos Nacho Cheese', calories: 140, protein: 2, carbs: 18, fat: 7, serving: '1 oz (28g)' },
  { name: 'Trail Mix', calories: 175, protein: 5, carbs: 19, fat: 10, serving: '1 oz (28g)' },

  // ── More Yogurt variations ─────────────────────────────────────────────────
  { name: 'Yogurt (low fat, plain)', calories: 154, protein: 12, carbs: 17, fat: 3.8, serving: '1 cup' },
  { name: 'Yogurt (strawberry)', calories: 180, protein: 7, carbs: 32, fat: 2, serving: '1 cup' },
  { name: 'Yogurt (blueberry)', calories: 175, protein: 7, carbs: 30, fat: 2, serving: '1 cup' },
  { name: 'Yogurt Parfait (with granola)', calories: 310, protein: 12, carbs: 50, fat: 8, serving: '1 serving' },
  { name: 'Frozen Yogurt', calories: 210, protein: 5, carbs: 38, fat: 4, serving: '1 cup' },

  // ── More Milk variations ────────────────────────────────────────────────────
  { name: 'Milk (chocolate)', calories: 208, protein: 8, carbs: 30, fat: 8, serving: '1 cup' },
  { name: 'Milk (evaporated)', calories: 338, protein: 17, carbs: 25, fat: 19, serving: '1 cup' },
  { name: 'Milk (condensed, sweetened)', calories: 982, protein: 24, carbs: 166, fat: 27, serving: '1 cup' },
  { name: 'Cashew Milk', calories: 25, protein: 0.5, carbs: 1, fat: 2, serving: '1 cup' },
  { name: 'Rice Milk', calories: 113, protein: 0.7, carbs: 22, fat: 2.3, serving: '1 cup' },

  // ── More Pasta & Rice ──────────────────────────────────────────────────────
  { name: 'Pasta (bolognese)', calories: 480, protein: 24, carbs: 52, fat: 16, serving: '1 plate' },
  { name: 'Pasta (carbonara)', calories: 540, protein: 22, carbs: 48, fat: 26, serving: '1 plate' },
  { name: 'Pasta (marinara)', calories: 380, protein: 12, carbs: 65, fat: 8, serving: '1 plate' },
  { name: 'Pasta (pesto)', calories: 420, protein: 14, carbs: 58, fat: 16, serving: '1 plate' },
  { name: 'Mac and Cheese (homemade)', calories: 460, protein: 18, carbs: 55, fat: 18, serving: '1 cup' },
  { name: 'Rice (steamed, white)', calories: 206, protein: 4.3, carbs: 44.5, fat: 0.4, serving: '1 cup' },
  { name: 'Rice and Beans', calories: 350, protein: 12, carbs: 65, fat: 3, serving: '1 cup' },
  { name: 'Coconut Rice', calories: 280, protein: 4, carbs: 50, fat: 8, serving: '1 cup' },
  { name: 'Turmeric Rice', calories: 220, protein: 4.5, carbs: 46, fat: 2, serving: '1 cup' },
  { name: 'Noodles (ramen)', calories: 380, protein: 10, carbs: 68, fat: 8, serving: '1 serving' },
  { name: 'Noodles (egg, cooked)', calories: 221, protein: 7.3, carbs: 40, fat: 3.3, serving: '1 cup' },
  { name: 'Noodles (rice, cooked)', calories: 192, protein: 1.8, carbs: 44, fat: 0.4, serving: '1 cup' },
  { name: 'Noodles (glass/cellophane)', calories: 160, protein: 0.1, carbs: 39, fat: 0, serving: '100g dry' },

  // ── More Soups ─────────────────────────────────────────────────────────────
  { name: 'Tomato Soup (cream)', calories: 161, protein: 6, carbs: 22, fat: 6, serving: '1 cup' },
  { name: 'Vegetable Soup', calories: 120, protein: 4, carbs: 20, fat: 3, serving: '1 cup' },
  { name: 'Pumpkin Soup', calories: 130, protein: 3, carbs: 18, fat: 5, serving: '1 cup' },
  { name: 'Mushroom Soup (cream)', calories: 166, protein: 5, carbs: 14, fat: 10, serving: '1 cup' },
  { name: 'Onion Soup (French)', calories: 220, protein: 8, carbs: 26, fat: 8, serving: '1 cup' },
  { name: 'Clam Chowder', calories: 268, protein: 14, carbs: 22, fat: 14, serving: '1 cup' },
  { name: 'Beef Broth', calories: 38, protein: 4.8, carbs: 0.1, fat: 1.9, serving: '1 cup' },
  { name: 'Bone Broth (chicken)', calories: 45, protein: 9, carbs: 0, fat: 1, serving: '1 cup' },
  { name: 'Lemon Chicken Soup', calories: 150, protein: 14, carbs: 12, fat: 5, serving: '1 cup' },
  { name: 'Black Bean Soup', calories: 218, protein: 13, carbs: 36, fat: 3, serving: '1 cup' },
  { name: 'Egusi Soup with Beef', calories: 410, protein: 22, carbs: 12, fat: 30, serving: '1 bowl' },
  { name: 'Banga Soup (Nigerian)', calories: 360, protein: 20, carbs: 8, fat: 28, serving: '1 bowl' },
  { name: 'Ogbono Soup', calories: 340, protein: 18, carbs: 6, fat: 26, serving: '1 bowl' },

  // ── More Wraps & Sandwiches ────────────────────────────────────────────────
  { name: 'Shawarma Wrap (beef)', calories: 460, protein: 30, carbs: 35, fat: 22, serving: '1 wrap' },
  { name: 'Egg Wrap', calories: 320, protein: 18, carbs: 28, fat: 14, serving: '1 wrap' },
  { name: 'BLT Sandwich', calories: 410, protein: 18, carbs: 38, fat: 20, serving: '1 sandwich' },
  { name: 'Grilled Cheese Sandwich', calories: 390, protein: 14, carbs: 34, fat: 22, serving: '1 sandwich' },
  { name: 'Club Sandwich', calories: 560, protein: 34, carbs: 42, fat: 26, serving: '1 sandwich' },
  { name: 'Veggie Wrap', calories: 320, protein: 10, carbs: 48, fat: 10, serving: '1 wrap' },
  { name: 'Salmon Wrap', calories: 380, protein: 32, carbs: 28, fat: 14, serving: '1 wrap' },
  { name: 'Tuna Wrap', calories: 360, protein: 30, carbs: 30, fat: 12, serving: '1 wrap' },

  // ── Nigerian & West African dishes ────────────────────────────────────────
  { name: 'Moi Moi', calories: 180, protein: 12, carbs: 22, fat: 6, serving: '1 piece' },
  { name: 'Akara (Bean Cake)', calories: 220, protein: 10, carbs: 24, fat: 10, serving: '3 pieces' },
  { name: 'Ewa Agoyin (Nigerian Beans)', calories: 310, protein: 16, carbs: 45, fat: 8, serving: '1 plate' },
  { name: 'Ofe Onugbu (Bitter Leaf Soup)', calories: 320, protein: 18, carbs: 8, fat: 22, serving: '1 bowl' },
  { name: 'Afang Soup', calories: 290, protein: 20, carbs: 6, fat: 20, serving: '1 bowl' },
  { name: 'Oha Soup', calories: 280, protein: 16, carbs: 8, fat: 20, serving: '1 bowl' },
  { name: 'Tuwo Shinkafa', calories: 320, protein: 5, carbs: 72, fat: 1, serving: '1 serving' },
  { name: 'Kunu (Nigerian drink)', calories: 120, protein: 3, carbs: 26, fat: 1, serving: '1 cup' },
  { name: 'Puff Puff', calories: 280, protein: 4, carbs: 38, fat: 12, serving: '3 pieces' },
  { name: 'Chin Chin', calories: 440, protein: 7, carbs: 60, fat: 18, serving: '100g' },
  { name: 'Jollof Spaghetti', calories: 380, protein: 10, carbs: 65, fat: 8, serving: '1 plate' },
  { name: 'Nigerian Fried Rice', calories: 400, protein: 14, carbs: 58, fat: 12, serving: '1 plate' },
  { name: 'Ofe Akwu (Palm Nut Soup)', calories: 380, protein: 16, carbs: 8, fat: 30, serving: '1 bowl' },
  { name: 'Groundnut Soup', calories: 420, protein: 20, carbs: 12, fat: 32, serving: '1 bowl' },
  { name: 'Bole and Fish (Nigerian)', calories: 480, protein: 28, carbs: 56, fat: 16, serving: '1 serving' },
  { name: 'Masa (Nigerian rice cake)', calories: 200, protein: 4, carbs: 38, fat: 4, serving: '2 pieces' },
  { name: 'Kunafa (Ghanaian)', calories: 380, protein: 8, carbs: 55, fat: 14, serving: '1 piece' },
  { name: 'Banku and Tilapia (Ghanaian)', calories: 520, protein: 34, carbs: 62, fat: 14, serving: '1 plate' },
  { name: 'Waakye (Ghanaian)', calories: 420, protein: 14, carbs: 72, fat: 8, serving: '1 plate' },
  { name: 'Kelewele (Ghanaian spicy plantain)', calories: 240, protein: 2, carbs: 52, fat: 6, serving: '100g' },
  { name: 'Fufu and Egusi', calories: 680, protein: 14, carbs: 90, fat: 28, serving: '1 plate' },
  { name: 'Fufu and Soup', calories: 620, protein: 18, carbs: 82, fat: 22, serving: '1 plate' },

  // ── Korean dishes ──────────────────────────────────────────────────────────
  { name: 'Korean Fried Chicken', calories: 380, protein: 28, carbs: 22, fat: 20, serving: '100g' },
  { name: 'Japchae (Korean glass noodles)', calories: 320, protein: 10, carbs: 52, fat: 8, serving: '1 serving' },
  { name: 'Doenjang Jjigae (soybean stew)', calories: 240, protein: 16, carbs: 18, fat: 10, serving: '1 bowl' },
  { name: 'Tteokbokki (spicy rice cakes)', calories: 310, protein: 8, carbs: 58, fat: 6, serving: '1 serving' },
  { name: 'Samgyeopsal (pork belly BBQ)', calories: 420, protein: 24, carbs: 2, fat: 36, serving: '100g' },
  { name: 'Galbi (Korean short ribs)', calories: 380, protein: 28, carbs: 10, fat: 26, serving: '100g' },
  { name: 'Sundubu Jjigae (soft tofu stew)', calories: 220, protein: 14, carbs: 14, fat: 10, serving: '1 bowl' },
  { name: 'Kimbap (Korean rice roll)', calories: 340, protein: 12, carbs: 54, fat: 8, serving: '1 roll (8 pcs)' },

  // ── Indian subcontinent ────────────────────────────────────────────────────
  { name: 'Chicken Curry', calories: 320, protein: 28, carbs: 14, fat: 18, serving: '1 serving' },
  { name: 'Mutton Curry', calories: 360, protein: 28, carbs: 10, fat: 24, serving: '1 serving' },
  { name: 'Fish Curry (Indian)', calories: 280, protein: 26, carbs: 10, fat: 16, serving: '1 serving' },
  { name: 'Chana Masala', calories: 280, protein: 12, carbs: 42, fat: 8, serving: '1 cup' },
  { name: 'Aloo Gobi', calories: 200, protein: 5, carbs: 32, fat: 7, serving: '1 cup' },
  { name: 'Rajma (kidney bean curry)', calories: 270, protein: 14, carbs: 42, fat: 5, serving: '1 cup' },
  { name: 'Idli (steamed rice cake)', calories: 58, protein: 2, carbs: 12, fat: 0.4, serving: '1 piece' },
  { name: 'Dosa (crispy crepe)', calories: 168, protein: 4, carbs: 32, fat: 3, serving: '1 large' },
  { name: 'Biryani (vegetable)', calories: 380, protein: 8, carbs: 64, fat: 10, serving: '1 serving' },

  // ── Caribbean ──────────────────────────────────────────────────────────────
  { name: 'Rice and Peas (Jamaican)', calories: 360, protein: 10, carbs: 68, fat: 5, serving: '1 cup' },
  { name: 'Oxtail Stew (Jamaican)', calories: 480, protein: 38, carbs: 18, fat: 26, serving: '1 serving' },
  { name: 'Curry Goat', calories: 380, protein: 34, carbs: 10, fat: 22, serving: '1 serving' },
  { name: 'Ackee and Saltfish', calories: 340, protein: 28, carbs: 12, fat: 20, serving: '1 serving' },
  { name: 'Pelau (Trinidadian)', calories: 420, protein: 22, carbs: 55, fat: 12, serving: '1 plate' },
  { name: 'Doubles (Trinidadian)', calories: 280, protein: 8, carbs: 44, fat: 8, serving: '1 serving' },
  { name: 'Callaloo (Caribbean stew)', calories: 180, protein: 8, carbs: 20, fat: 8, serving: '1 bowl' },

  // ── Mediterranean / Middle Eastern (extra) ────────────────────────────────
  { name: 'Shakshuka', calories: 320, protein: 18, carbs: 20, fat: 18, serving: '1 serving' },
  { name: 'Fattoush Salad', calories: 180, protein: 4, carbs: 24, fat: 8, serving: '1 bowl' },
  { name: 'Kibbeh', calories: 290, protein: 18, carbs: 22, fat: 14, serving: '2 pieces' },
  { name: 'Manakish (za\'atar flatbread)', calories: 350, protein: 8, carbs: 50, fat: 14, serving: '1 piece' },
  { name: 'Musakhan (Palestinian chicken)', calories: 580, protein: 38, carbs: 42, fat: 28, serving: '1 serving' },
  { name: 'Basbousa (semolina cake)', calories: 280, protein: 5, carbs: 50, fat: 8, serving: '1 piece' },

  // ── Breakfast items ────────────────────────────────────────────────────────
  { name: 'Boiled Egg and Toast', calories: 250, protein: 12, carbs: 28, fat: 8, serving: '1 serving' },
  { name: 'Egg and Avocado Toast', calories: 380, protein: 16, carbs: 34, fat: 20, serving: '1 serving' },
  { name: 'Overnight Oats', calories: 310, protein: 12, carbs: 52, fat: 7, serving: '1 jar' },
  { name: 'Acai Bowl', calories: 340, protein: 6, carbs: 60, fat: 10, serving: '1 bowl' },
  { name: 'Smoothie Bowl', calories: 320, protein: 8, carbs: 58, fat: 8, serving: '1 bowl' },
  { name: 'Banana Pancakes', calories: 320, protein: 8, carbs: 56, fat: 8, serving: '2 pancakes' },
  { name: 'Breakfast Burrito', calories: 520, protein: 28, carbs: 50, fat: 20, serving: '1 burrito' },
  { name: 'Porridge with Honey', calories: 220, protein: 6, carbs: 44, fat: 3, serving: '1 bowl' },

  // ── Beverages ─────────────────────────────────────────────────────────────
  { name: 'Water', calories: 0, protein: 0, carbs: 0, fat: 0, serving: '1 cup' },
  { name: 'Coffee (black)', calories: 5, protein: 0.3, carbs: 0, fat: 0, serving: '1 cup (240ml)' },
  { name: 'Coffee (latte)', calories: 190, protein: 12, carbs: 19, fat: 7, serving: '16 oz' },
  { name: 'Coffee (cappuccino)', calories: 120, protein: 8, carbs: 12, fat: 4, serving: '12 oz' },
  { name: 'Coffee (americano)', calories: 10, protein: 0.6, carbs: 0, fat: 0, serving: '12 oz' },
  { name: 'Espresso', calories: 3, protein: 0.1, carbs: 0, fat: 0, serving: '1 shot (30ml)' },
  { name: 'Tea (black, no milk)', calories: 2, protein: 0, carbs: 0.5, fat: 0, serving: '1 cup' },
  { name: 'Tea (with whole milk)', calories: 50, protein: 2, carbs: 5, fat: 2, serving: '1 cup' },
  { name: 'Green Tea', calories: 2, protein: 0, carbs: 0.5, fat: 0, serving: '1 cup' },
  { name: 'Matcha Latte', calories: 120, protein: 5, carbs: 12, fat: 4, serving: '1 cup' },
  { name: 'Orange Juice (fresh)', calories: 112, protein: 1.7, carbs: 26, fat: 0.5, serving: '1 cup' },
  { name: 'Apple Juice', calories: 114, protein: 0.3, carbs: 28, fat: 0.3, serving: '1 cup' },
  { name: 'Smoothie (banana, milk)', calories: 230, protein: 8, carbs: 42, fat: 3.5, serving: '1 cup' },
  { name: 'Protein Shake', calories: 160, protein: 30, carbs: 8, fat: 3, serving: '1 scoop (250ml)' },
  { name: 'Coca-Cola (regular)', calories: 140, protein: 0, carbs: 39, fat: 0, serving: '12 oz can' },
  { name: 'Coca-Cola Zero', calories: 0, protein: 0, carbs: 0, fat: 0, serving: '12 oz can' },
  { name: 'Sprite', calories: 140, protein: 0, carbs: 38, fat: 0, serving: '12 oz can' },
  { name: 'Energy Drink (Monster)', calories: 200, protein: 0, carbs: 54, fat: 0, serving: '1 can (473ml)' },
  { name: 'Milk (warm, whole)', calories: 149, protein: 8, carbs: 12, fat: 8, serving: '1 cup' },
  { name: 'Coconut Water', calories: 46, protein: 1.7, carbs: 9, fat: 0.5, serving: '1 cup' },
  { name: 'Red Wine', calories: 125, protein: 0.1, carbs: 3.8, fat: 0, serving: '5 oz glass' },
  { name: 'White Wine', calories: 121, protein: 0.1, carbs: 3.8, fat: 0, serving: '5 oz glass' },
  { name: 'Beer (regular)', calories: 153, protein: 1.6, carbs: 12.6, fat: 0, serving: '12 oz can' },

  // ── Condiments & Sauces ───────────────────────────────────────────────────
  { name: 'Ketchup', calories: 15, protein: 0.2, carbs: 3.7, fat: 0, serving: '1 tbsp' },
  { name: 'Mustard (yellow)', calories: 9, protein: 0.5, carbs: 0.6, fat: 0.5, serving: '1 tbsp' },
  { name: 'Soy Sauce', calories: 8, protein: 1, carbs: 0.8, fat: 0, serving: '1 tbsp' },
  { name: 'Hot Sauce (Tabasco)', calories: 2, protein: 0, carbs: 0, fat: 0, serving: '1 tsp' },
  { name: 'BBQ Sauce', calories: 29, protein: 0.3, carbs: 7, fat: 0, serving: '1 tbsp' },
  { name: 'Ranch Dressing', calories: 73, protein: 0.3, carbs: 1.4, fat: 7.7, serving: '1 tbsp' },
  { name: 'Salsa', calories: 5, protein: 0.3, carbs: 1, fat: 0, serving: '1 tbsp' },
  { name: 'Tahini', calories: 89, protein: 2.6, carbs: 3.2, fat: 8, serving: '1 tbsp' },
  { name: 'Sriracha', calories: 10, protein: 0.2, carbs: 2, fat: 0, serving: '1 tsp' },
  { name: 'Honey', calories: 64, protein: 0.1, carbs: 17.3, fat: 0, serving: '1 tbsp' },
  { name: 'Maple Syrup', calories: 52, protein: 0, carbs: 13.4, fat: 0, serving: '1 tbsp' },
  { name: 'Nutella', calories: 100, protein: 1.2, carbs: 11, fat: 6, serving: '1 tbsp' },
];

// Common search aliases — maps what the user types to canonical search terms
const SEARCH_ALIASES = {
  'chiken': 'chicken', 'chikken': 'chicken', 'chiken breast': 'chicken breast',
  'chcken': 'chicken', 'chiken thigh': 'chicken thigh',
  'brocolli': 'broccoli', 'brocoli': 'broccoli',
  'yougurt': 'yogurt', 'yoghurt': 'yogurt', 'youghurt': 'yogurt',
  'bannana': 'banana', 'bananana': 'banana',
  'sandwhich': 'sandwich', 'sandwitch': 'sandwich',
  'icecream': 'ice cream', 'ice-cream': 'ice cream',
  'potatoe': 'potato', 'potatos': 'potato',
  'tomatoe': 'tomato',
  'chocolat': 'chocolate',
  'spinich': 'spinach', 'spinich': 'spinach',
  'avacado': 'avocado', 'avocardo': 'avocado',
  'spaggetti': 'spaghetti', 'spagetti': 'spaghetti',
  'burrito': 'burrito', 'burro': 'burrito',
  'hummos': 'hummus', 'humus': 'hummus',
  'pb': 'peanut butter', 'peanutbutter': 'peanut butter',
  'oj': 'orange juice',
  'gg': 'egg', 'egs': 'egg', 'egss': 'eggs',
  'bred': 'bread', 'breat': 'bread',
  'ceral': 'cereal', 'granolla': 'granola',
  'beens': 'beans', 'benas': 'beans',
  'samon': 'salmon', 'salman': 'salmon',
  'letuce': 'lettuce', 'lettice': 'lettuce',
  'cuccumber': 'cucumber', 'cucumbar': 'cucumber',
  'tuna fish': 'tuna', 'tinned tuna': 'tuna',
  'ground turkey': 'turkey mince', 'minced turkey': 'turkey mince',
  'minced beef': 'ground beef', 'mince': 'ground beef',
  'steak': 'beef steak', 'sirloin': 'beef steak',
  'chips': 'french fries', 'fries': 'french fries',
  'coke': 'coca-cola', 'cola': 'coca-cola',
  'oatmeal': 'oats', 'porridge': 'oats',
  'greek yog': 'greek yogurt', 'greekyogurt': 'greek yogurt',
  'whole milk': 'milk whole', '2% milk': 'milk 2%', 'skim milk': 'milk skim',
  'almond milk': 'almond milk', 'oat milk': 'oat milk',
};

/**
 * Generic-first scoring — items where the query word appears at the START
 * of the name (without brand/country qualifiers in parens) rank highest.
 * Longer matches and bracket-free names score higher (they're generic).
 */
export function localSearch(query, limit = 20) {
  if (!query || query.length < 1) return [];

  // Correct spelling via alias map
  const rawQ = query.toLowerCase().trim();
  const q = SEARCH_ALIASES[rawQ] || rawQ;

  const terms = q.split(/\s+/).filter(Boolean);

  const scored = FOOD_DB
    .map(f => {
      const n = f.name.toLowerCase();
      const nameBase = n.replace(/\s*\(.*?\)/g, '').trim(); // strip parenthetical qualifiers
      const words = nameBase.split(/[\s,/]+/);

      let score = 0;

      // Full query matches
      if (nameBase === q) score = 100;                          // exact match on clean name
      else if (n === q) score = 95;                            // exact full match
      else if (nameBase.startsWith(q)) score = 80;            // clean name starts with query
      else if (n.startsWith(q)) score = 75;                   // full name starts with query

      // All terms present check
      const allTermsPresent = terms.every(t => n.includes(t));

      if (score === 0 && allTermsPresent) {
        // First word of clean name is the first search term → generic
        if (words[0] === terms[0]) score = 60;
        // First word of full name starts with query term
        else if (words.some(w => w.startsWith(terms[0]))) score = 45;
        else score = 30;
      } else if (score === 0) {
        // Partial match: at least one term found
        const someTermPresent = terms.some(t => n.includes(t));
        if (!someTermPresent) return { item: f, score: 0 };

        if (nameBase.startsWith(terms[0])) score = 25;
        else if (words.some(w => w === terms[0])) score = 20;
        else if (words.some(w => w.startsWith(terms[0]))) score = 15;
        else if (n.includes(terms[0])) score = 10;
      }

      // Boost: no parenthetical = cleaner/more generic entry
      if (score > 0 && !f.name.includes('(')) score += 5;

      return { item: f, score };
    })
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score || a.item.name.localeCompare(b.item.name));

  return scored.slice(0, limit).map(x => x.item);
}