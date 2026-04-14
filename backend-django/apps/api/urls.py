from django.urls import path
from .views import LoginView, MeView, ProductListView, UploadView, PublicSettingsView, TestimonialListView

urlpatterns = [
    path('auth/login', LoginView.as_view(), name='login'),
    path('auth/me', MeView.as_view(), name='me'),
    path('apps/public/prod/public-settings/by-id/<str:id>', PublicSettingsView.as_view(), name='public_settings'),
    path('upload', UploadView.as_view(), name='upload'),
    path('entities/products', ProductListView.as_view(), name='products'),
    path('entities/testimonials', TestimonialListView.as_view(), name='testimonials'),
]
