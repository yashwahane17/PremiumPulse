"""
Comprehensive RBAC and End-to-End Audit Test Suite for PremiumPulse
Tests:
1. Public registration creates role="USER" (preventing role escalation)
2. Customer login & JWT validation
3. Admin login endpoint (/api/auth/admin/login): enforces role="ADMIN", rejects normal users with 403
4. Strict RBAC: normal users calling /api/admin/* endpoints are rejected with 403 Forbidden
5. Admin endpoints: /api/admin/overview, users, predictions, agents, models, system-health, analytics
6. Account status toggling: activate/deactivate, prevents deactivated users from logging in
7. User Data Isolation: User B cannot access User A's prediction records or history
8. User Profile API: GET /api/profile and PUT /api/profile calculates BMI and updates profile
"""

import sys
import os
import json
from fastapi.testclient import TestClient

# Ensure current directory is on PYTHONPATH
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from backend.main import app

client = TestClient(app)

def run_tests():
    print("=" * 70)
    print("PREMIUMPULSE RBAC & MULTI-PORTAL SYSTEM AUDIT")
    print("=" * 70)

    # -------------------------------------------------------------
    # TEST 1: Public Registration (Always role="USER")
    # -------------------------------------------------------------
    print("\n[TEST 1] Testing Public Registration & Role Escalation Prevention...")
    import time
    ts = int(time.time())
    user_a_email = f"audit_user_a_{ts}@example.com"
    user_b_email = f"audit_user_b_{ts}@example.com"
    password = "SecurePassword@123"

    # Register User A (Attempting to inject role="ADMIN")
    resp = client.post("/api/auth/register", json={
        "full_name": "Audit User A",
        "email": user_a_email,
        "password": password,
        "role": "ADMIN"  # Malicious injection attempt
    })
    assert resp.status_code == 200, f"Registration failed: {resp.text}"
    user_a_data = resp.json()
    assert user_a_data["user"]["role"] == "USER", f"Role escalation bug! Got: {user_a_data['user']['role']}"
    user_a_token = user_a_data["access_token"]
    user_a_id = user_a_data["user"]["id"]
    print(f"  ✓ User A registered successfully. Role is strictly enforced as: {user_a_data['user']['role']}")

    # Register User B
    resp_b = client.post("/api/auth/register", json={
        "full_name": "Audit User B",
        "email": user_b_email,
        "password": password
    })
    assert resp_b.status_code == 200
    user_b_token = resp_b.json()["access_token"]
    user_b_id = resp_b.json()["user"]["id"]
    print(f"  ✓ User B registered successfully with ID: {user_b_id}")

    # -------------------------------------------------------------
    # TEST 2: Admin Login Endpoint Security
    # -------------------------------------------------------------
    print("\n[TEST 2] Testing Admin Login Endpoint (/api/auth/admin/login)...")
    # Try logging in User A (customer) at admin endpoint -> Should fail with 403
    resp = client.post("/api/auth/admin/login", json={
        "email": user_a_email,
        "password": password
    })
    assert resp.status_code == 403, f"Expected 403 Forbidden for customer at admin login, got {resp.status_code}"
    print(f"  ✓ Customer login at admin endpoint rejected with HTTP 403 Forbidden: {resp.json().get('detail')}")

    # Login real admin
    resp = client.post("/api/auth/admin/login", json={
        "email": "admin@premiumpulse.ai",
        "password": "Admin@Pulse2026!"
    })
    assert resp.status_code == 200, f"Admin login failed: {resp.text}"
    admin_data = resp.json()
    assert admin_data["user"]["role"] == "ADMIN"
    admin_token = admin_data["access_token"]
    print(f"  ✓ Administrator successfully logged in. Role: {admin_data['user']['role']}")

    # -------------------------------------------------------------
    # TEST 3: Strict RBAC Barrier (Normal User cannot access Admin APIs)
    # -------------------------------------------------------------
    print("\n[TEST 3] Testing RBAC Enforcement (Customer calling /api/admin/*)...")
    customer_headers = {"Authorization": f"Bearer {user_a_token}"}
    admin_headers = {"Authorization": f"Bearer {admin_token}"}

    admin_endpoints = [
        "/api/admin/overview",
        "/api/admin/users",
        "/api/admin/predictions",
        "/api/admin/agents",
        "/api/admin/models",
        "/api/admin/system-health",
        "/api/admin/analytics",
    ]

    for ep in admin_endpoints:
        r = client.get(ep, headers=customer_headers)
        assert r.status_code == 403, f"Endpoint {ep} allowed customer! Status: {r.status_code}"
        print(f"  ✓ {ep} -> HTTP 403 Forbidden (Blocked for normal customer)")

    # -------------------------------------------------------------
    # TEST 4: Admin Portal Capabilities
    # -------------------------------------------------------------
    print("\n[TEST 4] Testing Admin Portal Data Retrieval...")
    # 1. Overview
    r = client.get("/api/admin/overview", headers=admin_headers)
    assert r.status_code == 200
    overview = r.json()
    assert "total_users" in overview and "active_users" in overview
    print(f"  ✓ /api/admin/overview: {overview['total_users']} total users, {overview['total_predictions']} predictions")

    # 2. Users directory
    r = client.get("/api/admin/users", headers=admin_headers)
    assert r.status_code == 200
    users_list = r.json()
    assert len(users_list) >= 2
    print(f"  ✓ /api/admin/users: Retrieved {len(users_list)} users in directory")

    # 3. Agents Telemetry
    r = client.get("/api/admin/agents", headers=admin_headers)
    assert r.status_code == 200
    agents_data = r.json()
    assert len(agents_data["agents"]) == 5
    print(f"  ✓ /api/admin/agents: Monitored {len(agents_data['agents'])} agents. Orchestrator: {agents_data['orchestrator_status']}")

    # 4. ML Models
    r = client.get("/api/admin/models", headers=admin_headers)
    assert r.status_code == 200
    models_data = r.json()
    assert models_data["models"]["xgboost.joblib"]["loaded"] is True
    print(f"  ✓ /api/admin/models: XGBoost loaded={models_data['models']['xgboost.joblib']['loaded']}, size={models_data['models']['xgboost.joblib']['size_kb']} KB")

    # 5. System Health
    r = client.get("/api/admin/system-health", headers=admin_headers)
    assert r.status_code == 200
    health = r.json()
    assert health["backend_status"] == "HEALTHY"
    assert health["database_status"] == "CONNECTED"
    print(f"  ✓ /api/admin/system-health: DB Latency={health['database_latency_ms']} ms, Memory={health['memory_usage_mb']} MB")

    # 6. Analytics
    r = client.get("/api/admin/analytics", headers=admin_headers)
    assert r.status_code == 200
    print(f"  ✓ /api/admin/analytics: Retrieved risk and model distribution matrices")

    # -------------------------------------------------------------
    # TEST 5: Account Status Toggling (Deactivate & Reactivate)
    # -------------------------------------------------------------
    print("\n[TEST 5] Testing User Account Deactivation & Login Prevention...")
    # Admin deactivates User A
    r = client.patch(f"/api/admin/users/{user_a_id}/status", json={"is_active": False}, headers=admin_headers)
    assert r.status_code == 200
    assert r.json()["user"]["is_active"] is False
    print(f"  ✓ Admin deactivated User A (ID: {user_a_id})")

    # User A tries to log in while deactivated -> Must return 403
    r = client.post("/api/auth/login", json={"email": user_a_email, "password": password})
    assert r.status_code == 403, f"Expected 403 for deactivated user, got {r.status_code}"
    print(f"  ✓ Deactivated User A login blocked with HTTP 403: {r.json().get('detail')}")

    # Admin reactivates User A
    r = client.patch(f"/api/admin/users/{user_a_id}/status", json={"is_active": True}, headers=admin_headers)
    assert r.status_code == 200
    assert r.json()["user"]["is_active"] is True
    print(f"  ✓ Admin reactivated User A (ID: {user_a_id})")

    # User A logs in successfully again
    r = client.post("/api/auth/login", json={"email": user_a_email, "password": password})
    assert r.status_code == 200
    user_a_token = r.json()["access_token"]
    customer_headers = {"Authorization": f"Bearer {user_a_token}"}
    print(f"  ✓ Reactivated User A successfully logged in again")

    # -------------------------------------------------------------
    # TEST 6: User Data Isolation (User B cannot see User A's data)
    # -------------------------------------------------------------
    print("\n[TEST 6] Testing User Data Isolation & Prediction Underwriting...")
    # User A runs a premium prediction
    pred_payload = {
        "age": 35,
        "gender": "male",
        "height_cm": 178.0,
        "weight_kg": 76.0,
        "smoker": "no",
        "physical_activity": "moderate",
        "daily_steps": 8500,
        "alcohol": "none",
        "medical_conditions": "None",
        "previous_medical_history": "None",
        "regular_checkups": True,
        "heart_rate": 70,
        "dependents": 1,
        "coverage_preference": "standard",
        "region": "southwest"
    }
    r = client.post("/api/predict", json=pred_payload, headers=customer_headers)
    assert r.status_code == 200, f"Prediction failed: {r.text}"
    user_a_pred = r.json()
    pred_id = user_a_pred["id"]
    print(f"  ✓ User A created prediction #{pred_id}: ₹{user_a_pred['predicted_premium_inr']:,} ({user_a_pred['model_used']})")

    # User B queries User A's prediction #{pred_id} directly -> Must be 404 (Not Found / Forbidden)
    user_b_headers = {"Authorization": f"Bearer {user_b_token}"}
    r = client.get(f"/api/predictions/{pred_id}", headers=user_b_headers)
    assert r.status_code == 404, f"Data isolation breach! User B was able to access User A's prediction: {r.status_code}"
    print(f"  ✓ User B query for User A's prediction returned HTTP 404 (Isolated by User ID)")

    # User B queries their own history -> Must be empty
    r = client.get("/api/predictions/history", headers=user_b_headers)
    assert r.status_code == 200
    user_b_history = r.json()
    assert len(user_b_history) == 0, f"User B history contains foreign records!"
    print(f"  ✓ User B history is completely clean ({len(user_b_history)} records)")

    # Admin queries prediction #{pred_id} -> Allowed (Admin has actuarial audit access)
    r = client.get(f"/api/predictions/{pred_id}", headers=admin_headers)
    assert r.status_code == 200
    print(f"  ✓ Admin verified prediction #{pred_id} audit record")

    # -------------------------------------------------------------
    # TEST 7: Customer Profile API & Dynamic BMI Calculation
    # -------------------------------------------------------------
    print("\n[TEST 7] Testing Customer Profile GET & PUT APIs...")
    # User A gets profile
    r = client.get("/api/profile", headers=customer_headers)
    assert r.status_code == 200
    prof = r.json()
    assert prof["email"] == user_a_email
    print(f"  ✓ GET /api/profile returned user profile for {prof['email']}")

    # User A updates profile with height=180, weight=72 (BMI = 72 / 1.8^2 = 22.22)
    update_payload = {
        "age": 36,
        "gender": "male",
        "height_cm": 180.0,
        "weight_kg": 72.0,
        "smoker": "no",
        "physical_activity": "high",
        "daily_steps": 10000,
        "alcohol": "none",
        "medical_conditions": "None",
        "previous_medical_history": "None",
        "regular_checkups": True,
        "heart_rate": 65,
        "dependents": 2,
        "coverage_preference": "comprehensive",
        "region": "southwest"
    }
    r = client.put("/api/profile", json=update_payload, headers=customer_headers)
    assert r.status_code == 200
    update_res = r.json()
    assert update_res["bmi"] == 22.22, f"Expected BMI 22.22, got {update_res['bmi']}"
    print(f"  ✓ PUT /api/profile recalculated and saved BMI: {update_res['bmi']}")

    print("\n" + "=" * 70)
    print("ALL AUDIT TESTS PASSED SUCCESSFULLY! (7/7 VERIFIED)")
    print("=" * 70)

if __name__ == "__main__":
    run_tests()
