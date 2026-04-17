from django.urls import path
<<<<<<< HEAD
from .views import (
    LoginView, MeView, ProductListView, UploadView,
    TestimonialListView, TenantListView, RegisterView, VerifyEmailView, ResendVerificationView,
    InviteView, ForgotPasswordView, ResetPasswordView, UserPromoteView
)

urlpatterns = [
    # Auth endpoints
    path('auth/login', LoginView.as_view(), name='login'),
    path('auth/me', MeView.as_view(), name='me'),
    path('auth/register', RegisterView.as_view(), name='register'),
    path('auth/verify-email', VerifyEmailView.as_view(), name='verify_email'),
    path('auth/resend-verification', ResendVerificationView.as_view(), name='resend_verification'),
    path('auth/forgot-password', ForgotPasswordView.as_view(), name='forgot_password'),
    path('auth/reset-password', ResetPasswordView.as_view(), name='reset_password'),
    path('auth/invite', InviteView.as_view(), name='invite'),

    # Public endpoints
    path('upload', UploadView.as_view(), name='upload'),

    # Entity endpoints (legacy support, now generic)
    path('entities/products', ProductListView.as_view(), name='products'),
    path('entities/testimonials', TestimonialListView.as_view(), name='testimonials'),
    path('entities/tenants', TenantListView.as_view(), name='tenants'),

    # User promotion
    path('users/<uuid:user_id>/promote', UserPromoteView.as_view(), name='promote_user'),
=======
from .views import LoginView, MeView, ProductListView, UploadView, PublicSettingsView, TestimonialListView

urlpatterns = [
    path('auth/login', LoginView.as_view(), name='login'),
    path('auth/me', MeView.as_view(), name='me'),
    path('apps/public/prod/public-settings/by-id/<str:id>', PublicSettingsView.as_view(), name='public_settings'),
    path('upload', UploadView.as_view(), name='upload'),
    path('entities/products', ProductListView.as_view(), name='products'),
    path('entities/testimonials', TestimonialListView.as_view(), name='testimonials'),
>>>>>>> 178c6066442bcf30bce830b8deda6700021cb4a3
]
