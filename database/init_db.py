"""
Database initialization, migration, and seeding script.
Sets up tables in SQLite, migrates RBAC fields, and populates Admin + Demo records.
"""

import os
import json
import sqlite3
from datetime import datetime, timedelta, timezone
from database.database import engine, Base, SessionLocal, DB_PATH
from database.models import User, UserHealthProfile, PredictionHistory, AgentExecutionLog, WearableHealthData, SystemActivityLog
from backend.auth_utils import hash_password

ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "admin@premiumpulse.ai").lower().strip()
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "Admin@Pulse2026!")

def run_migrations():
    """Applies schema migrations to SQLite for role-based access control without data loss."""
    if not os.path.exists(DB_PATH):
        return

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("PRAGMA table_info(users)")
    columns = [col[1] for col in cursor.fetchall()]

    if "role" not in columns:
        print("Migrating: Adding 'role' column to users table...")
        cursor.execute("ALTER TABLE users ADD COLUMN role VARCHAR(50) DEFAULT 'USER'")

    if "is_active" not in columns:
        print("Migrating: Adding 'is_active' column to users table...")
        cursor.execute("ALTER TABLE users ADD COLUMN is_active BOOLEAN DEFAULT 1")

    if "last_login" not in columns:
        print("Migrating: Adding 'last_login' column to users table...")
        cursor.execute("ALTER TABLE users ADD COLUMN last_login DATETIME")

    # Ensure existing users have role 'USER' and is_active True
    cursor.execute("UPDATE users SET role = 'USER' WHERE role IS NULL OR role = ''")
    cursor.execute("UPDATE users SET is_active = 1 WHERE is_active IS NULL")

    conn.commit()
    conn.close()
    print("Database migration check completed.")

