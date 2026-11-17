"""
PremiumPulse FastAPI Application
Provides RESTful APIs for customer authentication, multi-agent AI orchestration,
ML predictions, wearable sync, health analytics, PDF reports,
and a dedicated Admin Portal for enterprise monitoring & website management.
"""

import os
import sys
import time
import json
from datetime import datetime, timezone, timedelta
from typing import List, Optional, Dict, Any
from fastapi import FastAPI, Depends, HTTPException, status, Header, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from sqlalchemy import desc, func, or_, text
from sqlalchemy.exc import IntegrityError
import psutil

from database.database import get_db, engine, Base, DB_PATH
from database.models import (
    User, UserHealthProfile, PredictionHistory, 
    AgentExecutionLog, WearableHealthData, SystemActivityLog
)
from backend.auth_utils import (
    hash_password, verify_password, create_access_token, 
    get_current_user, get_current_admin, get_current_customer, 
    get_user_from_token_string
)
from backend.schemas import (
    UserRegister, UserLogin, AdminLogin, TokenResponse, UserResponse,
    HealthProfileInput, PredictionResult, WearableInput, DashboardSummary,
    AdminOverview, AdminUserItem, AdminUserStatusUpdate, AdminPredictionItem,
    AdminAgentMetric, AdminAgentsResponse, AdminSystemHealth
)
from agents.orchestrator import CentralOrchestrator
from backend.report_generator import generate_pdf_report

SERVER_START_TIME = time.time()

# Initialize app
app = FastAPI(
    title="PremiumPulse AI - Health Insurance Underwriting & Admin API",
    description="Multi-Agent AI, Machine Learning, and Role-Based Enterprise Underwriting Platform",
    version="2.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Central Orchestrator Instance
orchestrator = CentralOrchestrator(models_dir=os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "models")))

# Ensure DB tables exist
Base.metadata.create_all(bind=engine)

@app.get("/")
@app.get("/api/health")
def health_check():
    return {
        "status": "HEALTHY",
        "service": "PremiumPulse API",
        "version": "2.0.0",
        "models_loaded": True,
        "agents_ready": True,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

def log_activity(db: Session, activity_type: str, description: str, user_id: Optional[int] = None, ip_address: Optional[str] = None):
    try:
        activity = SystemActivityLog(
            activity_type=activity_type,
            description=description,
            user_id=user_id,
            ip_address=ip_address,
            created_at=datetime.now(timezone.utc)
        )
        db.add(activity)
        db.commit()
    except Exception as e:
        print(f"Activity logging error: {e}")

# =====================================================================
# 1. AUTHENTICATION ENDPOINTS (USER & ADMIN)
# =====================================================================

@app.post("/api/auth/register", response_model=TokenResponse)
def register(user_in: UserRegister, request: Request, db: Session = Depends(get_db)):
    """Public customer registration. Always creates USER accounts."""
    existing = db.query(User).filter(User.email == user_in.email.lower().strip()).first()
    if existing:
        raise HTTPException(status_code=400, detail="An account with this email already exists.")
    
    new_user = User(
        email=user_in.email.lower().strip(),
        hashed_password=hash_password(user_in.password),
        full_name=user_in.full_name.strip(),
        role="USER",
        is_active=True,
        last_login=datetime.now(timezone.utc)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    log_activity(db, "USER_REGISTER", f"Customer registered: {new_user.email}", user_id=new_user.id, ip_address=request.client.host if request.client else None)

    token = create_access_token(data={"sub": str(new_user.id), "role": "USER", "email": new_user.email})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": new_user.id,
            "email": new_user.email,
            "full_name": new_user.full_name,
            "role": new_user.role,
            "is_active": new_user.is_active
        }
    }

@app.post("/api/auth/login", response_model=TokenResponse)
def login(login_in: UserLogin, request: Request, db: Session = Depends(get_db)):
    """Customer and general user login."""
    user = db.query(User).filter(User.email == login_in.email.lower().strip()).first()
    if not user or not verify_password(login_in.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password combination."
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account has been deactivated. Please contact an administrator."
        )

    user.last_login = datetime.now(timezone.utc)
    db.commit()

    log_activity(db, "USER_LOGIN", f"User logged in: {user.email}", user_id=user.id, ip_address=request.client.host if request.client else None)

    token = create_access_token(data={"sub": str(user.id), "role": user.role, "email": user.email})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role,
            "is_active": user.is_active
        }
    }

@app.post("/api/auth/admin/login", response_model=TokenResponse)
def admin_login(login_in: AdminLogin, request: Request, db: Session = Depends(get_db)):
    """Dedicated Admin Portal login. Enforces ADMIN role and active status."""
    user = db.query(User).filter(User.email == login_in.email.lower().strip()).first()
    if not user or not verify_password(login_in.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid administrator credentials."
        )
    
    if user.role != "ADMIN":
        log_activity(db, "UNAUTHORIZED_ADMIN_ATTEMPT", f"Non-admin user attempted admin login: {user.email}", user_id=user.id, ip_address=request.client.host if request.client else None)
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. Administrator privileges required."
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Administrator account is deactivated."
        )

    user.last_login = datetime.now(timezone.utc)
    db.commit()

    log_activity(db, "ADMIN_LOGIN", f"Administrator logged into admin portal: {user.email}", user_id=user.id, ip_address=request.client.host if request.client else None)

    token = create_access_token(data={"sub": str(user.id), "role": "ADMIN", "email": user.email})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role,
            "is_active": user.is_active
        }
    }

