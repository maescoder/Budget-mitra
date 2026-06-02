<h1>Budget-Mitra</h1>
  <p><strong>AI-Powered Price Intelligence Platform</strong></p>
  
  > *"Don't just compare prices. Understand them."*

  <p align="center">
    <img src="https://img.shields.io/badge/Next.js-14-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
    <img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/Python-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
    <img src="https://img.shields.io/badge/MySQL-PlanetScale-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" />
  </p>

</div>

---

## 🌟 The Problem
Every day, millions of online shoppers make one critical mistake — **they buy on impulse.**
Current price comparison tools only show you *what* a product costs today. They don't answer the questions that actually matter:
- *Is this the cheapest this product has ever been?*
- *Should I buy now, or wait?*
- *Will the price drop again before Diwali?*

## 💡 The Solution
**Antigravity** is a **Price Intelligence System**. 
Where traditional tools answer *"Where is it cheapest right now?"*, Antigravity uses Historical Data, Trend Analysis, and Machine Learning to tell you **when** to buy.

---

## 🔥 Key Features

### 🛒 Cross-Platform Comparison
Instantly find the best deal across Amazon, Flipkart, Myntra, and more in under 3 seconds. See prices, ratings, and delivery estimates in one clean dashboard.

### 📈 Historical Price Analysis
View interactive 7, 30, and 90-day price trends to understand market fluctuations, seasonal pricing, and spot all-time lows.

### 🧠 AI Price Intelligence Engine
Powered by **Facebook Prophet** and custom ML pipelines, Antigravity predicts the next 14-day price movement and gives you a definitive **BUY NOW** or **WAIT** recommendation, backed by a dynamic Deal Score (0-100).

### 🔔 Smart Price Drop Alerts
Set a target price and forget it. Antigravity's background workers poll prices every 30 minutes and send you an email (SendGrid) and an in-app notification the exact moment your target is hit.

---

## 🏗️ Architecture & Tech Stack

Antigravity uses a highly scalable, microservices-inspired architecture:

- **Frontend:** Next.js 14, React 18, Tailwind CSS, Zustand, Recharts (Hosted on Vercel)
- **Backend API:** Node.js, Express, Bull Queue (Hosted on Render/Railway)
- **ML Service:** Python, FastAPI, Prophet (Hosted on Render/HuggingFace)
- **Database:** MySQL (via PlanetScale)
- **Cache:** Redis (via Upstash) for sub-millisecond lookups

<details>
<summary><strong>Click to view the System Architecture Diagram</strong></summary>
<br>

```text
┌──────────────────────────────────────────────────────────────────────┐
│                        USER (Browser / Mobile)                       │
└─────────────────────────────────┬────────────────────────────────────┘
                                  │ HTTPS
┌─────────────────────────────────▼────────────────────────────────────┐
│                     REACT FRONTEND (Vercel)                          │
└─────────────────────────────────┬────────────────────────────────────┘
                                  │ REST API (JSON)
┌─────────────────────────────────▼────────────────────────────────────┐
│                   NODE.JS BACKEND API (Render/Railway)               │
└──────┬──────────────────────┬──────────────────────┬─────────────────┘
       │                      │                      │
       │ SQL queries          │ ML API call          │ Scraping calls
┌──────▼───────┐    ┌─────────▼────────┐    ┌────────▼───────────────┐
│   MySQL DB   │    │  PYTHON ML API   │    │  SCRAPING LAYER        │
└──────────────┘    └──────────────────┘    └────────────────────────┘
```
</details>

---

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/your-username/antigravity.git
cd antigravity
```

### 2. Setup the Backend (Node.js)
```bash
cd backend
npm install
cp .env.example .env # Add your MySQL, Redis, and SendGrid keys
npm run dev
```

### 3. Setup the ML Service (Python)
```bash
cd ml
pip install -r requirements.txt
uvicorn main:app --reload
```

### 4. Setup the Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```
Your app will be running on `http://localhost:3000`.

---

## 🔮 Roadmap
- [ ] MVP v1.0 Launch (Web Platform)
- [ ] Browser Extension Integration
- [ ] Native Mobile Apps (iOS / Android)
- [ ] International Markets Support
- [ ] Community Reviews & Trust Score

---

<div align="center">
  <p>Built with ❤️ by The GC Coders.</p>
</div>
