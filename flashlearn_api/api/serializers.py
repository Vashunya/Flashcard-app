from rest_framework import serializers
from .models import Category, Deck, Flashcard

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

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

class StatSummarySerializer(serializers.Serializer):
    total_decks = serializers.IntegerField()
    total_cards = serializers.IntegerField()