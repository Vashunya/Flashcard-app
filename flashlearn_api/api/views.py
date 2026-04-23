from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404

from .models import Deck, Flashcard, Category, StudyLog
from .serializers import (
    DeckSerializer, LoginSerializer, StatSummarySerializer,
    CategorySerializer, RegisterSerializer, FlashcardSerializer, StudyLogSerializer
)



@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = authenticate(
            username=serializer.validated_data['username'],
            password=serializer.validated_data['password']
        )
        if user:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({'token': token.key, 'username': user.username})
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        username = serializer.validated_data['username']
        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)
        user = User.objects.create_user(
            username=username,
            password=serializer.validated_data['password'],
            email=serializer.validated_data.get('email', '')
        )
        token, _ = Token.objects.get_or_create(user=user)
        return Response({'token': token.key, 'username': user.username}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    request.user.auth_token.delete()
    return Response({'message': 'Logged out'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_stats_view(request):
    data = {
        'total_decks': Deck.objects.filter(author=request.user).count(),
        'total_cards': Flashcard.objects.filter(deck__author=request.user).count(),
    }
    return Response(StatSummarySerializer(data).data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def category_list_view(request):
    return Response(CategorySerializer(Category.objects.all(), many=True).data)



class DeckListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        decks = Deck.objects.filter(author=request.user)
        return Response(DeckSerializer(decks, many=True).data)

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
        return Response(DeckSerializer(self.get_object(pk, request.user)).data)

    def put(self, request, pk):
        serializer = DeckSerializer(self.get_object(pk, request.user), data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        self.get_object(pk, request.user).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class FlashcardListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, deck_id):
        deck = get_object_or_404(Deck, pk=deck_id, author=request.user)
        return Response(FlashcardSerializer(deck.cards.all(), many=True).data)

    def post(self, request, deck_id):
        deck = get_object_or_404(Deck, pk=deck_id, author=request.user)
        data = {**request.data, 'deck': deck.id}
        serializer = FlashcardSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class FlashcardDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk, user):
        return get_object_or_404(Flashcard, pk=pk, deck__author=user)

    def put(self, request, pk):
        serializer = FlashcardSerializer(self.get_object(pk, request.user), data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        self.get_object(pk, request.user).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class StudyLogView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        deck = get_object_or_404(Deck, pk=request.data.get('deck'))
        log = StudyLog.objects.create(
            user=request.user,
            deck=deck,
            score=request.data.get('score', 0)
        )
        return Response(StudyLogSerializer(log).data, status=status.HTTP_201_CREATED)