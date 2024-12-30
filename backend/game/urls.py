from django.urls import path
from . import views
app_name = 'game'
urlpatterns = [
    path('profiles/', views.ProfileList.as_view(), name='profile-list'),
    path('games/', views.GameListCreate.as_view(), name='game-list-create'),
    path('games/<int:pk>/', views.GameRetrieveUpdateDestroy.as_view(), name='game-detail'),
    path('guesses/', views.GuessListCreate.as_view(), name='guess-list-create'),
    path('games/<int:game_id>/guesses/', views.GuessListCreate.as_view(), name='game-guesses'),
    path('game-requests/', views.GameRequestListCreateView.as_view(), name='game-request-list-create'),
    path('game-requests/<int:pk>/', views.GameRequestRetrieveUpdateDestroy.as_view(), name='game-request-detail'),
    path('users/', views.UserListView.as_view(), name='user-list'),
]
