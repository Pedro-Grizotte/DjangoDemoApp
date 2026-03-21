from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.contas.models import Usuario
from apps.contas.serializers import UsuarioRegistroSerializer, UsuarioSerializer

# Views de contas
class RegistroView(generics.CreateAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioRegistroSerializer
    permission_classes = [permissions.AllowAny]

class EuView(generics.RetrieveAPIView):
    serializer_class = UsuarioSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        # validação credenciais e devolver token/JWT
        return Response({"detail": "Implementar login."}, status=501)    
