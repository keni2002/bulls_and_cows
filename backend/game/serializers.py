# game/serializers.py
from rest_framework import serializers
from .models import  Game, Guess, GameRequest
from authentication.models import Profile
from rest_framework import serializers
from django.contrib.auth.models import User





class UserProfileSerializer(serializers.ModelSerializer):
    games_won = serializers.IntegerField(source='profile.games_won', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'games_won']





class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['user', 'bio', 'photo', 'games_won']

class GameSerializer(serializers.ModelSerializer):
    player1_secret = serializers.CharField(write_only=True)
    player2_secret = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = Game
        fields = ['id', 'player1', 'player2', 'player1_secret', 'player2_secret', 'created_at', 'active', 'winner']

    def create(self, validated_data):
        player1_secret = validated_data.pop('player1_secret')
        player2_secret = validated_data.pop('player2_secret', None)
        game = Game.objects.create(**validated_data)
        game.player1_secret = player1_secret
        if player2_secret:
            game.player2_secret = player2_secret
        game.save()
        return game

class GuessSerializer(serializers.ModelSerializer):
    class Meta:
        model = Guess
        fields = ['id', 'game', 'player', 'guess', 'bulls', 'cows', 'created_at']

class GameRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameRequest
        fields = ['id', 'requester', 'requestee', 'created_at', 'accepted']

