from django.db import models

# Create your models here.
from django.db import models
from django.conf import settings
from django.utils import timezone
from .utils import encrypt, decrypt


class Game(models.Model):
    player1 = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='player1_games', on_delete=models.CASCADE)
    player2 = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='player2_games', on_delete=models.CASCADE, null=True, blank=True)
    player1_secret_encrypted = models.CharField(max_length=128)
    player2_secret_encrypted = models.CharField(max_length=128, null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    active = models.BooleanField(default=True)
    winner = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='won_games', on_delete=models.SET_NULL, null=True, blank=True)

    @property
    def player1_secret(self):
        return decrypt(self.player1_secret_encrypted)

    @player1_secret.setter
    def player1_secret(self, value):
        self.player1_secret_encrypted = encrypt(value)
        self.save()

    @property
    def player2_secret(self):
        return decrypt(self.player2_secret_encrypted)

    @player2_secret.setter
    def player2_secret(self, value):
        self.player2_secret_encrypted = encrypt(value)
        self.save()

class Guess(models.Model):
    game = models.ForeignKey(Game, related_name='guesses', on_delete=models.CASCADE)
    player = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    guess = models.CharField(max_length=4)
    bulls = models.PositiveIntegerField()
    cows = models.PositiveIntegerField()
    created_at = models.DateTimeField(default=timezone.now)

class GameRequest(models.Model):
    requester = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='sent_requests', on_delete=models.CASCADE)
    requestee = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='received_requests', on_delete=models.CASCADE)
    created_at = models.DateTimeField(default=timezone.now)
    accepted = models.BooleanField(default=False)
