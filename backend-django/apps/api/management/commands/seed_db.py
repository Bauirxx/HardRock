from django.core.management.base import BaseCommand
from apps.api.models import (
    CustomUser, Tenant, Product, Client, Order, Lead, Service, Testimonial, Payment
)
import uuid

class Command(BaseCommand):
    help = 'Seeds the database with initial data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding data...')

        # 1. Create Tenant
        tenant, created = Tenant.objects.get_or_create(
            slug='hardrock',
            defaults={
                'nome': 'Hard Rock Gym',
                'subdominio': 'default',
                'descricao': 'Elite Training Center',
                'endereco': 'Av. 24 de Julho, Maputo',
                'horario_funcionamento': 'Seg-Sex 6h-22h, Sáb 8h-18h, Dom 8h-14h',
                'whatsapp_number': '+258 84 000 0000',
                'telefone': '+258 1 000 0000',
                'email_notificacao': 'info@hardrockgym.co.mz',
                'primary_color': '#ef4444',
                'redes_sociais': {
                    'instagram': 'https://instagram.com/hardrockgym',
                    'facebook': 'https://facebook.com/hardrockgym',
                    'youtube': 'https://youtube.com/@hardrockgym',
                    'twitter': 'https://x.com/hardrockgym',
                    'tiktok': ''
                },
                'hero_images': [
                    {
                        'url': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&h=400&fit=crop',
                        'titulo': 'Transforme Seu Corpo',
                        'link': '/equipamentos',
                        'tipo': 'geral'
                    },
                    {
                        'url': 'https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?w=1200&h=400&fit=crop',
                        'titulo': 'Força e Resistência',
                        'link': '/loja',
                        'tipo': 'promocao'
                    },
                    {
                        'url': 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1200&h=400&fit=crop',
                        'titulo': 'Seu Personal Trainer',
                        'link': '/equipamentos',
                        'tipo': 'nova-maquina'
                    }
                ]
            }
        )
        if not created:
            tenant.hero_images = [
                {
                    'url': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&h=400&fit=crop',
                    'titulo': 'Transforme Seu Corpo',
                    'link': '/equipamentos',
                    'tipo': 'geral'
                },
                {
                    'url': 'https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?w=1200&h=400&fit=crop',
                    'titulo': 'Força e Resistência',
                    'link': '/loja',
                    'tipo': 'promocao'
                },
                {
                    'url': 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1200&h=400&fit=crop',
                    'titulo': 'Seu Personal Trainer',
                    'link': '/equipamentos',
                    'tipo': 'nova-maquina'
                }
            ]
            tenant.save()
        self.stdout.write(f'Tenant created/updated: {tenant.nome}')

        # 2. Create Users
        users_to_create = [
            {
                'email': 'admin@hardrock.com',
                'full_name': 'Administrador Hard Rock',
                'role': 'admin',
                'password': 'admin123',
                'genero': 'M',
                'idade': 35,
            },
            {
                'email': 'staff@hardrock.com',
                'full_name': 'Instrutor Carlos',
                'role': 'staff',
                'password': 'admin123',
                'genero': 'M',
                'idade': 28,
            },
            {
                'email': 'internal@hardrock.com',
                'full_name': 'Membro Premium João',
                'role': 'internal_client',
                'password': 'admin123',
                'genero': 'M',
                'idade': 32,
            },
            {
                'email': 'external@hardrock.com',
                'full_name': 'Visitante da Loja Ana',
                'role': 'external_client',
                'password': 'admin123',
                'genero': 'F',
                'idade': 25,
            },
            {
                'email': 'trainer@hardrock.com',
                'full_name': 'Instrutor Pessoal Silva',
                'role': 'personal_trainer',
                'password': 'admin123',
                'genero': 'M',
                'idade': 30,
                'especialidade': 'Musculação',
                'bio': 'Instrutor certificado com 10 anos de experiência',
                'disponibilidade': 'Seg-Sex 6h-22h, Sáb 8h-18h',
                'telefone': '+258 84 123 4567',
            }
        ]

        for user_data in users_to_create:
            user, created = CustomUser.objects.get_or_create(
                email=user_data['email'],
                defaults={
                    'full_name': user_data['full_name'],
                    'role': user_data['role'],
                    'genero': user_data.get('genero'),
                    'idade': user_data.get('idade'),
                    'especialidade': user_data.get('especialidade'),
                    'bio': user_data.get('bio'),
                    'disponibilidade': user_data.get('disponibilidade'),
                    'telefone': user_data.get('telefone'),
                }
            )
            if created:
                user.set_password(user_data['password'])
                user.save()
                self.stdout.write(f'User created: {user.email}')
            else:
                user.role = user_data['role']
                user.set_password(user_data['password'])
                user.save()
                self.stdout.write(f'User updated: {user.email}')

        # 3. Create Sample Products
        products_to_create = [
            {
                'nome': 'Whey Protein Hard Rock',
                'descricao': 'Proteína de alta qualidade, 2kg',
                'preco': 2500,
                'preco_promocional': 2000,
                'stock_quantidade': 50,
                'categoria': 'Suplementos',
                'tipo': 'supplement',
                'status': 'active',
                'destaque': True,
            },
            {
                'nome': 'Dumbbells Ajustáveis',
                'descricao': 'Conjunto de halteres ajustáveis, 5-25kg',
                'preco': 5000,
                'stock_quantidade': 20,
                'categoria': 'Equipamento',
                'tipo': 'equipment',
                'is_machine': True,
                'status': 'active',
                'destaque': True,
            },
            {
                'nome': 'T-shirt Hard Rock',
                'descricao': 'Camiseta de treino, 100% algodão',
                'preco': 500,
                'stock_quantidade': 100,
                'categoria': 'Roupa',
                'tipo': 'clothing',
                'status': 'active',
            }
        ]

        for product_data in products_to_create:
            product, created = Product.objects.get_or_create(
                nome=product_data['nome'],
                defaults={
                    'tenant_id': tenant.id,
                    **product_data
                }
            )
            if created:
                self.stdout.write(f'Product created: {product.nome}')

        # 4. Create Sample Clients
        clients_to_create = [
            {
                'nome': 'João Silva',
                'email': 'joao@example.com',
                'telefone': '+258 84 123 4567',
                'genero': 'M',
                'idade': 35,
                'endereco': 'Rua A, Maputo',
                'status': 'active',
                'plano_atual': 'Premium',
            },
            {
                'nome': 'Maria Santos',
                'email': 'maria@example.com',
                'telefone': '+258 84 987 6543',
                'genero': 'F',
                'idade': 28,
                'endereco': 'Rua B, Maputo',
                'status': 'active',
                'plano_atual': 'Standard',
            }
        ]

        for client_data in clients_to_create:
            client, created = Client.objects.get_or_create(
                email=client_data['email'],
                defaults={
                    'tenant_id': tenant.id,
                    **client_data
                }
            )
            if created:
                self.stdout.write(f'Client created: {client.nome}')

        # 5. Create Sample Testimonials
        testimonials_to_create = [
            {
                'nome': 'João Silva',
                'comentario': 'Excelente ginásio, instrutores muito profissionais!',
                'estrelas': 5,
                'status': 'approved',
            },
            {
                'nome': 'Maria Santos',
                'comentario': 'Ambiente incrível, equipamento de qualidade',
                'estrelas': 5,
                'status': 'approved',
            }
        ]

        for testimonial_data in testimonials_to_create:
            testimonial, created = Testimonial.objects.get_or_create(
                nome=testimonial_data['nome'],
                comentario=testimonial_data['comentario'],
                defaults={
                    'tenant_id': tenant.id,
                    **testimonial_data
                }
            )
            if created:
                self.stdout.write(f'Testimonial created: {testimonial.nome}')

        # 6. Create Sample Services
        services_to_create = [
            {
                'nome': 'Plano Mensal',
                'descricao': 'Acesso ilimitado ao ginásio',
                'preco_mensal': 3000,
                'preco_trimestral': 8000,
                'preco_anual': 30000,
                'status': 'active',
                'destaque': True,
            },
            {
                'nome': 'Personal Trainer',
                'descricao': 'Sessão de treino pessoal',
                'preco_mensal': 5000,
                'status': 'active',
            }
        ]

        for service_data in services_to_create:
            service, created = Service.objects.get_or_create(
                nome=service_data['nome'],
                defaults={
                    'tenant_id': tenant.id,
                    **service_data
                }
            )
            if created:
                self.stdout.write(f'Service created: {service.nome}')

        self.stdout.write(self.style.SUCCESS('Seeding completed!'))
