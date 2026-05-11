from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView
from dj_rest_auth.views import PasswordChangeView
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import RegisterSerializer, UserSerializer
from .models import CustomUser
from drf_spectacular.utils import extend_schema, extend_schema_view


@extend_schema(tags=['Користувачі та Авторизація'])
class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

@extend_schema_view(post=extend_schema(tags=['Користувачі та Авторизація']))
class DecoratedPasswordChange(PasswordChangeView):
    pass

@extend_schema_view(
    get=extend_schema(tags=['Користувачі та Авторизація'], summary="Отримати профіль"),
    patch=extend_schema(tags=['Користувачі та Авторизація'], summary="Оновити профіль (ім'я/прізвище)"),
    put=extend_schema(tags=['Користувачі та Авторизація'], summary="Оновити профіль повністю")
)
class MeView(generics.RetrieveUpdateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


@extend_schema(tags=['Користувачі та Авторизація'])
class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return Response(
                {"error": "Refresh token обов'язковий"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(
                {"message": "Успішно вийшли з системи"},
                status=status.HTTP_205_RESET_CONTENT,
            )
        except Exception:
            return Response(
                {"error": "Недійсний або вже використаний токен"},
                status=status.HTTP_400_BAD_REQUEST,
            )


class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    callback_url = "http://localhost:5173"
    client_class = OAuth2Client