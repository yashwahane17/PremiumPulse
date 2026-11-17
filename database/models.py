"""
SQLAlchemy ORM models for PremiumPulse.
Includes Role-Based Access Control (RBAC) and System Activity Logging.
"""

from datetime import datetime, timezone
from sqlalchemy import Column, Integer, Float, String, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from database.database import Base

def utcnow():
    return datetime.now(timezone.utc)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False, default="USER") # "USER" or "ADMIN"
    is_active = Column(Boolean, nullable=False, default=True) # Account status
    last_login = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=utcnow)

    # Relationships
    health_profile = relationship("UserHealthProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    predictions = relationship("PredictionHistory", back_populates="user", cascade="all, delete-orphan")
    wearable_records = relationship("WearableHealthData", back_populates="user", cascade="all, delete-orphan")
    agent_logs = relationship("AgentExecutionLog", back_populates="user", cascade="all, delete-orphan")
    activity_logs = relationship("SystemActivityLog", back_populates="user")


class UserHealthProfile(Base):
    __tablename__ = "user_health_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True)
    
    age = Column(Integer, nullable=False)
    gender = Column(String(50), nullable=False, default="male")
    height_cm = Column(Float, nullable=False)
    weight_kg = Column(Float, nullable=False)
    bmi = Column(Float, nullable=False)
    
    smoker = Column(String(20), nullable=False, default="no") # "yes" or "no"
    physical_activity = Column(String(50), nullable=False, default="moderate") # "low", "moderate", "high"
    daily_steps = Column(Integer, nullable=False, default=6000)
    alcohol = Column(String(50), nullable=True, default="none") # "none", "occasional", "frequent"
    
    medical_conditions = Column(Text, nullable=True, default="None")
    previous_medical_history = Column(Text, nullable=True, default="None")
    regular_checkups = Column(Boolean, nullable=False, default=True)
    heart_rate = Column(Integer, nullable=True, default=72)
    
    dependents = Column(Integer, nullable=False, default=0)
    coverage_preference = Column(String(50), nullable=False, default="standard") # "standard", "comprehensive", "premium"
    region = Column(String(50), nullable=False, default="southwest")
    
    updated_at = Column(DateTime, default=utcnow, onupdate=utcnow)

    user = relationship("User", back_populates="health_profile")


class PredictionHistory(Base):
    __tablename__ = "prediction_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    predicted_premium_inr = Column(Float, nullable=False)
    premium_range_min = Column(Float, nullable=False)
    premium_range_max = Column(Float, nullable=False)
    
    risk_category = Column(String(50), nullable=False) # "Low Risk", "Moderate Risk", "High Risk"
    risk_score = Column(Float, nullable=False) # 0 to 100
    bmi = Column(Float, nullable=False)
    
    model_used = Column(String(100), nullable=False)
    model_r2 = Column(Float, nullable=False)
    model_mae = Column(Float, nullable=False)
    
    # Model comparison values in INR
    linear_regression_inr = Column(Float, nullable=True)
    random_forest_inr = Column(Float, nullable=True)
    xgboost_inr = Column(Float, nullable=True)
    
    # Structured snapshots (JSON)
    features_snapshot = Column(Text, nullable=False) # JSON of inputs
    shap_factors = Column(Text, nullable=True) # JSON of feature contributions
    explanation = Column(Text, nullable=False) # Insight Agent explanation
    improvement_tips = Column(Text, nullable=True) # JSON list of actionable health savings
    
    created_at = Column(DateTime, default=utcnow)

    user = relationship("User", back_populates="predictions")
    agent_logs = relationship("AgentExecutionLog", back_populates="prediction", cascade="all, delete-orphan")


class AgentExecutionLog(Base):
    __tablename__ = "agent_execution_logs"

    id = Column(Integer, primary_key=True, index=True)
    prediction_id = Column(Integer, ForeignKey("prediction_history.id", ondelete="SET NULL"), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    agent_name = Column(String(100), nullable=False)
    status = Column(String(50), nullable=False, default="SUCCESS") # SUCCESS, WARNING, ERROR
    execution_time_ms = Column(Float, nullable=False, default=0.0)
    input_summary = Column(Text, nullable=True)
    output_summary = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=utcnow)

    user = relationship("User", back_populates="agent_logs")
    prediction = relationship("PredictionHistory", back_populates="agent_logs")


class WearableHealthData(Base):
    __tablename__ = "wearable_health_data"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    steps = Column(Integer, nullable=False)
    heart_rate = Column(Integer, nullable=False)
    weight = Column(Float, nullable=False)
    bmi = Column(Float, nullable=False)
    activity_level = Column(String(50), nullable=False)
    source = Column(String(100), nullable=False, default="manual") # manual, simulated_apple_watch, simulated_fitbit
    
    recorded_at = Column(DateTime, default=utcnow)

    user = relationship("User", back_populates="wearable_records")


class SystemActivityLog(Base):
    __tablename__ = "system_activity_logs"

    id = Column(Integer, primary_key=True, index=True)
    activity_type = Column(String(100), nullable=False) # USER_REGISTER, USER_LOGIN, PREDICTION_GENERATED, WEARABLE_SYNC, STATUS_CHANGE, ADMIN_LOGIN
    description = Column(Text, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    ip_address = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=utcnow)

    user = relationship("User", back_populates="activity_logs")
