# Quran Evaluatie Platform (QEP)

Een asynchroon platform voor het toetsen en verbeteren van Quran recitatie, memorisatie en Tajweed. Studenten maken audio-opnames van hun recitaties die door docenten worden beoordeeld met gedetailleerde feedback.

## Features

- **Audio Opnames**: Maak eenvoudig audio-opnames met ingebouwde recorder en waveform visualisatie
- **Tijdspecifieke Feedback**: Docenten kunnen feedback geven op specifieke tijdstippen in de audio met categorieën voor Tajweed regels
- **Hifz Tracking**: Visuele voortgangstracking voor alle 114 surahs
- **Dashboard**: Uitgebreide dashboards voor studenten en docenten met statistieken
- **Audio Feedback**: Docenten kunnen ook audio feedback geven

## Tech Stack

- **Frontend**: Next.js 14 met App Router, React, TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL met Prisma ORM
- **Authenticatie**: NextAuth.js
- **Audio Storage**: AWS S3 of Cloudflare R2
- **Audio Processing**: Web Audio API

## Installatie

### Vereisten

- Node.js 18+ en npm
- PostgreSQL database
- AWS S3 bucket of Cloudflare R2 (voor audio storage)

### Stappen

1. **Clone de repository**

```bash
cd QuranReconnect-1
```

2. **Installeer dependencies**

```bash
npm install
```

3. **Configureer environment variabelen**

Kopieer `.env.example` naar `.env` en vul de waarden in:

```bash
cp .env.example .env
```

Vul de volgende variabelen in:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/quran_evaluatie_platform"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="genereer-een-random-secret-key"

# AWS S3 (of Cloudflare R2)
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_REGION="eu-west-1"
AWS_BUCKET_NAME="quran-audio-submissions"
AWS_ENDPOINT="" # Optioneel voor R2
```

4. **Setup database**

```bash
# Genereer Prisma client
npm run prisma:generate

# Push schema naar database
npm run prisma:push
```

5. **Creëer demo gebruikers** (optioneel)

Je kunt handmatig gebruikers aanmaken in de database. Gebruik bcrypt om wachtwoorden te hashen:

```javascript
// Voorbeeld met bcryptjs
const bcrypt = require('bcryptjs');
const hashedPassword = await bcrypt.hash('password', 10);
```

SQL om demo users aan te maken:

```sql
-- Student account
INSERT INTO "User" (id, email, name, password, role, level)
VALUES (
  'clxxxx',
  'student@example.com',
  'Demo Student',
  '$2a$10$YourHashedPasswordHere',
  'STUDENT',
  'BEGINNER'
);

-- Admin/Docent account
INSERT INTO "User" (id, email, name, password, role)
VALUES (
  'clyyyy',
  'admin@example.com',
  'Demo Docent',
  '$2a$10$YourHashedPasswordHere',
  'ADMIN'
);
```

6. **Start development server**

```bash
npm run dev
```

De applicatie is nu beschikbaar op [http://localhost:3000](http://localhost:3000)

## Project Structuur

```
/
├── app/                      # Next.js App Router
│   ├── api/                  # API routes
│   │   ├── auth/             # NextAuth endpoints
│   │   ├── submissions/      # Submission endpoints
│   │   ├── feedback/         # Feedback endpoints
│   │   ├── progress/         # Progress tracking
│   │   ├── stats/            # Statistics endpoints
│   │   └── upload/           # S3 upload URL generator
│   ├── dashboard/            # Student dashboard
│   ├── admin/                # Admin dashboard
│   ├── auth/                 # Authentication pages
│   └── test/                 # Test submission pages
├── components/
│   ├── ui/                   # Base UI components
│   ├── audio/                # Audio components (Recorder, Player)
│   ├── feedback/             # Feedback components
│   └── progress/             # Progress tracking components
├── lib/
│   ├── db/                   # Database utilities en queries
│   ├── audio/                # Audio processing en upload
│   ├── auth/                 # Auth configuration
│   ├── api/                  # API client functions
│   └── data/                 # Static data (surahs)
├── types/                    # TypeScript type definitions
└── prisma/
    └── schema.prisma         # Database schema
```

## Gebruik

### Als Student

1. Log in met je account
2. Ga naar het dashboard om je voortgang te zien
3. Klik op "Nieuwe inzending" om een audio opname te maken
4. Bekijk feedback van docenten op je inzendingen
5. Volg je voortgang in de Hifz Map

### Als Docent/Admin

1. Log in met een admin account
2. Bekijk alle pending submissions in het admin dashboard
3. Klik op een submission om deze te beoordelen
4. Luister naar de audio en voeg tijdspecifieke feedback toe
5. Geef een cijfer en keur de submission goed of vraag om herhaling

## API Endpoints

### Authenticatie
- `POST /api/auth/[...nextauth]` - NextAuth endpoints

### Submissions
- `GET /api/submissions` - Haal submissions op (gefilterd op rol)
- `POST /api/submissions` - Maak nieuwe submission (student only)
- `GET /api/submissions/[id]` - Haal specifieke submission op
- `PATCH /api/submissions/[id]` - Update submission status (admin only)

### Feedback
- `POST /api/feedback` - Voeg feedback toe (admin only)
- `GET /api/feedback/[submissionId]` - Haal feedback op voor submission

### Progress
- `GET /api/progress` - Haal voortgang op voor ingelogde student

### Stats
- `GET /api/stats/student` - Haal student statistieken op
- `GET /api/stats/admin` - Haal admin statistieken op (admin only)

### Upload
- `POST /api/upload` - Genereer signed S3 upload URL

## Database Schema

Het project gebruikt Prisma ORM met PostgreSQL. Belangrijkste models:

- **User**: Studenten en docenten/admins
- **Assignment**: Test opdrachten (Hifz, Tilawah, Tajweed)
- **Submission**: Audio inzendingen van studenten
- **Feedback**: Tijdspecifieke feedback van docenten
- **Progress**: Voortgang tracking per surah

Zie `prisma/schema.prisma` voor het volledige schema.

## Audio Opslag

Het platform ondersteunt zowel AWS S3 als Cloudflare R2 voor audio storage:

- Audio wordt client-side opgenomen via Web Audio API
- Server genereert signed upload URLs
- Client upload direct naar S3/R2
- Playback via signed download URLs

## Beveiliging

- Wachtwoorden worden gehashed met bcryptjs
- JWT-based sessies via NextAuth.js
- Signed URLs voor S3 uploads/downloads met expiratie
- Rate limiting op upload endpoints (aanbevolen voor productie)
- CORS en CSRF bescherming via Next.js

## Development

### Prisma Commands

```bash
# Genereer Prisma client
npm run prisma:generate

# Push schema naar database (development)
npm run prisma:push

# Open Prisma Studio (database GUI)
npm run prisma:studio
```

### Build voor productie

```bash
npm run build
npm run start
```

## Toekomstige Verbeteringen

- [ ] Real-time notificaties via Socket.io
- [ ] Email notificaties bij nieuwe feedback
- [ ] Batch upload voor meerdere submissions
- [ ] Audio transcriptie met AI
- [ ] Automatische Tajweed detectie
- [ ] Export progress reports naar PDF
- [ ] Mobile app met React Native
- [ ] Video opnames ondersteuning
- [ ] Peer review functionaliteit

## Licentie

Dit project is ontwikkeld voor educatieve doeleinden.

## Support

Voor vragen of problemen, open een issue in de GitHub repository.
