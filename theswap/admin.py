from django.contrib import admin
from theswap.models import Profile, Major, Prof, Def, Message, Inbox, Outbox
from django import forms
from theswap.forms import ProfileForm

admin.site.register(Major)
admin.site.register(Prof)
admin.site.register(Def)
admin.site.register(Message)
admin.site.register(Inbox)
admin.site.register(Outbox)
# Register your models here.
class ProfileAdmin(admin.ModelAdmin):
   form = ProfileForm
   list_display = ('user',)
admin.site.register(Profile, ProfileAdmin)