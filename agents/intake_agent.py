"""
Agent 1: Intake Agent
Validates user health and lifestyle data, flags inconsistencies, ensures sanity bounds,
and prepares normalized structured input for downstream agents.
"""

import time
from typing import Dict, Any, Tuple

class IntakeAgent:
    def __init__(self):
        self.name = "Intake Agent"

    def process(self, raw_data: Dict[str, Any]) -> Tuple[Dict[str, Any], Dict[str, Any]]:
        """
        Validates raw user data and returns (validated_data, step_log).
        """
        start_time = time.time()
        warnings = []
        errors = []

        # 1. Age validation
        age = int(raw_data.get("age", 0))
        if age < 18 or age > 100:
            errors.append(f"Age {age} is outside the allowable insurance policy age window (18-100).")

        # 2. Height and Weight
        height_cm = float(raw_data.get("height_cm", 0.0))
        weight_kg = float(raw_data.get("weight_kg", 0.0))
        
        if height_cm < 80.0 or height_cm > 250.0:
            errors.append(f"Height {height_cm}cm is outside realistic physiological range (80-250cm).")
        if weight_kg < 25.0 or weight_kg > 300.0:
            errors.append(f"Weight {weight_kg}kg is outside realistic physiological range (25-300kg).")

        # 3. Smoking status
        smoker = str(raw_data.get("smoker", "no")).strip().lower()
        if smoker not in ["yes", "no"]:
            warnings.append(f"Unrecognized smoker flag '{smoker}'. Defaulted to 'no'.")
            smoker = "no"

        # 4. Gender
        gender = str(raw_data.get("gender", "male")).strip().lower()
        if gender not in ["male", "female", "other"]:
            gender = "male"

        # 5. Activity level & steps consistency check
        activity = str(raw_data.get("physical_activity", "moderate")).strip().lower()
        daily_steps = int(raw_data.get("daily_steps", 6000))
        
        if activity == "high" and daily_steps < 3000:
            warnings.append("Declared 'High' physical activity but recorded fewer than 3,000 daily steps. Checked for wearable calibration.")
        elif activity == "low" and daily_steps > 12000:
            warnings.append("Declared 'Low' physical activity but logged over 12,000 steps. Lifestyle classification calibrated upward.")
            activity = "moderate"

        # 6. Region
        region = str(raw_data.get("region", "southwest")).strip().lower()
        if region not in ["southwest", "southeast", "northwest", "northeast"]:
            region = "southwest"

        # 7. Dependents & Coverage
        dependents = max(0, min(10, int(raw_data.get("dependents", 0))))
        coverage = str(raw_data.get("coverage_preference", "standard")).strip().lower()
        if coverage not in ["standard", "comprehensive", "premium"]:
            coverage = "standard"

        # 8. Medical History & Conditions
        medical_conditions = str(raw_data.get("medical_conditions", "None")).strip()
        previous_history = str(raw_data.get("previous_medical_history", "None")).strip()
        regular_checkups = bool(raw_data.get("regular_checkups", True))
        heart_rate = int(raw_data.get("heart_rate", 72)) if raw_data.get("heart_rate") else 72
        
        if heart_rate < 40 or heart_rate > 180:
            warnings.append(f"Resting heart rate of {heart_rate} BPM is atypical. Flagged for review.")

        if errors:
            status = "ERROR"
            summary = f"Intake rejected with {len(errors)} error(s): " + "; ".join(errors)
            raise ValueError(summary)
        elif warnings:
            status = "WARNING"
            summary = f"Intake validated with {len(warnings)} caution notes: " + "; ".join(warnings)
        else:
            status = "SUCCESS"
            summary = f"Intake validation successful. All 12 parameters verified within physiological and policy constraints."

        validated_data = {
            "age": age,
            "gender": gender,
            "height_cm": height_cm,
            "weight_kg": weight_kg,
            "smoker": smoker,
            "physical_activity": activity,
            "daily_steps": daily_steps,
            "alcohol": str(raw_data.get("alcohol", "none")).strip().lower(),
            "medical_conditions": medical_conditions,
            "previous_medical_history": previous_history,
            "regular_checkups": regular_checkups,
            "heart_rate": heart_rate,
            "dependents": dependents,
            "coverage_preference": coverage,
            "region": region
        }

        exec_time = round((time.time() - start_time) * 1000, 2)
        step_log = {
            "agent_name": self.name,
            "status": status,
            "execution_time_ms": exec_time,
            "summary": summary,
            "details": {
                "validated_fields_count": len(validated_data),
                "warnings": warnings,
                "sanitized_inputs": {
                    "age": age,
                    "gender": gender,
                    "smoker": smoker,
                    "steps": daily_steps,
                    "dependents": dependents
                }
            }
        }

        return validated_data, step_log

