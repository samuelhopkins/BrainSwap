from django.db import models
from django.conf import settings
from django.db.models.signals import post_save
from django.contrib.auth.models import User
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
    contacts = models.ManyToManyField(User, related_name='profile_contacts')
    summary = models.TextField()
    majors = models.ManyToManyField(Major)
    profs = models.ManyToManyField(Prof)
    defs = models.ManyToManyField(Def)

def create_user_profile(sender, instance, created, **kwargs):
    if created:
        profile, created = Profile.objects.get_or_create(user=instance)

post_save.connect(create_user_profile, sender=User)

