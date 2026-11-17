# PremiumPulse – AI-Agent Powered Health Insurance Premium Prediction System

> **Official Project for The Big Hack 2026**  
> An autonomous multi-agent insurtech platform that combines classical actuarial science, multi-model machine learning, and explainable AI (XAI) to deliver fair, transparent, and personalized health insurance premium predictions.

---

## 🌟 Executive Summary

Health insurance underwriting has historically suffered from opaque pricing models, static actuarial tables, and broad risk pools that penalize healthy individuals. **PremiumPulse** solves this challenge through an autonomous multi-agent AI architecture and multi-model machine learning pipeline:

- **Intake Agent:** Enforces strict physiological bounds checking and data sanitization.
- **Risk Assessment Agent:** Computes exact BMI and stratifies cardiovascular morbidity hazard into Low, Moderate, and High Risk tiers.
- **Pricing Agent:** Simultaneously benchmarks **Linear Regression**, **Random Forest**, and **XGBoost Regressors** trained on medical expense datasets, selecting the optimal estimator dynamically.
- **Insight Agent:** Explains predictions using Explainable AI (XAI), details primary cost drivers, and quantifies potential rupee savings from healthier habits.
- **Central Orchestrator:** Coordinates data flow, logs sub-millisecond execution telemetry, and compiles persistent underwriting reports.
- **Wearable Telemetry:** Live smartwatch data synchronization (Apple Watch, Fitbit, Garmin) with automated real-time premium recalculation.
- **Automated PDF Reports:** One-click generation of branded, institutional-grade underwriting documents using ReportLab.

---

## 🏗️ Multi-Agent AI Architecture

```
User Biometrics & Telemetry
             │
             ▼
   [Central Orchestrator]
             │
   ┌─────────┴───────────────────────────────────────────┐
   │ 1. Telemetry Stream                                 │
   ▼                                                     │
[Intake Agent] ──> Bounds & Anomaly Validation           │
   │                                                     │
   │ 2. Validated Schema                                 │
   ▼                                                     │
[Risk Assessment Agent] ──> BMI & Clinical Risk Scoring  │
   │                                                     │
   │ 3. Risk Stratification                              │
   ▼                                                     │
[Pricing Agent] ──> Benchmark 3 ML Models (LR, RF, XGB)  │
   │                                                     │
   │ 4. Selected Premium & Confidence Interval           │
   ▼                                                     │
[Insight Agent] ──> XAI Cost Drivers & Rupee Savings     │
   │                                                     │
   └─────────────────────────────────────────────────────┘
             │
             ▼ 5. Telemetry & Audit Logs
   [Central Orchestrator] ──> Persists to DB & Generates PDF
             │
             ▼
   [Interactive React Dashboard]
```

---

## 📊 Machine Learning Model Benchmarks

Models trained on the **Kaggle Medical Cost Personal Dataset** ($1,338$ samples, $80/20$ train/test split):

| Model Architecture | Algorithm Class | $R^2$ Score | MAE (USD) | MAE (INR Calibrated) |
| :--- | :--- | :--- | :--- | :--- |
| **Linear Regression** | Ordinary Least Squares with Interactions | **$0.8830$** | **$\$2,315.52$** | **$₹10,634.04$** |
| **XGBoost Regressor** | Extreme Gradient Boosted Trees ($150$ est) | **$0.8769$** | **$\$2,421.53$** | **$₹11,120.90$** |
| **Random Forest** | Nonlinear Bagging Ensemble ($150$ trees) | **$0.8702$** | **$\$2,549.09$** | **$₹11,706.68$** |

### Key Feature Drivers:
1. `smoker_bmi_interaction` ($73.0\%$ importance weight)
2. `smoker_obese_interaction` ($11.5\%$ importance weight)
3. `age_squared` ($6.3\%$ importance weight)
4. `age` ($5.5\%$ importance weight)

---

## 🛠️ Technology Stack

- **Frontend:** React 19, Vite 8, Tailwind CSS v4, Lucide React, Recharts
- **Backend:** Python 3.14 / 3.13, FastAPI, Pydantic v2, Uvicorn
- **Machine Learning:** Scikit-learn, XGBoost, Pandas, NumPy, Joblib
- **Database:** SQLite with SQLAlchemy ORM (WAL mode, migration-ready)
- **Security:** PBKDF2-SHA256 password hashing with salt, JWT token authorization
- **Reporting:** ReportLab PDF document engine
- **AI Agents:** Python multi-agent architecture with optional Google Gemini API integration and expert rule-based fallback

