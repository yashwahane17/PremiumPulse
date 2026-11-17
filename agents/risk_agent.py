"""
Agent 2: Risk Assessment Agent
Calculates precise BMI, stratifies cardiovascular and lifestyle health risk,
computes a comprehensive actuarial risk score (0-100), and assigns risk category.
"""

import time
from typing import Dict, Any, Tuple

class RiskAssessmentAgent:
    def __init__(self):
        self.name = "Risk Assessment Agent"

    def calculate_bmi(self, weight_kg: float, height_cm: float) -> Tuple[float, str]:
        height_m = height_cm / 100.0
        bmi = round(weight_kg / (height_m ** 2), 2)
        
        if bmi < 18.5:
            cat = "Underweight"
        elif bmi < 25.0:
            cat = "Normal"
        elif bmi < 30.0:
            cat = "Overweight"
        elif bmi < 35.0:
            cat = "Obese (Class I)"
        else:
            cat = "Obese (Class II+)"
            
        return bmi, cat

    def process(self, validated_data: Dict[str, Any]) -> Tuple[Dict[str, Any], Dict[str, Any]]:
        start_time = time.time()
        
        weight_kg = validated_data["weight_kg"]
        height_cm = validated_data["height_cm"]
        bmi, bmi_category = self.calculate_bmi(weight_kg, height_cm)
        
        age = validated_data["age"]
        smoker = validated_data["smoker"] == "yes"
        activity = validated_data["physical_activity"]
        steps = validated_data["daily_steps"]
        conditions = validated_data.get("medical_conditions", "None").lower()
        heart_rate = validated_data.get("heart_rate", 72)
        regular_checkups = validated_data.get("regular_checkups", True)

        # Multi-factor Risk Scoring Matrix (Base: 10, Max: 100)
        risk_score = 10.0
        risk_factors = []

        # 1. Smoking Impact (Massive cardiovascular/oncology risk)
        if smoker:
            risk_score += 35.0
            risk_factors.append("Active tobacco smoking (+35 pts risk)")
        else:
            risk_factors.append("Non-smoker status (Favorable base risk)")

        # 2. BMI Impact
        if bmi >= 35.0:
            risk_score += 25.0
            risk_factors.append(f"Severe obesity (BMI {bmi}) elevates metabolic risk (+25 pts)")
        elif bmi >= 30.0:
            risk_score += 18.0
            risk_factors.append(f"Obesity Class I (BMI {bmi}) (+18 pts)")
        elif bmi >= 25.0:
            risk_score += 8.0
            risk_factors.append(f"Overweight BMI {bmi} (+8 pts)")
        elif bmi < 18.5:
            risk_score += 5.0
            risk_factors.append(f"Underweight BMI {bmi} (+5 pts)")
        else:
            risk_factors.append(f"Optimal healthy BMI {bmi} (No BMI surcharge)")

        # Smoker + Obese combined compound risk
        if smoker and bmi >= 30.0:
            risk_score += 12.0
            risk_factors.append("High-risk compound multiplier: Active smoking + BMI >= 30 (+12 pts)")

        # 3. Age Impact
        if age >= 55:
            risk_score += 15.0
            risk_factors.append(f"Senior age bracket ({age} yrs) increases baseline morbidity (+15 pts)")
        elif age >= 40:
            risk_score += 8.0
            risk_factors.append(f"Middle age bracket ({age} yrs) (+8 pts)")
        else:
            risk_factors.append(f"Young adult demographic ({age} yrs) (Low age baseline)")

        # 4. Physical Activity & Daily Steps
        if steps >= 10000 or activity == "high":
            risk_score -= 8.0
            risk_factors.append("Excellent physical mobility (>=10k steps) (-8 pts discount)")
        elif steps >= 6000 or activity == "moderate":
            risk_score -= 4.0
            risk_factors.append("Moderate regular activity (-4 pts discount)")
        else:
            risk_score += 6.0
            risk_factors.append("Sedentary lifestyle (<6k steps) (+6 pts)")

        # 5. Chronic Conditions
        high_risk_keywords = ["diabetes", "hypertension", "heart", "cardiac", "cancer", "stroke", "kidney", "asthma"]
        found_conditions = [kw for kw in high_risk_keywords if kw in conditions]
        if found_conditions:
            cond_penalty = min(20.0, len(found_conditions) * 10.0)
            risk_score += cond_penalty
            risk_factors.append(f"Pre-existing condition(s) detected: {', '.join(found_conditions)} (+{cond_penalty} pts)")

        # 6. Checkups & Heart Rate
        if not regular_checkups:
            risk_score += 3.0
            risk_factors.append("No regular annual preventative screening (+3 pts)")
        else:
            risk_score -= 2.0

        if heart_rate > 90:
            risk_score += 4.0
            risk_factors.append(f"Elevated resting heart rate ({heart_rate} BPM) (+4 pts)")

        # Clamp risk score between 5.0 and 99.0
        risk_score = round(max(5.0, min(99.0, risk_score)), 1)

        # Categorize
        if risk_score < 35.0:
            risk_category = "Low Risk"
            summary_desc = "Standard health profile with minimal actuarial risk factors."
        elif risk_score <= 65.0:
            risk_category = "Moderate Risk"
            summary_desc = "Moderate risk indicators present; controllable lifestyle modifications can reduce risk."
        else:
            risk_category = "High Risk"
            summary_desc = "Significant risk factors identified (e.g. tobacco use, elevated BMI, or chronic history)."

        risk_assessment = {
            "bmi": bmi,
            "bmi_category": bmi_category,
            "risk_score": risk_score,
            "risk_category": risk_category,
            "risk_summary": summary_desc,
            "risk_factors": risk_factors
        }

        exec_time = round((time.time() - start_time) * 1000, 2)
        step_log = {
            "agent_name": self.name,
            "status": "SUCCESS",
            "execution_time_ms": exec_time,
            "summary": f"Calculated BMI {bmi} ({bmi_category}). Assigned {risk_category} (Score: {risk_score}/100).",
            "details": {
                "bmi": bmi,
                "risk_score": risk_score,
                "risk_category": risk_category,
                "top_factors_count": len(risk_factors)
            }
        }

        return risk_assessment, step_log

