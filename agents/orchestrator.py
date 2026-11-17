"""
Central Orchestrator Agent
Coordinates the complete multi-agent workflow:
Intake Agent -> Risk Assessment Agent -> Pricing Agent -> Insight Agent -> Synthesis.
Captures timing, status, and telemetry across each stage.
"""

import os
import time
from typing import Dict, Any, Optional, List
from agents.intake_agent import IntakeAgent
from agents.risk_agent import RiskAssessmentAgent
from agents.pricing_agent import PricingAgent
from agents.insight_agent import InsightAgent

class CentralOrchestrator:
    def __init__(self, models_dir=None):
        self.name = "Central Orchestrator"
        if models_dir is None:
            models_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "models"))
        self.models_dir = models_dir
        self.intake_agent = IntakeAgent()
        self.risk_agent = RiskAssessmentAgent()
        self.pricing_agent = PricingAgent(models_dir=models_dir)
        self.insight_agent = InsightAgent(models_dir=models_dir)

    def run_pipeline(self, raw_input: Dict[str, Any], previous_prediction: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        pipeline_start = time.time()
        agent_logs: List[Dict[str, Any]] = []

        # ----------------------------------------------------
        # STAGE 1: Intake Agent
        # ----------------------------------------------------
        try:
            validated_data, intake_log = self.intake_agent.process(raw_input)
            agent_logs.append(intake_log)
        except Exception as e:
            agent_logs.append({
                "agent_name": self.intake_agent.name,
                "status": "ERROR",
                "execution_time_ms": 0.0,
                "summary": f"Intake validation failed: {str(e)}",
                "details": {"error": str(e)}
            })
            raise ValueError(f"Intake Agent error: {str(e)}")

        # ----------------------------------------------------
        # STAGE 2: Risk Assessment Agent
        # ----------------------------------------------------
        try:
            risk_assessment, risk_log = self.risk_agent.process(validated_data)
            agent_logs.append(risk_log)
        except Exception as e:
            agent_logs.append({
                "agent_name": self.risk_agent.name,
                "status": "ERROR",
                "execution_time_ms": 0.0,
                "summary": f"Risk assessment failed: {str(e)}",
                "details": {"error": str(e)}
            })
            raise RuntimeError(f"Risk Assessment Agent error: {str(e)}")

        # ----------------------------------------------------
        # STAGE 3: Pricing Agent (ML Inference)
        # ----------------------------------------------------
        try:
            pricing_result, pricing_log = self.pricing_agent.process(validated_data, risk_assessment)
            agent_logs.append(pricing_log)
        except Exception as e:
            agent_logs.append({
                "agent_name": self.pricing_agent.name,
                "status": "ERROR",
                "execution_time_ms": 0.0,
                "summary": f"Pricing inference failed: {str(e)}",
                "details": {"error": str(e)}
            })
            raise RuntimeError(f"Pricing Agent error: {str(e)}")

        # ----------------------------------------------------
        # STAGE 4: Insight Agent (Explainability & Savings)
        # ----------------------------------------------------
        try:
            insight_result, insight_log = self.insight_agent.process(
                validated_data, risk_assessment, pricing_result, previous_prediction
            )
            agent_logs.append(insight_log)
        except Exception as e:
            agent_logs.append({
                "agent_name": self.insight_agent.name,
                "status": "ERROR",
                "execution_time_ms": 0.0,
                "summary": f"Insight generation failed: {str(e)}",
                "details": {"error": str(e)}
            })
            raise RuntimeError(f"Insight Agent error: {str(e)}")

        # ----------------------------------------------------
        # FINAL STAGE: Orchestrator Synthesis
        # ----------------------------------------------------
        total_exec_time = round((time.time() - pipeline_start) * 1000, 2)
        orchestrator_log = {
            "agent_name": self.name,
            "status": "SUCCESS",
            "execution_time_ms": total_exec_time,
            "summary": f"Orchestrated 4 agents in {total_exec_time}ms. Final premium compiled successfully.",
            "details": {
                "total_pipeline_time_ms": total_exec_time,
                "stages_completed": 4
            }
        }
        agent_logs.append(orchestrator_log)

        # Assemble unified response
        final_response = {
            "predicted_premium_inr": pricing_result["predicted_premium_inr"],
            "premium_range_min": pricing_result["premium_range_min"],
            "premium_range_max": pricing_result["premium_range_max"],
            "risk_category": risk_assessment["risk_category"],
            "risk_score": risk_assessment["risk_score"],
            "bmi": risk_assessment["bmi"],
            "bmi_category": risk_assessment["bmi_category"],
            "model_used": pricing_result["selected_model"],
            "model_r2": pricing_result["model_r2"],
            "model_mae": pricing_result["model_mae"],
            "model_comparisons": pricing_result["predictions_inr_comparison"],
            "features_snapshot": validated_data,
            "influencing_factors": insight_result["influencing_factors"],
            "explanation": insight_result["explanation"],
            "improvement_tips": insight_result["improvement_tips"],
            "total_potential_savings_inr": insight_result["total_potential_savings_inr"],
            "agent_logs": agent_logs
        }

        return final_response

