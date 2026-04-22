from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login_view, name='login'),
    path('stats/', views.user_stats_view, name='stats'),
    path('decks/', views.DeckListView.as_view(), name='deck-list'),
    path('decks/<int:pk>/', views.DeckDetailView.as_view(), name='deck-detail'),
]