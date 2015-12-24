from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from theswap.models import Profile, Major, Prof, Def
from django.http import HttpResponseRedirect, HttpResponse
from .forms import ProfileForm
from collections import defaultdict
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.core.mail.message import EmailMessage
from django.template.loader import render_to_string
from django.core import mail
import json
# Create your views here.

@login_required
def profile(request):
    if request.method == 'POST':
        profileForm = ProfileForm(request.POST, instance= request.user.profile)
        if profileForm.is_valid():
            profile = profileForm.save()
            profile.save()
        return HttpResponseRedirect('/accounts/connect/')
    else:
        initial_text = "Tell us something about yourself"
        if len(request.user.profile.summary)>2 and request.user.profile.summary != initial_text:
            userProfileForm = ProfileForm(instance = request.user.profile)
        else:
            userProfileForm = ProfileForm(instance = request.user.profile)
        return render(request, 'profile.html', {"form" : userProfileForm})

@login_required
def get_recommended(request):
    profs = request.user.profile.profs.all()
    profs = [prof.name for prof in profs]
    defs = request.user.profile.defs.all()
    defs = [defi.name for defi in defs]
    all_users = User.objects.exclude(id=request.user.id).filter(is_staff = False)
    students_ret = defaultdict(int)
    for user in all_users:
        prof_dict = dict.fromkeys(profs, 0)
        def_dict = dict.fromkeys(defs, 0)
        for defi in user.profile.defs.all():
            if defi.name in prof_dict.keys():
                prof_dict[defi.name] = 1
        running_total = sum(prof_dict.values())
        if running_total > 0:
            students_ret[user.id] = running_total
        for prof in user.profile.profs.all():
            if prof.name in def_dict.keys():
                def_dict[prof.name] = 1
        running_total = sum(def_dict.values())
        if running_total > 0:
            students_ret[user.id] += running_total
    folks = sorted(students_ret.items(), key = lambda x: x[1], reverse=True)
    matches = [User.objects.get(id=tup[0]) for tup in folks]
    print matches
    return matches

@login_required
def messages(request):
    return render(request, 'messages.html', {})

@login_required
def message(request):
    if request.method == 'POST':
        body = str(request.POST['body'])
        print request.POST
        user_id = request.POST['id']
        subject ="New message from BrainSwap"
        recipient = User.objects.get(id=user_id)
        print "In message"
        print (recipient in request.user.profile.contacts.all())
        if recipient in request.user.profile.contacts.all():
            context = {'success': True, 'message' : 'You have already contacted this user'}
            return HttpResponse(json.dumps(context))
        else:
            request.user.profile.contacts.add(recipient)
        msg_plain = request.user.username+" would like to connect!\n\n"+body+"\n\nRespond to this email to contact them directly."
        email = mail.EmailMessage(subject,msg_plain,'sahopkins93@gmail.com',[recipient.email], [], [recipient.email])
        try:
            connection = mail.get_connection()
            connection.open()
            connection.send_messages([email])
            connection.close()
            context = {'success': True, 'message' : 'Your message has been successfully sent!'}
            return HttpResponse(json.dumps(context))
        except:
            context = {'success': False, 'message' : 'Error sending message'}
            return HttpResponse(json.dumps(context))

@login_required
def connect(request):
    if request.method == 'GET':
        profs = Prof.objects.all()
        defs = Def.objects.all()
        majors = Major.objects.all()
        matches = get_recommended(request)
        return render(request, 'connect.html', {'profs' : profs, 'defs' : defs, 'majors' : majors, 'matches' : matches})
    elif request.method == 'POST':
        isGet = request.POST['isGet']
        folks = ["No results matched your search"]
        students_ret = defaultdict(int)
        users = User.objects.exclude(id=request.user.id).filter(is_staff = False)
        if (isGet == 'true'):
            profs = map(int,request.POST.getlist('subjects[]'))
            majors = map(int, request.POST.getlist('majors[]'))
            if profs != []:
                for user in users:
                    prof_dict = dict.fromkeys(profs, 0)
                    for prof in user.profile.profs.all():
                        if prof_dict.has_key(prof.id):
                            prof_dict[prof.id] = 1
                    running_total = sum(prof_dict.values())
                    if running_total > 0:
                        students_ret[user.id] = running_total
                if majors != []:
                    for user in users:
                        majors_dict = dict.fromkeys(majors, 0)
                        for major in user.profile.majors.all():
                            if majors_dict.has_key(major.id):
                                majors_dict[major.id] = 1
                        running_total = sum(majors_dict.values())
                        if running_total > 0:
                            students_ret[user.id] += running_total
            elif majors != []:
                for user in users:
                        majors_dict = dict.fromkeys(majors, 0)
                        for major in user.profile.majors.all():
                            if major.id in majors_dict:
                                majors_dict[major.id] = 1
                        running_total = sum(majors_dict.values())
                        if running_total > 0:
                            students_ret[user.id] += running_total
        else:
            defs = map(int,request.POST.getlist('subjects[]'))
            majors = map(int,request.POST.getlist('majors[]'))
            if defs != []:
                for user in users:
                    def_dict = dict.fromkeys(defs, 0)
                    for defi in user.profile.defs.all():
                        if def_dict.has_key(defi.id):
                            def_dict[defi.id] = 1
                    running_total = sum(def_dict.values())
                    if running_total > 0:
                        students_ret[user.id] = running_total
                if majors != []:
                    for user in users:
                        majors_dict = dict.fromkeys(majors, 0)
                        for major in user.profile.majors.all():
                            if majors_dict.has_key(major.id):
                                majors_dict[major.id] = 1
                        running_total = sum(majors_dict.values())
                        if running_total > 0:
                            students_ret[user.id] += running_total
            elif majors != []:
                for user in users:
                        majors_dict = dict.fromkeys(majors, 0)
                        for major in user.profile.majors.all():
                            if major.id in majors_dict:
                                majors_dict[major.id] = 1
                        running_total = sum(majors_dict.values())
                        if running_total > 0:
                            students_ret[user.id] += running_total

        folks = sorted(students_ret.items(), key = lambda x: x[1], reverse=True)
        folks = [User.objects.get(id=tup[0]) for tup in folks]
        students = []
        for folk in folks:
            students.append({'name' : folk.username, 'summary' : folk.profile.summary, 'id' : folk.id})
        return HttpResponse(json.dumps({'folks': students}))




