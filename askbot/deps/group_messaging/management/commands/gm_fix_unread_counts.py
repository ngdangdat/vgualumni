from django.core.management.base import NoArgsCommand
from askbot.models import User
from askbot.utils.console import ProgressBar
from askbot.deps.group_messaging.models import get_unread_inbox_counter

class Command(NoArgsCommand):

    def handle_noargs(self, *args, **kwargs):
        users = User.objects.all()
        count = users.count()
        message = 'Fixing inbox counts for the users'
        for user in ProgressBar(users.iterator(), count, message):
            counter = get_unread_inbox_counter(user)
            counter.recalculate()
            counter.save()
