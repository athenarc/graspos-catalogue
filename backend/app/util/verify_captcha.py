import httpx
from fastapi import HTTPException
from config import CONFIG

async def verify_recaptcha(token: str):
    """Verify Google reCAPTCHA v2 token."""
    secret = CONFIG.captcha_secret_key
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://www.google.com/recaptcha/api/siteverify",
            data={
                "secret": secret,
                "response": token
            },
        )
        result = response.json()
        if not result.get("success"):
            raise HTTPException(status_code=400, detail="Invalid CAPTCHA")
