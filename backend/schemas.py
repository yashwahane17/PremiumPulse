"""
Pydantic Schemas for Request & Response Data Validation.
Includes Role-Based Access Control and Admin Portal Schemas.
"""

from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field

# Auth Schemas
class UserRegister(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=100)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class AdminLogin(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]

class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    role: str
    is_active: bool
    last_login: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Health & Prediction Input Schema
class HealthProfileInput(BaseModel):
    # Step 1: Personal
    age: int = Field(..., ge=18, le=100, description="Age in years (18-100)")
    gender: str = Field("male", description="Gender: male, female, other")
    height_cm: float = Field(..., ge=80.0, le=250.0, description="Height in centimeters")
    weight_kg: float = Field(..., ge=25.0, le=300.0, description="Weight in kilograms")
    
    # Step 2: Lifestyle
    smoker: str = Field("no", description="Smoking status: yes or no")
    physical_activity: str = Field("moderate", description="Activity level: low, moderate, high")
    daily_steps: int = Field(6000, ge=0, le=60000, description="Average daily steps")
    alcohol: Optional[str] = Field("none", description="Alcohol consumption: none, occasional, frequent")
    
    # Step 3: Medical History
    medical_conditions: Optional[str] = Field("None", description="Known chronic conditions (e.g. Hypertension, Diabetes)")
    previous_medical_history: Optional[str] = Field("None", description="Previous surgeries or major conditions")
    regular_checkups: bool = Field(True, description="Attends regular annual medical checkups")
    heart_rate: Optional[int] = Field(72, ge=40, le=200, description="Resting heart rate in BPM")
    
    # Step 4: Insurance & Location
    dependents: int = Field(0, ge=0, le=10, description="Number of children/dependents")
    coverage_preference: str = Field("standard", description="standard, comprehensive, premium")
    region: Optional[str] = Field("southwest", description="northeast, northwest, southeast, southwest")

class AgentStepLog(BaseModel):
    agent_name: str
    status: str
    execution_time_ms: float
    summary: str
    details: Optional[Dict[str, Any]] = None

class PredictionResult(BaseModel):
    id: Optional[int] = None
    predicted_premium_inr: float
    premium_range_min: float
    premium_range_max: float
    risk_category: str
    risk_score: float
    bmi: float
    bmi_category: str
    model_used: str
    model_r2: float
    model_mae: float
    model_comparisons: Dict[str, float]
    features_snapshot: Dict[str, Any]
    influencing_factors: List[Dict[str, Any]]
    explanation: str
    improvement_tips: List[Dict[str, Any]]
    agent_logs: List[AgentStepLog]
    created_at: Optional[datetime] = None

class WearableInput(BaseModel):
    steps: int = Field(..., ge=0, le=80000)
    heart_rate: int = Field(..., ge=40, le=220)
    weight: float = Field(..., ge=25.0, le=300.0)
    height_cm: Optional[float] = Field(None, ge=80.0, le=250.0)
    activity_level: str = Field("moderate")
    source: str = Field("manual")
    recalculate_premium: bool = Field(True)

class DashboardSummary(BaseModel):
    user_name: str
    email: str
    role: str
    has_profile: bool
    latest_prediction: Optional[Dict[str, Any]] = None
    health_profile: Optional[Dict[str, Any]] = None
    history_count: int
    history: List[Dict[str, Any]]
    wearable_latest: Optional[Dict[str, Any]] = None

# =====================================================================
# ADMIN PORTAL SCHEMAS
# =====================================================================

class AdminUserItem(BaseModel):
    id: int
    email: str
    full_name: str
    role: str
    is_active: bool
    created_at: str
    last_login: Optional[str] = None
    total_predictions: int = 0
    has_profile: bool = False

class AdminUserStatusUpdate(BaseModel):
    is_active: bool

class AdminOverview(BaseModel):
    total_users: int
    active_users: int
    inactive_users: int
    total_predictions: int
    predictions_today: int
    total_agent_executions: int
    failed_agent_executions: int
    avg_premium_inr: float
    min_premium_inr: float
    max_premium_inr: float
    model_summary: Dict[str, Any]
    trend_labels: List[str]
    trend_counts: List[int]

class AdminPredictionItem(BaseModel):
    id: int
    user_id: int
    user_email: str
    user_name: str
    predicted_premium_inr: float
    premium_range_min: float
    premium_range_max: float
    risk_category: str
    risk_score: float
    bmi: float
    model_used: str
    model_r2: float
    created_at: str

class AdminAgentMetric(BaseModel):
    agent_name: str
    status: str # OPERATIONAL or DEGRADED
    total_executions: int
    success_count: int
    failed_count: int
    avg_latency_ms: float
    last_execution: Optional[str] = None

class AdminAgentsResponse(BaseModel):
    agents: List[AdminAgentMetric]
    orchestrator_status: str
    recent_error_logs: List[Dict[str, Any]]

class AdminSystemHealth(BaseModel):
    backend_status: str
    database_status: str
    database_latency_ms: float
    database_size_kb: float
    models_loaded: bool
    agents_ready: bool
    uptime_seconds: float
    memory_usage_mb: float
    python_version: str
    server_time: str
