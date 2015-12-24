from django.forms import ModelForm
from theswap.models import Profile, Major, Prof, Def
from django import forms

class ProfileForm(ModelForm):
    class Meta:
        model = Profile
        fields = ['summary','majors', 'profs', 'defs']
        labels = {
        'profs': 'Proficient Classes',
        'defs' : 'Deficient Classes',
        }
        majors_list = ()
        for major in Major.objects.all():
            majors_list += (major, "sam")

        widgets = {
             'majors' : forms.SelectMultiple(attrs={"class": "ui fluid search dropdown"}),
             'profs' : forms.SelectMultiple(choices=Prof.objects.all(), attrs={"class": "ui fluid search dropdown"}),
             'defs' : forms.SelectMultiple(choices=Def.objects.all(), attrs={"class": "ui fluid search dropdown"}),
            'summary' : forms.Textarea(attrs={'placeholder' : 'Tell us about yourself! Year in school, work/tutoring experience, classes you have taken etc...',})
        }
