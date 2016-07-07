from django.db import models
from django.contrib.auth.models import User, UserManager
import datetime


# Create your models here.
class UserProfile(models.Model):
    user = models.OneToOneField(User)
    activation_key = models.CharField(max_length=40, blank=True)
    key_expires = models.DateTimeField(default=datetime.date.today())

    def __str__(self):
        return self.user.username

    class Meta:
        verbose_name_plural = 'User profiles'


class Data(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='data_user')
    data = models.DateField(blank=True, null=True)
    goal = models.IntegerField(blank=True, null=True)
    result = models.IntegerField(blank=True, null=True)
    sign = models.BooleanField(blank=True, default=False)

    # def __str__(self):
    #     return self.data

    def new_user(self, user):
        self.user = user
        self.data = datetime.datetime.now()
        self.goal = 1000
        self.result = 0
        self.sign = 1
        self.save()


class Record(models.Model):
    description = models.CharField(max_length=1028)
    for_date = models.ForeignKey(Data, on_delete=models.CASCADE, related_name='records')
    amount = models.IntegerField(blank=True, null=True)