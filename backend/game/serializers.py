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
        fields = ['id', 'first_name', 'last_name', 'username', 'email', 'games_won']





class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['user', 'bio', 'photo', 'games_won']


from rest_framework import serializers
from .models import Game
from .utils import encrypt, decrypt

from rest_framework import serializers
from .models import Game
from .utils import encrypt, decrypt


class GameSerializer(serializers.ModelSerializer):
    player1_secret = serializers.CharField(write_only=True)
    player2_secret = serializers.CharField(write_only=True, required=False, allow_blank=True)
    opponent_name = serializers.SerializerMethodField()

    class Meta:
        model = Game
        fields = ['id', 'player1', 'player2', 'player1_secret', 'player2_secret', 'created_at', 'active', 'winner',
                  'opponent_name']

    def create(self, validated_data):
        player1_secret = validated_data.pop('player1_secret')
        player2_secret = validated_data.pop('player2_secret', None)
        validated_data['player1_secret_encrypted'] = encrypt(player1_secret)
        if player2_secret:
            validated_data['player2_secret_encrypted'] = encrypt(player2_secret)
        game = Game.objects.create(**validated_data)
        return game

    def update(self, instance, validated_data):
        player1_secret = validated_data.pop('player1_secret', None)
        player2_secret = validated_data.pop('player2_secret', None)

        if player1_secret:
            instance.player1_secret_encrypted = encrypt(player1_secret)
        if player2_secret:
            instance.player2_secret_encrypted = encrypt(player2_secret)

        instance.active = validated_data.get('active', instance.active)
        instance.winner = validated_data.get('winner', instance.winner)
        instance.save()
        return instance

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        representation['player1_secret'] = decrypt(instance.player1_secret_encrypted)
        if instance.player2_secret_encrypted:
            representation['player2_secret'] = decrypt(instance.player2_secret_encrypted)
        else:
            representation['player2_secret'] = None

        if self.context.get('request').user == instance.player1:
            representation['user_secret'] = decrypt(instance.player1_secret_encrypted)
        elif self.context.get('request').user == instance.player2:
            representation['user_secret'] = decrypt(instance.player2_secret_encrypted)

        if self.context.get('exclude_secrets'):
            representation.pop('player1_secret', None)
            representation.pop('player2_secret', None)


        return representation

    def get_opponent_name(self, obj):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            user = request.user
            opponent = obj.player2 if user == obj.player1 else obj.player1
            return opponent.get_full_name() or opponent.username
        return None


class GuessSerializer(serializers.ModelSerializer):
    class Meta:
        model = Guess
        fields = ['id', 'game', 'player', 'guess', 'bulls', 'cows', 'created_at']

class GameRequestSerializer(serializers.ModelSerializer):
    game = GameSerializer(read_only=True)
    class Meta:
        model = GameRequest
        fields = ['id', 'requester', 'requestee', 'game', 'created_at', 'accepted', 'initiated']

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        if self.context.get('exclude_secrets'):
            if 'game' in representation:
                representation['game'].pop('player1_secret', None)
                representation['game'].pop('player2_secret', None)
        return representation


