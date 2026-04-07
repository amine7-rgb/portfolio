# Amine Portfolio

Professional freelance portfolio built with React, Vite, Node.js, Express, and MongoDB.

## Run Locally

```bash
npm install
npm run dev
```

## Contact Email

The contact form saves messages to MongoDB and can send them to your Gmail inbox.

Create a `.env` file from `.env.example`, then set:

```bash
CONTACT_TO_EMAIL=amed14170@gmail.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=amed14170@gmail.com
SMTP_PASS=your_gmail_app_password
```

For Gmail, `SMTP_PASS` should be a Google App Password, not your normal Gmail password.

## Build

```bash
npm run build
npm start
```

## GitHub

Your public GitHub profile is already linked in the contact section:

```text
https://github.com/amine7-rgb
```

To publish this project, create a repository on GitHub, then connect it with:

```bash
git init
git add .
git commit -m "Initial portfolio"
git branch -M main
git remote add origin https://github.com/amine7-rgb/YOUR_REPOSITORY_NAME.git
git push -u origin main
```
