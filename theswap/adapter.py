from allauth.account.adapter import DefaultAccountAdapter
from django.conf import settings
from django.shortcuts import resolve_url
from datetime import datetime, timedelta

class AccountAdapter(DefaultAccountAdapter):
    def get_login_redirect_url(self, request):
        threshold = 90
        if(request.user.last_login - request.user.date_joined).seconds < threshold:
            url = '/accounts/profile'
        else:
            url = settings.LOGIN_REDIRECT_URL
        return resolve_url(url)