from django.urls import path
from apps.contas.views import RegistroView, EuView, LoginView

urlpatterns = [
    path("registro/", RegistroView.as_view(), name="conta-registro"),
    path("login/", LoginView.as_view(), name="conta-login"),
    path("eu/", EuView.as_view(), name="conta-eu"),
]
