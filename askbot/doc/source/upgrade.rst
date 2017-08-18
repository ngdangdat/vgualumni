How to upgrade Askbot
=====================

NOTE: back up the database and customized files before upgrading.

1) Django Version support.
--------------------------

Currently Askbot supports major versions of Django `1.5`, `1.6`, `1.7` 
and `1.8`, however - a corresponding version of Askbot must be selected for
each version of the Django framework as shown below:

+---------------------------------+-----------------------+
| Version of the Django framework | Version of Askbot (*) |
+=================================+=======================+
| `1.5.x`                         | `0.7.x` or `0.8.x`(**)|
+---------------------------------+-----------------------+
| `1.6.x`                         | `0.8.x` (**)          |
+---------------------------------+-----------------------+
| `1.7.x`                         | `0.9.x`               |
+---------------------------------+-----------------------+
| `1.8.x`                         | `0.10.x`              |
+---------------------------------+-----------------------+

Note (*): select latest version of the corresponding release series,
x means the latest minor release number.

To automatically install the latest available version within the series,
use the following pip commmand (here we want to install version 0.8.x)::

   `pip install 'askbot<0.9'`.

Note (**): releases of series `0.8` must be used only to migrate
From Django `1.5` and below.

2) Upgrade of the Askbot software.
----------------------------------

Before running the upgrade scripts - prepare fresh backup of the database,
`settings.py` file and any other files that you've customized.

If you are upgrading from one of the versions of `0.7.x` or earlier
two steps will be necessary.

* Upgrade to `0.8.x`
* Upgrade from `0.8.x` to `0.9.x` or `0.10.x` - depending 
  on the version of Django you want to use

Two steps are required because starting Django 1.7, the mechanism of database
migrations changed. Version `0.8.x` is a stepping stone to the later versions,
which prepares the database.

2.1) Upgrade to version 0.8.x
=============================

Version `0.8.x` can be installed directly over the previous installation::

  pip uninstall askbot && pip install 'askbot<0.9'

Pip installs software from the Python Package Index 
(https://pypi.python.org/pypi), alternatively, Askbot can be installed from
the GitHub repository (https://github.com/ASKBOT/askbot-devel) with the
basic knowledge of `git` version control system.

After that run `python manage.py migrate`. The script might ask you to 
upgrade some modules first, do that, then repeat the command.

2.2) Upgrade to 0.9.x or 0.10.x into a new Python environment
=============================================================

Upgrading to further options is easier to achieve 
(for an alternative, see section 2.3) by installation into
a new environment::

  mkdir myproj
  cd myproj
  virtualenv env --no-site-packages
  source env/bin/activate
  pip install 'askbot<0.11' #assuming you want 0.10.x
  askbot-setup #answer questions - use the same database as before
  python manage.py migrate --fake-initial --noinput
  python manage.py collectstatic --noinput

When upgrading to 0.9.x version, askbot version should be specified
with::

  pip install 'askbot<0.10'

And command should be without the `--fake-initial` parameter::

  python manage.py migrate --noinput

Above instruction suggests using pip, hovewer it is also possible to
clone the git repository, fetch and checkout the necessary version and run
`python setup.py develop`.

This page does yet cover the case where upgrade is done in-place, without 
creating of the new Python virtual environment. If you decide to upgrade
in-place::

    * make changes in the `settings.py` file, replace `manage.py` and
    `urls.py` files. Templates for these files are available in 
    `askbot/setup_templates` directory.
    might give more specific information about the necessary changes.
    * remove old `*.pyc` files: rm `find . -name '*.pyc'`
    * make necessary module upgrades

Future version of this page might have more specific steps to take
when upgrading in place.

2.3) Upgrade to 0.9.x over the existing installation of 0.8.x
=============================================================

This option is an alternative to one described in the section above.
It is a bit more involved, but will help you to "grandfather" the
`settings.py` and `urls.py` files that might have been customized.

It is also possible to upgrade in the same manner to version 0.10.x,
but with some differences that are described in section 2.4.

`cd` into the directory where your file is installed (the one with
the `settings.py` file, it is also called the Django project directory).
Then the following commands::

    rm `find . -name '*.pyc'` #delete all the left over .pyc files
    pip uninstall askbot django django-followit South --yes
    pip install 'askbot<0.10' #installs latest 0.9.x

Edit the `settings.py` file:

* remove `'south'`, from `INSTALLED_APPS`
* remove `SOUTH_TESTS_MIGRATE` from `settings.py`
* replace entry `'group_messaging'` with `'askbot.deps.group_messaging'`
  in the `INSTALLED_APPS`
* add line `ATOMIC_REQUESTS=True`

Replace file `manage.py` with one in askbot/setup_templates/manage.py.
It might be a bit hard to find this file manually, the command below
should help (copy/paste and run)::


    cp `python -c 'import askbot, os; print os.path.join(os.path.dirname(askbot.__file__), "setup_templates", "manage.py")'` .

Migrate the database and collect the static files::

    python manage.py migrate --noinput
    python manage.py collectstatic --noinput

Now the site is upgraded to version 0.9.x.

2.3) Upgrade to 0.10.x over the installation 0.8.x
==================================================

Upgrade to version `0.10.x` follows the same steps and 
in the same order as above. This section describes only
the differences, specific to version `0.10.x`.

Install the latest version `0.10.x`, instead of `0.9.x`::

    pip install 'askbot<0.11' #installs latest 0.10.x

When editing the `settings.py` file, in addition to changes made for `0.9.x`,
do the following:

* Remove whole entries `TEMPLATE_LOADERS` and `TEMPLATE_CONTEXT_PROCESSORS`
* Remove sub-entry `'django.middleware.transaction.TransactionMiddleware'`
  from `MIDDLEWARE_CLASSES`
* Add `TEMPLATES` entry with the following contents::

  TEMPLATES = (
    {
        'BACKEND': 'askbot.skins.template_backends.AskbotSkinTemplates',
    },
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.core.context_processors.request',
                'django.contrib.auth.context_processors.auth',
            ]
        }
    },
  )
 
Lastly, command `migrate` is run with an extra `--fake-initial` option::

    python manage.py migrate --noinput --fake-initial
