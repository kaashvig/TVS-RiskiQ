import os
import pandas as pd
from typing import Dict, Any
from models.schemas import CustomerDetails, AssetDetails

class CopilotService:
    def __init__(self):
        self.groq_api_key = os.getenv("GROQ_API_KEY")
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
        self.client = None

        self.base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        self.ai_rec_csv = os.path.join(self.base_dir, "data", "processed", "ai_credit_recommendations.csv")
        self.ai_rec_df = None
        self._load_precomputed_recs()

        if self.groq_api_key:
            try:
                from groq import Groq
                self.client = Groq(api_key=self.groq_api_key)
                print("[CopilotService] Initialized Groq LLM Client")
            except Exception as e:
                print(f"[CopilotService] Failed to initialize Groq client: {e}")
        elif self.openai_api_key:
            try:
                from openai import OpenAI
                self.client = OpenAI(api_key=self.openai_api_key)
                print("[CopilotService] Initialized OpenAI LLM Client")
            except Exception as e:
                print(f"[CopilotService] Failed to initialize OpenAI client: {e}")

    def _load_precomputed_recs(self):
        """Load pre-computed AI recommendations if file exists."""
        try:
            if os.path.exists(self.ai_rec_csv):
                self.ai_rec_df = pd.read_csv(self.ai_rec_csv)
                print(f"[CopilotService] Loaded pre-computed AI recommendations ({len(self.ai_rec_df)} records)")
        except Exception as e:
            print(f"[CopilotService] Could not load AI recommendations CSV: {e}")

    def generate_asset_summary(self, customer: CustomerDetails, asset: AssetDetails, ml_results: Dict[str, Any]) -> str:
        agmt_id = asset.agmt_id or "TN-01-EV-2024-8842"

        # 1. Check pre-computed CSV recommendations
        if self.ai_rec_df is not None and agmt_id in self.ai_rec_df["Agmt_Id"].values:
            matched = self.ai_rec_df[self.ai_rec_df["Agmt_Id"] == agmt_id]["AI_Recommendation"].values
            if len(matched) > 0 and pd.notna(matched[0]):
                return str(matched[0])

        prompt = f"""
You are a Senior Credit Risk Officer at TVS Credit Services.
Analyze the following loan application details and ML model predictions:

Agreement ID: {agmt_id}
Customer Profile: Age {customer.cust_age}, CIBIL {customer.cust_cibil_score}, Employment: {customer.cust_employment_type}, Monthly Income: ₹{customer.cust_monthly_income:,.2f}, FOIR: {customer.cust_foir * 100:.1f}%, State: {customer.cust_state}
Asset Details: Model: {asset.asset_model}, Fuel: {asset.asset_fuel_type}, Category: {asset.asset_category}, Ex-Showroom Cost: ₹{asset.asset_cost:,.2f}, Loan Amount: ₹{asset.loan_amount:,.2f}, Tenure: {asset.tenure} months
ML Predictions:
- Residual Value Forecast: ₹{ml_results['residual_value_forecast']:,.2f}
- Residual Risk Score: {ml_results['residual_risk_score']:.1f}/100 ({ml_results['risk_band']} Risk)
- Profitability Score: {ml_results['profitability_score']:.1f}/100
- Recommended LTV: {ml_results['recommended_ltv']}% (Current LTV: {ml_results['ltv']}%)
- Recommended Tenure: {ml_results['recommended_tenure']} months
- Decision: {ml_results['decision']}

Provide an executive summary with:
1. Overall Risk Assessment
2. Key Risk Drivers
3. Mitigations & Recommended Lending Actions
"""
        # 2. Try Groq or OpenAI API call if client initialized
        if self.client:
            try:
                response = self.client.chat.completions.create(
                    model="llama3-70b-8192",
                    messages=[
                        {"role": "system", "content": "You are a Senior TVS Credit Risk Officer delivering concise executive credit decisions."},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.3,
                    max_tokens=500
                )
                return response.choices[0].message.content
            except Exception as e:
                print(f"[CopilotService] LLM API call error: {e}. Falling back to rule-based summary.")

        # 3. Rule-based summary fallback
        return self._generate_fallback_summary(customer, asset, ml_results)

    def _generate_fallback_summary(self, customer: CustomerDetails, asset: AssetDetails, ml_results: Dict[str, Any]) -> str:
        decision = ml_results["decision"]
        risk_band = ml_results["risk_band"]
        ltv = ml_results["ltv"]
        rec_ltv = ml_results["recommended_ltv"]
        
        summary = f"**Executive Decision**: {decision}\n\n"
        summary += f"• **Risk Assessment**: Asset {asset.agmt_id or 'contract'} carries a **{risk_band}** residual risk score of {ml_results['residual_risk_score']:.1f}/100. Current LTV is {ltv}% against an asset cost of ₹{asset.asset_cost:,.0f}.\n"
        summary += f"• **Key Risk Drivers**: LTV ratio ({ltv}%), CIBIL credit score ({customer.cust_cibil_score}), and vehicle model depreciation profile for {asset.asset_model} ({asset.asset_fuel_type}).\n"
        summary += f"• **Recommended Action**: Cap loan LTV at **{rec_ltv}%** (₹{asset.asset_cost * (rec_ltv / 100):,.0f}) and restrict tenure to **{ml_results['recommended_tenure']} months**. "
        
        if asset.asset_fuel_type.lower() in ["electric", "ev"]:
            summary += "Mandate telematics battery monitoring to mitigate EV battery capacity degradation risk."
        else:
            summary += "Require automated NACH mandate setup and secondary guarantor confirmation."

        return summary

# Singleton instance
copilot_service = CopilotService()
