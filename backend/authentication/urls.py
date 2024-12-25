from django.urls import re_path
from . import views
app_name = 'auths'
urlpatterns = [
    re_path('login/',views.login,name='login'),
    re_path('signup/',views.signup,name='signup'),
    re_path('test_token/',views.test_token,name='test_token'),

]
