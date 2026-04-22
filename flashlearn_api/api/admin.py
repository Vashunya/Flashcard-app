from django.contrib import admin
from .models import Category, Deck, Flashcard, StudyLog

admin.site.register(Category)
admin.site.register(Deck)
admin.site.register(Flashcard)
admin.site.register(StudyLog)