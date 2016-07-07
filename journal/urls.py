"""journal URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.9/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from django.contrib import admin
from django.conf import settings
from journal_app import views as journal_app_views

#only dev!!!!!!!!!!!!!

from django.conf.urls.static import static
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

#

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^confirm/(?P<act>\w+)/$', journal_app_views.register_confirm, name='register_confirm'),
    url(r'^changerecord/$', journal_app_views.change_record_ajax, name='change_record_ajax'),
    url(r'^changegoal/$', journal_app_views.change_goal_ajax, name='change_goal_ajax'),
    url(r'^addrecord/$', journal_app_views.add_record_ajax, name='add_record_ajax'),
    url(r'^delrecord/$', journal_app_views.del_record_ajax, name='del_record_ajax'),
    url(r'^log_out/$', journal_app_views.log_out, name='log_out'),
    url(r'^log_in/$', journal_app_views.log_in, name='log_in'),
    url(r'^registration/$', journal_app_views.registration, name='registration'),
    url(r'^personal/$', journal_app_views.personal, name='personal'),
    url(r'^$', journal_app_views.index, name='index'),
]