@app.get("/api/auth/me", response_model=UserResponse)
def get_profile(current_user: User = Depends(get_current_user)):
    return current_user

@app.get("/api/profile")
def get_user_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(UserHealthProfile).filter(UserHealthProfile.user_id == current_user.id).first()
    profile_dict = None
    if profile:
        profile_dict = {
            "age": profile.age,
            "gender": profile.gender,
            "height_cm": profile.height_cm,
            "weight_kg": profile.weight_kg,
            "bmi": profile.bmi,
            "smoker": profile.smoker,
            "physical_activity": profile.physical_activity,
            "daily_steps": profile.daily_steps,
            "alcohol": profile.alcohol,
            "medical_conditions": profile.medical_conditions,
            "previous_medical_history": profile.previous_medical_history,
            "regular_checkups": profile.regular_checkups,
            "heart_rate": profile.heart_rate,
            "dependents": profile.dependents,
            "coverage_preference": profile.coverage_preference,
            "region": profile.region,
            "updated_at": profile.updated_at.isoformat() if profile.updated_at else None
        }
    
    return {
        "user_id": current_user.id,
        "email": current_user.email,
        "full_name": current_user.full_name,
        "role": current_user.role,
        "is_active": current_user.is_active,
        "created_at": current_user.created_at.isoformat() if current_user.created_at else None,
        "health_profile": profile_dict
    }

