import io
import re
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from typing import Dict, Any
from models.schemas import CustomerDetails, AssetDetails

class PDFReportService:
    def generate_report(self, customer: CustomerDetails, asset: AssetDetails, ml_results: Dict[str, Any]) -> io.BytesIO:
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            rightMargin=36,
            leftMargin=36,
            topMargin=36,
            bottomMargin=36
        )

        story = []
        styles = getSampleStyleSheet()

        # Custom TVS Brand Styles
        title_style = ParagraphStyle(
            'HeaderTitle',
            parent=styles['Heading1'],
            fontName='Helvetica-Bold',
            fontSize=22,
            leading=26,
            textColor=colors.HexColor('#E31E24')
        )
        subtitle_style = ParagraphStyle(
            'HeaderSubtitle',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=10,
            leading=14,
            textColor=colors.HexColor('#6B7280')
        )
        section_heading = ParagraphStyle(
            'SectionHeading',
            parent=styles['Heading2'],
            fontName='Helvetica-Bold',
            fontSize=13,
            leading=16,
            textColor=colors.HexColor('#111827'),
            spaceBefore=12,
            spaceAfter=6
        )
        body_style = ParagraphStyle(
            'Body',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=9.5,
            leading=13.5,
            textColor=colors.HexColor('#374151')
        )
        bold_body = ParagraphStyle(
            'BoldBody',
            parent=body_style,
            fontName='Helvetica-Bold'
        )

        # Header section
        story.append(Paragraph("TVS RiskTwin — Credit Intelligence Platform", title_style))
        story.append(Paragraph("AI-Powered Vehicle Financing Assessment Report | Confidential", subtitle_style))
        story.append(Spacer(1, 10))
        story.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor('#E31E24'), spaceAfter=15))

        # Executive Summary Box / Decision Badge
        decision = ml_results.get('decision', 'REVIEW REQUIRED')
        risk_band = ml_results.get('risk_band', 'Medium')
        
        badge_color = '#10B981' if decision == 'APPROVE' else ('#F59E0B' if 'CONDITION' in decision else '#E31E24')
        
        decision_table = Table([
            [
                Paragraph(f"<b>Agreement ID:</b> {asset.agmt_id or 'TN-01-EV-2024-8842'}", body_style),
                Paragraph(f"<b>Executive Decision:</b> <font color='{badge_color}'><b>{decision}</b></font>", body_style),
                Paragraph(f"<b>Risk Band:</b> <b>{risk_band}</b>", body_style)
            ]
        ], colWidths=[180, 240, 120])
        decision_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F9FAFB')),
            ('BORDER', (0,0), (-1,-1), 1, colors.HexColor('#E5E7EB')),
            ('PADDING', (0,0), (-1,-1), 8),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ]))
        story.append(decision_table)
        story.append(Spacer(1, 12))

        # Customer & Asset Table
        story.append(Paragraph("Applicant & Vehicle Overview", section_heading))

        cust_asset_data = [
            [
                Paragraph("<b>Customer Name</b>", bold_body), Paragraph("TVS Lending Applicant", body_style),
                Paragraph("<b>Vehicle Model</b>", bold_body), Paragraph(f"{asset.asset_model}", body_style)
            ],
            [
                Paragraph("<b>Age / State</b>", bold_body), Paragraph(f"{customer.cust_age} yrs / {customer.cust_state}", body_style),
                Paragraph("<b>Fuel / Category</b>", bold_body), Paragraph(f"{asset.asset_fuel_type} / {asset.asset_category}", body_style)
            ],
            [
                Paragraph("<b>CIBIL Score</b>", bold_body), Paragraph(f"{customer.cust_cibil_score}", body_style),
                Paragraph("<b>Ex-Showroom Price</b>", bold_body), Paragraph(f"₹{asset.asset_cost:,.2f}", body_style)
            ],
            [
                Paragraph("<b>Monthly Income</b>", bold_body), Paragraph(f"₹{customer.cust_monthly_income:,.2f}", body_style),
                Paragraph("<b>Disbursed Loan</b>", bold_body), Paragraph(f"₹{asset.loan_amount:,.2f}", body_style)
            ],
            [
                Paragraph("<b>FOIR Ratio</b>", bold_body), Paragraph(f"{customer.cust_foir * 100:.1f}%", body_style),
                Paragraph("<b>Current LTV</b>", bold_body), Paragraph(f"{ml_results.get('ltv', 0):.1f}%", body_style)
            ]
        ]
        t_overview = Table(cust_asset_data, colWidths=[110, 160, 110, 160])
        t_overview.setStyle(TableStyle([
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E5E7EB')),
            ('BACKGROUND', (0,0), (0,-1), colors.HexColor('#F3F4F6')),
            ('BACKGROUND', (2,0), (2,-1), colors.HexColor('#F3F4F6')),
            ('PADDING', (0,0), (-1,-1), 6),
        ]))
        story.append(t_overview)
        story.append(Spacer(1, 14))

        # Risk & Forecast Metrics
        story.append(Paragraph("ML Forecasting & Risk Metrics", section_heading))

        metrics_data = [
            [
                Paragraph("Metric", bold_body), Paragraph("Model Output", bold_body), Paragraph("Target Benchmark / Recommendation", bold_body)
            ],
            [
                Paragraph("Residual Value Forecast", body_style),
                Paragraph(f"<b>₹{ml_results.get('residual_value_forecast', 0):,.2f}</b>", body_style),
                Paragraph(f"Depreciation Ratio: {(1 - ml_results.get('residual_value_forecast', 0)/asset.asset_cost)*100:.1f}%", body_style)
            ],
            [
                Paragraph("Residual Risk Score", body_style),
                Paragraph(f"<b>{ml_results.get('residual_risk_score', 0):.1f} / 100</b>", body_style),
                Paragraph(f"Risk Band: <b>{risk_band}</b>", body_style)
            ],
            [
                Paragraph("Profitability Score", body_style),
                Paragraph(f"<b>{ml_results.get('profitability_score', 0):.1f} / 100</b>", body_style),
                Paragraph(f"Expected Profit: ₹{ml_results.get('expected_profit', 0):,.2f}", body_style)
            ],
            [
                Paragraph("Recommended LTV", body_style),
                Paragraph(f"<b>{ml_results.get('recommended_ltv', 75)}%</b>", body_style),
                Paragraph(f"Current LTV: {ml_results.get('ltv', 0):.1f}%", body_style)
            ],
            [
                Paragraph("Recommended Tenure", body_style),
                Paragraph(f"<b>{ml_results.get('recommended_tenure', 36)} Months</b>", body_style),
                Paragraph(f"Current Tenure: {asset.tenure} Months", body_style)
            ]
        ]
        t_metrics = Table(metrics_data, colWidths=[160, 180, 200])
        t_metrics.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#E31E24')),
            ('TEXTCOLOR', (0,0), (-1,0), colors.white),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E5E7EB')),
            ('PADDING', (0,0), (-1,-1), 6),
        ]))
        story.append(t_metrics)
        story.append(Spacer(1, 14))

        # AI Copilot Summary
        story.append(Paragraph("AI Copilot Reasoning & Summary", section_heading))
        summary_text = ml_results.get('ai_copilot_summary', 'No summary available.')
        for p_line in summary_text.split('\n'):
            if p_line.strip():
                clean_line = re.sub(r'\*\*(.*?)\*\*', r'<b>\1</b>', p_line.strip())
                clean_line = clean_line.replace('&', '&amp;') if '&amp;' not in clean_line else clean_line
                story.append(Paragraph(clean_line, body_style))
                story.append(Spacer(1, 4))

        story.append(Spacer(1, 15))
        story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#E5E7EB'), spaceAfter=10))
        story.append(Paragraph("Generated by TVS RiskTwin Platform • TVS Credit Services Enterprise System", subtitle_style))

        doc.build(story)
        buffer.seek(0)
        return buffer

# Singleton instance
pdf_service = PDFReportService()
