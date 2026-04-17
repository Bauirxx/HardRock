from rest_framework import status, views, viewsets, permissions, response
from rest_framework.decorators import action
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.conf import settings
from django.utils import timezone
from datetime import timedelta
import random
import secrets

from .models import (
    CustomUser, Product, Tenant, Client, Order, Payment,
    Lead, Service, Testimonial, PasswordResetToken
)
from .serializers import (
    CustomUserSerializer, ProductSerializer, TenantSerializer,
    ClientSerializer, OrderSerializer, LeadSerializer, ServiceSerializer,
    PaymentSerializer, TestimonialSerializer, LoginSerializer
)
from .email_utils import (
    send_verification_email, send_welcome_email,
    send_password_reset_email, send_invite_email
)


# In-memory storage for registration/invite (temporary, pending persistence)
_PENDING_REGS = {}
_INVITE_TOKENS = {}


def _new_code():
    return f"{random.randint(100000, 999999)}"


class LoginView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = authenticate(
                email=serializer.validated_data['email'],
                password=serializer.validated_data['password']
            )
            if user:
                refresh = RefreshToken.for_user(user)
                return response.Response({
                    'token': str(refresh.access_token),
                    'user': CustomUserSerializer(user).data
                })
            return response.Response(
                {'error': 'Credenciais inválidas'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MeView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        if not request.user.is_authenticated:
            return response.Response(
                {'error': 'Não autenticado'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        serializer = CustomUserSerializer(request.user)
        return response.Response(serializer.data)

    def patch(self, request):
        if not request.user.is_authenticated:
            return response.Response(
                {'error': 'Não autenticado'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        user = request.user
        serializer = CustomUserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return response.Response(serializer.data)
        return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RegisterView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = (request.data.get('email') or '').strip().lower()
        password = request.data.get('password') or ''
        full_name = (request.data.get('full_name') or '').strip()

        if not email or not password or not full_name:
            return response.Response(
                {'error': 'Campos obrigatórios em falta.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        if len(password) < 6:
            return response.Response(
                {'error': 'Senha muito curta (mínimo 6 caracteres).'},
                status=status.HTTP_400_BAD_REQUEST
            )
        if CustomUser.objects.filter(email=email).exists():
            return response.Response(
                {'error': 'Email já registado.'},
                status=status.HTTP_409_CONFLICT
            )

        code = _new_code()
        _PENDING_REGS[email] = {
            'email': email,
            'password': password,
            'full_name': full_name,
            'code': code,
        }
        print(f"[register] verification code for {email} = {code}")
        send_verification_email(CustomUser(email=email, full_name=full_name), code)
        return response.Response({
            'pending': True,
            'email': email,
            'dev_code': code if settings.DEBUG else None
        })


class VerifyEmailView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = (request.data.get('email') or '').strip().lower()
        code = (request.data.get('code') or '').strip()
        pending = _PENDING_REGS.get(email)
        if not pending:
            return response.Response(
                {'error': 'Nenhum registo pendente encontrado.'},
                status=status.HTTP_404_NOT_FOUND
            )
        if pending['code'] != code:
            return response.Response(
                {'error': 'Código de verificação inválido.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = CustomUser.objects.create_user(
            email=pending['email'],
            password=pending['password'],
            full_name=pending['full_name'],
            role='external_client',
        )
        _PENDING_REGS.pop(email, None)
        send_welcome_email(user)
        refresh = RefreshToken.for_user(user)
        return response.Response({
            'verified': True,
            'token': str(refresh.access_token),
            'user': CustomUserSerializer(user).data
        })


class ResendVerificationView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = (request.data.get('email') or '').strip().lower()
        pending = _PENDING_REGS.get(email)
        if not pending:
            return response.Response(
                {'error': 'Nenhum registo pendente.'},
                status=status.HTTP_404_NOT_FOUND
            )
        pending['code'] = _new_code()
        print(f"[register] new verification code for {email} = {pending['code']}")
        return response.Response({
            'sent': True,
            'dev_code': pending['code'] if settings.DEBUG else None
        })


class InviteView(views.APIView):
    permission_classes = [permissions.AllowAny]  # TODO: tighten to IsAdminUser

    def post(self, request):
        email = (request.data.get('email') or '').strip().lower()
        role = request.data.get('role') or 'internal_client'
        if not email:
            return response.Response(
                {'error': 'Email obrigatório.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        if role not in dict(CustomUser.ROLE_CHOICES):
            return response.Response(
                {'error': 'Papel inválido.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        token = 'inv_' + secrets.token_urlsafe(8)
        _INVITE_TOKENS[token] = {'email': email, 'role': role}
        print(f"[invite] token for {email} ({role}) = {token}")
        invite_url = f"{request.build_absolute_uri('/')}/registo?invite={token}"
        send_invite_email(email, role, invite_url)
        return response.Response({
            'success': True,
            'email': email,
            'role': role,
            'invite_token': token
        })


class ForgotPasswordView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = (request.data.get('email') or '').strip().lower()
        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            return response.Response({
                'success': False,
                'message': 'Se o email existir, um link de reset foi enviado.'
            })

        # Invalidate old tokens
        user.reset_tokens.filter(used=False).update(used=True)

        # Create new token
        token = secrets.token_urlsafe(32)
        expires_at = timezone.now() + timedelta(hours=24)
        reset_token = PasswordResetToken.objects.create(
            user=user, token=token, expires_at=expires_at
        )

        reset_url = f"{request.build_absolute_uri('/')}/reset-password?token={token}"
        send_password_reset_email(user, token, reset_url)

        return response.Response({
            'success': True,
            'message': 'Email de reset enviado (console backend em dev)'
        })


class ResetPasswordView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        token = request.data.get('token') or ''
        password = request.data.get('password') or ''

        if not token or not password:
            return response.Response(
                {'error': 'Token e senha obrigatórios.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        if len(password) < 6:
            return response.Response(
                {'error': 'Senha muito curta.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            reset_token = PasswordResetToken.objects.get(token=token)
        except PasswordResetToken.DoesNotExist:
            return response.Response(
                {'error': 'Token inválido.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not reset_token.is_valid():
            return response.Response(
                {'error': 'Token expirado ou já utilizado.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = reset_token.user
        user.set_password(password)
        user.save()
        reset_token.used = True
        reset_token.save()

        return response.Response({
            'success': True,
            'message': 'Senha redefinida com sucesso. Faça login novamente.'
        })


class UploadView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        file = request.FILES.get('file')
        if not file:
            return response.Response(
                {'error': 'Nenhum arquivo enviado'},
                status=status.HTTP_400_BAD_REQUEST
            )

        from django.core.files.storage import default_storage
        filename = default_storage.save(f'uploads/{file.name}', file)
        file_url = f"{request.build_absolute_uri('/')}{settings.MEDIA_URL}{filename.replace('uploads/', '')}"

        return response.Response({'file_url': file_url})


# Generic Entity ViewSet
class GenericEntityViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        model = self.kwargs.get('model')
        model_map = {
            'products': Product,
            'tenants': Tenant,
            'clients': Client,
            'orders': Order,
            'leads': Lead,
            'services': Service,
            'payments': Payment,
            'testimonials': Testimonial,
            'users': CustomUser,
        }
        qs = model_map.get(model, Product).objects.all()

        # Handle filters
        for key, value in self.request.query_params.items():
            if key not in ['sort', 'limit', 'offset']:
                qs = qs.filter(**{key: value})

        # Handle sorting
        sort = self.request.query_params.get('sort', '-created_date')
        qs = qs.order_by(sort)

        return qs

    def get_serializer_class(self):
        model = self.kwargs.get('model')
        serializers_map = {
            'products': ProductSerializer,
            'tenants': TenantSerializer,
            'clients': ClientSerializer,
            'orders': OrderSerializer,
            'leads': LeadSerializer,
            'services': ServiceSerializer,
            'payments': PaymentSerializer,
            'testimonials': TestimonialSerializer,
            'users': CustomUserSerializer,
        }
        return serializers_map.get(model, ProductSerializer)

    def list(self, request, *args, **kwargs):
        limit = int(request.query_params.get('limit', 50))
        qs = self.get_queryset()[:limit]
        serializer = self.get_serializer_class()(qs, many=True)
        return response.Response(serializer.data)


class UserPromoteView(views.APIView):
    permission_classes = [permissions.AllowAny]  # TODO: IsAdminUser

    def post(self, request, user_id):
        try:
            user = CustomUser.objects.get(id=user_id)
        except CustomUser.DoesNotExist:
            return response.Response(
                {'error': 'Utilizador não encontrado.'},
                status=status.HTTP_404_NOT_FOUND
            )

        user.role = 'internal_client'
        user.save()

        return response.Response({
            'success': True,
            'message': f'{user.full_name} foi promovido a membro.',
            'user': CustomUserSerializer(user).data
        })


class ProductListView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        limit = int(request.query_params.get('limit', 50))
        qs = Product.objects.all()[:limit]
        serializer = ProductSerializer(qs, many=True)
        return response.Response(serializer.data)


class TestimonialListView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        limit = int(request.query_params.get('limit', 50))
        qs = Testimonial.objects.filter(status='approved')[:limit]
        serializer = TestimonialSerializer(qs, many=True)
        return response.Response(serializer.data)


class TenantListView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        qs = Tenant.objects.all()
        serializer = TenantSerializer(qs, many=True)
        return response.Response(serializer.data)