def init_database():
    run_migrations()

    print("Creating all database tables...")
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully.")

    db = SessionLocal()
    try:
        # 1. Seed or update ADMIN user
        admin_user = db.query(User).filter(User.email == ADMIN_EMAIL).first()
        if not admin_user:
            print(f"Seeding Admin account ({ADMIN_EMAIL})...")
            admin_user = User(
                email=ADMIN_EMAIL,
                hashed_password=hash_password(ADMIN_PASSWORD),
                full_name="System Administrator",
                role="ADMIN",
                is_active=True,
                last_login=datetime.now(timezone.utc)
            )
            db.add(admin_user)
            db.commit()
            db.refresh(admin_user)

            db.add(SystemActivityLog(
                activity_type="SYSTEM_INIT",
                description="Initial administrator account created with role ADMIN.",
                user_id=admin_user.id
            ))
            db.commit()
            print(f"Admin account initialized successfully: {ADMIN_EMAIL}")
        else:
            # Ensure admin has role ADMIN
            if admin_user.role != "ADMIN":
                admin_user.role = "ADMIN"
                db.commit()

        # 2. Seed Demo Customer user (Rajesh Verma)
        demo_user = db.query(User).filter(User.email == "demo@premiumpulse.ai").first()
        if not demo_user:
            print("Seeding demo customer user...")
            demo_user = User(
                email="demo@premiumpulse.ai",
                hashed_password=hash_password("Demo@12345"),
                full_name="Rajesh Verma",
                role="USER",
                is_active=True,
                last_login=datetime.now(timezone.utc)
            )
            db.add(demo_user)
            db.commit()
            db.refresh(demo_user)
            
            # Health Profile
            profile = UserHealthProfile(
                user_id=demo_user.id,
                age=38,
                gender="male",
                height_cm=176.0,
                weight_kg=79.0,
                bmi=25.5,
                smoker="no",
                physical_activity="moderate",
                daily_steps=7800,
                alcohol="occasional",
                medical_conditions="Mild Hypertension",
                previous_medical_history="Appendectomy (2018)",
                regular_checkups=True,
                heart_rate=72,
                dependents=2,
                coverage_preference="standard",
                region="southwest"
            )
            db.add(profile)
            
            # Historical Predictions (3 months ago, 1 month ago, and recent)
            now = datetime.now(timezone.utc)
            
            p1 = PredictionHistory(
                user_id=demo_user.id,
                predicted_premium_inr=32400.0,
                premium_range_min=29000.0,
                premium_range_max=35800.0,
                risk_category="Moderate Risk",
                risk_score=48.0,
                bmi=27.4,
                model_used="Linear Regression",
                model_r2=0.883,
                model_mae=10634.0,
                linear_regression_inr=32400.0,
                random_forest_inr=34100.0,
                xgboost_inr=33800.0,
                features_snapshot=json.dumps({"age": 38, "weight_kg": 85.0, "smoker": "no", "daily_steps": 4500}),
                shap_factors=json.dumps([{"factor": "BMI 27.4", "impact": "High"}]),
                explanation="Initial assessment showed elevated underwriting risk primarily due to overweight BMI and sedentary step activity.",
                improvement_tips=json.dumps([{"action": "Weight loss to BMI < 25", "potential_saving_inr": 4500.0}]),
                created_at=now - timedelta(days=90)
            )
            db.add(p1)
            
            p2 = PredictionHistory(
                user_id=demo_user.id,
                predicted_premium_inr=28500.0,
                premium_range_min=25500.0,
                premium_range_max=31500.0,
                risk_category="Low Risk",
                risk_score=28.0,
                bmi=26.1,
                model_used="Linear Regression",
                model_r2=0.883,
                model_mae=10634.0,
                linear_regression_inr=28500.0,
                random_forest_inr=29900.0,
                xgboost_inr=29400.0,
                features_snapshot=json.dumps({"age": 38, "weight_kg": 81.0, "smoker": "no", "daily_steps": 6500}),
                shap_factors=json.dumps([{"factor": "BMI 26.1", "impact": "Moderate"}]),
                explanation="Improved daily steps and weight reduction led to a 12% premium drop.",
                improvement_tips=json.dumps([{"action": "Reach 10,000 steps daily", "potential_saving_inr": 2200.0}]),
                created_at=now - timedelta(days=30)
            )
            db.add(p2)

            p3 = PredictionHistory(
                user_id=demo_user.id,
                predicted_premium_inr=26200.0,
                premium_range_min=23200.0,
                premium_range_max=29200.0,
                risk_category="Low Risk",
                risk_score=22.0,
                bmi=25.5,
                model_used="Linear Regression",
                model_r2=0.883,
                model_mae=10634.0,
                linear_regression_inr=26200.0,
                random_forest_inr=27400.0,
                xgboost_inr=27100.0,
                features_snapshot=json.dumps({"age": 38, "weight_kg": 79.0, "smoker": "no", "daily_steps": 7800}),
                shap_factors=json.dumps([{"factor": "Optimal Lifestyle Habit", "impact": "Low"}]),
                explanation="Current active routine keeps your policy in the preferred low-risk underwriting tier.",
                improvement_tips=json.dumps([{"action": "Maintain BMI < 25", "potential_saving_inr": 1800.0}]),
                created_at=now - timedelta(days=2)
            )
            db.add(p3)

            # Seed Wearable Data
            wearables = [
                WearableHealthData(user_id=demo_user.id, steps=7850, heart_rate=71, weight=79.0, bmi=25.5, activity_level="moderate", source="mock_fitbit", recorded_at=now - timedelta(days=2)),
                WearableHealthData(user_id=demo_user.id, steps=8420, heart_rate=69, weight=78.8, bmi=25.4, activity_level="moderate", source="mock_fitbit", recorded_at=now - timedelta(days=1)),
                WearableHealthData(user_id=demo_user.id, steps=9150, heart_rate=68, weight=78.6, bmi=25.3, activity_level="high", source="mock_fitbit", recorded_at=now)
            ]
            db.add_all(wearables)

            db.commit()
            print("Seeded demo customer user Rajesh Verma (demo@premiumpulse.ai / Demo@12345).")
        else:
            # Ensure demo_user has role USER
            if demo_user.role != "USER":
                demo_user.role = "USER"
                db.commit()

        print("Database ready.")
    finally:
        db.close()

if __name__ == "__main__":
    init_database()
