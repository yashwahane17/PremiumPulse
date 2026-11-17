"""
Agent 3: Pricing Agent
Loads the 3 trained ML models (Linear Regression, Random Forest, XGBoost),
generates predictions, compares outputs, selects the optimal model, and computes the INR premium range.
"""

import os
import json
import time
import joblib
import numpy as np
import pandas as pd
from typing import Dict, Any, Tuple

class PricingAgent:
    def __init__(self, models_dir=None):
        self.name = "Pricing Agent"
        if models_dir is None:
            models_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "models"))
        self.models_dir = models_dir
        self.models = {}
        self.metrics = {}
        self.features = []
        self.usd_to_inr = 83.50
        self.actuarial_rate = 0.055
        self._load_models()

    def _load_models(self):
        metrics_path = os.path.join(self.models_dir, "model_metrics.json")
        if os.path.exists(metrics_path):
            with open(metrics_path, "r") as f:
                self.metrics = json.load(f)
                self.features = self.metrics.get("features", [])
                self.usd_to_inr = self.metrics.get("usd_to_inr", 83.50)
                self.actuarial_rate = self.metrics.get("actuarial_rate", 0.055)

        model_files = {
            "Linear Regression": "linear_regression.joblib",
            "Random Forest": "random_forest.joblib",
            "XGBoost": "xgboost.joblib"
        }

        for name, filename in model_files.items():
            path = os.path.join(self.models_dir, filename)
            if os.path.exists(path):
                self.models[name] = joblib.load(path)
            else:
                print(f"Warning: Model file {path} not found.")

    def build_feature_vector(self, data: Dict[str, Any], bmi: float) -> pd.DataFrame:
        age = data["age"]
        children = data["dependents"]
        is_male = 1 if data["gender"] == "male" else 0
        is_smoker = 1 if data["smoker"] == "yes" else 0
        obese = 1 if bmi >= 30.0 else 0
        smoker_obese_interaction = is_smoker * obese
        smoker_bmi_interaction = is_smoker * bmi
        age_squared = (age / 10.0) ** 2

        region = data.get("region", "southwest").lower()
        region_ne = 1 if region == "northeast" else 0
        region_nw = 1 if region == "northwest" else 0
        region_se = 1 if region == "southeast" else 0
        region_sw = 1 if region == "southwest" else 0

        row = {
            'age': age,
            'bmi': bmi,
            'children': children,
            'is_male': is_male,
            'is_smoker': is_smoker,
            'obese': obese,
            'smoker_obese_interaction': smoker_obese_interaction,
            'smoker_bmi_interaction': smoker_bmi_interaction,
            'age_squared': age_squared,
            'region_northeast': region_ne,
            'region_northwest': region_nw,
            'region_southeast': region_se,
            'region_southwest': region_sw
        }

        return pd.DataFrame([row])[self.features]

    def process(self, validated_data: Dict[str, Any], risk_assessment: Dict[str, Any]) -> Tuple[Dict[str, Any], Dict[str, Any]]:
        start_time = time.time()
        
        bmi = risk_assessment["bmi"]
        coverage_pref = validated_data.get("coverage_preference", "standard").lower()
        coverage_multiplier = {
            "standard": 1.0,
            "comprehensive": 1.25,
            "premium": 1.50
        }.get(coverage_pref, 1.0)

        # Build feature DataFrame
        df_features = self.build_feature_vector(validated_data, bmi)

        predictions_usd = {}
        predictions_inr = {}

        for name, model in self.models.items():
            pred_usd = float(model.predict(df_features)[0])
            # Ensure charges cannot be negative
            pred_usd = max(1000.0, pred_usd)
            
            # Policy premium calculation in INR
            # Calibrated formula: Medical Claim Base * Currency Exchange * Actuarial Rate * Coverage Multiplier
            pred_inr = round(pred_usd * self.usd_to_inr * self.actuarial_rate * coverage_multiplier, 2)
            
            predictions_usd[name] = round(pred_usd, 2)
            predictions_inr[name] = pred_inr

        # Select best model
        best_model_name = self.metrics.get("best_model", "Linear Regression")
        if best_model_name not in predictions_inr:
            best_model_name = list(predictions_inr.keys())[0] if predictions_inr else "Default"

        selected_premium_inr = predictions_inr[best_model_name]
        
        # Uncertainty band / Range based on RMSE
        best_eval = self.metrics.get("evaluation_metrics", {}).get(best_model_name, {})
        rmse_inr = best_eval.get("rmse_inr", 15000.0)
        margin = max(1500.0, rmse_inr * 0.15)

        range_min = max(3500.0, round(selected_premium_inr - margin, 2))
        range_max = round(selected_premium_inr + margin, 2)

        pricing_result = {
            "predicted_premium_inr": selected_premium_inr,
            "premium_range_min": range_min,
            "premium_range_max": range_max,
            "selected_model": best_model_name,
            "model_r2": best_eval.get("r2_score", 0.88),
            "model_mae": best_eval.get("mae_inr", 10600.0),
            "predictions_inr_comparison": predictions_inr,
            "predictions_usd_comparison": predictions_usd,
            "coverage_multiplier": coverage_multiplier,
            "coverage_tier": coverage_pref
        }

        exec_time = round((time.time() - start_time) * 1000, 2)
        step_log = {
            "agent_name": self.name,
            "status": "SUCCESS",
            "execution_time_ms": exec_time,
            "summary": f"Executed inference across 3 ML models. Selected {best_model_name} (R²: {pricing_result['model_r2']}). Premium: ₹{selected_premium_inr:,.2f}.",
            "details": {
                "models_evaluated": list(predictions_inr.keys()),
                "comparison": predictions_inr,
                "selected_model": best_model_name,
                "range": f"₹{range_min:,.2f} - ₹{range_max:,.2f}"
            }
        }

        return pricing_result, step_log

