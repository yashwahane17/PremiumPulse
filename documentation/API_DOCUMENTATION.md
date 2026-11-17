# PremiumPulse REST API Documentation

Base URL: `http://localhost:8000/api`

---

## 1. Authentication Endpoints

### `POST /auth/register`
Creates a new policyholder account.
- **Request Body:**
  ```json
  {
    "full_name": "Aarav Sharma",
    "email": "aarav@example.com",
    "password": "Password@123"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "access_token": "eyJhbGciOi...",
    "token_type": "bearer",
    "user": {
      "id": 1,
      "email": "aarav@example.com",
      "full_name": "Aarav Sharma"
    }
  }
  ```

### `POST /auth/login`
Authenticates user and returns JWT bearer token.
- **Request Body:**
  ```json
  {
    "email": "demo@premiumpulse.ai",
    "password": "Demo@12345"
  }
  ```
- **Response (200 OK):** Same token structure as register.

### `GET /auth/me`
Retrieves currently authenticated user profile.
- **Headers:** `Authorization: Bearer <token>`

---

## 2. Dashboard & Predictions

### `GET /dashboard`
Aggregates summary telemetry, active health profile, historical time-series, and latest prediction.
- **Headers:** `Authorization: Bearer <token>`
- **Response (200 OK):**
  ```json
  {
    "user_name": "Rajesh Verma",
    "has_profile": true,
    "latest_prediction": {
      "predicted_premium_inr": 26200.0,
      "premium_range_min": 23200.0,
      "premium_range_max": 29200.0,
      "risk_category": "Low Risk",
      "risk_score": 22.0,
      "bmi": 25.5,
      "model_used": "Linear Regression"
    },
    "history_count": 3,
    "history": [...]
  }
  ```

### `POST /predict`
Executes the full 4-agent autonomous pipeline and persists the underwriting report.
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
  ```json
  {
    "age": 35,
    "gender": "male",
    "height_cm": 175.0,
    "weight_kg": 76.0,
    "smoker": "no",
    "physical_activity": "moderate",
    "daily_steps": 7500,
    "alcohol": "occasional",
    "medical_conditions": "None",
    "previous_medical_history": "None",
    "regular_checkups": true,
    "heart_rate": 72,
    "dependents": 1,
    "coverage_preference": "standard",
    "region": "southwest"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "id": 5,
    "predicted_premium_inr": 25400.25,
    "premium_range_min": 22450.00,
    "premium_range_max": 28350.50,
    "risk_category": "Low Risk",
    "risk_score": 12.0,
    "bmi": 24.82,
    "bmi_category": "Normal",
    "model_used": "Linear Regression",
    "model_r2": 0.883,
    "model_comparisons": {
      "Linear Regression": 25400.25,
      "Random Forest": 27120.40,
      "XGBoost": 26890.10
    },
    "influencing_factors": [...],
    "explanation": "...",
    "improvement_tips": [...],
    "agent_logs": [...]
  }
  ```

### `GET /predictions/history`
Returns chronological list of all previous underwritten evaluations.

### `GET /predictions/{id}`
Returns complete breakdown, feature snapshot, and execution logs for a single prediction ID.

---

## 3. Wearable Health Data

### `POST /wearable/update`
Syncs smartwatch telemetry and triggers automatic recalculation.
- **Request Body:**
  ```json
  {
    "steps": 10500,
    "heart_rate": 66,
    "weight": 74.5,
    "activity_level": "high",
    "source": "simulated_apple_watch",
    "recalculate_premium": true
  }
  ```

### `GET /wearable/latest`
Fetches recent time-series wearable activity records.

---

## 4. Reports & Analytics

### `GET /model/metrics`
Returns benchmark metrics (MAE, RMSE, $R^2$) and feature importance distributions for all trained ML models.

### `GET /health/insights`
Returns detailed lifestyle risk analysis, BMI breakdown, and preventive health recommendations.

### `GET /reports/{id}/download`
Generates and streams an official, branded PDF underwriting report.

