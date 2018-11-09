# -*- coding: utf-8 -*-
import smtplib
import json
import re

SMTP_SERVER = 'smtp.gmail.com'
SMTP_SSL_PORT = 465
SMTP_USER = 'i.chestnova.dev@gmail.com'
SMTP_PASSWORD = 'f1o2k3dev'

def index(req, name, email, phone, message):

    response = {
        "status": "error",
        "message": "",
        "error_fields": {}
    }      

    er_f = {x: ['Обязательное поле'] for x,y in zip(['name','email','message'],[name,email,message])\
            if y.strip() == ''}
    if er_f:
        response['error_fields'] = er_f
        return json.dumps(response)

    if not re.match(r'\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$', email):
        response['error_fields'] = {'email': ['Некорректный адрес e-mail']}
        return json.dumps(response)

    sent_from = SMTP_USER
    to = [email]
    subject = 'Обратная связь'
    body = """\
Добрый день, {0}!

Мы получили Ваше сообщение:
{1}

В ближайшее время наши специалисты с Вами свяжутся.

C уважением, Ирина Честнова, менеджер отдела работы с клиентами.
""".format(name, message)

    email_text = """\
From: {0}
To: {1}
Subject: {2}

{3}
""".format(sent_from, ", ".join(to), subject, body)

    try:
        server = smtplib.SMTP_SSL(SMTP_SERVER, SMTP_SSL_PORT)
        server.ehlo()
        server.login(SMTP_USER, SMTP_PASSWORD)
        server.sendmail(sent_from, to, email_text)
        server.close()

        response['status'] = 'success'
        response['message'] = 'Ваше письмо отправлено'
    except:
        response['message'] = 'Ошибка при отправлении почты'
    
    return json.dumps(response)
