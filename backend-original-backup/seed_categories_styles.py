"""
Seed script for Service Categories, Gallery Styles, and Gallery Colors
Run this once to populate initial data
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path
import uuid

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

async def seed_categories():
    """Seed initial service categories"""
    categories = [
        {
            "id": str(uuid.uuid4()),
            "name_en": "Manicures",
            "name_de": "Maniküre",
            "name_fr": "Manucures"
        },
        {
            "id": str(uuid.uuid4()),
            "name_en": "Pedicures",
            "name_de": "Pediküre",
            "name_fr": "Pédicures"
        },
        {
            "id": str(uuid.uuid4()),
            "name_en": "Extensions",
            "name_de": "Verlängerungen",
            "name_fr": "Extensions"
        },
        {
            "id": str(uuid.uuid4()),
            "name_en": "Add-ons",
            "name_de": "Zusatzleistungen",
            "name_fr": "Suppléments"
        },
        {
            "id": str(uuid.uuid4()),
            "name_en": "Quick Services",
            "name_de": "Schnellservice",
            "name_fr": "Services rapides"
        },
        {
            "id": str(uuid.uuid4()),
            "name_en": "Massage",
            "name_de": "Massage",
            "name_fr": "Massage"
        }
    ]
    
    # Clear existing categories first
    await db.service_categories.delete_many({})
    
    # Insert new categories
    await db.service_categories.insert_many(categories)
    print(f"✅ Seeded {len(categories)} service categories")

async def seed_gallery_styles():
    """Seed initial gallery styles"""
    styles = [
        {
            "id": str(uuid.uuid4()),
            "name_en": "French",
            "name_de": "Französisch",
            "name_fr": "Français"
        },
        {
            "id": str(uuid.uuid4()),
            "name_en": "Classic",
            "name_de": "Klassisch",
            "name_fr": "Classique"
        },
        {
            "id": str(uuid.uuid4()),
            "name_en": "Modern",
            "name_de": "Modern",
            "name_fr": "Moderne"
        },
        {
            "id": str(uuid.uuid4()),
            "name_en": "Artistic",
            "name_de": "Künstlerisch",
            "name_fr": "Artistique"
        },
        {
            "id": str(uuid.uuid4()),
            "name_en": "Minimalist",
            "name_de": "Minimalistisch",
            "name_fr": "Minimaliste"
        },
        {
            "id": str(uuid.uuid4()),
            "name_en": "Glitter",
            "name_de": "Glitzer",
            "name_fr": "Paillettes"
        },
        {
            "id": str(uuid.uuid4()),
            "name_en": "Ombre",
            "name_de": "Ombre",
            "name_fr": "Ombré"
        },
        {
            "id": str(uuid.uuid4()),
            "name_en": "Matte",
            "name_de": "Matt",
            "name_fr": "Mat"
        }
    ]
    
    # Clear existing styles first
    await db.gallery_styles.delete_many({})
    
    # Insert new styles
    await db.gallery_styles.insert_many(styles)
    print(f"✅ Seeded {len(styles)} gallery styles")

async def seed_gallery_colors():
    """Seed initial gallery colors"""
    colors = [
        {
            "id": str(uuid.uuid4()),
            "name_en": "Pink",
            "name_de": "Rosa",
            "name_fr": "Rose",
            "hex_code": "#FFB6C1"
        },
        {
            "id": str(uuid.uuid4()),
            "name_en": "Red",
            "name_de": "Rot",
            "name_fr": "Rouge",
            "hex_code": "#FF6B6B"
        },
        {
            "id": str(uuid.uuid4()),
            "name_en": "Purple",
            "name_de": "Lila",
            "name_fr": "Violet",
            "hex_code": "#9B59B6"
        },
        {
            "id": str(uuid.uuid4()),
            "name_en": "Blue",
            "name_de": "Blau",
            "name_fr": "Bleu",
            "hex_code": "#3498DB"
        },
        {
            "id": str(uuid.uuid4()),
            "name_en": "Green",
            "name_de": "Grün",
            "name_fr": "Vert",
            "hex_code": "#2ECC71"
        },
        {
            "id": str(uuid.uuid4()),
            "name_en": "Yellow",
            "name_de": "Gelb",
            "name_fr": "Jaune",
            "hex_code": "#F39C12"
        },
        {
            "id": str(uuid.uuid4()),
            "name_en": "Gold",
            "name_de": "Gold",
            "name_fr": "Or",
            "hex_code": "#D4AF76"
        },
        {
            "id": str(uuid.uuid4()),
            "name_en": "Silver",
            "name_de": "Silber",
            "name_fr": "Argent",
            "hex_code": "#C0C0C0"
        },
        {
            "id": str(uuid.uuid4()),
            "name_en": "Black",
            "name_de": "Schwarz",
            "name_fr": "Noir",
            "hex_code": "#000000"
        },
        {
            "id": str(uuid.uuid4()),
            "name_en": "White",
            "name_de": "Weiß",
            "name_fr": "Blanc",
            "hex_code": "#FFFFFF"
        },
        {
            "id": str(uuid.uuid4()),
            "name_en": "Nude",
            "name_de": "Nude",
            "name_fr": "Nude",
            "hex_code": "#F5DEB3"
        },
        {
            "id": str(uuid.uuid4()),
            "name_en": "Orange",
            "name_de": "Orange",
            "name_fr": "Orange",
            "hex_code": "#FF8C00"
        }
    ]
    
    # Clear existing colors first
    await db.gallery_colors.delete_many({})
    
    # Insert new colors
    await db.gallery_colors.insert_many(colors)
    print(f"✅ Seeded {len(colors)} gallery colors")

async def main():
    print("🌱 Starting database seeding...")
    await seed_categories()
    await seed_gallery_styles()
    await seed_gallery_colors()
    print("✨ Database seeding completed successfully!")
    client.close()

if __name__ == "__main__":
    asyncio.run(main())
