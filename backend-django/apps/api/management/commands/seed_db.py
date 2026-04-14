from django.core.management.base import BaseCommand
from apps.api.models import CustomUser, Tenant, Product
import uuid

class Command(BaseCommand):
    help = 'Seeds the database with initial data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding data...')

        # 1. Create Tenant
        tenant, _ = Tenant.objects.get_or_create(
            slug='hardrock',
            defaults={
                'nome': 'Hard Rock Gym',
                'descricao': 'Elite Training Center'
            }
        )

        # 2. Create Users
        users_to_create = [
            {
                'email': 'admin@hardrock.com',
                'full_name': 'Administrador Hard Rock',
                'role': 'admin',
                'password': 'admin123'
            },
            {
                'email': 'staff@hardrock.com',
                'full_name': 'Instrutor Carlos',
                'role': 'staff',
                'password': 'admin123'
            },
            {
                'email': 'internal@hardrock.com',
                'full_name': 'Membro Premium João',
                'role': 'internal_client',
                'password': 'admin123'
            },
            {
                'email': 'external@hardrock.com',
                'full_name': 'Visitante da Loja Ana',
                'role': 'external_client',
                'password': 'admin123'
            },
        ]

        for user_data in users_to_create:
            user, created = CustomUser.objects.get_or_create(
                email=user_data['email'],
                defaults={
                    'full_name': user_data['full_name'],
                    'role': user_data['role'],
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

        # 3. Create a Sample Product
        Product.objects.get_or_create(
            nome='Whey Protein Hard Rock',
            defaults={
                'descricao': 'Proteína de alta qualidade',
                'preco': 2500,
                'categoria': 'Suplementos',
                'estoque': 50
            }
        )

        self.stdout.write(self.style.SUCCESS('Seeding completed!'))