---

## 📁 Project Folder Structure

```
prime_agent/
├── backend/                  # FastAPI Application & Endpoints
│   ├── main.py               # REST API Endpoints & CORS
│   ├── auth_utils.py         # PBKDF2 Password Hashing & JWT
│   ├── schemas.py            # Pydantic Request/Response Models
│   └── report_generator.py   # ReportLab PDF Generation Engine
├── agents/                   # Autonomous AI Agents
│   ├── intake_agent.py       # Agent 1: Bounds & Data Validation
│   ├── risk_agent.py         # Agent 2: BMI & Hazard Stratification
│   ├── pricing_agent.py      # Agent 3: Multi-Model ML Inference
│   ├── insight_agent.py      # Agent 4: XAI & Lifestyle Savings
│   └── orchestrator.py       # Central Multi-Agent Orchestrator
├── ml/                       # Machine Learning Pipeline
│   └── train_models.py       # ML Training, Evaluation & Serialization
├── database/                 # Database Layer
│   ├── database.py           # SQLite Connection & Session Maker
│   ├── models.py             # SQLAlchemy ORM Data Models
│   └── init_db.py            # DB Initialization & Demo Seeding
├── datasets/                 # Training Data
│   └── insurance.csv         # Kaggle Medical Cost Personal Dataset
├── models/                   # Serialized ML Models & Metrics
│   ├── linear_regression.joblib
│   ├── random_forest.joblib
│   ├── xgboost.joblib
│   └── model_metrics.json
├── reports/                  # Generated PDF Reports
├── documentation/            # Technical Specifications
│   ├── ARCHITECTURE.md       # Multi-Agent Architecture & Formulas
│   └── API_DOCUMENTATION.md  # Detailed REST API Documentation
├── frontend/                 # React 19 + Vite Application
│   ├── src/
│   │   ├── api/api.js        # API Client with Token Injection
│   │   ├── context/          # Auth Context State
│   │   ├── components/       # Navbar, Footer, Modals (Wearable, Compare)
│   │   └── pages/            # 8 Interactive Application Pages
│   └── vite.config.js
├── requirements.txt          # Python Dependencies
├── .env.example              # Environment Configuration
├── test_backend_api.py       # Automated API Test Suite
└── README.md                 # Project Overview & Quick Start
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Python 3.10+ (Tested on 3.13 & 3.14)
- Node.js v18+ & npm v9+

### 2. Backend Setup
1. Open a terminal in the project root:
   ```bash
   # Install dependencies
   pip install -r requirements.txt

   # Initialize database & seed demo account
   python -m database.init_db

   # Start FastAPI backend server
   python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
   ```
2. The interactive Swagger API documentation will be live at: `http://localhost:8000/docs`

### 3. Frontend Setup
1. Open a second terminal and navigate to `frontend`:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
2. Access the frontend application at: `http://localhost:5173`

---

## 🔑 Pre-Seeded Demo Credentials

For hackathon judges and evaluators, a pre-seeded account is ready:
- **Email:** `demo@premiumpulse.ai`
- **Password:** `Demo@12345`
- Or simply click the **"One-Click Demo Account (Rajesh Verma)"** button on the Sign-In page!

---

## 🧪 Automated Testing

Execute the automated end-to-end verification suite:
```bash
python test_backend_api.py
```
This verifies:
1. User authentication and JWT issuance
2. Dashboard telemetry retrieval
3. Model evaluation metrics ($R^2$, MAE, RMSE)
4. Multi-agent pipeline execution across all 4 agents + Orchestrator
5. Smartwatch wearable synchronization with dynamic premium recalculation
6. High-resolution PDF report generation and binary streaming

---

## ⚖️ Regulatory Notice & Disclaimer

PremiumPulse is an educational underwriting prediction tool powered by machine learning algorithms. The estimates produced are intended to promote risk awareness and healthy lifestyle habits. They do not constitute an official medical diagnosis, binding insurance quote, or guaranteed policy issuance.

