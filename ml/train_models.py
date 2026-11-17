"""
PremiumPulse ML Training Pipeline
Trains Linear Regression, Random Forest, and XGBoost models on the Medical Cost Personal Dataset.
Evaluates metrics (MAE, MSE, RMSE, R²), serializes the models and preprocessing artifacts with joblib.
"""

import os
import json
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from xgboost import XGBRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

# Constants
USD_TO_INR = 83.50  # Base conversion rate
ACTUARIAL_RATE = 0.055 # Medical cost to annual insurance policy premium calibration factor (approx 5.5% of total expected risk load)

def load_data(filepath="datasets/insurance.csv"):
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"Dataset file {filepath} not found.")
    df = pd.read_csv(filepath)
    return df

def feature_engineering(df):
    """
    Transforms raw features into engineered feature set for modeling.
    """
    df = df.copy()
    
    # Binary encodings
    df['is_smoker'] = (df['smoker'].str.lower() == 'yes').astype(int)
    df['is_male'] = (df['sex'].str.lower() == 'male').astype(int)
    
    # High-risk interaction terms (known actuarial driver)
    df['obese'] = (df['bmi'] >= 30.0).astype(int)
    df['smoker_obese_interaction'] = df['is_smoker'] * df['obese']
    df['smoker_bmi_interaction'] = df['is_smoker'] * df['bmi']
    df['age_squared'] = (df['age'] / 10.0) ** 2
    
    # Region one-hot encoding
    regions = ['northeast', 'northwest', 'southeast', 'southwest']
    for r in regions:
        df[f'region_{r}'] = (df['region'].str.lower() == r).astype(int)
        
    feature_cols = [
        'age', 'bmi', 'children', 'is_male', 'is_smoker', 
        'obese', 'smoker_obese_interaction', 'smoker_bmi_interaction', 'age_squared',
        'region_northeast', 'region_northwest', 'region_southeast', 'region_southwest'
    ]
    
    return df[feature_cols], df['charges'], feature_cols

def train_and_evaluate():
    print("==================================================")
    print("      PREMIUMPULSE ML MODEL TRAINING PIPELINE      ")
    print("==================================================")
    
    os.makedirs("models", exist_ok=True)
    
    df = load_data()
    print(f"Loaded dataset with {len(df)} rows and {len(df.columns)} columns.")
    
    X, y, feature_cols = feature_engineering(df)
    
    # Train / Test split (80/20)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42
    )
    
    print(f"Training set: {X_train.shape[0]} samples, Test set: {X_test.shape[0]} samples.")
    
    models = {
        "Linear Regression": LinearRegression(),
        "Random Forest": RandomForestRegressor(
            n_estimators=150, 
            max_depth=6, 
            min_samples_split=4,
            random_state=42
        ),
        "XGBoost": XGBRegressor(
            n_estimators=150, 
            max_depth=4, 
            learning_rate=0.05, 
            subsample=0.85,
            colsample_bytree=0.85,
            random_state=42
        )
    }
    
    results = {}
    trained_model_objs = {}
    
    for name, model in models.items():
        print(f"\nTraining {name}...")
        model.fit(X_train, y_train)
        
        y_pred = model.predict(X_test)
        
        mae = float(mean_absolute_error(y_test, y_pred))
        mse = float(mean_squared_error(y_test, y_pred))
        rmse = float(np.sqrt(mse))
        r2 = float(r2_score(y_test, y_pred))
        
        # Calculate INR scaled metrics
        mae_inr = float(mae * USD_TO_INR * ACTUARIAL_RATE)
        rmse_inr = float(rmse * USD_TO_INR * ACTUARIAL_RATE)
        
        results[name] = {
            "mae_usd": round(mae, 2),
            "mse_usd": round(mse, 2),
            "rmse_usd": round(rmse, 2),
            "r2_score": round(r2, 4),
            "mae_inr": round(mae_inr, 2),
            "rmse_inr": round(rmse_inr, 2)
        }
        
        trained_model_objs[name] = model
        print(f"-> {name} Results: R² = {r2:.4f} | MAE = ${mae:.2f} (₹{mae_inr:.2f}) | RMSE = ${rmse:.2f}")

    # Determine best model based on R² score
    best_model_name = max(results, key=lambda k: results[k]["r2_score"])
    print(f"\n==================================================")
    print(f"★ BEST PERFORMING MODEL: {best_model_name} (R² = {results[best_model_name]['r2_score']})")
    print(f"==================================================")
    
    # Feature importances for explainability
    rf_model = trained_model_objs["Random Forest"]
    xgb_model = trained_model_objs["XGBoost"]
    lr_model = trained_model_objs["Linear Regression"]
    
    feature_importance_dict = {
        "Random Forest": dict(zip(feature_cols, [round(float(v), 4) for v in rf_model.feature_importances_])),
        "XGBoost": dict(zip(feature_cols, [round(float(v), 4) for v in xgb_model.feature_importances_])),
        "Linear Regression Coeffs": dict(zip(feature_cols, [round(float(v), 4) for v in lr_model.coef_]))
    }
    
    # Save models
    file_map = {
        "Linear Regression": "models/linear_regression.joblib",
        "Random Forest": "models/random_forest.joblib",
        "XGBoost": "models/xgboost.joblib"
    }
    
    for name, path in file_map.items():
        joblib.dump(trained_model_objs[name], path)
        print(f"Saved {name} to {path}")
        
    # Save metadata & metrics
    metadata = {
        "best_model": best_model_name,
        "features": feature_cols,
        "usd_to_inr": USD_TO_INR,
        "actuarial_rate": ACTUARIAL_RATE,
        "evaluation_metrics": results,
        "feature_importances": feature_importance_dict
    }
    
    with open("models/model_metrics.json", "w") as f:
        json.dump(metadata, f, indent=2)
    print("Saved model_metrics.json successfully.")

    return metadata

if __name__ == "__main__":
    train_and_evaluate()

