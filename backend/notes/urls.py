from django.urls import path,include
from . import views

app_name = 'notes'
urlpatterns = [
    path('notes/',views.NoteListCreate.as_view(),name='list_or_create'),
    path('notes/delete/<int:pk>/',views.NoteDelete.as_view(),name='delete'),
]
