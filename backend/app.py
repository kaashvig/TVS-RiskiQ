import os
from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from routes.analyze import router as analyze_router
from routes.reports import router as reports_router
from routes.copilot import router as copilot_router

load_dotenv()

app = FastAPI(
    title="TVS RiskTwin — AI-Powered Vehicle Financing Intelligence Backend",
    description="Production FastAPI service for CatBoost residual value forecasting, risk scoring, SHAP explainability, and GenAI Copilot recommendations.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for React frontend direct API calls
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "*"  # Allow all origins for production flexibility
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(analyze_router)
app.include_router(reports_router)
app.include_router(copilot_router)

@app.get("/", tags=["Health"])
async def root():
    return {
        "status": "online",
        "app": "TVS RiskTwin API",
        "tagline": "AI-Powered Vehicle Financing Intelligence Platform",
        "docs": "/docs"
    }

@app.get("/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "catboost_model": "active",
        "genai_copilot": "active"
    }

# Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    print(f"[Unhandled Error] Path: {request.url.path} | Error: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred.", "error": str(exc)}
    )

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("app:app", host="0.0.0.0", port=port, reload=True)
