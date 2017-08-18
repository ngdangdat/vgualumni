from django.core.management.base import NoArgsCommand
import os.path
import askbot
from askbot.search.postgresql import setup_full_text_search

class Command(NoArgsCommand):

    def handle_noargs(self, **options):
        dir_path = askbot.get_install_directory()
        script_path = os.path.join(
                            dir_path,
                            'search',
                            'postgresql',
                            'thread_and_post_models_03012016.plsql'
                        )
        setup_full_text_search(script_path)

        script_path = os.path.join(
                            dir_path,
                            'search',
                            'postgresql',
                            'user_profile_search_12202015.plsql'
                        )
        setup_full_text_search(script_path)
