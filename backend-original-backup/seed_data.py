import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]


async def seed_database():
    # Clear existing data
    await db.services.delete_many({})
    await db.artists.delete_many({})
    await db.gallery.delete_many({})
    await db.settings.delete_many({})

    # Seed Services
    services = [
        {
            "id": "service-1",
            "name_en": "Classic Manicure",
            "name_de": "Klassische Maniküre",
            "name_fr": "Manucure Classique",
            "description_en": "File, shape, cuticle care, polish",
            "description_de": "Feilen, Formen, Nagelhautpflege, Politur",
            "description_fr": "Limer, former, soin des cuticules, vernis",
            "category": "Manicures",
            "price": "CHF 45",
            "duration": "45 mins",
            "image_url": "https://images.unsplash.com/photo-1632345031435-8727f6897d53"
        },
        {
            "id": "service-2",
            "name_en": "Gel Manicure",
            "name_de": "Gel-Maniküre",
            "name_fr": "Manucure Gel",
            "description_en": "Long-lasting gel polish, chip-free for 2-3 weeks",
            "description_de": "Langlebiger Gel-Lack, splitterfrei für 2-3 Wochen",
            "description_fr": "Vernis gel longue durée, sans écaille pendant 2-3 semaines",
            "category": "Manicures",
            "price": "CHF 65",
            "duration": "60 mins",
            "image_url": "https://images.unsplash.com/photo-1611821828952-3453ba0f9408"
        },
        {
            "id": "service-3",
            "name_en": "Luxury Spa Manicure",
            "name_de": "Luxus-Spa-Maniküre",
            "name_fr": "Manucure Spa de Luxe",
            "description_en": "Exfoliation, mask, massage, polish - ultimate pampering",
            "description_de": "Peeling, Maske, Massage, Politur - ultimative Verwöhnung",
            "description_fr": "Exfoliation, masque, massage, vernis - soin ultime",
            "category": "Manicures",
            "price": "CHF 85",
            "duration": "75 mins",
            "image_url": "https://images.pexels.com/photos/3997379/pexels-photo-3997379.jpeg"
        },
        {
            "id": "service-4",
            "name_en": "Classic Pedicure",
            "name_de": "Klassische Pediküre",
            "name_fr": "Pédicure Classique",
            "description_en": "Soak, scrub, massage, polish",
            "description_de": "Einweichen, Peeling, Massage, Politur",
            "description_fr": "Tremper, gommage, massage, vernis",
            "category": "Pedicures",
            "price": "CHF 55",
            "duration": "60 mins",
            "image_url": "https://images.pexels.com/photos/6724357/pexels-photo-6724357.jpeg"
        },
        {
            "id": "service-5",
            "name_en": "Gel Pedicure",
            "name_de": "Gel-Pediküre",
            "name_fr": "Pédicure Gel",
            "description_en": "Long-lasting gel on toes",
            "description_de": "Langanhaltender Gel-Lack auf den Zehen",
            "description_fr": "Gel longue durée sur les orteils",
            "category": "Pedicures",
            "price": "CHF 75",
            "duration": "75 mins",
            "image_url": "https://images.pexels.com/photos/6724464/pexels-photo-6724464.jpeg"
        },
        {
            "id": "service-6",
            "name_en": "Nail Art",
            "name_de": "Nagelkunst",
            "name_fr": "Nail Art",
            "description_en": "Custom designs, hand-painted details",
            "description_de": "Individuelle Designs, handgemalte Details",
            "description_fr": "Designs personnalisés, détails peints à la main",
            "category": "Add-ons",
            "price": "From CHF 15",
            "duration": "30-60 mins",
            "image_url": "https://images.unsplash.com/photo-1571290274554-6a2eaa771e5f"
        },
        {
            "id": "service-7",
            "name_en": "Gel Extensions",
            "name_de": "Gel-Extensions",
            "name_fr": "Extensions Gel",
            "description_en": "Full set of soft gel tips, customizable length",
            "description_de": "Vollständiger Satz weicher Gel-Tips, anpassbare Länge",
            "description_fr": "Ensemble complet de tips gel doux, longueur personnalisable",
            "category": "Extensions",
            "price": "CHF 120",
            "duration": "120 mins",
            "image_url": "https://images.unsplash.com/photo-1648844421638-0655d00dd5ba"
        },
        {
            "id": "service-8",
            "name_en": "Polish Change",
            "name_de": "Lackwechsel",
            "name_fr": "Changement de Vernis",
            "description_en": "Quick polish change, hands or feet",
            "description_de": "Schneller Lackwechsel, Hände oder Füße",
            "description_fr": "Changement rapide de vernis, mains ou pieds",
            "category": "Quick Services",
            "price": "CHF 25",
            "duration": "20 mins",
            "image_url": "https://images.unsplash.com/photo-1617472556169-c5547fde3282"
        },
        {
            "id": "service-9",
            "name_en": "Gel Removal",
            "name_de": "Gel-Entfernung",
            "name_fr": "Retrait Gel",
            "description_en": "Safe, gentle removal with nail care",
            "description_de": "Sichere, sanfte Entfernung mit Nagelpflege",
            "description_fr": "Retrait sûr et doux avec soin des ongles",
            "category": "Quick Services",
            "price": "CHF 30",
            "duration": "30 mins",
            "image_url": "https://images.unsplash.com/photo-1698308233758-d55c98fd7444"
        }
    ]

    await db.services.insert_many(services)
    print(f"✓ Seeded {len(services)} services")

    # Seed Artists
    artists = [
        {
            "id": "artist-1",
            "name": "Sophie",
            "bio_en": "Master nail artist with 8 years of experience specializing in intricate designs",
            "bio_de": "Meister-Nagelkünstlerin mit 8 Jahren Erfahrung, spezialisiert auf komplizierte Designs",
            "bio_fr": "Artiste des ongles avec 8 ans d'expérience spécialisée dans les designs complexes",
            "specialties_en": "Nail art, geometric designs, French manicure",
            "specialties_de": "Nagelkunst, geometrische Designs, French Manicure",
            "specialties_fr": "Nail art, designs géométriques, manucure française",
            "years_experience": 8,
            "image_url": "https://images.unsplash.com/photo-1700760933910-d3c03aa18b65",
            "instagram": "@sophie_nails"
        },
        {
            "id": "artist-2",
            "name": "Marie",
            "bio_en": "Passionate about minimalist nail art and natural beauty",
            "bio_de": "Leidenschaftlich über minimalistische Nagelkunst und natürliche Schönheit",
            "bio_fr": "Passionnée par le nail art minimaliste et la beauté naturelle",
            "specialties_en": "Minimalist designs, natural nails, gel manicures",
            "specialties_de": "Minimalistische Designs, natürliche Nägel, Gel-Maniküren",
            "specialties_fr": "Designs minimalistes, ongles naturels, manucures gel",
            "years_experience": 5,
            "image_url": "https://images.pexels.com/photos/939835/pexels-photo-939835.jpeg",
            "instagram": "@marie_beautynails"
        },
        {
            "id": "artist-3",
            "name": "Elena",
            "bio_en": "Specialist in luxury spa treatments and advanced nail techniques",
            "bio_de": "Spezialistin für Luxus-Spa-Behandlungen und fortgeschrittene Nageltechniken",
            "bio_fr": "Spécialiste des soins spa de luxe et techniques avancées des ongles",
            "specialties_en": "Spa pedicures, gel extensions, luxury treatments",
            "specialties_de": "Spa-Pediküren, Gel-Extensions, Luxusbehandlungen",
            "specialties_fr": "Pédicures spa, extensions gel, traitements de luxe",
            "years_experience": 10,
            "image_url": "https://images.unsplash.com/photo-1693776528429-f73dd0586329",
            "instagram": "@elena_nailspa"
        }
    ]

    await db.artists.insert_many(artists)
    print(f"✓ Seeded {len(artists)} artists")

    # Seed Gallery - Updated with correct colors from gallery_colors
    gallery = [
        {
            "id": "gallery-1",
            "image_url": "https://images.unsplash.com/photo-1611821828952-3453ba0f9408",
            "title_en": "Elegant Minimalist",
            "title_de": "Eleganter Minimalist",
            "title_fr": "Minimaliste Élégant",
            "artist_name": "Sophie",
            "style": "Minimalist",
            "colors": ["Nude", "White"],
            "created_at": "2024-01-15T10:00:00Z"
        },
        {
            "id": "gallery-2",
            "image_url": "https://images.unsplash.com/photo-1698308233758-d55c98fd7444",
            "title_en": "Black & Silver Art",
            "title_de": "Schwarz & Silber Kunst",
            "title_fr": "Art Noir & Argent",
            "artist_name": "Sophie",
            "style": "Modern",
            "colors": ["Black", "Silver"],
            "created_at": "2024-01-20T10:00:00Z"
        },
        {
            "id": "gallery-3",
            "image_url": "https://images.unsplash.com/photo-1617472556169-c5547fde3282",
            "title_en": "Clean Design",
            "title_de": "Sauberes Design",
            "title_fr": "Design Épuré",
            "artist_name": "Marie",
            "style": "Minimalist",
            "colors": ["Nude", "Pink"],
            "created_at": "2024-02-01T10:00:00Z"
        },
        {
            "id": "gallery-4",
            "image_url": "https://images.unsplash.com/photo-1571290274554-6a2eaa771e5f",
            "title_en": "Colorful Geometric",
            "title_de": "Buntes Geometrisch",
            "title_fr": "Géométrique Coloré",
            "artist_name": "Sophie",
            "style": "Modern",
            "colors": ["Red", "Orange", "Yellow"],
            "created_at": "2024-02-10T10:00:00Z"
        },
        {
            "id": "gallery-5",
            "image_url": "https://images.pexels.com/photos/6429663/pexels-photo-6429663.jpeg",
            "title_en": "Professional Colorful",
            "title_de": "Professionell Bunt",
            "title_fr": "Coloré Professionnel",
            "artist_name": "Elena",
            "style": "Artistic",
            "colors": ["Pink", "Purple", "Blue"],
            "created_at": "2024-02-15T10:00:00Z"
        },
        {
            "id": "gallery-6",
            "image_url": "https://images.unsplash.com/photo-1648844421638-0655d00dd5ba",
            "title_en": "Glitter Glamour",
            "title_de": "Glitzer Glamour",
            "title_fr": "Glamour Pailleté",
            "artist_name": "Elena",
            "style": "Glitter",
            "colors": ["Gold", "Silver"],
            "created_at": "2024-03-01T10:00:00Z"
        },
        {
            "id": "gallery-7",
            "image_url": "https://images.unsplash.com/photo-1648844421727-cde6c4246b13",
            "title_en": "Elegant Glitter",
            "title_de": "Eleganter Glitzer",
            "title_fr": "Paillettes Élégantes",
            "artist_name": "Marie",
            "style": "Glitter",
            "colors": ["Gold", "Nude"],
            "created_at": "2024-03-05T10:00:00Z"
        },
        {
            "id": "gallery-8",
            "image_url": "https://images.unsplash.com/photo-1648844421753-351afd50486a",
            "title_en": "Professional Glitter",
            "title_de": "Professioneller Glitzer",
            "title_fr": "Paillettes Professionnelles",
            "artist_name": "Sophie",
            "style": "Glitter",
            "colors": ["Silver", "White"],
            "created_at": "2024-03-10T10:00:00Z"
        },
        {
            "id": "gallery-9",
            "image_url": "https://images.pexels.com/photos/3997379/pexels-photo-3997379.jpeg",
            "title_en": "Colorful Display",
            "title_de": "Bunte Anzeige",
            "title_fr": "Affichage Coloré",
            "artist_name": "Elena",
            "style": "Artistic",
            "colors": ["Red", "Blue", "Green", "Yellow"],
            "created_at": "2024-03-15T10:00:00Z"
        },
        {
            "id": "gallery-10",
            "image_url": "https://images.pexels.com/photos/6830805/pexels-photo-6830805.jpeg",
            "title_en": "Professional Art",
            "title_de": "Professionelle Kunst",
            "title_fr": "Art Professionnel",
            "artist_name": "Marie",
            "style": "French",
            "colors": ["Nude", "White"],
            "created_at": "2024-03-20T10:00:00Z"
        },
        {
            "id": "gallery-11",
            "image_url": "https://images.unsplash.com/photo-1604654894610-df63bc536371",
            "title_en": "Ombre Magic",
            "title_de": "Ombre Zauber",
            "title_fr": "Magie Ombré",
            "artist_name": "Sophie",
            "style": "Ombre",
            "colors": ["Pink", "Purple"],
            "created_at": "2024-03-25T10:00:00Z"
        },
        {
            "id": "gallery-12",
            "image_url": "https://images.unsplash.com/photo-1610992015762-45dca7c2c8e5",
            "title_en": "Matte Elegance",
            "title_de": "Matte Eleganz",
            "title_fr": "Élégance Mate",
            "artist_name": "Marie",
            "style": "Matte",
            "colors": ["Black", "Red"],
            "created_at": "2024-03-30T10:00:00Z"
        }
    ]

    await db.gallery.insert_many(gallery)
    print(f"✓ Seeded {len(gallery)} gallery items")

    # Seed Settings
    settings = {
        "id": "site_settings",
        "business_name_en": "Fabulous Nails & Spa",
        "business_name_de": "Fabulous Nails & Spa",
        "business_name_fr": "Fabulous Nails & Spa",
        "phone": "+41 44 123 45 67",
        "email": "info@fabulousnails.ch",
        "address_line1": "Bahnhofstrasse 123",
        "address_line2": "",
        "city": "Zürich",
        "postal_code": "8001",
        "country": "Switzerland",
        "hours_weekday": "Mon-Fri: 09:00 - 19:00",
        "hours_saturday": "Sat: 09:00 - 17:00",
        "hours_sunday": "Sun: 10:00 - 16:00",
        "instagram_url": "https://instagram.com",
        "facebook_url": "https://facebook.com",
        "whatsapp_number": "+41441234567"
    }

    await db.settings.insert_one(settings)
    print("✓ Seeded site settings")
    print("\n✓ Database seeding completed successfully!")


if __name__ == "__main__":
    asyncio.run(seed_database())