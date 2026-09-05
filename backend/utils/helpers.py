import math

def format_currency(amount: float) -> str:
    """Format amount as Indian Rupees (INR)."""
    if amount is None:
        return "₹0"
    if abs(amount) >= 1_00_00_000:
        return f"₹{amount / 1_00_00_000:.2f} Cr"
    elif abs(amount) >= 1_00_000:
        return f"₹{amount / 1_00_000:.2f} Lakh"
    else:
        return f"₹{amount:,.2f}"

def format_percentage(val: float) -> str:
    """Format value as percentage string."""
    return f"{val:.1f}%"

def calculate_ltv(loan_amount: float, asset_cost: float) -> float:
    """Calculate Loan-to-Value ratio in %."""
    if asset_cost <= 0:
        return 0.0
    return round((loan_amount / asset_cost) * 100, 2)
