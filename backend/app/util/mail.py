"""Mail server config."""

from fastapi_mail import FastMail, ConnectionConfig, MessageSchema, MessageType

from config import CONFIG

mail_conf = ConnectionConfig(
    MAIL_USERNAME=CONFIG.mail_username,
    MAIL_PASSWORD=CONFIG.mail_password,
    MAIL_FROM=CONFIG.mail_sender,
    MAIL_PORT=CONFIG.mail_port,
    MAIL_SERVER=CONFIG.mail_server,
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=False,
    VALIDATE_CERTS=False,
)

mail = FastMail(mail_conf)


async def send_verification_email(email: str, token: str) -> None:
    """Send user verification email with nicer formatting."""
    url = f"{CONFIG.mail_url}{token}"
    if CONFIG.mail_console or CONFIG.prod.lower() == "dev":
        print(f"Verification link for {email}: {url}")
    else:
        body_plain = (
            f"Hello,\n\n"
            f"Welcome to GraspOS Catalogue!\n\n"
            f"Please verify your email address by clicking the link below:\n"
            f"{url}\n\n"
            f"If you did not sign up, just ignore this email.\n\n"
            f"Thanks,\nGraspOS Team")

        # HTML body
        body_html = f"""
        <!DOCTYPE html>
        <html lang="en">

        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Verify your GraspOS account</title>
        </head>

        <body style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial,sans-serif;">
            <table align="center" width="100%" cellpadding="0" cellspacing="0"
                style="max-width:600px;margin:auto;background-color:white;border-radius:8px;overflow:hidden;">
                <tr>
                    <td style="background-color:#20477B;padding:20px 30px;text-align:center;">
                        <h1 style="color:white;margin:0;font-size:24px;">GraspOS</h1>
                    </td>
                </tr>
                <tr>
                    <td style="padding:30px;color:#333;">
                        <p style="font-size:16px;margin-bottom:20px;">Hello,</p>
                        <p style="font-size:16px;margin-bottom:20px;">
                            Welcome to <strong>GraspOS</strong>!
                        </p>
                        <p style="font-size:16px;margin-bottom:20px;">
                            Please verify your email address by clicking the button below:
                        </p>
                        <p style="text-align:center;margin:30px 0;">
                            <a href="{url}" target="_blank" rel="noopener noreferrer" style="background-color:#20477B;color:white;text-decoration:none;
                                    padding:12px 24px;border-radius:6px;display:inline-block;font-weight:bold;">
                                Verify Email
                            </a>
                        </p>
                        <p style="font-size:14px;color:#555;">
                            <i>
                                If you didn’t sign up for this account, you can safely ignore this message.
                            </i>
                        </p>
                        <p style="font-size:14px;color:#555;margin-top:40px;">Thanks,<br />The GraspOS Team</p>
                    </td>
                </tr>
                <tr>
                    <td style="background-color:#f4f6f8;padding:15px;text-align:center;font-size:12px;color:#999;">
                        © GraspOS. All rights reserved.
                    </td>
                </tr>
            </table>
        </body>

        </html>
        """

        message = MessageSchema(
            recipients=[email],
            subject="Verify your GraspOS account",
            body=body_html,
            subtype=MessageType.html,
        )
        await mail.send_message(message)


async def send_password_reset_email(email: str, token: str) -> None:
    """Send password reset email."""
    # Change this later to public endpoint
    url = CONFIG.root_url + "/register/reset-password/" + token
    if CONFIG.mail_console:
        print("POST to " + url)
    else:
        message = MessageSchema(
            recipients=[email],
            subject="MyServer Password Reset",
            body=
            f"Click the link to reset your MyServer account password: {url}\nIf you did not request this, please ignore this email",
            subtype=MessageType.plain,
        )
        await mail.send_message(message)
