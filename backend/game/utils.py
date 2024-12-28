# game/utils.py
from cryptography.fernet import Fernet
from django.conf import settings

key = settings.CRYPT_SECRET_KEY  # Reemplaza 'your-secret-key' con tu propia clave

cipher_suite = Fernet(key)

def encrypt(text):
    return cipher_suite.encrypt(text.encode()).decode()

def decrypt(encrypted_text):
    return cipher_suite.decrypt(encrypted_text.encode()).decode()

def calculate_bulls_and_cows(secret, guess):
    bulls = sum(1 for s, g in zip(secret, guess) if s == g)
    cows = sum(1 for g in guess if g in secret) - bulls
    return bulls, cows

