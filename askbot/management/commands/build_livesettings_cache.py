from django.core.management.base import NoArgsCommand
from django.conf import settings as django_settings
from django.utils import translation

class Command(NoArgsCommand):
    '''Loads livesettings values to cache helping speed up
       initial load time for the users'''

    def handle_noargs(self, **options):
        translation.activate(django_settings.LANGUAGE_CODE)
        from askbot.conf import settings as askbot_settings
        #Just loads all the settings that way they will be in the cache
        for key, value in askbot_settings._ConfigSettings__instance.items():
            empty1 = getattr(askbot_settings, key)
        print 'cache pre-loaded'
