from django.core.management.base import BaseCommand

# Python
from random import randint

from journal_app.models import *


def create_user(start, stop):
    for x in range(start, stop, 1):
        try:
            username = 'user_'+str(x)
            password = '12345'
            email = str(x)+'@gmail.com'
            user = User.objects.create_user(username=username, email=email, password=password)
            user.save()
        except Exception as e:
            print(e)
    print('users create!')


def create_data(start, stop):
    for x in range(start, stop, 1):
        try:
            user = User.objects.get(pk=9)
            goal = 1000
            date = datetime.date(2016, 5, x)
            user_date = Data(user=user, data=date, goal=goal)
            user_date.save()
        except Exception as e:
            print(e)
    print('date create!')


def create_record(start, stop):
    for y in range(1, 3, 1):
        date = Data.objects.get(pk=y)
        for x in range(start, stop, 1):
            try:
                descrip = 'description for day:'+str(y)+' position:'+str(x)
                ammount = randint(0, 601)
                for_date = date
                record = Record(description=descrip, amount=ammount, for_date=for_date)
                record.save()
            except Exception as e:
                print(e)
    print('date create!')


class Command(BaseCommand):
    help = 'Initialize database'

    def handle(self, *args, **options):
        #create_user(1, 4)
        #create_data(1, 5)
        create_record(1, 6)
        self.stdout.write('Successfully filled database!')