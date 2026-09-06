from fastapi import APIRouter, HTTPException, status
from models.schemas import ChatRequest, ChatResponse
from services.copilot_service import copilot_service

router = APIRouter(prefix="", tags=["GenAI Copilot Chat"])

@router.post(
    "/chat",
    response_model=ChatResponse,
    status_code=status.HTTP_200_OK,
    summary="Process AI Credit Copilot Chat Query",
    description="Conversational chat endpoint maintaining session memory, asset normalization, intent detection, and debug logging."
)
@router.post(
    "/copilot/chat",
    response_model=ChatResponse,
    status_code=status.HTTP_200_OK,
    summary="Process AI Credit Copilot Chat Query (Alias)"
)
async def copilot_chat(payload: ChatRequest):
    try:
        result = copilot_service.process_chat(payload.message, payload.session_id)
        return ChatResponse(
            response=result["response"],
            current_asset=result["current_asset"],
            detected_intent=result["detected_intent"]
        )
    except Exception as e:
        print(f"[CopilotRoute Error] {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing copilot chat: {str(e)}"
        )

@router.get("/copilot/session", status_code=status.HTTP_200_OK)
async def get_session_state():
    return copilot_service.get_session_state()
