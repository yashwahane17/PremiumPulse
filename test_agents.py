"""
Test script for Multi-Agent Orchestrator Pipeline
"""

from agents.orchestrator import CentralOrchestrator

def main():
    orc = CentralOrchestrator()
    sample_input = {
        'age': 35,
        'gender': 'male',
        'height_cm': 175.0,
        'weight_kg': 78.0,
        'smoker': 'no',
        'physical_activity': 'moderate',
        'daily_steps': 7500,
        'medical_conditions': 'None',
        'dependents': 1,
        'coverage_preference': 'standard',
        'region': 'southwest'
    }
    
    res = orc.run_pipeline(sample_input)
    print("--- PIPELINE RUN RESULT ---")
    print(f"Predicted Premium: ₹{res['predicted_premium_inr']:,.2f}")
    print(f"Estimated Range: ₹{res['premium_range_min']:,.2f} - ₹{res['premium_range_max']:,.2f}")
    print(f"Risk Category: {res['risk_category']} (Score: {res['risk_score']})")
    print(f"BMI: {res['bmi']} ({res['bmi_category']})")
    print(f"Model Used: {res['model_used']}")
    print(f"Model Comparisons: {res['model_comparisons']}")
    print(f"\nAgent Execution Steps ({len(res['agent_logs'])} total):")
    for log in res['agent_logs']:
        print(f"  [{log['agent_name']}] Status: {log['status']} ({log['execution_time_ms']}ms)")
        print(f"    Summary: {log['summary']}")
        
    print("\nInfluencing Factors:")
    for f in res['influencing_factors']:
        print(f"  - {f['factor']} ({f['impact_label']}): {f['direction']}")
        
    print("\nActionable Improvement Tips:")
    for tip in res['improvement_tips']:
        print(f"  - {tip['action']}: Potential Savings ₹{tip['potential_saving_inr']:,.2f}")

if __name__ == "__main__":
    main()

