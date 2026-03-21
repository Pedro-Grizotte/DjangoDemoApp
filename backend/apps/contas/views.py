from rest_framework import generics, permissions, status
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.contas.models import Usuario
from apps.contas.serializers import UsuarioRegistroSerializer, UsuarioSerializer, LoginSerializer

# Views de contas
class RegistroView(generics.CreateAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioRegistroSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)

        return Response({
                "token": token.key,
                "user": UsuarioSerializer(user).data,
            },
            status=status.HTTP_201_CREATED, 
        )

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(
            data=request.data,
            context={
                "request": request
            },
        )   
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        token, _ = Token.objects.get_or_create(user=user)

        return Response({
                "token": token.key,
                "user": UsuarioSerializer(user).data,
            },
            status=status.HTTP_200_OK,
        )
    
class EuView(generics.RetrieveAPIView):
    serializer_class = UsuarioSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user
