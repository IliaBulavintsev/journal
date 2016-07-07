from django import template
from journal_app.models import *
register = template.Library()

@register.filter(name='odd')
def rang(mod):
    new = abs(mod.result - mod.goal)
    return new