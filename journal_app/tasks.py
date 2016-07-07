from celery.task import periodic_task
from celery.schedules import crontab
from celery import shared_task
from datetime import timedelta
from django.core.mail import send_mail
from .models import *

@periodic_task(run_every=timedelta(seconds=10))
def test():
    print("is works!")

@periodic_task(run_every=crontab(minute=0, hour=0))
def create_date():
    print("date creates!")
    users = User.objects.filter(is_active=True)
    print(users)
    for user in users:
        obj = Data.objects.filter(user=user).order_by('-data')[0]
        print(obj.goal)
        date = Data(user=user, data=datetime.datetime.now(), goal=obj.goal, result=0, sign=1)
        date.save()


@shared_task()
def send_email(username, email, activation_key):
    email_subject = 'Подтверждение регистрации'
    email_body = "Hey %s, thanks for signing up. To activate your account, click this link within \
                        48hours http://127.0.0.1:8000/confirm/%s" % (username, activation_key)

    send_mail(email_subject, email_body, 'twintipper@mail.ru', [email], fail_silently=False)
    print("email_send!")