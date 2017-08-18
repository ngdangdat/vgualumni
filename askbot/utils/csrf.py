from django.conf import settings as django_settings
from django.middleware.csrf import _sanitize_token, _get_new_csrf_key

def get_or_create_csrf_token(request):
    try:
        csrf_token = _sanitize_token(
            request.COOKIES[django_settings.CSRF_COOKIE_NAME])
        # Use same token next time
    except KeyError:
        csrf_token = _get_new_csrf_key()
        # Generate token and store it in the request, so it's
        # available to the view.
    request.META['CSRF_COOKIE'] = csrf_token
    request.META['CSRF_COOKIE_USED'] = True
    return csrf_token