@app.put("/api/profile")
def update_user_profile(
    input_data: HealthProfileInput,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    h_m = input_data.height_cm / 100.0
    calculated_bmi = round(input_data.weight_kg / (h_m ** 2), 2)
    
    profile = db.query(UserHealthProfile).filter(UserHealthProfile.user_id == current_user.id).first()
    if not profile:
        profile = UserHealthProfile(
            user_id=current_user.id,
            bmi=calculated_bmi,
            **input_data.model_dump()
        )
        db.add(profile)
    else:
        for k, v in input_data.model_dump().items():
            setattr(profile, k, v)
        profile.bmi = calculated_bmi
        profile.updated_at = datetime.utcnow()
    
    # Audit log
    log_activity(db, "UPDATE_HEALTH_PROFILE", f"Updated health profile. BMI calculated: {calculated_bmi}", user_id=current_user.id)
    db.commit()
    db.refresh(profile)
    
    return {
        "message": "Health profile updated successfully.",
        "bmi": calculated_bmi,
        "profile": {
            "age": profile.age,
            "gender": profile.gender,
            "height_cm": profile.height_cm,
            "weight_kg": profile.weight_kg,
            "bmi": profile.bmi,
            "smoker": profile.smoker,
            "physical_activity": profile.physical_activity,
            "daily_steps": profile.daily_steps,
            "alcohol": profile.alcohol,
            "medical_conditions": profile.medical_conditions,
            "previous_medical_history": profile.previous_medical_history,
            "regular_checkups": profile.regular_checkups,
            "heart_rate": profile.heart_rate,
            "dependents": profile.dependents,
            "coverage_preference": profile.coverage_preference,
            "region": profile.region
        }
    }


# =====================================================================
# 2. CUSTOMER DASHBOARD & HEALTH ENDPOINTS (ISOLATED PER USER)
# =====================================================================

@app.get("/api/dashboard", response_model=DashboardSummary)
def get_dashboard(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(UserHealthProfile).filter(UserHealthProfile.user_id == current_user.id).first()
    predictions = db.query(PredictionHistory).filter(PredictionHistory.user_id == current_user.id)\
        .order_by(desc(PredictionHistory.created_at)).all()
    
    latest_pred = None
    if predictions:
        p = predictions[0]
        latest_pred = {
            "id": p.id,
            "predicted_premium_inr": p.predicted_premium_inr,
            "premium_range_min": p.premium_range_min,
            "premium_range_max": p.premium_range_max,
            "risk_category": p.risk_category,
            "risk_score": p.risk_score,
            "bmi": p.bmi,
            "model_used": p.model_used,
            "model_r2": p.model_r2,
            "model_mae": p.model_mae,
            "explanation": p.explanation,
            "improvement_tips": json.loads(p.improvement_tips or "[]"),
            "influencing_factors": json.loads(p.shap_factors or "[]"),
            "model_comparisons": {
                "Linear Regression": p.linear_regression_inr,
                "Random Forest": p.random_forest_inr,
                "XGBoost": p.xgboost_inr
            },
            "created_at": p.created_at.isoformat()
        }

    history_list = []
    for p in predictions:
        history_list.append({
            "id": p.id,
            "predicted_premium_inr": p.predicted_premium_inr,
            "risk_category": p.risk_category,
            "bmi": p.bmi,
            "model_used": p.model_used,
            "created_at": p.created_at.isoformat(),
            "date_formatted": p.created_at.strftime("%b %d, %Y")
        })

    profile_dict = None
    if profile:
        profile_dict = {
            "age": profile.age,
            "gender": profile.gender,
            "height_cm": profile.height_cm,
            "weight_kg": profile.weight_kg,
            "bmi": profile.bmi,
            "smoker": profile.smoker,
            "physical_activity": profile.physical_activity,
            "daily_steps": profile.daily_steps,
            "alcohol": profile.alcohol,
            "medical_conditions": profile.medical_conditions,
            "regular_checkups": profile.regular_checkups,
            "heart_rate": profile.heart_rate,
            "dependents": profile.dependents,
            "coverage_preference": profile.coverage_preference,
            "region": profile.region
        }

    latest_wearable = db.query(WearableHealthData).filter(WearableHealthData.user_id == current_user.id)\
        .order_by(desc(WearableHealthData.recorded_at)).first()
    wearable_dict = None
    if latest_wearable:
        wearable_dict = {
            "steps": latest_wearable.steps,
            "heart_rate": latest_wearable.heart_rate,
            "weight": latest_wearable.weight,
            "bmi": latest_wearable.bmi,
            "activity_level": latest_wearable.activity_level,
            "source": latest_wearable.source,
            "recorded_at": latest_wearable.recorded_at.isoformat()
        }

    return {
        "user_name": current_user.full_name,
        "email": current_user.email,
        "role": current_user.role,
        "has_profile": profile is not None,
        "latest_prediction": latest_pred,
        "health_profile": profile_dict,
        "history_count": len(history_list),
        "history": history_list,
        "wearable_latest": wearable_dict
    }


# =====================================================================
# 3. PREDICTION & MULTI-AGENT ORCHESTRATION ENDPOINTS
# =====================================================================

@app.post("/api/predict")
def predict_premium(
    input_data: HealthProfileInput,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Fetch previous prediction for user comparison
    prev_pred = db.query(PredictionHistory).filter(PredictionHistory.user_id == current_user.id)\
        .order_by(desc(PredictionHistory.created_at)).first()
    
    prev_dict = None
    if prev_pred:
        prev_dict = {
            "predicted_premium_inr": prev_pred.predicted_premium_inr,
            "risk_category": prev_pred.risk_category,
            "bmi": prev_pred.bmi
        }

    raw_dict = input_data.model_dump()
    
    try:
        # Run Central Multi-Agent Orchestrator Pipeline
        res = orchestrator.run_pipeline(raw_dict, previous_prediction=prev_dict)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    # Save / Update UserHealthProfile with concurrency protection
    try:
        profile = db.query(UserHealthProfile).filter(UserHealthProfile.user_id == current_user.id).first()
        if not profile:
            profile = UserHealthProfile(user_id=current_user.id, **input_data.model_dump(), bmi=res["bmi"])
            db.add(profile)
            db.flush()
        else:
            for k, v in input_data.model_dump().items():
                setattr(profile, k, v)
            profile.bmi = res["bmi"]
            profile.updated_at = datetime.now(timezone.utc)
            db.flush()
    except IntegrityError:
        db.rollback()
        profile = db.query(UserHealthProfile).filter(UserHealthProfile.user_id == current_user.id).first()
        if profile:
            for k, v in input_data.model_dump().items():
                setattr(profile, k, v)
            profile.bmi = res["bmi"]
            profile.updated_at = datetime.now(timezone.utc)
            db.flush()

    # Save PredictionHistory record
    comp = res["model_comparisons"]
    prediction_record = PredictionHistory(
        user_id=current_user.id,
        predicted_premium_inr=res["predicted_premium_inr"],
        premium_range_min=res["premium_range_min"],
        premium_range_max=res["premium_range_max"],
        risk_category=res["risk_category"],
        risk_score=res["risk_score"],
        bmi=res["bmi"],
        model_used=res["model_used"],
        model_r2=res["model_r2"],
        model_mae=res["model_mae"],
        linear_regression_inr=comp.get("Linear Regression"),
        random_forest_inr=comp.get("Random Forest"),
        xgboost_inr=comp.get("XGBoost"),
        features_snapshot=json.dumps(res["features_snapshot"]),
        shap_factors=json.dumps(res["influencing_factors"]),
        explanation=res["explanation"],
        improvement_tips=json.dumps(res["improvement_tips"]),
        created_at=datetime.now(timezone.utc)
    )
    db.add(prediction_record)
    db.commit()
    db.refresh(prediction_record)

    # Save AgentExecutionLogs
    for log in res["agent_logs"]:
        db_log = AgentExecutionLog(
            prediction_id=prediction_record.id,
            user_id=current_user.id,
            agent_name=log["agent_name"],
            status=log["status"],
            execution_time_ms=log["execution_time_ms"],
            input_summary=log.get("summary"),
            output_summary=json.dumps(log.get("details", {}))
        )
        db.add(db_log)
    db.commit()

    log_activity(db, "PREDICTION_GENERATED", f"Prediction #{prediction_record.id} created: ₹{res['predicted_premium_inr']:,.2f} ({res['risk_category']})", user_id=current_user.id)

    res["id"] = prediction_record.id
    res["created_at"] = prediction_record.created_at.isoformat()
    return res

@app.post("/api/agents/analyze")
def analyze_with_agents_live(
    input_data: HealthProfileInput,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return predict_premium(input_data=input_data, current_user=current_user, db=db)

# =====================================================================
# 4. CUSTOMER PREDICTION HISTORY & DETAIL (STRICT DATA ISOLATION)
# =====================================================================

@app.get("/api/predictions/history")
def get_prediction_history(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Returns only current authenticated user's prediction history."""
    records = db.query(PredictionHistory).filter(PredictionHistory.user_id == current_user.id)\
        .order_by(desc(PredictionHistory.created_at)).all()
    
    result = []
    for r in records:
        result.append({
            "id": r.id,
            "predicted_premium_inr": r.predicted_premium_inr,
            "premium_range_min": r.premium_range_min,
            "premium_range_max": r.premium_range_max,
            "risk_category": r.risk_category,
            "risk_score": r.risk_score,
            "bmi": r.bmi,
            "model_used": r.model_used,
            "model_r2": r.model_r2,
            "model_mae": r.model_mae,
            "created_at": r.created_at.isoformat(),
            "date_formatted": r.created_at.strftime("%b %d, %Y - %I:%M %p"),
            "features_snapshot": json.loads(r.features_snapshot or "{}"),
            "explanation": r.explanation,
            "model_comparisons": {
                "Linear Regression": r.linear_regression_inr,
                "Random Forest": r.random_forest_inr,
                "XGBoost": r.xgboost_inr
            }
        })
    return result

@app.get("/api/predictions/{pred_id}")
def get_prediction_detail(pred_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """User can only access their own prediction. Admin can view any prediction."""
    query = db.query(PredictionHistory).filter(PredictionHistory.id == pred_id)
    if current_user.role != "ADMIN":
        query = query.filter(PredictionHistory.user_id == current_user.id)
    
    record = query.first()
    if not record:
        raise HTTPException(status_code=404, detail="Prediction record not found.")

    agent_logs = db.query(AgentExecutionLog).filter(AgentExecutionLog.prediction_id == pred_id).all()
    logs_data = [{
        "agent_name": l.agent_name,
        "status": l.status,
        "execution_time_ms": l.execution_time_ms,
        "summary": l.input_summary,
        "details": json.loads(l.output_summary or "{}")
    } for l in agent_logs]

    return {
        "id": record.id,
        "predicted_premium_inr": record.predicted_premium_inr,
        "premium_range_min": record.premium_range_min,
        "premium_range_max": record.premium_range_max,
        "risk_category": record.risk_category,
        "risk_score": record.risk_score,
        "bmi": record.bmi,
        "model_used": record.model_used,
        "model_r2": record.model_r2,
        "model_mae": record.model_mae,
        "model_comparisons": {
            "Linear Regression": record.linear_regression_inr,
            "Random Forest": record.random_forest_inr,
            "XGBoost": record.xgboost_inr
        },
        "features_snapshot": json.loads(record.features_snapshot or "{}"),
        "influencing_factors": json.loads(record.shap_factors or "[]"),
        "explanation": record.explanation,
        "improvement_tips": json.loads(record.improvement_tips or "[]"),
        "agent_logs": logs_data,
        "created_at": record.created_at.isoformat()
    }


# =====================================================================
# 5. WEARABLE DATA MODULE
# =====================================================================

@app.post("/api/wearable/update")
def update_wearable_data(
    data: WearableInput,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(UserHealthProfile).filter(UserHealthProfile.user_id == current_user.id).first()
    height_cm = data.height_cm or (profile.height_cm if profile else 175.0)
    
    height_m = height_cm / 100.0
    bmi = round(data.weight / (height_m ** 2), 2)

    wearable_entry = WearableHealthData(
        user_id=current_user.id,
        steps=data.steps,
        heart_rate=data.heart_rate,
        weight=data.weight,
        bmi=bmi,
        activity_level=data.activity_level,
        source=data.source,
        recorded_at=datetime.now(timezone.utc)
    )
    db.add(wearable_entry)

    if profile:
        profile.weight_kg = data.weight
        profile.bmi = bmi
        profile.daily_steps = data.steps
        profile.heart_rate = data.heart_rate
        profile.physical_activity = data.activity_level
        profile.updated_at = datetime.now(timezone.utc)
    
    db.commit()

    recalc_result = None
    if data.recalculate_premium and profile:
        input_data = HealthProfileInput(
            age=profile.age,
            gender=profile.gender,
            height_cm=profile.height_cm,
            weight_kg=profile.weight_kg,
            smoker=profile.smoker,
            physical_activity=profile.physical_activity,
            daily_steps=profile.daily_steps,
            alcohol=profile.alcohol,
            medical_conditions=profile.medical_conditions,
            previous_medical_history=profile.previous_medical_history,
            regular_checkups=profile.regular_checkups,
            heart_rate=profile.heart_rate,
            dependents=profile.dependents,
            coverage_preference=profile.coverage_preference,
            region=profile.region
        )
        recalc_result = predict_premium(input_data=input_data, current_user=current_user, db=db)

    log_activity(db, "WEARABLE_SYNC", f"Synced wearable telemetry: {data.steps:,} steps, source={data.source}", user_id=current_user.id)

    return {
        "status": "SUCCESS",
        "message": "Wearable health parameters synchronized successfully.",
        "wearable": {
            "steps": data.steps,
            "heart_rate": data.heart_rate,
            "weight": data.weight,
            "bmi": bmi,
            "activity_level": data.activity_level,
            "source": data.source
        },
        "recalculated_prediction": recalc_result
    }

@app.get("/api/wearable/latest")
def get_latest_wearable(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    records = db.query(WearableHealthData).filter(WearableHealthData.user_id == current_user.id)\
        .order_by(desc(WearableHealthData.recorded_at)).limit(10).all()
    
    if not records:
        return {"records": [], "latest": None}

    items = [{
        "id": r.id,
        "steps": r.steps,
        "heart_rate": r.heart_rate,
        "weight": r.weight,
        "bmi": r.bmi,
        "activity_level": r.activity_level,
        "source": r.source,
        "recorded_at": r.recorded_at.isoformat()
    } for r in records]

    return {"records": items, "latest": items[0]}


# =====================================================================
# 6. HEALTH INSIGHTS & PUBLIC MODEL METRICS
# =====================================================================

@app.get("/api/health/insights")
def get_health_insights(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(UserHealthProfile).filter(UserHealthProfile.user_id == current_user.id).first()
    latest_pred = db.query(PredictionHistory).filter(PredictionHistory.user_id == current_user.id)\
        .order_by(desc(PredictionHistory.created_at)).first()

    bmi = profile.bmi if profile else 24.5
    smoker = (profile.smoker == "yes") if profile else False
    steps = profile.daily_steps if profile else 7000
    risk_cat = latest_pred.risk_category if latest_pred else "Low Risk"

    return {
        "bmi_analysis": {
            "current_bmi": bmi,
            "category": "Normal" if bmi < 25 else ("Overweight" if bmi < 30 else "Obese"),
            "healthy_range": "18.5 - 24.9",
            "delta_to_normal": round(max(0.0, bmi - 24.9), 1)
        },
        "smoking_impact": {
            "is_smoker": smoker,
            "actuarial_penalty_pct": 48 if smoker else 0,
            "message": "Tobacco cessation can reduce policy premiums by up to 48%." if smoker else "Non-smoker classification grants maximum baseline health discounts."
        },
        "activity_analysis": {
            "daily_steps": steps,
            "status": "Optimal" if steps >= 10000 else ("Active" if steps >= 7000 else "Sedentary"),
            "weekly_cardio_recommendation": "150 minutes of moderate-intensity aerobic exercise."
        },
        "risk_overview": {
            "category": risk_cat,
            "score": latest_pred.risk_score if latest_pred else 20.0,
            "advice": "Continue preventative annual health checkups to safeguard against future medical surcharges."
        },
        "disclaimer": "PremiumPulse insights are educational tools designed to encourage healthy lifestyle habits, not formal medical diagnoses or actual contractual policy offers."
    }

@app.get("/api/model/metrics")
def get_model_metrics():
    metrics_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "models", "model_metrics.json"))
    if not os.path.exists(metrics_path):
        raise HTTPException(status_code=404, detail="Model metrics metadata not found.")
    
    with open(metrics_path, "r") as f:
        data = json.load(f)
    return data


# =====================================================================
# 7. PDF REPORT DOWNLOAD (USER ISOLATED)
# =====================================================================

@app.get("/api/reports/{pred_id}/download")
def download_pdf_report(
    pred_id: int,
    token: Optional[str] = Query(None),
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    current_user = None
    if authorization:
        current_user = get_user_from_token_string(authorization, db)
    if not current_user and token:
        current_user = get_user_from_token_string(token, db)

    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials or session expired.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    query = db.query(PredictionHistory).filter(PredictionHistory.id == pred_id)
    if current_user.role != "ADMIN":
        query = query.filter(PredictionHistory.user_id == current_user.id)
        
    pred = query.first()
    if not pred:
        raise HTTPException(status_code=404, detail="Prediction not found or access denied.")

    pred_user = db.query(User).filter(User.id == pred.user_id).first()

    agent_logs = db.query(AgentExecutionLog).filter(AgentExecutionLog.prediction_id == pred_id).all()
    logs_data = [{
        "agent_name": l.agent_name,
        "status": l.status,
        "execution_time_ms": l.execution_time_ms,
        "summary": l.input_summary
    } for l in agent_logs]

    pred_dict = {
        "id": pred.id,
        "predicted_premium_inr": pred.predicted_premium_inr,
        "premium_range_min": pred.premium_range_min,
        "premium_range_max": pred.premium_range_max,
        "risk_category": pred.risk_category,
        "risk_score": pred.risk_score,
        "bmi": pred.bmi,
        "bmi_category": "Normal" if pred.bmi < 25 else ("Overweight" if pred.bmi < 30 else "Obese"),
        "model_used": pred.model_used,
        "model_r2": pred.model_r2,
        "features_snapshot": pred.features_snapshot,
        "model_comparisons": {
            "Linear Regression": pred.linear_regression_inr,
            "Random Forest": pred.random_forest_inr,
            "XGBoost": pred.xgboost_inr
        },
        "influencing_factors": pred.shap_factors,
        "improvement_tips": pred.improvement_tips,
        "agent_logs": logs_data
    }

    user_prof = {
        "full_name": pred_user.full_name if pred_user else current_user.full_name,
        "email": pred_user.email if pred_user else current_user.email
    }

    pdf_filename = f"PremiumPulse_Report_{pred_id}.pdf"
    pdf_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "reports", pdf_filename))
    
    generate_pdf_report(pred_dict, user_prof, pdf_path)
    
    return FileResponse(
        path=pdf_path,
        filename=pdf_filename,
        media_type="application/pdf"
    )


# =====================================================================
# 8. ADMIN PORTAL ENDPOINTS (RESTRICTED TO ROLE == 'ADMIN')
# =====================================================================

@app.get("/api/admin/overview", response_model=AdminOverview)
def get_admin_overview(current_admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    """Admin Overview statistics with real database metrics."""
    total_users = db.query(User).count()
    active_users = db.query(User).filter(User.is_active == True).count()
    inactive_users = total_users - active_users
    
    total_predictions = db.query(PredictionHistory).count()
    
    today_start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    predictions_today = db.query(PredictionHistory).filter(PredictionHistory.created_at >= today_start).count()
    
    total_agent_executions = db.query(AgentExecutionLog).count()
    failed_agent_executions = db.query(AgentExecutionLog).filter(AgentExecutionLog.status == "ERROR").count()
    
    avg_premium = db.query(func.avg(PredictionHistory.predicted_premium_inr)).scalar() or 0.0
    min_premium = db.query(func.min(PredictionHistory.predicted_premium_inr)).scalar() or 0.0
    max_premium = db.query(func.max(PredictionHistory.predicted_premium_inr)).scalar() or 0.0

    # Model metrics summary
    metrics_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "models", "model_metrics.json"))
    model_summary = {}
    if os.path.exists(metrics_path):
        with open(metrics_path, "r") as f:
            model_summary = json.load(f)

    # 7-day trend calculation
    trend_labels = []
    trend_counts = []
    for i in range(6, -1, -1):
        day_date = datetime.now(timezone.utc).date() - timedelta(days=i)
        day_start = datetime.combine(day_date, datetime.min.time(), tzinfo=timezone.utc)
        day_end = datetime.combine(day_date, datetime.max.time(), tzinfo=timezone.utc)
        cnt = db.query(PredictionHistory).filter(
            PredictionHistory.created_at >= day_start,
            PredictionHistory.created_at <= day_end
        ).count()
        trend_labels.append(day_date.strftime("%b %d"))
        trend_counts.append(cnt)

    return {
        "total_users": total_users,
        "active_users": active_users,
        "inactive_users": inactive_users,
        "total_predictions": total_predictions,
        "predictions_today": predictions_today,
        "total_agent_executions": total_agent_executions,
        "failed_agent_executions": failed_agent_executions,
        "avg_premium_inr": round(float(avg_premium), 2),
        "min_premium_inr": round(float(min_premium), 2),
        "max_premium_inr": round(float(max_premium), 2),
        "model_summary": model_summary,
        "trend_labels": trend_labels,
        "trend_counts": trend_counts
    }

@app.get("/api/admin/users", response_model=List[AdminUserItem])
def get_admin_users(
    q: Optional[str] = Query(None),
    status_filter: Optional[str] = Query("all"),
    role_filter: Optional[str] = Query("all"),
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """User Management: view, search, and filter registered users."""
    query = db.query(User)
    
    if q:
        query = query.filter(or_(
            User.email.ilike(f"%{q}%"),
            User.full_name.ilike(f"%{q}%")
        ))
        
    if status_filter == "active":
        query = query.filter(User.is_active == True)
    elif status_filter == "inactive":
        query = query.filter(User.is_active == False)

    if role_filter in ["USER", "ADMIN"]:
        query = query.filter(User.role == role_filter)

    users = query.order_by(desc(User.created_at)).all()
    
    results = []
    for u in users:
        pred_cnt = db.query(PredictionHistory).filter(PredictionHistory.user_id == u.id).count()
        profile_exists = db.query(UserHealthProfile).filter(UserHealthProfile.user_id == u.id).first() is not None
        results.append({
            "id": u.id,
            "email": u.email,
            "full_name": u.full_name,
            "role": u.role,
            "is_active": u.is_active,
            "created_at": u.created_at.strftime("%Y-%m-%d %H:%M"),
            "last_login": u.last_login.strftime("%Y-%m-%d %H:%M") if u.last_login else None,
            "total_predictions": pred_cnt,
            "has_profile": profile_exists
        })
    return results

@app.patch("/api/admin/users/{user_id}/status")
def update_user_status(
    user_id: int,
    status_in: AdminUserStatusUpdate,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Activate or deactivate a user account."""
    if user_id == current_admin.id:
        raise HTTPException(status_code=400, detail="Administrators cannot deactivate their own account.")
        
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    user.is_active = status_in.is_active
    db.commit()

    action = "activated" if status_in.is_active else "deactivated"
    log_activity(db, "STATUS_CHANGE", f"Admin {current_admin.email} {action} user account {user.email}", user_id=current_admin.id)

    return {
        "status": "SUCCESS",
        "message": f"User account has been {action}.",
        "user": {
            "id": user.id,
            "email": user.email,
            "is_active": user.is_active
        }
    }

@app.get("/api/admin/predictions", response_model=List[AdminPredictionItem])
def get_admin_predictions(
    q: Optional[str] = Query(None),
    risk_filter: Optional[str] = Query("all"),
    model_filter: Optional[str] = Query("all"),
    limit: int = Query(50, le=200),
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Prediction Monitoring across the entire system."""
    query = db.query(PredictionHistory).join(User, PredictionHistory.user_id == User.id)

    if q:
        query = query.filter(or_(
            User.email.ilike(f"%{q}%"),
            User.full_name.ilike(f"%{q}%")
        ))

    if risk_filter != "all":
        query = query.filter(PredictionHistory.risk_category == risk_filter)

    if model_filter != "all":
        query = query.filter(PredictionHistory.model_used.ilike(f"%{model_filter}%"))

    predictions = query.order_by(desc(PredictionHistory.created_at)).limit(limit).all()

    items = []
    for p in predictions:
        u = db.query(User).filter(User.id == p.user_id).first()
        items.append({
            "id": p.id,
            "user_id": p.user_id,
            "user_email": u.email if u else "unknown@user",
            "user_name": u.full_name if u else "Unknown User",
            "predicted_premium_inr": p.predicted_premium_inr,
            "premium_range_min": p.premium_range_min,
            "premium_range_max": p.premium_range_max,
            "risk_category": p.risk_category,
            "risk_score": p.risk_score,
            "bmi": p.bmi,
            "model_used": p.model_used,
            "model_r2": p.model_r2,
            "created_at": p.created_at.strftime("%Y-%m-%d %H:%M:%S")
        })
    return items

@app.get("/api/admin/agents", response_model=AdminAgentsResponse)
def get_admin_agents(current_admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    """Deep monitoring for all 4 AI agents and Central Orchestrator."""
    agent_names = [
        "Intake Agent",
        "Risk Assessment Agent",
        "Pricing Agent",
        "Insight Agent",
        "Central Orchestrator"
    ]

    metrics_list = []
    for name in agent_names:
        total = db.query(AgentExecutionLog).filter(AgentExecutionLog.agent_name == name).count()
        success = db.query(AgentExecutionLog).filter(AgentExecutionLog.agent_name == name, AgentExecutionLog.status == "SUCCESS").count()
        failed = db.query(AgentExecutionLog).filter(AgentExecutionLog.agent_name == name, AgentExecutionLog.status == "ERROR").count()
        
        avg_lat = db.query(func.avg(AgentExecutionLog.execution_time_ms)).filter(AgentExecutionLog.agent_name == name).scalar() or 0.0
        last_log = db.query(AgentExecutionLog).filter(AgentExecutionLog.agent_name == name).order_by(desc(AgentExecutionLog.created_at)).first()

        status_str = "OPERATIONAL"
        if failed > 0 and (failed / max(1, total)) > 0.1:
            status_str = "DEGRADED"

        metrics_list.append({
            "agent_name": name,
            "status": status_str,
            "total_executions": total,
            "success_count": success,
            "failed_count": failed,
            "avg_latency_ms": round(float(avg_lat), 2),
            "last_execution": last_log.created_at.strftime("%Y-%m-%d %H:%M:%S") if last_log else None
        })

    # Error logs
    error_logs = db.query(AgentExecutionLog).filter(AgentExecutionLog.status.in_(["ERROR", "WARNING"]))\
        .order_by(desc(AgentExecutionLog.created_at)).limit(20).all()

    recent_errors = [{
        "id": l.id,
        "agent_name": l.agent_name,
        "status": l.status,
        "summary": l.input_summary,
        "execution_time_ms": l.execution_time_ms,
        "created_at": l.created_at.strftime("%Y-%m-%d %H:%M:%S")
    } for l in error_logs]

    return {
        "agents": metrics_list,
        "orchestrator_status": "OPERATIONAL",
        "recent_error_logs": recent_errors
    }

@app.get("/api/admin/models")
def get_admin_models(current_admin: User = Depends(get_current_admin)):
    """ML Model performance comparison and monitoring."""
    metrics_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "models", "model_metrics.json"))
    dataset_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "datasets", "insurance.csv"))
    
    dataset_info = {"exists": False, "rows": 0, "size_kb": 0}
    if os.path.exists(dataset_path):
        dataset_info = {
            "exists": True,
            "path": "datasets/insurance.csv",
            "size_kb": round(os.path.getsize(dataset_path) / 1024, 2),
            "source": "Kaggle Medical Cost Personal Dataset"
        }

    metrics_data = {}
    if os.path.exists(metrics_path):
        with open(metrics_path, "r") as f:
            metrics_data = json.load(f)

    # Check model artifacts on disk
    models_status = {}
    for m_file in ["linear_regression.joblib", "random_forest.joblib", "xgboost.joblib"]:
        p = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "models", m_file))
        models_status[m_file] = {
            "loaded": os.path.exists(p),
            "size_kb": round(os.path.getsize(p) / 1024, 2) if os.path.exists(p) else 0,
            "modified": datetime.fromtimestamp(os.path.getmtime(p)).strftime("%Y-%m-%d %H:%M:%S") if os.path.exists(p) else None
        }

    return {
        "dataset": dataset_info,
        "models": models_status,
        "benchmark_metrics": metrics_data
    }

@app.get("/api/admin/system-health", response_model=AdminSystemHealth)
def get_admin_system_health(current_admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    """System Health check: backend, database, memory, models, agents."""
    t0 = time.time()
    db.execute(text("SELECT 1"))
    db_latency = round((time.time() - t0) * 1000, 2)

    db_size_kb = 0.0
    if os.path.exists(DB_PATH):
        db_size_kb = round(os.path.getsize(DB_PATH) / 1024, 2)

    # Memory usage
    process = psutil.Process(os.getpid())
    mem_info = process.memory_info()
    memory_mb = round(mem_info.rss / (1024 * 1024), 2)

    # Check model files
    models_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "models"))
    models_loaded = all(os.path.exists(os.path.join(models_dir, f)) for f in ["linear_regression.joblib", "random_forest.joblib", "xgboost.joblib"])

    uptime = round(time.time() - SERVER_START_TIME, 1)

    return {
        "backend_status": "HEALTHY",
        "database_status": "CONNECTED",
        "database_latency_ms": db_latency,
        "database_size_kb": db_size_kb,
        "models_loaded": models_loaded,
        "agents_ready": True,
        "uptime_seconds": uptime,
        "memory_usage_mb": memory_mb,
        "python_version": sys.version.split()[0],
        "server_time": datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
    }

@app.get("/api/admin/analytics")
def get_admin_analytics(current_admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    """Aggregate analytics for risk distributions, models, and underwriting trends."""
    total_preds = db.query(PredictionHistory).count()
    if total_preds == 0:
        return {"risk_distribution": {}, "model_distribution": {}, "premium_bands": {}, "averages": {}}

    # Risk distribution
    risks = db.query(PredictionHistory.risk_category, func.count(PredictionHistory.id)).group_by(PredictionHistory.risk_category).all()
    risk_dist = {r[0]: {"count": r[1], "pct": round(r[1] / total_preds * 100, 1)} for r in risks}

    # Model distribution
    models_cnt = db.query(PredictionHistory.model_used, func.count(PredictionHistory.id)).group_by(PredictionHistory.model_used).all()
    model_dist = {m[0]: m[1] for m in models_cnt}

    # Premium bands: <20k, 20k-40k, 40k-60k, >60k
    b1 = db.query(PredictionHistory).filter(PredictionHistory.predicted_premium_inr < 20000).count()
    b2 = db.query(PredictionHistory).filter(PredictionHistory.predicted_premium_inr >= 20000, PredictionHistory.predicted_premium_inr < 40000).count()
    b3 = db.query(PredictionHistory).filter(PredictionHistory.predicted_premium_inr >= 40000, PredictionHistory.predicted_premium_inr < 60000).count()
    b4 = db.query(PredictionHistory).filter(PredictionHistory.predicted_premium_inr >= 60000).count()

    # Averages
    avg_bmi = db.query(func.avg(UserHealthProfile.bmi)).scalar() or 0.0
    avg_steps = db.query(func.avg(UserHealthProfile.daily_steps)).scalar() or 0.0

    return {
        "total_predictions": total_preds,
        "risk_distribution": risk_dist,
        "model_distribution": model_dist,
        "premium_bands": {
            "< ₹20,000": b1,
            "₹20,000 - ₹40,000": b2,
            "₹40,000 - ₹60,000": b3,
            "> ₹60,000": b4
        },
        "averages": {
            "avg_bmi": round(float(avg_bmi), 1),
            "avg_daily_steps": int(avg_steps)
        }
    }

@app.get("/api/admin/activity")
def get_admin_activity_logs(
    limit: int = Query(50, le=200),
    activity_type: Optional[str] = Query(None),
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Retrieve system audit logs for administrative monitoring."""
    query = db.query(SystemActivityLog)
    if activity_type:
        query = query.filter(SystemActivityLog.activity_type == activity_type)
    
    logs = query.order_by(desc(SystemActivityLog.created_at)).limit(limit).all()
    
    result = []
    for log in logs:
        user_email = None
        user_name = None
        if log.user_id:
            u = db.query(User).filter(User.id == log.user_id).first()
            if u:
                user_email = u.email
                user_name = u.full_name
        
        result.append({
            "id": log.id,
            "activity_type": log.activity_type,
            "description": log.description,
            "user_id": log.user_id,
            "user_email": user_email,
            "user_name": user_name,
            "ip_address": log.ip_address,
            "created_at": log.created_at.strftime("%Y-%m-%d %H:%M:%S") if log.created_at else None,
            "time_formatted": log.created_at.strftime("%b %d, %H:%M:%S") if log.created_at else None
        })
    return result


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
