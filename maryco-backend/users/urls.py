from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView, LogoutView, GoogleLogin
from drf_spectacular.utils import extend_schema, extend_schema_view
from django_rest_passwordreset.views import  ResetPasswordRequestToken, ResetPasswordConfirm, ResetPasswordValidateToken

auth_tag = ['Користувачі та Авторизація']
@extend_schema_view(post=extend_schema(tags=auth_tag))
class DecoratedLogin(TokenObtainPairView): pass

@extend_schema_view(post=extend_schema(tags=auth_tag))
class DecoratedRefresh(TokenRefreshView): pass


@extend_schema_view(post=extend_schema(tags=auth_tag))
class DecoratedResetRequest(ResetPasswordRequestToken): pass

@extend_schema_view(post=extend_schema(tags=auth_tag))
class DecoratedResetConfirm(ResetPasswordConfirm): pass

@extend_schema_view(post=extend_schema(tags=auth_tag))
class DecoratedResetValidate(ResetPasswordValidateToken): pass
@extend_schema_view(post=extend_schema(tags=auth_tag))
class DecoratedGoogle(GoogleLogin): pass

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth_register'),

    # Вхід та Токени
    path('login/', DecoratedLogin.as_view(), name='token_obtain_pair'),
    path('token/refresh/', DecoratedRefresh.as_view(), name='token_refresh'),
    path('password_reset/', DecoratedResetRequest.as_view(), name='reset-password-request'),
    path('password_reset/confirm/', DecoratedResetConfirm.as_view(), name='reset-password-confirm'),
    path('password_reset/validate_token/', DecoratedResetValidate.as_view(), name='reset-password-validate'),
    path('logout/', LogoutView.as_view(), name='auth_logout'),
    path('google/', DecoratedGoogle.as_view(), name='google_login'),
]