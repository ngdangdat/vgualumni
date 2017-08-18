.. _multilingual:
====================================
Setting up multilingual Askbot sites
====================================

Askbot can support multiple languages on a single site.
Urls are modified by a language code prefix,
e.g. url /questions/ becomes /de/questions/ for the German localization.

.. note::
    If you want to learn about configuration of individual languages
    please look :ref:`here <localization>`

The setting in the `settings.py` file controlling language mode is 
`ASKBOT_LANGUAGE_MODE`.

For the single-language mode this setting may be removed or set to::
    ASKBOT_LANGUAGE_MODE = 'single-lang' 

For the "url language" mode (there are two multilingual modes)::
    ASKBOT_LANGUAGE_MODE = 'url-lang'

For the "user language" mode::
    ASKBOT_LANGUAGE_MODE = 'user-lang'

The "url language" mode displays questions on the main page only
for the language corresponding to the url prefix 
(e.g. /en/ for English or /de/ for German).

The "user language" mode displays questions on the main page in 
the languages section of their user profile (for the logged in users).

Language of the user interface in both multilingual modes corresponds
to the language prefix of the url.

For either of multilingual modes, specify the list of
the enabled languages::
    from django.utils.translation import ugettext_lazy as _
    LANGUAGES = (
        ('de', _('German')),
        ('en', _('English'))
    )

More on the usage of this setting can be read in the
`Django documentation <https://docs.djangoproject.com/en/dev/ref/settings/#languages>`_.

Once the language mode is specified, Askbot startup checks, if enabled
will guide through the configuration of the remaining settings.

Upgrading from older versions
=============================
Older versions had setting `ASKBOT_MULTILINGUAL` used
in the project-level `urls.py` file. When upgrading from such version,
update the `urls.py` according to the template in 
`askbot/setup_templates/urls.py`.

Other settings required for the multilingual configuration
==========================================================
If the startup checks are enabled
(setting `ASKBOT_SELF_TEST` does not equal `False`),
Askbot will guide you through configuring of the remaining settings.

This section will help users who disable the Askbot self-tests and
when the mode is `'url-lang'` or `'user-lang'`.

Activate the django's locale middleware by adding to the 
`MIDDLEWARE_CLASSES` the following entry::
    'django.middleware.locale.LocaleMiddleware',

Add the following to the `settings.py`::
    ASKBOT_TRANSLATE_URL = False
