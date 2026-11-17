"""
Comprehensive API test suite for PremiumPulse backend.
Tests authentication, dashboard, ML metrics, multi-agent prediction, wearable sync, and PDF reports.
"""

from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_api():
    print("=== 1. TESTING LOGIN ===")
    res = client.post("/api/auth/login", json={
        "email": "demo@premiumpulse.ai",
        "password": "Demo@12345"
    })
    assert res.status_code == 200, f"Login failed: {res.text}"
    token_data = res.json()
    token = token_data["access_token"]
    print("Login SUCCESS! Access token obtained.")
    headers = {"Authorization": f"Bearer {token}"}

    print("\n=== 2. TESTING GET /api/dashboard ===")
    res = client.get("/api/dashboard", headers=headers)
    assert res.status_code == 200, f"Dashboard failed: {res.text}"
    dash_data = res.json()
    print("Dashboard SUCCESS! User:", dash_data["user_name"])
    print("Has profile:", dash_data["has_profile"], "| History count:", dash_data["history_count"])
    if dash_data["latest_prediction"]:
        print("Latest Premium: ₹", dash_data["latest_prediction"]["predicted_premium_inr"])

    print("\n=== 3. TESTING GET /api/model/metrics ===")
    res = client.get("/api/model/metrics")
    assert res.status_code == 200, f"Model metrics failed: {res.text}"
    metrics = res.json()
    print("Model metrics SUCCESS! Best model:", metrics["best_model"])
    for m, vals in metrics["evaluation_metrics"].items():
        print(f"  - {m}: R²={vals['r2_score']} | MAE=₹{vals['mae_inr']}")

    print("\n=== 4. TESTING POST /api/predict (Full Multi-Agent Run) ===")
    pred_payload = {
        "age": 42,
        "gender": "female",
        "height_cm": 165.0,
        "weight_kg": 64.0,
        "smoker": "no",
        "physical_activity": "high",
        "daily_steps": 10500,
        "alcohol": "none",
        "medical_conditions": "None",
        "previous_medical_history": "None",
        "regular_checkups": True,
        "heart_rate": 66,
        "dependents": 2,
        "coverage_preference": "comprehensive",
        "region": "northeast"
    }
    res = client.post("/api/predict", json=pred_payload, headers=headers)
    assert res.status_code == 200, f"Predict failed: {res.text}"
    pred_res = res.json()
    new_id = pred_res["id"]
    print(f"Predict SUCCESS! ID: {new_id} | Premium: ₹{pred_res['predicted_premium_inr']:,.2f}")
    print(f"Risk: {pred_res['risk_category']} (Score: {pred_res['risk_score']}) | BMI: {pred_res['bmi']}")
    print(f"Agent Steps Count: {len(pred_res['agent_logs'])}")

    print("\n=== 5. TESTING POST /api/wearable/update ===")
    wearable_payload = {
        "steps": 11200,
        "heart_rate": 64,
        "weight": 63.5,
        "height_cm": 165.0,
        "activity_level": "high",
        "source": "simulated_apple_watch",
        "recalculate_premium": True
    }
    res = client.post("/api/wearable/update", json=wearable_payload, headers=headers)
    assert res.status_code == 200, f"Wearable update failed: {res.text}"
    w_data = res.json()
    print("Wearable update SUCCESS! Status:", w_data["status"])
    if w_data["recalculated_prediction"]:
        print("Auto Recalculated Premium: ₹", w_data["recalculated_prediction"]["predicted_premium_inr"])

    print(f"\n=== 6. TESTING GET /api/reports/{new_id}/download ===")
    res = client.get(f"/api/reports/{new_id}/download", headers=headers)
    assert res.status_code == 200, f"PDF download failed: {res.text}"
    assert len(res.content) > 1000, "PDF content seems too small"
    print(f"PDF download SUCCESS! Size: {len(res.content)} bytes")

    print("\n==========================================")
    print("   ALL BACKEND ENDPOINTS PASSED WITH 100% SUCCESS!   ")
    print("==========================================")

if __name__ == "__main__":
    test_api()

