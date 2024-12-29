from django.contrib import admin
from . import  models
# Register your models here.
@admin.register(models.Game)
class GameAdmin(admin.ModelAdmin):
    pass
@admin.register(models.GameRequest)
class GameReAdmin(admin.ModelAdmin):
    pass

@admin.register(models.Guess)
class GesAdmin(admin.ModelAdmin):
    pass