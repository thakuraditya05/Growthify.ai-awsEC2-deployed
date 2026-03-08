# GrowthSync - AI-Powered Content Creation Platform

<div align="center">
  <img src="GrowthSync-fronted/public/Growthify.png" alt="GrowthSync Logo" width="200"/>
  
  **Transform your content creation workflow with AI-powered tools**
  
  [![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](YOUR_EC2_LINK_HERE)
  [![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Screenshots](#-screenshots)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

GrowthSync is a comprehensive AI-powered platform designed for content creators to streamline their workflow across multiple social media platforms. It combines trending content discovery, AI-driven content generation, and thumbnail creation into one unified dashboard.

### Key Highlights

- 🤖 **AI Content Generation** - Generate scripts, hooks, titles, captions, and hashtags
- 🎨 **AI Thumbnail Studio** - Create eye-catching thumbnails with customizable moods and styles
- 📈 **Trending Content Discovery** - Track trends across YouTube, Reddit, X (Twitter), and YouTube Music
- 📊 **Project Management** - Organize and manage all your content projects in one place
- 🔄 **Real-time Updates** - Automated cron jobs fetch trending content every 30 minutes
- 🎯 **Multi-Platform Support** - Optimized content for YouTube, Instagram, Reddit, X, and more

---

## ✨ Features

### 1. AI Content Generator
- Generate complete content packages including:
  - Video scripts optimized for different platforms
  - Attention-grabbing hooks
  - SEO-friendly titles
  - Engaging descriptions/captions
  - Relevant hashtags
- Multiple prompt types: Storytelling, Educational, Controversial, Listicle, Short-form
- Real-time refinement with AI chat interface
- Save content to new or existing projects

### 2. AI Thumbnail Studio
- Generate professional thumbnails using AI
- Customizable parameters:
  - Mood selection (Dramatic, Minimalist, Vibrant, Dark & Mysterious, Corporate)
  - Color preferences
  - Visual elements description
- Direct download functionality
- Integration with project workflow

### 3. Trending Content Discovery
- Real-time trending data from:
  - YouTube Videos
  - YouTube Music
  - Reddit Posts
  - X (Twitter) Posts
- Save trends for later reference
- Filter by platform
- View engagement metrics (views, likes, comments)

### 4. Project Management
- Create and organize content projects
- Track project status (draft, in-progress, completed)
- Link content and thumbnails to projects
- Recent projects dashboard
- Project statistics and analytics

### 5. Dashboard & Analytics
- Overview of content performance
- Platform-wise growth tracking
- Recent projects quick access
- Statistics cards for project insights

---

## 🛠 Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **React Hot Toast** - Toast notifications
- **SweetAlert2** - Beautiful alerts

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Primary database
- **AWS DocumentDB** - Secondary database for trending data
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### AI & Cloud Services
- **AWS Bedrock** - AI model runtime
- **Groq SDK** - AI content generation
- **Replicate** - AI image generation
- **AWS S3** - File storage
- **Cloudinary** - Image hosting and optimization

### DevOps & Utilities
- **node-cron** - Scheduled tasks
- **dotenv** - Environment configuration
- **CORS** - Cross-origin resource sharing
- **Nodemon** - Development auto-reload

---

## 🏗 Architecture

```
GROWTHSYNC_FINAL/
│
├── GrowthSync-fronted/          # React Frontend Application
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── common/          # Shared components (ProjectCard, Modal)
│   │   │   ├── home-widgets/    # Dashboard widgets
│   │   │   └── layout/          # Layout components
│   │   ├── pages/               # Page components
│   │   │   ├── ContentGenerator/
│   │   │   ├── ThumbnailStudio/
│   │   │   ├── Projects/
│   │   │   ├── Trends/
│   │   │   └── ...
│   │   ├── context/             # React Context (Auth)
│   │   ├── hooks/               # Custom React hooks
│   │   ├── theme/               # Theme configuration
│   │   └── constants/           # App constants
│   └── public/                  # Static assets
│
└── GrowthSynch-backend/         # Node.js Backend API
    ├── src/
    │   ├── controllers/         # Request handlers
    │   │   └── AI logic/        # AI generation logic
    │   ├── models/              # Mongoose schemas
    │   ├── routes/              # API routes
    │   ├── services/            # Business logic
    │   │   ├── aiService.js
    │   │   ├── youtubeService.js
    │   │   ├── redditService.js
    │   │   └── xService.js
    │   ├── middlewares/         # Express middlewares
    │   └── utils/               # Utility functions
    ├── db.js                    # Database connections
    ├── config.js                # App configuration
    └── server.js                # Entry point
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB instance
- AWS Account (for Bedrock, S3, DocumentDB)
- API keys for external services

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd GROWTHSYNC_FINAL
```

2. **Setup Backend**
```bash
cd GrowthSynch-backend
npm install
```

3. **Setup Frontend**
```bash
cd ../GrowthSync-fronted
npm install
```

4. **Configure Environment Variables** (see below)

5. **Start Development Servers**

Backend:
```bash
cd GrowthSynch-backend
npm run dev
```

Frontend:
```bash
cd GrowthSync-fronted
npm run dev
```

The frontend will be available at `http://localhost:5173` and backend at `http://localhost:5000`

---

## 🔐 Environment Variables

### Backend (.env)

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/growthsync
DOCDB_URI=your_documentdb_connection_string

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d

# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_BEDROCK_MODEL_ID=your_model_id

# AWS S3
S3_BUCKET_NAME=your_bucket_name

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# AI Services
GROQ_API_KEY=your_groq_api_key
REPLICATE_API_TOKEN=your_replicate_token

# External APIs
YOUTUBE_API_KEY=your_youtube_api_key
REDDIT_CLIENT_ID=your_reddit_client_id
REDDIT_CLIENT_SECRET=your_reddit_client_secret
X_BEARER_TOKEN=your_x_bearer_token
```

### Frontend

Create `GrowthSync-fronted/.env`:

```env
VITE_API_URL=http://localhost:5000
```

---

## 📡 API Documentation

### Authentication Endpoints

```
POST   /api/auth/register       - Register new user
POST   /api/auth/login          - Login user
GET    /api/auth/me             - Get current user
```

### Project Endpoints

```
POST   /api/projects            - Create new project
GET    /api/projects            - Get all user projects
GET    /api/projects/:id        - Get single project
PUT    /api/projects/:id        - Update project
DELETE /api/projects/:id        - Delete project
```

### AI Endpoints

```
POST   /api/ai/generate-content     - Generate AI content
POST   /api/ai/refine-content       - Refine existing content
POST   /api/ai/save-content         - Save content to project
POST   /api/ai/generate-thumbnail   - Generate AI thumbnail
GET    /api/ai/download-thumbnail   - Download thumbnail
```

### Trending Endpoints

```
GET    /api/v1/trending             - Get all trending content
POST   /api/v1/trending/save        - Save a trend
GET    /api/v1/trending/saved       - Get saved trends
DELETE /api/v1/trending/saved       - Delete saved trend
```

### Dashboard Endpoints

```
GET    /api/dashboard               - Get dashboard statistics
```

---

## 📸 Screenshots

### 📊 Dashboard
<img src="https://github.com/user-attachments/assets/54a91063-5024-4337-9b32-2016ba6f482d" width="100%" alt="Dashboard Overview" />
*Overview of your content performance and recent projects*

### 🤖 AI Content Generator
<img src="https://github.com/user-attachments/assets/dcedd0bb-9b2b-45ff-b1f0-38ae21adf56c" width="100%" alt="AI Content Generator" />
*Generate and refine content with AI assistance*

### 🎨 AI Thumbnail Studio
<img src="https://github.com/user-attachments/assets/fbb0bc83-894e-402a-85f1-31cf6f298ca4" width="100%" alt="AI Thumbnail Studio" />
*Create professional thumbnails with AI*

### 🔥 Trending Content
<img src="https://github.com/user-attachments/assets/342c591b-771d-45ec-b92b-fcd2389f9a4f" width="100%" alt="Trending Content" />
*Discover trending content across platforms*
---

## 🌐 Deployment

### Deployed on AWS EC2

**🚀 Live Demo:** [Growthify.ai](http://13.234.113.82/)


### Deployment Steps

1. **Provision EC2 Instance**
   - Ubuntu Server 22.04 LTS
   - t2.medium or higher recommended
   - Configure security groups (ports 80, 443, 5000)

2. **Install Dependencies**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx
```

3. **Clone and Setup Application**
```bash
git clone <repository-url>
cd GROWTHSYNC_FINAL

# Setup backend
cd GrowthSynch-backend
npm install
pm2 start server.js --name growthsync-backend

# Setup frontend
cd ../GrowthSync-fronted
npm install
npm run build
```

4. **Configure Nginx**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        root /path/to/GrowthSync-fronted/dist;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

5. **Setup SSL with Let's Encrypt**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

6. **Configure PM2 Startup**
```bash
pm2 startup
pm2 save
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
## 🙏 Acknowledgments

- AWS Bedrock for AI capabilities
- Groq for fast AI inference
- Replicate for image generation
- All open-source contributors

---


<div align="center">
  Made with ❤️ by the Growthify.ai Team
  ⭐ Star this repo if you find it helpful!
</div>


---

