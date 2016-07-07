from django.shortcuts import render, get_object_or_404
from django.contrib import *
from django.contrib.auth import *
from django.contrib.auth.views import *
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponseRedirect
from django.http import Http404
from django.http import HttpResponse, JsonResponse
import json
import os
import hashlib, datetime, random
from journal_app.models import *
from django.db.models import Count
from journal_app.forms import *
from django.contrib.auth.decorators import login_required
from django.core.mail import send_mail
from django.utils import timezone
from .tasks import send_email
# Create your views here.


def index(request):
    if request.user.is_authenticated():
        return HttpResponseRedirect('personal/')
    else:
        return render(request, 'index.html')


def personal(request):
    dates = Data.objects.filter(user=request.user)
    return render(request, 'personal.html', {'dates': dates})


def log_out(request):
    if request.user.is_authenticated():
        logout(request)
        return HttpResponseRedirect('/')
    else:
            raise Http404


def log_in(request):
    if request.method == "POST":
        if not request.user.is_authenticated():
            username = request.POST['username']
            password = request.POST['password']
            user = authenticate(username=username, password=password)
            if user is not None and user.is_active:
                login(request, user)
                return HttpResponseRedirect('/')
            else:
                return render(request, 'login.html', {'error_login': 1})
        else:
            return HttpResponseRedirect('/')
    else:
        return render(request, 'login.html')


def registration(request):
    if request.method == "POST":
        response_data = {}
        print(request.POST)
        username = request.POST.get('username')
        email = request.POST.get('email')
        password = request.POST.get('password')
        repeat_password = request.POST.get('repeat_password')
        if User.objects.filter(username=username):
            response_data['error'] = 'Username с таким именем уже существует.'
        elif User.objects.filter(email=email):
            response_data['error'] = 'Email уже существует.'
        else:
            response_data['status'] = 'ok'
            user = User.objects.create_user(username=username, email=email, password=password, is_active=False)
            user.save()
            salt = hashlib.sha1(str(random.random()).encode('utf-8')).hexdigest()[:5]
            activation_key = hashlib.sha1((salt+email).encode('utf-8')).hexdigest()
            key_expires = datetime.datetime.today() + datetime.timedelta(2)

            # Create and save user profile
            new_profile = UserProfile(user=user, activation_key=activation_key, key_expires=key_expires)
            new_profile.save()
            send_email(username, email, activation_key)
            # Send email with activation key
            # email_subject = 'Подтверждение регистрации'
            # email_body = "Hey %s, thanks for signing up. To activate your account, click this link within \
            #                     48hours http://127.0.0.1:8000/confirm/%s" % (username, activation_key)
            #
            # send_mail(email_subject, email_body, 'twintipper@mail.ru', [email], fail_silently=False)
        return JsonResponse(response_data)
    else:
        return render(request, 'registration.html')


def register_confirm(request, act):
    if request.user.is_authenticated():
        HttpResponseRedirect('/personal')

    # check if there is UserProfile which matches the activation key (if not then display 404)
    user_profile = get_object_or_404(UserProfile, activation_key=act)

    # check if the activation key has expired, if it hase then render confirm_expired.html
    if user_profile.key_expires <= timezone.now():
        return render(request, 'confirm_expired.html')
    # if the key hasn't expired save user and set him as active and render some template to confirm activation
    user = user_profile.user
    user.is_active = True
    user.save()
    date = Data()
    Data.new_user(date, user)
    return render(request, 'confirm.html')


def add_record_ajax(request):
    if request.method == "POST":
        response_data = {}
        print(request.POST)
        pk = request.POST.get('date_pk')
        score = int(request.POST.get('score'))
        descrip = request.POST.get('description')
        if pk:
            data = Data.objects.get(pk=pk)
            data.result = int(data.result) + score
            if int(data.goal) - int(data.result) < 0:
                data.sign = False
            else:
                data.sign = True
            data.save()
            record = Record(description=descrip, for_date=data, amount=score)
            record.save()
            response_data['result'] = abs(int(data.goal) - int(data.result))
            response_data['sign'] = data.sign
            response_data['pk'] = record.pk
            response_data['status'] = 'ok'
            return JsonResponse(response_data)
        else:
            response_data['status'] = 'bad'
            return JsonResponse(response_data)
    else:
        raise Http404


def del_record_ajax(request):
    if request.method == "POST":
        response_data = {}
        print(request.POST)
        pk = request.POST.get('pk')
        if pk:
            record = Record.objects.get(pk=pk)
            print(record.amount)
            for_date = record.for_date
            data = Data.objects.get(pk=for_date.pk)
            print(data.result)
            data.result = int(data.result) - int(record.amount)
            if data.goal - data.result < 0:
                data.sign = False
            else:
                data.sign = True
            data.save()
            record.delete()
            response_data['status'] = 'ok'
            response_data['result'] = abs(data.goal - data.result)
            response_data['sign'] = data.sign
            return JsonResponse(response_data)
        else:
            response_data['status'] = 'bad'
            return JsonResponse(response_data)
    else:
        raise Http404


def change_goal_ajax(request):
    if request.method == "POST":
        response_data = {}
        print(request.POST)
        pk = request.POST.get('pk')
        if pk:
            date = Data.objects.get(pk=pk)
            date.goal = request.POST.get('val')
            if int(date.goal) - int(date.result) < 0:
                date.sign = False
            else:
                date.sign = True
            date.save()
            response_data['status'] = 'ok'
            response_data['result'] = abs(int(date.goal) - int(date.result))
            response_data['sign'] = date.sign
            response_data['val'] = date.goal
            return JsonResponse(response_data)
        else:
            response_data['status'] = 'bad'
            return JsonResponse(response_data)
    else:
        raise Http404


def change_record_ajax(request):
    if request.method == "POST":
        response_data = {}
        print(request.POST)
        pk = request.POST.get('pk')
        if pk:
            record = Record.objects.get(pk=pk)
            date = Data.objects.get(pk=record.for_date.pk)
            date.result = int(date.result) - int(record.amount)
            record.amount = request.POST.get('score')
            record.description = request.POST.get('desc')
            record.save()
            date.result = int(date.result) + int(record.amount)
            if int(date.goal) - int(date.result) < 0:
                date.sign = False
            else:
                date.sign = True
            date.save()
            response_data['status'] = 'ok'
            response_data['result'] = abs(int(date.goal) - int(date.result))
            response_data['sign'] = date.sign
            return JsonResponse(response_data)
        else:
            response_data['status'] = 'bad'
            return JsonResponse(response_data)
    else:
        raise Http404