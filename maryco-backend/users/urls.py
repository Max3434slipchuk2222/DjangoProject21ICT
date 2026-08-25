from django.contrib.auth import get_user_model
from django.urls import path, include
from django_rest_passwordreset.models import ResetPasswordToken
from django_rest_passwordreset.signals import reset_password_token_created
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView, LogoutView, GoogleLogin, MeView, DecoratedPasswordChange
from drf_spectacular.utils import extend_schema, extend_schema_view
from django_rest_passwordreset.views import  ResetPasswordRequestToken, ResetPasswordConfirm, ResetPasswordValidateToken

User = get_user_model()
auth_tag = ['Користувачі та Авторизація']
@extend_schema_view(post=extend_schema(tags=auth_tag))
class DecoratedLogin(TokenObtainPairView): pass

@extend_schema_view(post=extend_schema(tags=auth_tag))
class DecoratedRefresh(TokenRefreshView): pass


@extend_schema_view(post=extend_schema(tags=auth_tag))
class DecoratedResetRequest(ResetPasswordRequestToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        if not serializer.is_valid():
            print("ПОМИЛКА ВАЛІДАЦІЇ СЕРІАЛІЗАТОРА:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data['email']
        print(f"Пошук користувача для email: {email}")

        users = User.objects.filter(email__iexact=email, is_active=True)
        if not users.exists():
            print("Користувача не знайдено в базі (повертаємо 200 OK для безпеки)")
            return Response({'status': 'OK'}, status=status.HTTP_200_OK)

        for user in users:

            ResetPasswordToken.objects.filter(user=user).delete()


            token = ResetPasswordToken.objects.create(
                user=user,
                user_agent=request.META.get('HTTP_USER_AGENT', ''),
                ip_address=request.META.get('REMOTE_ADDR', '')
            )


            reset_password_token_created.send(
                sender=self.__class__,
                instance=self,
                reset_password_token=token
            )

        return Response({'status': 'OK'}, status=status.HTTP_200_OK)
@extend_schema_view(post=extend_schema(tags=auth_tag))
class DecoratedResetConfirm(APIView):
    def post(self, request, *args, **kwargs):
        token_key = request.data.get('token')
        password = request.data.get('password')

        if not token_key or not password:
            return Response(
                {'detail': 'Поля token та password є обов\'язковими.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        token_obj = ResetPasswordToken.objects.filter(key=token_key).first()
        if not token_obj:
            return Response(
                {'detail': 'The OTP password entered is not valid. Please check and try again.'},
                status=status.HTTP_404_NOT_FOUND
            )

        user = token_obj.user
        user.set_password(password)
        user.save()
        token_obj.delete()
        print(f"Пароль успішно змінено для: {user.email}")

        return Response({'status': 'OK', 'message': 'Пароль успішно змінено.'}, status=status.HTTP_200_OK)
@extend_schema_view(post=extend_schema(tags=auth_tag))
class DecoratedResetValidate(ResetPasswordValidateToken): pass
@extend_schema_view(post=extend_schema(tags=auth_tag))
class DecoratedGoogle(GoogleLogin): pass

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('me/', MeView.as_view(), name='auth_me'),
    # Вхід та Токени
    path('login/', DecoratedLogin.as_view(), name='token_obtain_pair'),
    path('token/refresh/', DecoratedRefresh.as_view(), name='token_refresh'),
    path('password_reset/', DecoratedResetRequest.as_view(), name='reset-password-request'),
    path('password_reset/confirm/', DecoratedResetConfirm.as_view(), name='reset-password-confirm'),
    path('password_reset/validate_token/', DecoratedResetValidate.as_view(), name='reset-password-validate'),
    path('logout/', LogoutView.as_view(), name='auth_logout'),
    path('google/', DecoratedGoogle.as_view(), name='google_login'),
    path('password/change/', DecoratedPasswordChange.as_view(), name='auth_password_change'),
]