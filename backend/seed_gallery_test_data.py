"""
Seed script to add test gallery styles, colors, and images
Run this script to populate the database with test data for the gallery feature
"""

import asyncio
import sys
from motor.motor_asyncio import AsyncIOMotorClient
import os
from datetime import datetime, timezone
import uuid

# Import translation service
from translation_service import TranslationService

# MongoDB connection
MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
DB_NAME = os.environ.get('DB_NAME', 'tattoo_studio')

async def seed_gallery_data():
    # Connect to MongoDB
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    translation_service = TranslationService()
    
    print("🎨 Starting gallery seed data insertion...")
    
    # ============= 1. ADD STYLES =============
    print("\n1️⃣ Adding Gallery Styles...")
    
    styles_to_add = [
        "Minimalistisch",  # Minimalist
        "Modern",          # Modern
        "Französisch",     # French
        "Glitzer",         # Glitter
        "Künstlerisch",    # Artistic
        "Elegant",         # Elegant
        "Geometrisch",     # Geometric
    ]
    
    # Clear existing styles
    await db.gallery_styles.delete_many({})
    print("   ✓ Cleared existing styles")
    
    added_styles = []
    for style_name_de in styles_to_add:
        translations = await translation_service.translate_to_all_languages(style_name_de)
        style_obj = {
            "id": str(uuid.uuid4()),
            "name_en": translations['en'],
            "name_de": translations['de'],
            "name_fr": translations['fr']
        }
        await db.gallery_styles.insert_one(style_obj)
        added_styles.append(style_obj)
        print(f"   ✓ Added style: {style_obj['name_de']} | {style_obj['name_en']} | {style_obj['name_fr']}")
    
    # ============= 2. ADD COLORS =============
    print("\n2️⃣ Adding Gallery Colors...")
    
    colors_to_add = [
        "Rosa",        # Pink
        "Rot",         # Red
        "Blau",        # Blue
        "Grün",        # Green
        "Gelb",        # Yellow
        "Orange",      # Orange
        "Lila",        # Purple
        "Gold",        # Gold
        "Silber",      # Silver
        "Schwarz",     # Black
        "Weiß",        # White
        "Nude",        # Nude
    ]
    
    # Clear existing colors
    await db.gallery_colors.delete_many({})
    print("   ✓ Cleared existing colors")
    
    added_colors = []
    for color_name_de in colors_to_add:
        translations = await translation_service.translate_to_all_languages(color_name_de)
        color_obj = {
            "id": str(uuid.uuid4()),
            "name_en": translations['en'],
            "name_de": translations['de'],
            "name_fr": translations['fr']
        }
        await db.gallery_colors.insert_one(color_obj)
        added_colors.append(color_obj)
        print(f"   ✓ Added color: {color_obj['name_de']} | {color_obj['name_en']} | {color_obj['name_fr']}")
    
    # ============= 3. ADD GALLERY ITEMS =============
    print("\n3️⃣ Adding Gallery Items with proper style and color mapping...")
    
    # Clear existing gallery items
    await db.gallery.delete_many({})
    print("   ✓ Cleared existing gallery items")
    
    # Define test gallery items with proper name_en mapping
    gallery_items = [
        {
            "title_de": "Eleganter Minimalist",
            "image_url": "https://images.unsplash.com/photo-1611821828952-3453ba0f9408",
            "artist_name": "Maria Schmidt",
            "style": "Minimalist",  # name_en
            "colors": ["Nude", "White"]  # name_en
        },
        {
            "title_de": "Schwarz & Silber Kunst",
            "image_url": "https://images.unsplash.com/photo-1698308233758-d55c98fd7444",
            "artist_name": "Sarah Weber",
            "style": "Modern",
            "colors": ["Black", "Silver"]
        },
        {
            "title_de": "Sauberes Design",
            "image_url": "https://images.unsplash.com/photo-1617472556169-c5547fde3282",
            "artist_name": "Julia Müller",
            "style": "Minimalist",
            "colors": ["Nude", "Pink"]
        },
        {
            "title_de": "Buntes Geometrisch",
            "image_url": "https://images.unsplash.com/photo-1571290274554-6a2eaa771e5f",
            "artist_name": "Anna Fischer",
            "style": "Modern",
            "colors": ["Red", "Orange", "Yellow"]
        },
        {
            "title_de": "Professionell Bunt",
            "image_url": "https://images.pexels.com/photos/6429663/pexels-photo-6429663.jpeg",
            "artist_name": "Lisa Bauer",
            "style": "Artistic",
            "colors": ["Pink", "Purple", "Blue"]
        },
        {
            "title_de": "Glitzer Glamour",
            "image_url": "https://images.unsplash.com/photo-1648844421638-0655d00dd5ba",
            "artist_name": "Sophie Wagner",
            "style": "Glitter",
            "colors": ["Gold", "Silver"]
        },
        {
            "title_de": "Eleganter Glitzer",
            "image_url": "https://images.unsplash.com/photo-1648844421727-cde6c4246b13",
            "artist_name": "Emma Koch",
            "style": "Glitter",
            "colors": ["Gold", "Nude"]
        },
        {
            "title_de": "Professioneller Glitzer",
            "image_url": "https://images.unsplash.com/photo-1648844421753-351afd50486a",
            "artist_name": "Mia Schneider",
            "style": "Glitter",
            "colors": ["Silver", "White"]
        },
        {
            "title_de": "Bunte Anzeige",
            "image_url": "https://images.pexels.com/photos/3997379/pexels-photo-3997379.jpeg",
            "artist_name": "Laura Hoffmann",
            "style": "Artistic",
            "colors": ["Red", "Blue", "Green", "Yellow"]
        },
        {
            "title_de": "Professionelle Kunst",
            "image_url": "https://images.pexels.com/photos/6830805/pexels-photo-6830805.jpeg",
            "artist_name": "Nina Richter",
            "style": "French",
            "colors": ["Nude", "White"]
        },
        {
            "title_de": "Rosa Eleganz",
            "image_url": "https://images.unsplash.com/photo-1604654894610-df63bc536371",
            "artist_name": "Maria Schmidt",
            "style": "Elegant",
            "colors": ["Pink", "White"]
        },
        {
            "title_de": "Grüne Geometrie",
            "image_url": "https://images.unsplash.com/photo-1632345031435-8727f6897d53",
            "artist_name": "Sarah Weber",
            "style": "Geometric",
            "colors": ["Green", "White", "Gold"]
        },
        {
            "title_de": "Blaue Träume",
            "image_url": "https://images.unsplash.com/photo-1610992015732-2449b76344bc",
            "artist_name": "Julia Müller",
            "style": "Modern",
            "colors": ["Blue", "Silver"]
        },
        {
            "title_de": "Rote Leidenschaft",
            "image_url": "https://images.unsplash.com/photo-1519014816548-bf5fe059798b",
            "artist_name": "Anna Fischer",
            "style": "Artistic",
            "colors": ["Red", "Black"]
        },
        {
            "title_de": "Lila Magie",
            "image_url": "https://images.unsplash.com/photo-1604654894609-b5c0a7c880c7",
            "artist_name": "Lisa Bauer",
            "style": "Modern",
            "colors": ["Purple", "White"]
        },
    ]
    
    for item in gallery_items:
        # Translate title
        title_translations = await translation_service.translate_to_all_languages(item['title_de'])
        
        gallery_obj = {
            "id": str(uuid.uuid4()),
            "image_url": item['image_url'],
            "title_en": title_translations['en'],
            "title_de": title_translations['de'],
            "title_fr": title_translations['fr'],
            "artist_name": item['artist_name'],
            "style": item['style'],  # Store name_en
            "colors": item['colors'],  # Store list of name_en
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        
        await db.gallery.insert_one(gallery_obj)
        print(f"   ✓ Added: {gallery_obj['title_de']} | Style: {gallery_obj['style']} | Colors: {', '.join(gallery_obj['colors'])}")
    
    # ============= 4. VERIFICATION =============
    print("\n4️⃣ Verification:")
    
    styles_count = await db.gallery_styles.count_documents({})
    colors_count = await db.gallery_colors.count_documents({})
    gallery_count = await db.gallery.count_documents({})
    
    print(f"   ✅ Total Styles: {styles_count}")
    print(f"   ✅ Total Colors: {colors_count}")
    print(f"   ✅ Total Gallery Items: {gallery_count}")
    
    # Show style usage
    print("\n   📊 Style Usage:")
    for style in added_styles[:5]:  # Show first 5
        count = await db.gallery.count_documents({"style": style['name_en']})
        print(f"      • {style['name_de']} ({style['name_en']}): {count} items")
    
    # Show color usage
    print("\n   🎨 Color Usage (Top 5):")
    for color in added_colors[:5]:  # Show first 5
        count = await db.gallery.count_documents({"colors": color['name_en']})
        print(f"      • {color['name_de']} ({color['name_en']}): {count} items")
    
    print("\n✅ Gallery seed data insertion completed successfully!")
    print("\n💡 Note: All styles and colors are stored using their English names (name_en)")
    print("   This ensures consistent filtering regardless of the UI language.")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_gallery_data())
