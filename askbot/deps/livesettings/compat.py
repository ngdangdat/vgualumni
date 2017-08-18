"""django version compatibility functions"""
from django.conf import settings
DEFAULT_CACHE_TIMEOUT = 6000

def get_cache_timeout():
    if hasattr(settings, 'CACHES'):
        timeout = settings.CACHES['default'].get('TIMEOUT', DEFAULT_CACHE_TIMEOUT)
        return getattr(settings, 'LIVESETTINGS_CACHE_TIMEOUT', timeout)
    return getattr(
                settings, 
                'LIVESETTINGS_CACHE_TIMEOUT', 
                getattr(settings, 'CACHE_TIMEOUT', DEFAULT_CACHE_TIMEOUT)
            )
