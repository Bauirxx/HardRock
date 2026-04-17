from rest_framework import serializers
<<<<<<< HEAD
from .models import (
    CustomUser, Tenant, Product, Client, Testimonial, Payment,
    Order, Lead, Service, PasswordResetToken
)


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'email', 'full_name', 'role', 'foto_url', 'genero', 'idade',
                  'especialidade', 'bio', 'disponibilidade', 'telefone', 'status', 'created_date')


class TenantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tenant
        fields = '__all__'


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'


class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = '__all__'


class LeadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lead
        fields = '__all__'


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = '__all__'


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'

=======
from .models import CustomUser, Tenant, Product, Client, Testimonial
>>>>>>> 178c6066442bcf30bce830b8deda6700021cb4a3

class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = '__all__'

<<<<<<< HEAD

class PasswordResetTokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = PasswordResetToken
        fields = ('id', 'token', 'expires_at', 'used', 'created_at')

=======
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'email', 'full_name', 'role', 'foto_url', 'created_date')
>>>>>>> 178c6066442bcf30bce830b8deda6700021cb4a3

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
<<<<<<< HEAD
=======

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class TenantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tenant
        fields = '__all__'
>>>>>>> 178c6066442bcf30bce830b8deda6700021cb4a3
