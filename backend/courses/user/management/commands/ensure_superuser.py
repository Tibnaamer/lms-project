import os
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError

# This command is a custom Django management command that makes sure that a superuser exists in the database as well as that it can also create a new superuser/promote 
# an existing user to superuser status based on provided command-line arguments or environment variables.
class Command(BaseCommand):
    help = "Create or promote a superuser from CLI args or DJANGO_SUPERUSER_* env vars."

    def add_arguments(self, parser):
        parser.add_argument("--email", dest="email", help="Superuser email")
        parser.add_argument("--username", dest="username", help="Superuser username")
        parser.add_argument("--password", dest="password", help="Superuser password")
        parser.add_argument(
            "--no-input",
            action="store_true",
            dest="no_input",
            help="Do not prompt; fail if required values are missing.",
        )

    def handle(self, *args, **options):
        email = (options.get("email") or os.getenv("DJANGO_SUPERUSER_EMAIL") or "").strip()
        username = (options.get("username") or os.getenv("DJANGO_SUPERUSER_USERNAME") or "").strip()
        password = options.get("password") or os.getenv("DJANGO_SUPERUSER_PASSWORD")
        no_input = options.get("no_input", False)

        if no_input:
            missing = [
                name
                for name, value in [
                    ("email", email),
                    ("username", username),
                    ("password", password),
                ]
                if not value
            ]
            if missing:
                raise CommandError(
                    "Missing required values in non-interactive mode: "
                    + ", ".join(missing)
                    + ". Provide CLI args or DJANGO_SUPERUSER_* env vars."
                )
        else:
            if not email:
                email = input("Superuser email: ").strip()
            if not username:
                username = input("Superuser username: ").strip()
            if not password:
                password = input("Superuser password: ").strip()

        if not email or not username or not password:
            raise CommandError("email, username, and password are required.")

        UserModel = get_user_model()
        user = UserModel.objects.filter(email__iexact=email).first()

        if user is None:
            user = UserModel.objects.create_superuser(
                username=username,
                email=email,
                password=password,
            )
            created = True
        else:
            created = False
            dirty = False

            if user.username != username and username:
                user.username = username
                dirty = True

            if not user.is_staff:
                user.is_staff = True
                dirty = True

            if not user.is_superuser:
                user.is_superuser = True
                dirty = True

            if not user.is_active:
                user.is_active = True
                dirty = True

            if dirty:
                user.save(update_fields=["username", "is_staff", "is_superuser", "is_active"])

        self._ensure_admin_profile(user)

        if created:
            self.stdout.write(self.style.SUCCESS(f"Created superuser: {email}"))
        else:
            self.stdout.write(self.style.SUCCESS(f"Ensured superuser privileges: {email}"))

    def _ensure_admin_profile(self, user):
        # Keep role metadata in sync for code paths that inspect UserProfile.
        try:
            from courses.models import UserProfile
        except Exception:
            return

        profile, _ = UserProfile.objects.get_or_create(user=user)
        if profile.role != "admin":
            profile.role = "admin"
            profile.save(update_fields=["role"])