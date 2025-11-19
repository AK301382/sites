import aiohttp
from typing import Dict
import asyncio
import logging

logger = logging.getLogger(__name__)

class TranslationService:
    """
    Free translation service using MyMemory Translation API
    No API key required - free tier: 1000 words/day
    """
    def __init__(self):
        # Using MyMemory free API
        self.api_url = "https://api.mymemory.translated.net/get"
        self.timeout = aiohttp.ClientTimeout(total=15)
        
    async def translate_text(self, text: str, source_lang: str, target_lang: str) -> str:
        """
        Translate text from source language to target language using MyMemory API
        
        Args:
            text: Text to translate
            source_lang: Source language code (de for German)
            target_lang: Target language code (en for English, fr for French)
        """
        if not text or text.strip() == "":
            return ""
        
        # Handle Swiss German - treat as standard German
        if source_lang == 'de-CH':
            source_lang = 'de'
            
        try:
            async with aiohttp.ClientSession(timeout=self.timeout) as session:
                params = {
                    "q": text,
                    "langpair": f"{source_lang}|{target_lang}"
                }
                
                async with session.get(self.api_url, params=params) as response:
                    if response.status == 200:
                        result = await response.json()
                        if result.get("responseStatus") == 200:
                            translated = result.get("responseData", {}).get("translatedText", text)
                            return translated
                        else:
                            logger.warning(f"Translation API returned non-200 status: {result.get('responseStatus')}")
                            return text
                    else:
                        logger.error(f"Translation API HTTP error: {response.status}")
                        return text
                        
        except asyncio.TimeoutError:
            logger.error("Translation request timed out")
            return text
        except Exception as e:
            logger.error(f"Translation error: {str(e)}")
            return text
    
    async def translate_to_all_languages(self, text: str, source_lang: str = 'de') -> Dict[str, str]:
        """
        Translate text to all supported languages (English and French)
        
        Args:
            text: Text to translate (in German or Swiss German)
            source_lang: Source language code (default: 'de')
            
        Returns:
            Dictionary with translations: {'en': 'English text', 'fr': 'French text', 'de': 'original text'}
        """
        # Start with original German text
        result = {'de': text}
        
        # Translate to English and French in parallel
        try:
            translations = await asyncio.gather(
                self.translate_text(text, source_lang, 'en'),
                self.translate_text(text, source_lang, 'fr'),
                return_exceptions=True
            )
            
            result['en'] = translations[0] if not isinstance(translations[0], Exception) else text
            result['fr'] = translations[1] if not isinstance(translations[1], Exception) else text
            
        except Exception as e:
            logger.error(f"Batch translation error: {str(e)}")
            # Fallback: use original text for all languages
            result['en'] = text
            result['fr'] = text
        
        return result

# Create global instance
translation_service = TranslationService()
