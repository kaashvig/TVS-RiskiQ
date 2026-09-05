from fastapi import APIRouter, HTTPException, status
from fastapi.responses import StreamingResponse
from models.schemas import ReportRequest
from services.ml_service import ml_service
from services.copilot_service import copilot_service
from services.pdf_service import pdf_service

router = APIRouter(prefix="", tags=["Credit Assessment Reports"])

@router.post(
    "/generate-report",
    status_code=status.HTTP_200_OK,
    summary="Generate PDF Credit Assessment Report",
    description="Generates a downloadable TVS Red branded PDF credit assessment report."
)
async def generate_credit_report(payload: ReportRequest):
    try:
        # Check if pre-computed analysis data was passed, otherwise run ML service
        if payload.analysis_data:
            ml_results = payload.analysis_data
        else:
            ml_results = ml_service.analyze_asset(payload.customer_details, payload.asset_details)
            copilot_summary = copilot_service.generate_asset_summary(
                payload.customer_details,
                payload.asset_details,
                ml_results
            )
            ml_results["ai_copilot_summary"] = copilot_summary

        # Generate PDF stream
        pdf_buffer = pdf_service.generate_report(
            payload.customer_details,
            payload.asset_details,
            ml_results
        )

        agmt_id = payload.asset_details.agmt_id or "TN-01-EV-2024-8842"
        filename = f"TVS_RiskTwin_Credit_Report_{agmt_id}.pdf"

        return StreamingResponse(
            pdf_buffer,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename={filename}"
            }
        )

    except Exception as e:
        print(f"[ReportRoute Error] {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating PDF report: {str(e)}"
        )
