from django.conf.urls import include, url
from django.contrib import admin
from django.views.generic import TemplateView
from . import views


urlpatterns = [
    url(r'^accounts/profile', views.profile, name='profile'),
    url(r'^accounts/connect/', views.connect, name='connect'),
    url(r'^accounts/messages',views.messages, name='messages'),
    url(r'^accounts/message', views.message),
    url(r'^$', TemplateView.as_view(template_name="index.html"))
]
