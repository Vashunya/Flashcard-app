from django.urls import path
from . import views

urlpatterns = [
    path('login/',              views.login_view,                name='login'),
    path('register/',           views.register_view,             name='register'),
    path('logout/',             views.logout_view,               name='logout'),
    path('stats/',              views.user_stats_view,           name='stats'),
    path('categories/',         views.category_list_view,        name='categories'),
    path('decks/',              views.DeckListView.as_view(),    name='deck-list'),
    path('decks/<int:pk>/',     views.DeckDetailView.as_view(),  name='deck-detail'),
    path('decks/<int:deck_id>/cards/', views.FlashcardListView.as_view(),   name='flashcard-list'),
    path('cards/<int:pk>/',     views.FlashcardDetailView.as_view(),        name='flashcard-detail'),
    path('study-logs/',         views.StudyLogView.as_view(),               name='study-log'),
]