from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework import status
from .models import  Game, Guess, GameRequest
from authentication.models import Profile
from .serializers import ProfileSerializer, GameSerializer, GuessSerializer, GameRequestSerializer
from .utils import calculate_bulls_and_cows
from django.contrib.auth.models import User
from .serializers import UserProfileSerializer

class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]



class ProfileList(generics.ListAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

class GameListCreate(generics.ListCreateAPIView):
    queryset = Game.objects.all()
    serializer_class = GameSerializer
    permission_classes = [permissions.IsAuthenticated]

class GameRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Game.objects.all()
    serializer_class = GameSerializer
    permission_classes = [permissions.IsAuthenticated]

class GuessListCreate(generics.ListCreateAPIView):
    queryset = Guess.objects.all()
    serializer_class = GuessSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        data = request.data
        game_id = data.get('game')
        player = request.user
        guess = data.get('guess')

        # Validations
        if not game_id or not guess:
            return Response({'detail': 'Game ID and guess are required.'}, status=status.HTTP_400_BAD_REQUEST)
        if len(guess) != 4 or not guess.isdigit():
            return Response({'detail': 'Guess must be a 4-digit number.'}, status=status.HTTP_400_BAD_REQUEST)

        game = Game.objects.get(id=game_id)
        if player != game.player1 and player != game.player2:
            return Response({'detail': 'You are not a participant in this game.'}, status=status.HTTP_403_FORBIDDEN)

        if not game.player1_secret_encrypted or not game.player2_secret_encrypted:
            return Response({'detail': 'Both players must define their secret numbers before the game can start.'}, status=status.HTTP_400_BAD_REQUEST)

        # Determine the secret number
        secret = game.player1_secret if player == game.player2 else game.player2_secret

        # Calculate bulls and cows
        bulls, cows = calculate_bulls_and_cows(secret, guess)

        # Create the guess record
        guess_record = Guess.objects.create(game=game, player=player, guess=guess, bulls=bulls, cows=cows)

        # Check if the game is won
        if bulls == 4:
            game.active = False
            game.winner = player
            game.save()

            # Update player's profile
            profile = player.profile
            profile.games_won += 1
            profile.save()

        serializer = GuessSerializer(guess_record)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class GameRequestListCreate(generics.ListCreateAPIView):
    queryset = GameRequest.objects.all()
    serializer_class = GameRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

class GameRequestRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = GameRequest.objects.all()
    serializer_class = GameRequestSerializer
    permission_classes = [permissions.IsAuthenticated]
