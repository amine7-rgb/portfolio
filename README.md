# Amine Portfolio

Professional freelance portfolio built with React, Vite, Node.js, Express, and MongoDB.

## Run Locally

```bash
npm install
npm run dev
```

## Contact Email

The contact form saves messages to MongoDB and can send them to your Gmail inbox.
The interactive `Idea to Brief Assistant` can generate richer AI briefs when OpenAI is configured.

Create a `.env` file from `.env.example`, then set:

```bash
CONTACT_TO_EMAIL=amed14170@gmail.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=amed14170@gmail.com
SMTP_PASS=your_gmail_app_password
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-5-mini
```

For Gmail, `SMTP_PASS` should be a Google App Password, not your normal Gmail password.

## Build

```bash
npm run build
npm start
```

## Deploy on Render

This project is ready for a free Render web service using `render.yaml`.

1. Push the repository to GitHub.
2. Open Render and create a new Blueprint from `amine7-rgb/portfolio`.
3. Add these secret environment variables in Render:

```bash
MONGODB_URI=your_mongodb_atlas_connection_string
SMTP_PASS=your_gmail_app_password
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-5-mini
```

Render will provide a free `onrender.com` URL. After the first deploy, update `CLIENT_ORIGIN` in Render if the service URL is different from `https://amine-portfolio.onrender.com`.

## Deploy on Vercel

This project also includes Vercel serverless API routes in `api/`.

Use these environment variables in Vercel:

```bash
MONGODB_URI=your_mongodb_atlas_connection_string
CONTACT_TO_EMAIL=amed14170@gmail.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=amed14170@gmail.com
SMTP_PASS=your_gmail_app_password
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-5-mini
```

Recommended project name: `med-amineoudi`.

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
