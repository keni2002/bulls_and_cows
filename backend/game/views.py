from django.db import IntegrityError
from django.db.models import QuerySet
from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework import status
from .models import  Game, Guess, GameRequest
from authentication.models import Profile
from .serializers import ProfileSerializer, GameSerializer, GuessSerializer, GameRequestSerializer
from .utils import calculate_bulls_and_cows
from django.contrib.auth.models import User
from .serializers import UserProfileSerializer
from rest_framework.exceptions import ValidationError
class UserListView(generics.ListAPIView):
    queryset = User.objects.filter(is_staff=False).order_by('-profile__games_won')
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]


class UserDetailView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user  # Solo permitir la edición del perfil del usuario autenticado

    def update(self, request, *args, **kwargs):
        try:
            return super().update(request, *args, **kwargs)
        except ValidationError as e:
            return Response({"email": ["Este correo electrónico ya está en uso."]}, status=status.HTTP_400_BAD_REQUEST)


class ProfileList(generics.ListAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

class GameListCreate(generics.ListCreateAPIView):
    queryset = Game.objects.all()
    serializer_class = GameSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['exclude_secrets'] = True
        return context

    def get_queryset(self):
        queryset = []
        for game in Game.objects.all().order_by('-created_at'):
            if game.gamerequest.accepted:
                queryset.append(game)
        return queryset

class GameRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Game.objects.all()
    serializer_class = GameSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['exclude_secrets'] = True
        return context

    def get_object(self):
        game = super().get_object()

        if self.request.user != game.player1 and self.request.user != game.player2:
            raise permissions.PermissionDenied(detail="You are not a participant in this game.")
        return game




class GuessListCreate(generics.ListCreateAPIView):
    serializer_class = GuessSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        game_id = self.kwargs.get('game_id')
        if not game_id:
            return Guess.objects.none()
        game = Game.objects.get(id=game_id)
        if user != game.player1 and user != game.player2:
            raise permissions.PermissionDenied(detail="You are not a participant in this game.")
        return Guess.objects.filter(game=game).order_by('-created_at')


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
        game_request = None
        try:
            game_request = GameRequest.objects.get(game=game)
        except:
            game_request = None

        if game_request:
            if not game_request.initiated:
                return Response({'detail': 'Espera a que el Solicitante entre.'}, status=status.HTTP_400_BAD_REQUEST)
            else:
                pass
        # if game.winner:
        #     return Response({'detail': 'El juego ya finalizó'}, status=status.HTTP_403_FORBIDDEN)
        if player != game.player1 and player != game.player2:
            return Response({'detail': 'No perteneces a este juego'}, status=status.HTTP_403_FORBIDDEN)

        if not game.player1_secret_encrypted or not game.player2_secret_encrypted:
            return Response({'detail': 'Para iniciar ambos deben elegir su número secreto'}, status=status.HTTP_400_BAD_REQUEST)

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



class GameRequestListCreateView(generics.ListCreateAPIView):
    serializer_class = GameRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return GameRequest.objects.filter(requester=user) | GameRequest.objects.filter(requestee=user).order_by(
            '-created_at')

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['exclude_secrets'] = True
        return context

    def perform_create(self, serializer):
        player1_secret = self.request.data.get('player1_secret')
        requestee = self.request.data.get('requestee')

        # Crear los datos del juego utilizando el serializador
        game_data = {
            'player1': self.request.user.id,
            'player1_secret': player1_secret,
            'player2': requestee
        }

        # Usar el serializador para crear el juego
        game_serializer = GameSerializer(data=game_data)
        game_serializer.is_valid(raise_exception=True)
        game = game_serializer.save()

        serializer.save(requester=self.request.user, game=game)



class GameRequestRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = GameRequest.objects.all()
    serializer_class = GameRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()

        # Permitir que tanto el solicitante como el destinatario puedan eliminar la solicitud
        if instance.requester != request.user and instance.requestee != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)

        # Verificar si la solicitud no ha sido iniciada
        if instance.initiated:
            raise PermissionDenied("No se puede eliminar una solicitud iniciada.")

        # Obtener el juego asociado y eliminarlo
        game = Game.objects.filter(gamerequest=instance).first()
        if game:
            game.delete()

        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def perform_update(self, serializer):
        instance = serializer.save()
        if instance.accepted:
            player2_secret = self.request.data.get('player2_secret')
            if player2_secret:
                game_data = {
                    'player2': self.request.user.id,
                    'player2_secret': player2_secret,
                    'active': True
                }
                game_serializer = GameSerializer(instance.game, data=game_data, partial=True)
                game_serializer.is_valid(raise_exception=True)
                game_serializer.save()
                instance.initiated = False
                instance.save()
        return Response({"game_id": instance.game.id}, status=status.HTTP_200_OK)

    #sobrescribo para evitar que el contrario valide el juego con initated = true
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        partial = kwargs.pop('partial', False)
        data = request.data.copy()
        # Verifica si el usuario actual es el requester o el requestee
        if request.user == instance.requester:
            # Requester puede actualizar cualquier campo
            serializer = self.get_serializer(instance, data=data, partial=partial)
        elif request.user == instance.requestee:
            # Requestee solo puede actualizar accepted y player2_secret
            allowed_fields = ['accepted', 'player2_secret']
            data = {field: value for field, value in data.items() if field in allowed_fields}
            serializer = self.get_serializer(instance, data=data, partial=partial)
        else:
            raise PermissionDenied("No tienes permiso para realizar esta acción.")
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

