from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
import uuid

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'admin')
        return self.create_user(email, password, **extra_fields)

class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Administrador'),
        ('staff', 'Funcionário'),
        ('internal_client', 'Cliente Interno (Membro)'),
        ('external_client', 'Cliente Externo (Loja)'),
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = None # Remove username field
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=255, blank=True, null=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='external_client')
    foto_url = models.URLField(max_length=500, blank=True, null=True)
    created_date = models.DateTimeField(auto_now_add=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name']

    def __str__(self):
        return self.email

class Tenant(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nome = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    descricao = models.TextField(blank=True, null=True)
    logo_url = models.URLField(max_length=500, blank=True, null=True)
    created_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nome

class Product(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nome = models.CharField(max_length=255)
    descricao = models.TextField(blank=True, null=True)
    preco = models.DecimalField(max_digits=12, decimal_places=2)
    categoria = models.CharField(max_length=100, blank=True, null=True)
    imagem_url = models.URLField(max_length=500, blank=True, null=True)
    estoque = models.IntegerField(default=0)
    created_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nome

class Client(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='client_profile')
    plano_atual = models.CharField(max_length=100, blank=True, null=True)
    status = models.CharField(max_length=20, default='active')
    data_inicio = models.DateField(auto_now_add=True)
    created_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Cliente: {self.user.full_name}"

class Testimonial(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nome = models.CharField(max_length=255)
    comentario = models.TextField()
    estrelas = models.IntegerField(default=5)
    status = models.CharField(max_length=20, default='approved')
    created_date = models.DateTimeField(auto_now_add=True)

class Payment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    valor = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=20, default='pending')
    tipo = models.CharField(max_length=50, default='mensalidade')
    metodo = models.CharField(max_length=50, blank=True, null=True)
    descricao = models.CharField(max_length=255, blank=True, null=True)
    created_date = models.DateTimeField(auto_now_add=True)
