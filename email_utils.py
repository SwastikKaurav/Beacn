import smtplib
from email.mime.text import MIMEText
from dotenv import load_dotenv
import os

load_dotenv()

def send_email(to: str, subject:str, body:str):
    msg = MIMEText(body)
    msg["To"] = to
    msg["Subject"] = subject
    msg["From"] = os.getenv("GMAIL_ADDRESS")

    with smtplib.SMTP("smtp.gmail.com", 587) as smtp:
        smtp.starttls()
        smtp.login(os.getenv("GMAIL_ADDRESS"), os.getenv("GMAIL_APP_PASSWORD"))
        smtp.sendmail(os.getenv("GMAIL_ADDRESS"), to, msg.as_string())
