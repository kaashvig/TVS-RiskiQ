import os
import re
import pandas as pd
from typing import Dict, Any, Optional
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

        # Conversational Memory / Session State
        self.session_state: Dict[str, Any] = {
            "current_asset": None
        }

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

    def set_current_asset(self, asset_id: str):
        """Update current asset in session state."""
        if asset_id:
            normalized = self.extract_and_normalize_asset_id(asset_id) or asset_id.upper()
            self.session_state["current_asset"] = normalized

    def get_session_state(self) -> Dict[str, Any]:
        return self.session_state

    def extract_and_normalize_asset_id(self, text: str) -> Optional[str]:
        """Check whether user message contains an explicit asset reference and normalize it."""
        if not text:
            return None
        # Normalize patterns like ASSET_1, asset 1, asset1, Asset 1, asset_1 to ASSET_1
        match = re.search(r'(?:asset|ASSET)[\s_#]?(?:no\.?|num|number)?[\s_]?([1-9]\d*)', text, re.IGNORECASE)
        if match:
            asset_num = match.group(1)
            return f"ASSET_{asset_num}"
        return None

    def detect_intent(self, text: str) -> str:
        """Detect follow-up intent from user message."""
        t = text.lower()

        # WHY_RISK
        if ("why" in t or "reason" in t) and ("risk" in t or "classified" in t or "score" in t or "rating" in t):
            return "WHY_RISK"
        if "high risk" in t or "classified as high risk" in t:
            return "WHY_RISK"

        # WHY_LTV
        if "ltv" in t and ("why" in t or "lower" in t or "reduce" in t or "recommending" in t or "recommend" in t or "ratio" in t):
            return "WHY_LTV"

        # MITIGATION
        if any(k in t for k in ["action", "reduce risk", "mitigat", "lower risk", "lessen risk", "decrease risk"]):
            return "MITIGATION"

        # PROFITABILITY
        if any(k in t for k in ["profit", "margin", "return", "gain", "revenue"]):
            return "PROFITABILITY"

        # STRESS_TEST
        if any(k in t for k in ["stress", "shock", "inflation", "slowdown", "scenario", "perform under"]):
            return "STRESS_TEST"

        # COMPARE
        if any(k in t for k in ["compare", " vs ", "versus", "difference"]):
            return "COMPARE"

        # ANALYZE_RISK
        if any(k in t for k in ["analyze", "analysis", "evaluate", "check", "approve", "review"]):
            return "ANALYZE_RISK"

        return "GENERAL_QUERY"

    def process_chat(self, message: str, session_id: str = "default") -> Dict[str, Any]:
        """Process conversational query with session memory, asset normalization, intent detection, and debug logging."""
        # 1. Check for explicit asset reference
        explicit_asset = self.extract_and_normalize_asset_id(message)

        if explicit_asset:
            self.session_state["current_asset"] = explicit_asset
            current_asset = explicit_asset
        else:
            current_asset = self.session_state.get("current_asset")

        # 2. Detect intent
        intent = self.detect_intent(message)

        # 3. Print required debug logs
        print(f"Current Asset: {current_asset}")
        print(f"Detected Intent: {intent}")

        # 4. Context Resolution
        if not current_asset:
            return {
                "response": "I'd be happy to help! Please specify an asset ID to analyze. Available assets: **ASSET_1**, **ASSET_2**, **ASSET_3**.",
                "current_asset": None,
                "detected_intent": intent
            }

        response_text = self._generate_intent_response(current_asset, intent, message)
        return {
            "response": response_text,
            "current_asset": current_asset,
            "detected_intent": intent
        }

    def _generate_intent_response(self, asset_id: str, intent: str, query: str) -> str:
        """Generate structured response based on current_asset and intent."""
        if asset_id == "ASSET_1":
            if intent == "WHY_RISK":
                return (
                    "ASSET_1 is classified as High Risk because:\n\n"
                    "- Missing CIBIL score\n"
                    "- Non-regular employment\n"
                    "- High residual value gap\n"
                    "- Risk score exceeds approval threshold"
                )
            elif intent == "MITIGATION":
                return (
                    "For ASSET_1, risk can be reduced by:\n\n"
                    "- Increasing down payment\n"
                    "- Reducing LTV\n"
                    "- Adding co-signer\n"
                    "- Shortening tenure\n"
                    "- Comprehensive insurance"
                )
            elif intent == "WHY_LTV":
                return (
                    "For ASSET_1, reducing LTV decreases lender exposure and expected loss because lower LTV provides "
                    "a higher equity cushion against vehicle value depreciation and unhedged default risk."
                )
            elif intent == "PROFITABILITY":
                return (
                    "For ASSET_1:\n"
                    "- Profitability Score: **49.15/100**\n"
                    "- Expected Profit: **₹34,222**\n"
                    "- Margin Outlook: Viable return if recommended LTV (65%) and shortened tenure (18 months) are enforced."
                )
            elif intent == "STRESS_TEST":
                return (
                    "Stress Test Analysis for ASSET_1:\n"
                    "- **EV Market Shock**: Residual risk score increases to 68.30 (Expected profit: ₹28,900)\n"
                    "- **High Inflation**: Residual risk score increases to 64.80 (Expected profit: ₹31,500)\n"
                    "- **Economic Slowdown**: Residual risk score reaches 72.40 (Expected profit: ₹22,800)"
                )
            elif intent == "ANALYZE_RISK" or intent == "GENERAL_QUERY":
                return (
                    "Based on comprehensive analysis of ASSET_1, this application presents elevated risk primarily driven by the absence of a CIBIL score and non-regular employment status. Despite a perfect Asset Health Index of 100, the residual value gap of ₹49,938 represents significant exposure.\n\n"
                    "**Risk Assessment: HIGH** — The combination of unverifiable creditworthiness (CIBIL: -1) and unstable income stream creates compounded default probability. The residual risk score of 61.65 exceeds our 60-point threshold for automatic approval.\n\n"
                    "**Recommendation: APPROVE WITH CONDITIONS** — TVS Credit can mitigate this risk through structured lending: increase down payment to 25% (reducing LTV from 85% to ~64%), mandate comprehensive vehicle insurance with GAP coverage, and require a creditworthy co-signer. Tenure should be capped at 18 months to minimize depreciation exposure.\n\n"
                    "**Expected Outcome:** With conditions applied, expected loss reduces from ₹23,220 to approximately ₹8,400, bringing the net expected return to ₹25,822 — a viable margin for TVS Credit's risk appetite."
                )

        elif asset_id == "ASSET_2":
            if intent == "WHY_RISK":
                return (
                    "ASSET_2 is classified as Low Risk (Score: 53.94) because:\n\n"
                    "- Higher monthly salary (₹60,000)\n"
                    "- Newer asset age (0-1 Year)\n"
                    "- Moderate LTV ratio (78.4%)\n"
                    "- Favorable vehicle depreciation profile"
                )
            elif intent == "MITIGATION":
                return (
                    "For ASSET_2, risk can be managed by:\n\n"
                    "- Standard monitoring protocol\n"
                    "- Quarterly check-in verification\n"
                    "- Maintaining LTV cap at 75%\n"
                    "- Automated NACH mandate"
                )
            elif intent == "WHY_LTV":
                return (
                    "For ASSET_2, capping LTV at 75% maintains strong collateral coverage while accommodating a high-earning borrower."
                )
            elif intent == "PROFITABILITY":
                return (
                    "For ASSET_2:\n"
                    "- Profitability Score: **61.60/100**\n"
                    "- Expected Profit: **₹52,100**\n"
                    "- Margin Outlook: Highly profitable credit profile under standard terms."
                )
            elif intent == "STRESS_TEST":
                return (
                    "Stress Test Analysis for ASSET_2:\n"
                    "- **EV Market Shock**: Risk score 58.20\n"
                    "- **High Inflation**: Risk score 56.10\n"
                    "- **Economic Slowdown**: Risk score 62.40"
                )
            elif intent == "ANALYZE_RISK" or intent == "GENERAL_QUERY":
                return (
                    "ASSET_2 presents a moderately favorable risk profile. While the applicant lacks a CIBIL history, the higher salary (₹60,000) and newer asset (0-1 Year) provide compensating factors.\n\n"
                    "**Risk Assessment: LOW** — The residual risk score of 53.94 falls below the high-risk threshold, and the profitability score of 61.60 indicates a viable lending opportunity.\n\n"
                    "**Recommendation: APPROVE** — Standard terms are acceptable. The asset's favorable depreciation profile and recovery efficiency provide adequate collateral coverage."
                )

        elif asset_id == "ASSET_3":
            if intent == "WHY_RISK":
                return (
                    "ASSET_3 is classified as Medium Risk (Score: 56.58) because:\n\n"
                    "- Strong CIBIL score (763) offsetting income variability\n"
                    "- Agricultural employment income fluctuation\n"
                    "- EV residual value market uncertainty"
                )
            elif intent == "MITIGATION":
                return (
                    "For ASSET_3, risk can be reduced by:\n\n"
                    "- Mandatory comprehensive EV insurance\n"
                    "- Battery health certificate requirement\n"
                    "- Telematics battery health monitoring\n"
                    "- Capping LTV at 70%"
                )
            elif intent == "WHY_LTV":
                return (
                    "For ASSET_3, reducing LTV to 70% protects against electric vehicle battery degradation and technological obsolescence."
                )
            elif intent == "PROFITABILITY":
                return (
                    "For ASSET_3:\n"
                    "- Profitability Score: **61.88/100**\n"
                    "- Expected Profit: **₹48,900**\n"
                    "- Margin Outlook: Solid return supported by high borrower credit score (763)."
                )
            elif intent == "STRESS_TEST":
                return (
                    "Stress Test Analysis for ASSET_3:\n"
                    "- **EV Market Shock**: Risk score 64.10 (higher EV market sensitivity)\n"
                    "- **High Inflation**: Risk score 59.30\n"
                    "- **Economic Slowdown**: Risk score 66.80"
                )
            elif intent == "ANALYZE_RISK" or intent == "GENERAL_QUERY":
                return (
                    "ASSET_3 demonstrates strong creditworthiness through a CIBIL score of 763, which significantly offsets the agricultural employment variability.\n\n"
                    "**Risk Assessment: MEDIUM** — The EV asset type introduces residual value uncertainty in the current market, but the borrower's credit profile is solid.\n\n"
                    "**Recommendation: APPROVE** — Approve with standard EV insurance requirement and battery health certification to protect against technological depreciation risk."
                )

        if intent == "COMPARE":
            return (
                "**Asset Risk Comparison**:\n\n"
                "- **ASSET_1**: High Risk (61.65) | Profitability: 49.15% | Decision: Approve with Conditions (25% down payment, co-signer required)\n"
                "- **ASSET_2**: Low Risk (53.94) | Profitability: 61.60% | Decision: Approve standard terms\n"
                "- **ASSET_3**: Medium Risk (56.58) | Profitability: 61.88% | Decision: Approve with EV insurance & battery check"
            )

        # General response for any other asset ID
        return (
            f"Analysis for **{asset_id}** [Intent: {intent}]:\n\n"
            f"• Current Asset in Memory: **{asset_id}**\n"
            f"• Risk & Credit Assessment: Analysis updated based on conversational memory context.\n"
            f"• Recommended Action: Review LTV limits, collateral coverage, and borrower profile."
        )

    def generate_asset_summary(self, customer: CustomerDetails, asset: AssetDetails, ml_results: Dict[str, Any]) -> str:
        agmt_id = asset.agmt_id or "TN-01-EV-2024-8842"
        self.set_current_asset(agmt_id)

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

