from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404

from .models import Deck, Flashcard
from .serializers import DeckSerializer, LoginSerializer, StatSummarySerializer

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']
        user = authenticate(username=username, password=password)
        if user:
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key})
        return Response({'error': 'Invalid Credentials'}, status=status.HTTP_400_BAD_REQUEST)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_stats_view(request):
    decks_count = Deck.objects.filter(author=request.user).count()
    cards_count = Flashcard.objects.filter(deck__author=request.user).count()
    serializer = StatSummarySerializer({'total_decks': decks_count, 'total_cards': cards_count})
    return Response(serializer.data)

class DeckListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        decks = Deck.objects.filter(author=request.user)
        serializer = DeckSerializer(decks, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = DeckSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(author=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DeckDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk, user):
        return get_object_or_404(Deck, pk=pk, author=user)

    def get(self, request, pk):
        deck = self.get_object(pk, request.user)
        serializer = DeckSerializer(deck)
        return Response(serializer.data)

    def put(self, request, pk):
        deck = self.get_object(pk, request.user)
        serializer = DeckSerializer(deck, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        deck = self.get_object(pk, request.user)
        deck.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)