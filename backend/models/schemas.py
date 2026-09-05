from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class CustomerDetails(BaseModel):
    cust_age: int = Field(35, ge=18, le=80, description="Customer age in years")
    cust_cibil_score: int = Field(720, ge=300, le=900, description="CIBIL credit score")
    cust_employment_type: str = Field("Salaried", description="Salaried, Self-Employed, etc.")
    cust_monthly_income: float = Field(45000.0, ge=0, description="Monthly income in INR")
    cust_foir: float = Field(0.42, ge=0, le=1.0, description="Fixed Obligation to Income Ratio")
    cust_state: str = Field("Tamil Nadu", description="State of residence")
    cust_pin_code: Optional[str] = Field("600001", description="Pincode")

class AssetDetails(BaseModel):
    agmt_id: Optional[str] = Field("TN-01-EV-2024-8842", description="Agreement ID")
    asset_cost: float = Field(125000.0, gt=0, description="Ex-showroom asset cost")
    loan_amount: float = Field(95000.0, gt=0, description="Loan amount disbursed")
    asset_model: str = Field("TVS iQube", description="Vehicle model name")
    asset_fuel_type: str = Field("Electric", description="Petrol, Electric, Hybrid, etc.")
    asset_category: str = Field("Scooter", description="Scooter, Motorcycle, Moped")
    tenure: int = Field(36, gt=0, description="Loan tenure in months")
    cust_net_irr: float = Field(14.5, description="Net IRR percentage")
    odometer_reading: float = Field(12500.0, ge=0, description="Kilometers driven")
    battery_health_pct: Optional[float] = Field(92.0, ge=0, le=100, description="Battery health percentage for EVs")

class ShapFeatureImportance(BaseModel):
    feature: str
    importance: float
    shap_value: float

class AnalysisRequest(BaseModel):
    customer_details: CustomerDetails
    asset_details: AssetDetails

class AnalysisResponse(BaseModel):
    agmt_id: str
    ltv: float
    residual_value_forecast: float
    residual_loss: float
    residual_risk_score: float
    risk_band: str
    profitability_score: float
    recommended_ltv: float
    recommended_tenure: int
    expected_loss: float
    expected_profit: float
    decision: str
    shap_explanation: List[ShapFeatureImportance]
    ai_copilot_summary: str

class ReportRequest(BaseModel):
    customer_details: CustomerDetails
    asset_details: AssetDetails
    analysis_data: Optional[Dict[str, Any]] = None
