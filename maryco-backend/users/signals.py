from django.core.mail import EmailMultiAlternatives
from django.dispatch import receiver
from django.template.loader import render_to_string
from django_rest_passwordreset.signals import reset_password_token_created

@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, *args, **kwargs):
    context = {
        'current_user': reset_password_token.user,
        'first_name': reset_password_token.user.first_name,
        'reset_password_url': f"http://localhost:5173/reset-password?token={reset_password_token.key}"
    }

    email_html_message = f"Вам надіслано код для скидання пароля: {reset_password_token.key}"

    msg = EmailMultiAlternatives(
        "Відновлення пароля для Maryco Club",
        email_html_message,
        'Maryco Club <maryco.club.private.school@gmail.com>',
        [reset_password_token.user.email]
    )
    msg.send()