from django.core.mail import EmailMultiAlternatives
from django.dispatch import receiver
from django_rest_passwordreset.signals import reset_password_token_created


@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, *args, **kwargs):
    user = reset_password_token.user
    first_name = user.first_name or user.email

    reset_url = (
        f"http://localhost:5173/reset-password"
        f"?token={reset_password_token.key}"
    )

    text_body = (
        f"Привіт, {first_name}!\n\n"
        f"Ви отримали цей лист, тому що хтось запросив скидання пароля для вашого акаунту Maryco Club.\n\n"
        f"Для створення нового пароля перейдіть за посиланням:\n"
        f"{reset_url}\n\n"
        f"Посилання дійсне 24 години.\n\n"
        f"Якщо ви не надсилали цей запит — просто проігноруйте цей лист.\n\n"
        f"З повагою,\nКоманда Maryco Club"
    )

    html_body = f"""
<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0"
               style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">

          <tr>
            <td style="background:#2563eb;padding:28px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:800;letter-spacing:0.5px;">
                MARYCO <span style="color:#93c5fd;">CLUB</span>
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding:40px 40px 24px;">
              <p style="margin:0 0 16px;font-size:16px;color:#1f2937;font-weight:600;">
                Привіт, {first_name}!
              </p>
              <p style="margin:0 0 24px;font-size:15px;color:#4b5563;line-height:1.6;">
                Ви отримали цей лист, тому що для вашого акаунту було запрошено скидання пароля.
                Якщо це були не ви — просто проігноруйте цей лист.
              </p>

              <div style="text-align:center;margin:32px 0;">
                <a href="{reset_url}"
                   style="display:inline-block;background:#2563eb;color:#ffffff;
                          font-size:15px;font-weight:700;padding:14px 36px;
                          border-radius:12px;text-decoration:none;letter-spacing:0.3px;">
                  Відновити пароль
                </a>
              </div>

              <p style="margin:0;font-size:13px;color:#9ca3af;text-align:center;line-height:1.5;">
                Або скопіюйте це посилання у браузер:<br>
                <a href="{reset_url}" style="color:#2563eb;word-break:break-all;">{reset_url}</a>
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:20px 40px 32px;border-top:1px solid #f3f4f6;">
              <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center;line-height:1.6;">
                Посилання дійсне протягом <strong>24 годин</strong>.<br>
                З повагою, команда <strong>Maryco Club</strong>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
"""

    msg = EmailMultiAlternatives(
        subject="Відновлення пароля — Maryco Club",
        body=text_body,
        from_email="Maryco Club <maryco.club.private.school@gmail.com>",
        to=[user.email],
    )
    msg.attach_alternative(html_body, "text/html")
    msg.send()