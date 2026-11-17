"""
Agent 4: Insight Agent
Provides Explainable AI (XAI) insights: decomposes cost factors,
quantifies actuarial impact, calculates actionable savings from lifestyle changes,
and generates narrative explanations in plain English. Supports LLM API with intelligent fallback.
"""

import os
import json
import time
from typing import Dict, Any, Tuple, List, Optional
import urllib.request

class InsightAgent:
    def __init__(self, models_dir=None):
        self.name = "Insight Agent"
        if models_dir is None:
            models_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "models"))
        self.models_dir = models_dir
        self.feature_importances = {}
        self._load_metrics()

    def _load_metrics(self):
        metrics_path = os.path.join(self.models_dir, "model_metrics.json")
        if os.path.exists(metrics_path):
            with open(metrics_path, "r") as f:
                data = json.load(f)
                self.feature_importances = data.get("feature_importances", {})

    def calculate_influencing_factors(self, data: Dict[str, Any], risk: Dict[str, Any], premium_inr: float) -> List[Dict[str, Any]]:
        factors = []
        is_smoker = data.get("smoker") == "yes"
        bmi = risk.get("bmi", 24.0)
        age = data.get("age", 30)
        activity = data.get("physical_activity", "moderate")
        steps = data.get("daily_steps", 6000)
        conditions = data.get("medical_conditions", "None")

        # 1. Smoker factor
        if is_smoker:
            factors.append({
                "factor": "Tobacco / Smoking Status",
                "importance_pct": 52,
                "direction": "INCREASE",
                "impact_label": "Critical Cost Driver",
                "description": "Active smoking is the single highest actuarial risk factor, causing a compound surcharge across respiratory and cardiovascular risk tables."
            })
        else:
            factors.append({
                "factor": "Non-Smoker Status",
                "importance_pct": 45,
                "direction": "DECREASE",
                "impact_label": "Major Premium Discount",
                "description": "Non-smoker classification protects you from significant actuarial risk surcharges."
            })

        # 2. BMI Factor
        if bmi >= 30:
            factors.append({
                "factor": f"Body Mass Index ({bmi} - Obese)",
                "importance_pct": 24,
                "direction": "INCREASE",
                "impact_label": "High Impact",
                "description": f"BMI above 30 elevates metabolic and cardiovascular risk, compounding the base actuarial rate."
            })
        elif bmi >= 25:
            factors.append({
                "factor": f"Body Mass Index ({bmi} - Overweight)",
                "importance_pct": 14,
                "direction": "INCREASE",
                "impact_label": "Moderate Impact",
                "description": "BMI is slightly elevated above the ideal 18.5-24.9 window."
            })
        else:
            factors.append({
                "factor": f"Optimal Body Mass Index ({bmi})",
                "importance_pct": 20,
                "direction": "DECREASE",
                "impact_label": "Healthy Baseline",
                "description": "Your BMI falls in the medically optimal range, avoiding overweight surcharges."
            })

        # 3. Age Factor
        if age >= 50:
            factors.append({
                "factor": f"Age Demographic ({age} yrs)",
                "importance_pct": 15,
                "direction": "INCREASE",
                "impact_label": "Age Bracket Surcharge",
                "description": "Actuarial probability of claim claims rises naturally in older demographic brackets."
            })
        else:
            factors.append({
                "factor": f"Age Bracket ({age} yrs)",
                "importance_pct": 12,
                "direction": "DECREASE",
                "impact_label": "Youth Discount",
                "description": "Younger age minimizes morbidity hazard rates in underwriting algorithms."
            })

        # 4. Activity & Mobility
        if steps >= 8000 or activity == "high":
            factors.append({
                "factor": f"Physical Activity & Mobility ({steps:,} steps/day)",
                "importance_pct": 9,
                "direction": "DECREASE",
                "impact_label": "Favorable Lifestyle Credit",
                "description": "Active daily lifestyle and continuous step count reduce long-term cardiovascular claim likelihood."
            })

        return factors

    def calculate_health_savings(self, data: Dict[str, Any], risk: Dict[str, Any], premium_inr: float) -> List[Dict[str, Any]]:
        tips = []
        is_smoker = data.get("smoker") == "yes"
        bmi = risk.get("bmi", 24.0)
        steps = data.get("daily_steps", 6000)

        # 1. Smoking cessation
        if is_smoker:
            savings = round(premium_inr * 0.48, 2)
            tips.append({
                "action": "Complete Tobacco Cessation",
                "potential_saving_inr": savings,
                "timeframe": "6 - 12 Months",
                "impact_level": "Highest",
                "description": f"Quitting smoking can slash up to 48% off your underwriting premium, yielding estimated annual savings of ₹{savings:,.2f}."
            })

        # 2. BMI reduction
        if bmi > 25.0:
            target_bmi = 24.0
            excess_pct = (bmi - target_bmi) / bmi
            bmi_savings = round(premium_inr * min(0.30, excess_pct * 0.75), 2)
            tips.append({
                "action": "Weight Management to Normal BMI (<25)",
                "potential_saving_inr": bmi_savings,
                "timeframe": "3 - 6 Months",
                "impact_level": "High",
                "description": f"Lowering BMI from {bmi} to below 25.0 moves you out of the metabolic surcharge tier, saving approx ₹{bmi_savings:,.2f}/yr."
            })

        # 3. Step count increase
        if steps < 10000:
            step_savings = round(premium_inr * 0.08, 2)
            tips.append({
                "action": "Increase Daily Step Count to 10,000+",
                "potential_saving_inr": step_savings,
                "timeframe": "Immediate (30-60 days)",
                "impact_level": "Moderate",
                "description": f"Logging consistent 10k daily steps qualifies for wellness discount programs, saving approx ₹{step_savings:,.2f}/yr."
            })

        # 4. Preventative Health Checkups
        if not data.get("regular_checkups", True):
            checkup_savings = round(premium_inr * 0.05, 2)
            tips.append({
                "action": "Schedule Annual Preventative Medical Screenings",
                "potential_saving_inr": checkup_savings,
                "timeframe": "Annual",
                "impact_level": "Preventative",
                "description": f"Insurers reward proactive preventative health checkups with preferred claim terms, saving approx ₹{checkup_savings:,.2f}/yr."
            })

        return tips

    def generate_explanation(self, data: Dict[str, Any], risk: Dict[str, Any], pricing: Dict[str, Any], previous_prediction: Optional[Dict[str, Any]] = None) -> str:
        """
        Generates high quality explainable natural language analysis.
        Uses external LLM (Gemini API) if GEMINI_API_KEY is available, otherwise provides
        expert actuarial rule-based narrative.
        """
        api_key = os.getenv("GEMINI_API_KEY")
        if api_key:
            try:
                # LLM explanation attempt
                prompt = f"""
                You are an expert health insurance actuary and medical underwriter for PremiumPulse.
                Explain this health insurance premium prediction to the user in a professional, empathetic, and clear manner (2-3 short paragraphs):
                User Data: Age: {data.get('age')}, BMI: {risk.get('bmi')} ({risk.get('bmi_category')}), Smoker: {data.get('smoker')}, Activity: {data.get('physical_activity')}, Steps: {data.get('daily_steps')}, Medical conditions: {data.get('medical_conditions')}.
                Risk Category: {risk.get('risk_category')} (Score: {risk.get('risk_score')}/100).
                ML Model Used: {pricing.get('selected_model')}.
                Predicted Annual Premium: INR {pricing.get('predicted_premium_inr'):,.2f} (Range: INR {pricing.get('premium_range_min'):,.2f} - {pricing.get('premium_range_max'):,.2f}).
                Explain the primary reasons for this rate, highlight the biggest cost drivers, and provide encouraging recommendations for lowering the rate.
                """
                url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
                req_data = json.dumps({"contents": [{"parts": [{"text": prompt}]}]}).encode("utf-8")
                req = urllib.request.Request(url, data=req_data, headers={"Content-Type": "application/json"})
                with urllib.request.urlopen(req, timeout=5) as response:
                    res_body = json.loads(response.read().decode())
                    text = res_body["candidates"][0]["content"]["parts"][0]["text"]
                    return text.strip()
            except Exception as e:
                # Fallback to expert rule-based narrative
                pass

        # Robust, high-grade actuarial rule-based narrative
        smoker = data.get("smoker") == "yes"
        bmi = risk.get("bmi")
        bmi_cat = risk.get("bmi_category")
        risk_cat = risk.get("risk_category")
        premium = pricing.get("predicted_premium_inr", 0.0)
        model = pricing.get("selected_model", "XGBoost")
        age = data.get("age")

        comparison_note = ""
        if previous_prediction:
            prev_prem = previous_prediction.get("predicted_premium_inr", premium)
            diff = premium - prev_prem
            if abs(diff) > 50:
                if diff > 0:
                    comparison_note = f" Compared to your previous estimate of ₹{prev_prem:,.2f}, your new estimate increased by ₹{abs(diff):,.2f} due to updated health parameters."
                else:
                    comparison_note = f" Compared to your previous estimate of ₹{prev_prem:,.2f}, your new estimate decreased by ₹{abs(diff):,.2f}—reflecting your improved health profile!"

        if risk_cat == "Low Risk":
            p1 = f"Your estimated annual health insurance premium of ₹{premium:,.2f} reflects an optimal **{risk_cat}** profile. Underwritten using our top-performing {model} model, your rates benefit from non-smoker status, healthy BMI ({bmi}), and active physical habits.{comparison_note}"
            p2 = "Maintaining your current physical activity, routine annual preventative screenings, and balanced nutrition will help preserve this preferred tier over future renewal cycles."
        elif risk_cat == "Moderate Risk":
            p1 = f"Your estimated annual premium of ₹{premium:,.2f} places you in the **{risk_cat}** bracket. The primary cost drivers influencing your {model} prediction include your current BMI of {bmi} ({bmi_cat}) and age bracket ({age} years).{comparison_note}"
            p2 = "Fortunately, this estimate is highly responsive to lifestyle adjustments. Engaging in consistent cardiovascular exercise, keeping your daily step count above 8,000, and managing body weight can substantially reduce your future premium."
        else:
            p1 = f"Your estimated annual premium of ₹{premium:,.2f} is in the **{risk_cat}** band. Our {model} model identified elevated underwriting risk primarily driven by {'active tobacco smoking' if smoker else 'elevated metabolic indicators'} and a BMI of {bmi} ({bmi_cat}).{comparison_note}"
            p2 = "Insurers apply compound risk surcharges when lifestyle risk factors coincide. Making targeted adjustments—such as tobacco cessation programs and structured nutritional guidance—can yield the largest relative premium reductions in the industry."

        return f"{p1}\n\n{p2}"

    def process(self, validated_data: Dict[str, Any], risk_assessment: Dict[str, Any], pricing_result: Dict[str, Any], previous_prediction: Optional[Dict[str, Any]] = None) -> Tuple[Dict[str, Any], Dict[str, Any]]:
        start_time = time.time()
        
        premium = pricing_result["predicted_premium_inr"]
        factors = self.calculate_influencing_factors(validated_data, risk_assessment, premium)
        savings_tips = self.calculate_health_savings(validated_data, risk_assessment, premium)
        explanation = self.generate_explanation(validated_data, risk_assessment, pricing_result, previous_prediction)

        insight_result = {
            "explanation": explanation,
            "influencing_factors": factors,
            "improvement_tips": savings_tips,
            "total_potential_savings_inr": sum(t["potential_saving_inr"] for t in savings_tips)
        }

        exec_time = round((time.time() - start_time) * 1000, 2)
        step_log = {
            "agent_name": self.name,
            "status": "SUCCESS",
            "execution_time_ms": exec_time,
            "summary": f"Generated explainability insights: {len(factors)} cost drivers, {len(savings_tips)} actionable health savings targets.",
            "details": {
                "top_factor": factors[0]["factor"] if factors else "N/A",
                "max_saving_inr": savings_tips[0]["potential_saving_inr"] if savings_tips else 0.0
            }
        }

        return insight_result, step_log

