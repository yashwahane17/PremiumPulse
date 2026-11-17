"""
Senior QA Engineer - Full Project Audit & Verification Suite for PremiumPulse
Exhaustively tests:
1. Database connectivity and table schemas
2. ML models loading and inference validity
3. Individual AI agents (Intake, Risk, Pricing, Insight) with boundary & error conditions
4. Central Orchestrator workflow and timing telemetry
5. Complete User-to-Prediction lifecycle via HTTP REST API (Registration, Login, Prediction, Wearable, PDF Report)
"""

import sys
import os
import json
import time
import uuid
from datetime import datetime

# Add root directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from fastapi.testclient import TestClient
from backend.main import app
from database.database import SessionLocal, engine, Base
from database.models import User, UserHealthProfile, PredictionHistory, AgentExecutionLog, WearableHealthData
from agents.intake_agent import IntakeAgent
from agents.risk_agent import RiskAssessmentAgent
from agents.pricing_agent import PricingAgent
from agents.insight_agent import InsightAgent
from agents.orchestrator import CentralOrchestrator
import joblib

client = TestClient(app)

def run_qa_audit():
    print("=" * 70)
    print("       PREMIUMPULSE SENIOR QA FULL-SYSTEM AUDIT SUITE       ")
    print("=" * 70)
    audit_passed = True
    audit_results = []

    def report_step(name: str, passed: bool, notes: str = ""):
        nonlocal audit_passed
        status_str = "PASS" if passed else "FAIL"
        symbol = "✓" if passed else "✗"
        if not passed:
            audit_passed = False
        print(f"[{symbol}] {status_str}: {name}")
        if notes:
            print(f"    -> {notes}")
        audit_results.append({"name": name, "status": status_str, "notes": notes})

    # =========================================================================
    # SECTION 1: DATABASE INTEGRITY & CONNECTIVITY
    # =========================================================================
    print("\n--- SECTION 1: DATABASE CONNECTIVITY & SCHEMAS ---")
    try:
        db = SessionLocal()
        user_count = db.query(User).count()
        pred_count = db.query(PredictionHistory).count()
        wearable_count = db.query(WearableHealthData).count()
        agent_log_count = db.query(AgentExecutionLog).count()
        db.close()
        report_step(
            "Database Connectivity", 
            True, 
            f"Connected to SQLite. Users: {user_count}, Predictions: {pred_count}, Wearable entries: {wearable_count}, Agent Logs: {agent_log_count}"
        )
    except Exception as e:
        report_step("Database Connectivity", False, str(e))

    # =========================================================================
    # SECTION 2: MACHINE LEARNING MODELS & DATASET INTEGRITY
    # =========================================================================
    print("\n--- SECTION 2: MACHINE LEARNING MODELS & PIPELINE AUDIT ---")
    models_dir = os.path.abspath("models")
    required_files = [
        "linear_regression.joblib",
        "random_forest.joblib",
        "xgboost.joblib",
        "model_metrics.json"
    ]
    for rf in required_files:
        path = os.path.join(models_dir, rf)
        exists = os.path.exists(path) and os.path.getsize(path) > 0
        report_step(f"ML Artifact: {rf}", exists, f"Size: {os.path.getsize(path) if exists else 0} bytes")

    try:
        with open(os.path.join(models_dir, "model_metrics.json"), "r") as f:
            metrics = json.load(f)
        best_model = metrics.get("best_model")
        lr_r2 = metrics["evaluation_metrics"]["Linear Regression"]["r2_score"]
        rf_r2 = metrics["evaluation_metrics"]["Random Forest"]["r2_score"]
        xgb_r2 = metrics["evaluation_metrics"]["XGBoost"]["r2_score"]
        r2_valid = (lr_r2 > 0.80) and (rf_r2 > 0.80) and (xgb_r2 > 0.80)
        report_step(
            "Model R² Benchmark Criteria (> 0.80)",
            r2_valid,
            f"LR: {lr_r2:.4f}, RF: {rf_r2:.4f}, XGB: {xgb_r2:.4f} (Best: {best_model})"
        )
    except Exception as e:
        report_step("Model R² Benchmark Criteria", False, str(e))

    # =========================================================================
    # SECTION 3: INDIVIDUAL AI AGENT AUDIT & BOUNDARY TESTING
    # =========================================================================
    print("\n--- SECTION 3: INDIVIDUAL AI AGENTS AUDIT ---")
    
    # --- Agent 1: Intake Agent ---
    intake = IntakeAgent()
    valid_raw = {
        "age": 32, "gender": "male", "height_cm": 178.0, "weight_kg": 76.0,
        "smoker": "no", "physical_activity": "moderate", "daily_steps": 8000,
        "alcohol": "occasional", "medical_conditions": "None", "previous_medical_history": "None",
        "regular_checkups": True, "heart_rate": 70, "dependents": 1,
        "coverage_preference": "standard", "region": "southwest"
    }
    
    # Valid intake
    try:
        v_data, v_log = intake.process(valid_raw)
        report_step("Agent 1 (Intake) - Valid Inputs Validation", v_log["status"] == "SUCCESS", v_log["summary"])
    except Exception as e:
        report_step("Agent 1 (Intake) - Valid Inputs Validation", False, str(e))

    # Boundary test: Invalid Age (< 18)
    try:
        bad_age = dict(valid_raw, age=12)
        intake.process(bad_age)
        report_step("Agent 1 (Intake) - Boundary Rejection: Age < 18", False, "Failed to reject age 12")
    except ValueError as ve:
        report_step("Agent 1 (Intake) - Boundary Rejection: Age < 18", True, f"Correctly rejected: {str(ve)[:60]}...")

    # Boundary test: Invalid Height (< 80 cm)
    try:
        bad_h = dict(valid_raw, height_cm=45.0)
        intake.process(bad_h)
        report_step("Agent 1 (Intake) - Boundary Rejection: Height < 80cm", False, "Failed to reject height 45cm")
    except ValueError as ve:
        report_step("Agent 1 (Intake) - Boundary Rejection: Height < 80cm", True, f"Correctly rejected: {str(ve)[:60]}...")

    # Consistency warning: declared high activity but logged 1,000 steps
    try:
        contradictory = dict(valid_raw, physical_activity="high", daily_steps=1000)
        _, c_log = intake.process(contradictory)
        has_warning = c_log["status"] == "WARNING" and len(c_log["details"]["warnings"]) > 0
        report_step("Agent 1 (Intake) - Inconsistency Detection", has_warning, f"Flagged: {c_log['details']['warnings'][0]}")
    except Exception as e:
        report_step("Agent 1 (Intake) - Inconsistency Detection", False, str(e))

    # --- Agent 2: Risk Assessment Agent ---
    risk_agent = RiskAssessmentAgent()
    try:
        bmi_val, bmi_cat = risk_agent.calculate_bmi(70.0, 175.0)
        expected_bmi = 22.86
        bmi_match = abs(bmi_val - expected_bmi) < 0.05 and bmi_cat == "Normal"
        report_step("Agent 2 (Risk) - Mathematical BMI Formula Accuracy", bmi_match, f"BMI: {bmi_val} ({bmi_cat})")
    except Exception as e:
        report_step("Agent 2 (Risk) - Mathematical BMI Formula Accuracy", False, str(e))

    # Stratification: Low Risk
    try:
        low_risk_data = dict(v_data, smoker="no", daily_steps=10000)
        low_res, low_log = risk_agent.process(low_risk_data)
        report_step("Agent 2 (Risk) - Low Risk Stratification", low_res["risk_category"] == "Low Risk", f"Category: {low_res['risk_category']}, Score: {low_res['risk_score']}")
    except Exception as e:
        report_step("Agent 2 (Risk) - Low Risk Stratification", False, str(e))

    # Stratification: High Risk (Smoker + Obese)
    try:
        high_risk_data = dict(v_data, smoker="yes", weight_kg=110.0, height_cm=170.0, medical_conditions="Hypertension, Diabetes")
        high_res, high_log = risk_agent.process(high_risk_data)
        report_step("Agent 2 (Risk) - High Risk Compound Stratification", high_res["risk_category"] == "High Risk", f"Category: {high_res['risk_category']}, Score: {high_res['risk_score']}")
    except Exception as e:
        report_step("Agent 2 (Risk) - High Risk Compound Stratification", False, str(e))

    # --- Agent 3: Pricing Agent ---
    pricing_agent = PricingAgent()
    try:
        price_res, price_log = pricing_agent.process(v_data, low_res)
        all_models_present = all(m in price_res["predictions_inr_comparison"] for m in ["Linear Regression", "Random Forest", "XGBoost"])
        prem_valid = price_res["predicted_premium_inr"] > 5000 and price_res["premium_range_min"] < price_res["predicted_premium_inr"] < price_res["premium_range_max"]
        report_step("Agent 3 (Pricing) - Multi-Model Inference & Range", all_models_present and prem_valid, f"Optimal: {price_res['selected_model']} => ₹{price_res['predicted_premium_inr']:,.2f} (Range: ₹{price_res['premium_range_min']:,.2f} - ₹{price_res['premium_range_max']:,.2f})")
    except Exception as e:
        report_step("Agent 3 (Pricing) - Multi-Model Inference & Range", False, str(e))

    # --- Agent 4: Insight Agent ---
    insight_agent = InsightAgent()
    try:
        insight_res, insight_log = insight_agent.process(v_data, low_res, price_res)
        has_factors = len(insight_res["influencing_factors"]) >= 2
        has_savings = len(insight_res["improvement_tips"]) >= 1
        has_explanation = len(insight_res["explanation"]) > 50
        report_step("Agent 4 (Insight) - Explainable AI & Rupee Savings", has_factors and has_savings and has_explanation, f"Factors: {len(insight_res['influencing_factors'])}, Savings Tips: {len(insight_res['improvement_tips'])}, Max Saving: ₹{insight_res['improvement_tips'][0]['potential_saving_inr']:,.2f}")
    except Exception as e:
        report_step("Agent 4 (Insight) - Explainable AI & Rupee Savings", False, str(e))

    # =========================================================================
    # SECTION 4: CENTRAL ORCHESTRATOR WORKFLOW AUDIT
    # =========================================================================
    print("\n--- SECTION 4: CENTRAL ORCHESTRATOR PIPELINE AUDIT ---")
    orchestrator = CentralOrchestrator()
    try:
        orch_res = orchestrator.run_pipeline(valid_raw)
        logs = orch_res.get("agent_logs", [])
        all_5_logged = len(logs) == 5
        agent_names = [l["agent_name"] for l in logs]
        expected_names = ["Intake Agent", "Risk Assessment Agent", "Pricing Agent", "Insight Agent", "Central Orchestrator"]
        names_matched = all(n in agent_names for n in expected_names)
        timing = sum(l["execution_time_ms"] for l in logs)
        report_step("Orchestrator 5-Stage Sequencing & Telemetry", all_5_logged and names_matched, f"Completed all 5 agents in ~{timing:.1f}ms total pipeline time.")
    except Exception as e:
        report_step("Orchestrator 5-Stage Sequencing & Telemetry", False, str(e))

    # =========================================================================
    # SECTION 5: COMPLETE USER-TO-PREDICTION INTEGRATION (REST API)
    # =========================================================================
    print("\n--- SECTION 5: REAL USER END-TO-END REST API AUDIT ---")
    
    unique_email = f"qa_user_{uuid.uuid4().hex[:8]}@testdomain.com"
    user_pw = "SecurePass@2026"
    user_name = "Priya Ananth"

    # 1. Register brand new user
    reg_res = client.post("/api/auth/register", json={
        "full_name": user_name,
        "email": unique_email,
        "password": user_pw
    })
    reg_ok = reg_res.status_code == 200 and "access_token" in reg_res.json()
    new_token = reg_res.json().get("access_token")
    auth_header = {"Authorization": f"Bearer {new_token}"}
    report_step("API: POST /api/auth/register (New User Creation)", reg_ok, f"User: {unique_email}, ID: {reg_res.json().get('user', {}).get('id')}")

    # 2. Login with valid credentials
    login_res = client.post("/api/auth/login", json={
        "email": unique_email,
        "password": user_pw
    })
    login_ok = login_res.status_code == 200 and "access_token" in login_res.json()
    report_step("API: POST /api/auth/login (Valid Credentials)", login_ok, "JWT Access Token received")

    # 3. Login with invalid credentials (must reject 401)
    bad_login = client.post("/api/auth/login", json={
        "email": unique_email,
        "password": "WrongPassword!"
    })
    bad_login_rejected = bad_login.status_code == 401
    report_step("API: POST /api/auth/login (Rejects Wrong Password)", bad_login_rejected, f"Status code: {bad_login.status_code}")

    # 4. Dashboard for fresh user (Must handle 0 predictions gracefully)
    dash_fresh = client.get("/api/dashboard", headers=auth_header)
    dash_fresh_ok = dash_fresh.status_code == 200 and dash_fresh.json()["history_count"] == 0 and dash_fresh.json()["latest_prediction"] is None
    report_step("API: GET /api/dashboard (Empty State Handling)", dash_fresh_ok, "Properly handles 0 predictions without errors")

    # 5. Predict Premium for new user (Full multi-agent pipeline)
    pred_payload = {
        "age": 29,
        "gender": "female",
        "height_cm": 164.0,
        "weight_kg": 58.0,
        "smoker": "no",
        "physical_activity": "high",
        "daily_steps": 11500,
        "alcohol": "none",
        "medical_conditions": "None",
        "previous_medical_history": "None",
        "regular_checkups": True,
        "heart_rate": 64,
        "dependents": 0,
        "coverage_preference": "comprehensive",
        "region": "northeast"
    }
    pred_api_res = client.post("/api/predict", json=pred_payload, headers=auth_header)
    pred_api_ok = pred_api_res.status_code == 200
    pred_data = pred_api_res.json() if pred_api_ok else {}
    pred_id = pred_data.get("id")
    report_step("API: POST /api/predict (Multi-Agent Underwriting)", pred_api_ok, f"Prediction ID: {pred_id}, Premium: ₹{pred_data.get('predicted_premium_inr', 0):,.2f}, Risk: {pred_data.get('risk_category')}")

    # 6. Verify Database Persistence for new user
    db = SessionLocal()
    saved_pred = db.query(PredictionHistory).filter(PredictionHistory.id == pred_id).first()
    saved_profile = db.query(UserHealthProfile).filter(UserHealthProfile.user_id == saved_pred.user_id if saved_pred else 0).first()
    saved_logs = db.query(AgentExecutionLog).filter(AgentExecutionLog.prediction_id == pred_id).count() if saved_pred else 0
    db.close()
    db_verified = (saved_pred is not None) and (saved_profile is not None) and (saved_logs == 5)
    report_step("Database Persistence Verification", db_verified, f"Prediction stored: {saved_pred is not None}, Profile: {saved_profile is not None}, Agent logs persisted: {saved_logs}/5")

    # 7. Wearable Telemetry Sync & Auto-Recalculation
    wearable_payload = {
        "steps": 12800,
        "heart_rate": 60,
        "weight": 57.5,
        "height_cm": 164.0,
        "activity_level": "high",
        "source": "simulated_apple_watch",
        "recalculate_premium": True
    }
    wearable_res = client.post("/api/wearable/update", json=wearable_payload, headers=auth_header)
    wearable_ok = wearable_res.status_code == 200 and wearable_res.json().get("recalculated_prediction") is not None
    report_step("API: POST /api/wearable/update (Sync & Auto-Recalculate)", wearable_ok, f"Recalculated Premium: ₹{wearable_res.json().get('recalculated_prediction', {}).get('predicted_premium_inr', 0):,.2f}")

    # 8. Prediction History API
    hist_res = client.get("/api/predictions/history", headers=auth_header)
    hist_ok = hist_res.status_code == 200 and len(hist_res.json()) >= 2
    report_step("API: GET /api/predictions/history", hist_ok, f"Retrieved {len(hist_res.json())} historical estimates")

    # 9. Individual Prediction Detail API
    detail_res = client.get(f"/api/predictions/{pred_id}", headers=auth_header)
    detail_ok = detail_res.status_code == 200 and detail_res.json().get("id") == pred_id
    report_step(f"API: GET /api/predictions/{pred_id} (Detail Report)", detail_ok, f"Loaded model comparisons: {list(detail_res.json().get('model_comparisons', {}).keys())}")

    # 10. Health Insights API
    insights_res = client.get("/api/health/insights", headers=auth_header)
    insights_ok = insights_res.status_code == 200 and "bmi_analysis" in insights_res.json()
    report_step("API: GET /api/health/insights", insights_ok, f"BMI Analysis: {insights_res.json().get('bmi_analysis', {}).get('category')}")

    # 11. Model Metrics API
    metrics_res = client.get("/api/model/metrics")
    metrics_ok = metrics_res.status_code == 200 and "evaluation_metrics" in metrics_res.json()
    report_step("API: GET /api/model/metrics", metrics_ok, f"Best model: {metrics_res.json().get('best_model')}")

    # 12. PDF Report Generation & Download via Header Auth
    pdf_header_res = client.get(f"/api/reports/{pred_id}/download", headers=auth_header)
    pdf_header_ok = pdf_header_res.status_code == 200 and len(pdf_header_res.content) > 3000 and pdf_header_res.content.startswith(b"%PDF")
    report_step("API: GET /api/reports/{id}/download (Bearer Header)", pdf_header_ok, f"PDF generated: {len(pdf_header_res.content):,} bytes, Signature: {pdf_header_res.content[:4]}")

    # 13. PDF Report Download via Query Parameter Token
    pdf_query_res = client.get(f"/api/reports/{pred_id}/download?token={new_token}")
    pdf_query_ok = pdf_query_res.status_code == 200 and len(pdf_query_res.content) > 3000 and pdf_query_res.content.startswith(b"%PDF")
    report_step("API: GET /api/reports/{id}/download (Query Parameter Token)", pdf_query_ok, f"Query token auth succeeded ({len(pdf_query_res.content):,} bytes)")

    # 14. PDF Report Download Unauthorized Rejection
    pdf_unauth_res = client.get(f"/api/reports/{pred_id}/download")
    pdf_unauth_rejected = pdf_unauth_res.status_code == 401
    report_step("API: GET /api/reports/{id}/download (Rejects Unauthorized)", pdf_unauth_rejected, f"Status code: {pdf_unauth_res.status_code}")

    # =========================================================================
    # SUMMARY REPORT
    # =========================================================================
    print("\n" + "=" * 70)
    passed_count = sum(1 for r in audit_results if r["status"] == "PASS")
    total_count = len(audit_results)
    print(f"AUDIT SUMMARY: {passed_count}/{total_count} CHECKS PASSED ({passed_count/total_count*100:.1f}%)")
    print("=" * 70)
    
    if audit_passed:
        print("\n🎉 ALL SYSTEMS VERIFIED: 100% PRODUCTION READY FOR HACKATHON EVALUATION!")
    else:
        print("\n⚠️ SOME AUDIT CHECKS FAILED. INVESTIGATE LOGS ABOVE.")
        sys.exit(1)

if __name__ == "__main__":
    run_qa_audit()

