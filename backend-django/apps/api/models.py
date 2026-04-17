from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
<<<<<<< HEAD
from django.utils import timezone
import uuid
import secrets
=======
import uuid
>>>>>>> 178c6066442bcf30bce830b8deda6700021cb4a3

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
<<<<<<< HEAD
        ('personal_trainer', 'Instrutor Pessoal'),
    )
    GENDER_CHOICES = (
        ('M', 'Masculino'),
        ('F', 'Feminino'),
        ('O', 'Outro'),
        ('N', 'Prefiro não dizer'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = None
=======
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = None # Remove username field
>>>>>>> 178c6066442bcf30bce830b8deda6700021cb4a3
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=255, blank=True, null=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='external_client')
    foto_url = models.URLField(max_length=500, blank=True, null=True)
<<<<<<< HEAD
    genero = models.CharField(max_length=1, choices=GENDER_CHOICES, blank=True, null=True)
    idade = models.IntegerField(blank=True, null=True)

    # For personal trainers
    especialidade = models.CharField(max_length=255, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    disponibilidade = models.CharField(max_length=500, blank=True, null=True)
    telefone = models.CharField(max_length=20, blank=True, null=True)
    status = models.CharField(max_length=20, default='active', choices=(('active', 'Ativo'), ('inactive', 'Inactivo')))

    created_date = models.DateTimeField(auto_now_add=True)

    objects = CustomUserManager()
=======
    created_date = models.DateTimeField(auto_now_add=True)

    objects = CustomUserManager()

>>>>>>> 178c6066442bcf30bce830b8deda6700021cb4a3
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name']

    def __str__(self):
        return self.email

class Tenant(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nome = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
<<<<<<< HEAD
    subdominio = models.CharField(max_length=100, default='default')
    descricao = models.TextField(blank=True, null=True)
    logo_url = models.URLField(max_length=500, blank=True, null=True)

    # Contact info
    whatsapp_number = models.CharField(max_length=20, blank=True, null=True)
    telefone = models.CharField(max_length=20, blank=True, null=True)
    email_notificacao = models.EmailField(blank=True, null=True)
    endereco = models.TextField(blank=True, null=True)
    horario_funcionamento = models.CharField(max_length=500, blank=True, null=True)
    google_maps_embed = models.URLField(max_length=1000, blank=True, null=True)

    # Branding
    primary_color = models.CharField(max_length=7, default='#10B981')
    redes_sociais = models.JSONField(default=dict, blank=True)  # {instagram, facebook, youtube, twitter, tiktok}
    videos_youtube = models.JSONField(default=list, blank=True)  # [{titulo, url}]
    hero_images = models.JSONField(default=list, blank=True)  # [{url, titulo, link, tipo}]

    # Email config
    email_host = models.CharField(max_length=255, blank=True, null=True)
    email_port = models.IntegerField(blank=True, null=True)
    email_username = models.CharField(max_length=255, blank=True, null=True)
    email_password = models.CharField(max_length=500, blank=True, null=True)
    email_use_tls = models.BooleanField(default=True)

=======
    descricao = models.TextField(blank=True, null=True)
    logo_url = models.URLField(max_length=500, blank=True, null=True)
>>>>>>> 178c6066442bcf30bce830b8deda6700021cb4a3
    created_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nome

class Product(models.Model):
<<<<<<< HEAD
    TIPO_CHOICES = (
        ('supplement', 'Suplemento'),
        ('clothing', 'Roupa'),
        ('accessory', 'Acessório'),
        ('machine', 'Máquina'),
        ('equipment', 'Equipamento'),
    )
    STATUS_CHOICES = (
        ('active', 'Ativo'),
        ('inactive', 'Inactivo'),
        ('discontinued', 'Descontinuado'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant_id = models.UUIDField(blank=True, null=True)
    nome = models.CharField(max_length=255)
    descricao = models.TextField(blank=True, null=True)
    preco = models.DecimalField(max_digits=12, decimal_places=2)
    preco_promocional = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    stock_quantidade = models.IntegerField(default=0)
    sku = models.CharField(max_length=100, blank=True, null=True)
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES, default='supplement')
    categoria = models.CharField(max_length=100, blank=True, null=True)
    is_machine = models.BooleanField(default=False)
    sob_consulta = models.BooleanField(default=False)
    destaque = models.BooleanField(default=False)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    imagens = models.JSONField(default=list, blank=True)  # Array of URLs
    ficha_tecnica = models.JSONField(default=dict, blank=True)  # Dict of technical specs
    youtube_url = models.URLField(max_length=500, blank=True, null=True)
=======
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nome = models.CharField(max_length=255)
    descricao = models.TextField(blank=True, null=True)
    preco = models.DecimalField(max_digits=12, decimal_places=2)
    categoria = models.CharField(max_length=100, blank=True, null=True)
    imagem_url = models.URLField(max_length=500, blank=True, null=True)
    estoque = models.IntegerField(default=0)
>>>>>>> 178c6066442bcf30bce830b8deda6700021cb4a3
    created_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nome

<<<<<<< HEAD
class Order(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pendente'),
        ('confirmed', 'Confirmado'),
        ('processing', 'A processar'),
        ('shipped', 'Enviado'),
        ('delivered', 'Entregue'),
        ('cancelled', 'Cancelado'),
    )
    PAYMENT_STATUS_CHOICES = (
        ('pending', 'Pendente'),
        ('completed', 'Completo'),
        ('failed', 'Falhou'),
        ('refunded', 'Reembolsado'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant_id = models.UUIDField(blank=True, null=True)
    tracking_code = models.CharField(max_length=20, unique=True)
    guest_name = models.CharField(max_length=255)
    guest_email = models.EmailField()
    guest_phone = models.CharField(max_length=20)
    endereco_entrega = models.JSONField(default=dict)  # {rua, cidade, codigo_postal, pais}
    items = models.JSONField(default=list)  # [{product_id, nome, quantidade, preco, imagem}]
    subtotal = models.DecimalField(max_digits=12, decimal_places=2)
    taxa_entrega = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=12, decimal_places=2)
    metodo_pagamento = models.CharField(max_length=50, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    status_pagamento = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='pending')
    created_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Encomenda {self.tracking_code}"

    def save(self, *args, **kwargs):
        if not self.tracking_code:
            self.tracking_code = self._generate_tracking_code()
        super().save(*args, **kwargs)

    @staticmethod
    def _generate_tracking_code():
        return 'ORD' + secrets.token_hex(3).upper()

class Client(models.Model):
    STATUS_CHOICES = (
        ('active', 'Activo'),
        ('inactive', 'Inactivo'),
        ('suspended', 'Suspenso'),
        ('pending', 'Pendente'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant_id = models.UUIDField(blank=True, null=True)
    nome = models.CharField(max_length=255, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    telefone = models.CharField(max_length=20, blank=True, null=True)
    genero = models.CharField(max_length=1, choices=(('M', 'M'), ('F', 'F'), ('O', 'O')), blank=True, null=True)
    idade = models.IntegerField(blank=True, null=True)
    endereco = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    notas = models.TextField(blank=True, null=True)
    plano_atual = models.CharField(max_length=100, blank=True, null=True)
=======
class Client(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='client_profile')
    plano_atual = models.CharField(max_length=100, blank=True, null=True)
    status = models.CharField(max_length=20, default='active')
>>>>>>> 178c6066442bcf30bce830b8deda6700021cb4a3
    data_inicio = models.DateField(auto_now_add=True)
    created_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
<<<<<<< HEAD
        return self.nome

class Lead(models.Model):
    STATUS_CHOICES = (
        ('new', 'Novo'),
        ('contacted', 'Contactado'),
        ('converted', 'Convertido'),
        ('lost', 'Perdido'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant_id = models.UUIDField(blank=True, null=True)
    nome = models.CharField(max_length=255)
    telefone = models.CharField(max_length=20)
    email = models.EmailField()
    interesse = models.CharField(max_length=255, blank=True, null=True)
    mensagem = models.TextField(blank=True, null=True)
    notas = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    fonte = models.CharField(max_length=100, blank=True, null=True)
    created_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Lead {self.nome}"

class Service(models.Model):
    STATUS_CHOICES = (
        ('active', 'Ativo'),
        ('inactive', 'Inactivo'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant_id = models.UUIDField(blank=True, null=True)
    nome = models.CharField(max_length=255)
    descricao = models.TextField(blank=True, null=True)
    preco_mensal = models.DecimalField(max_digits=12, decimal_places=2)
    preco_trimestral = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    preco_anual = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    destaque = models.BooleanField(default=False)
    created_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nome

class Payment(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pendente'),
        ('processing', 'A processar'),
        ('completed', 'Completo'),
        ('failed', 'Falhou'),
        ('refunded', 'Reembolsado'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    tenant_id = models.UUIDField(blank=True, null=True)
    valor = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    tipo = models.CharField(max_length=50, default='mensalidade')
    metodo = models.CharField(max_length=50, blank=True, null=True)
    descricao = models.CharField(max_length=255, blank=True, null=True)
    data_pagamento = models.DateTimeField(blank=True, null=True)
    created_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Pagamento {self.tipo} — {self.valor}"

class Testimonial(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pendente'),
        ('approved', 'Aprovado'),
        ('rejected', 'Rejeitado'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant_id = models.UUIDField(blank=True, null=True)
    nome = models.CharField(max_length=255)
    comentario = models.TextField()
    estrelas = models.IntegerField(default=5)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='approved')
    created_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Depoimento — {self.nome}"

class PasswordResetToken(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='reset_tokens')
    token = models.CharField(max_length=255, unique=True)
    expires_at = models.DateTimeField()
    used = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def is_valid(self):
        return not self.used and timezone.now() < self.expires_at

    def __str__(self):
        return f"Reset {self.user.email}"
=======
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
>>>>>>> 178c6066442bcf30bce830b8deda6700021cb4a3
