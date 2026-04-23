from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Category, Deck, Flashcard, StudyLog


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']


class FlashcardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Flashcard
        fields = '__all__'


class DeckSerializer(serializers.ModelSerializer):
    cards = FlashcardSerializer(many=True, read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Deck
        fields = ['id', 'title', 'description', 'category', 'category_name', 'author', 'cards']
        read_only_fields = ['author']


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)


class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    email = serializers.EmailField(required=False, default='')


class StatSummarySerializer(serializers.Serializer):
    total_decks = serializers.IntegerField()
    total_cards = serializers.IntegerField()


class StudyLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudyLog
        fields = '__all__'
        read_only_fields = ['user', 'watched_at']