from django.core.management.base import NoArgsCommand
from askbot.models import User
from askbot.utils.console import ProgressBar

class Command(NoArgsCommand):
    def handle(self, *args, **kwargs):
        users = User.objects.all()
        count = users.count()
        message = 'Ading users to global and personal groups'
        for user in ProgressBar(users.iterator(), count, message):
            user.join_default_groups()
