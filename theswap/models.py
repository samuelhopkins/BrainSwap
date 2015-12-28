from django.db import models
from django.conf import settings
from django.db.models.signals import post_save
from django.contrib.auth.models import User
import datetime
# Create your models here.

class Prof(models.Model):
    name = models.CharField(max_length = 200, unique = True)

    def __repr__(self):
        return "{0}".format(self.name)

    def __str__(self):
        return "{0}".format(self.name)

    def __unicode__(self):
        return "{0}".format(self.name)

class Def(models.Model):
    name = models.CharField(max_length = 200, unique = True)

    def __repr__(self):
        return "{0}".format(self.name)

    def __str__(self):
        return "{0}".format(self.name)

    def __unicode__(self):
        return "{0}".format(self.name)

class Inbox(models.Model):
    user = models.OneToOneField(User)

    def __str__(self):
        return "{0}".format(self.user.username)

class Outbox(models.Model):
    user = models.OneToOneField(User)

    def __str__(self):
        return "{0}".format(self.user.username)

class Message(models.Model):
    read = models.BooleanField(default=False)
    created = models.DateTimeField(auto_now_add=True)
    content = models.TextField()
    recipient_name = models.CharField(max_length = 200, default="Sam")
    sender_name = models.CharField(max_length = 200, default="Sam")
    recipient = models.ForeignKey(Inbox,null=True, blank=True)
    sender = models.ForeignKey(Outbox,null=True, blank=True)

    def __str__(self):
        return "{0}".format(str(self.sender) +" to "+ str(self.recipient))

class Major(models.Model):
    name = models.CharField(max_length = 200, unique = True)

    def __repr__(self):
        return "{0}".format(self.name)

    def __str__(self):
        return "{0}".format(self.name)

    def __unicode__(self):
        return "{0}".format(self.name)

class Profile(models.Model):
    user = models.OneToOneField(User)
    summary = models.TextField()
    unread_messages = models.IntegerField(default=0)
    majors = models.ManyToManyField(Major)
    profs = models.ManyToManyField(Prof)
    defs = models.ManyToManyField(Def)

def create_user_profile(sender, instance, created, **kwargs):
    if created:
        profile, created = Profile.objects.get_or_create(user=instance)
        inbox, created = Inbox.objects.get_or_create(user=instance)
        outbox, created = Outbox.objects.get_or_create(user=instance)

post_save.connect(create_user_profile, sender=User)

