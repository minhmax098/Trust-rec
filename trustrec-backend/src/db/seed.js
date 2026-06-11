const db = require('./connection');

async function seedDatabase() {
  try {
    console.log("Creating tables...");
    
    // Create table Recipes
    await db.query(`
      CREATE TABLE IF NOT EXISTS recipes (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        ingredients TEXT[] NOT NULL,
        cooking_time INT NOT NULL,
        tags TEXT[] NOT NULL
      );
    `);

    console.log("Tables created successfully.");

    // Insert seed data if the table is empty
    const countRes = await db.query('SELECT COUNT(*) FROM recipes');
    if (parseInt(countRes.rows[0].count) === 0) {
      console.log("Inserting seed data...");
      
      const queryText = `
        INSERT INTO recipes (title, ingredients, cooking_time, tags) 
        VALUES ($1, $2, $3, $4)
      `;

      await db.query(queryText, [
        "Chicken Breast Salad with Peanut Butter Dressing",
        ["Chicken breast", "Lettuce", "Peanut butter", "Olive oil", "Honey"],
        15,
        ["Keto", "High-Protein"]
      ]);

      await db.query(queryText, [
        "Lotus Seed and Longan Sweet Soup with Rock Sugar",
        ["Lotus seeds", "Dried longan", "Rock sugar", "Red dates"],
        30,
        ["Dessert", "Cooling"]
      ]);

      console.log("Seed data inserted successfully.");
    } else {
      console.log("Database already has data. Skipping seed.");
    }

    process.exit(0);
  } catch (err) {
    console.error("Error seeding database:", err);
    process.exit(1);
  }
}

seedDatabase();