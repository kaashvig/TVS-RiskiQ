from fastapi import APIRouter, HTTPException, status
from models.schemas import AnalysisRequest, AnalysisResponse
from services.ml_service import ml_service
from services.copilot_service import copilot_service

router = APIRouter(prefix="", tags=["Risk Intelligence & Analysis"])

@router.post(
    "/analyze",
    response_model=AnalysisResponse,
    status_code=status.HTTP_200_OK,
    summary="Analyze Loan Application",
    description="Calculate residual value forecast, risk band, profitability score, lending recommendations, SHAP feature explanations, and GenAI Copilot summary."
)
async def analyze_loan_application(payload: AnalysisRequest):
    try:
        # Run ML model & risk analysis
        ml_results = ml_service.analyze_asset(payload.customer_details, payload.asset_details)

        # Generate GenAI Copilot summary
        copilot_summary = copilot_service.generate_asset_summary(
            payload.customer_details,
            payload.asset_details,
            ml_results
        )

        return AnalysisResponse(
            agmt_id=ml_results["agmt_id"],
            ltv=ml_results["ltv"],
            residual_value_forecast=ml_results["residual_value_forecast"],
            residual_loss=ml_results["residual_loss"],
            residual_risk_score=ml_results["residual_risk_score"],
            risk_band=ml_results["risk_band"],
            profitability_score=ml_results["profitability_score"],
            recommended_ltv=ml_results["recommended_ltv"],
            recommended_tenure=ml_results["recommended_tenure"],
            expected_loss=ml_results["expected_loss"],
            expected_profit=ml_results["expected_profit"],
            decision=ml_results["decision"],
            shap_explanation=ml_results["shap_explanation"],
            ai_copilot_summary=copilot_summary
        )

    except Exception as e:
        print(f"[AnalyzeRoute Error] {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error performing risk analysis: {str(e)}"
        )
