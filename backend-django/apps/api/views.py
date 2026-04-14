from rest_framework import status, views, response, permissions
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.conf import settings
from .serializers import UserSerializer, LoginSerializer, ProductSerializer
from .models import Product

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
                    'user': UserSerializer(user).data
                })
            return response.Response({'error': 'Credenciais inválidas'}, status=status.HTTP_401_UNAUTHORIZED)
        return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class MeView(views.APIView):
    # Allow Any for testing simulation, but IsAuthenticated for real use
    permission_classes = [permissions.AllowAny] 

    def get(self, request):
        role_sim = request.query_params.get('role')
        if role_sim and settings.DEBUG:
            # Return a mock user for the requested role
            return response.Response({
                'id': 'simulated-id',
                'email': f'{role_sim}@simulated.com',
                'full_name': f'Simulated {role_sim}',
                'role': role_sim,
                'created_date': '2026-01-01T00:00:00Z'
            })
            
        if not request.user.is_authenticated:
            return response.Response({'error': 'Não autenticado'}, status=status.HTTP_401_UNAUTHORIZED)
            
        serializer = UserSerializer(request.user)
        return response.Response(serializer.data)

class TestimonialListView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        from .models import Testimonial
        from .serializers import TestimonialSerializer
        testimonials = Testimonial.objects.filter(status='approved').order_by('-created_date')
        serializer = TestimonialSerializer(testimonials, many=True)
        return response.Response(serializer.data)

class ProductListView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        products = Product.objects.all().order_by('-created_date')
        serializer = ProductSerializer(products, many=True)
        return response.Response(serializer.data)

class PublicSettingsView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, id):
        return response.Response({
            'id': id,
            'nome': 'Hard Rock Gym Django',
            'public_settings': {
                'require_auth': False,
                'registration_open': True
            }
        })

class UploadView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        file = request.FILES.get('file')
        if not file:
            return response.Response({'error': 'Nenhum arquivo enviado'}, status=status.HTTP_400_BAD_REQUEST)
        
        # In a real Django setup, we'd use a FileField on a model.
        # For a quick fix compatible with the old logic:
        import os
        from django.conf import settings
        from django.core.files.storage import default_storage
        
        filename = default_storage.save(f'uploads/{file.name}', file)
        file_url = f"http://127.0.0.1:8000{settings.MEDIA_URL}{filename.replace('uploads/', '')}"
        
        return response.Response({'file_url': file_url})
