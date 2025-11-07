from django.core.management.base import BaseCommand, CommandError
import bcrypt
from app.users.json_store import load_users, save_users


class Command(BaseCommand):
    help = "Crea un usuario en el almacén JSON (sin base de datos)"

    def add_arguments(self, parser):
        parser.add_argument('--usuario', required=True, help='Nombre de usuario (clave de login)')
        parser.add_argument('--password', required=True, help='Contraseña en texto plano (se almacenará hasheada)')

    def handle(self, *args, **options):
        usuario = options['usuario'].strip()
        password = options['password']
        if not usuario or not password:
            raise CommandError('usuario y password son obligatorios')

        users = load_users()
        if any(u.get('usuario', '').strip().lower() == usuario.lower() for u in users):
            raise CommandError(f'El usuario "{usuario}" ya existe')

        salt = bcrypt.gensalt(rounds=12)
        pw_hash = bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

        users.append({
            'usuario': usuario,
            'password_hash': pw_hash,
        })
        save_users(users)
        self.stdout.write(self.style.SUCCESS(f'Usuario "{usuario}" creado en JSON store'))
