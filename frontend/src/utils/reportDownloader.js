/**
 * Helper utility to trigger PDF report generation & immediate browser download from TVS RiskTwin backend API.
 */
export async function downloadCreditReport(agmtId = 'ASSET_1', customPayload = null) {
  const assetId = agmtId || 'ASSET_1'
  const payload = customPayload || {
    customer_details: {
      cust_age: 29,
      cust_cibil_score: 650,
      cust_employment_type: "Salaried",
      cust_monthly_income: 30000.0,
      cust_foir: 0.45,
      cust_state: "Tamil Nadu",
      cust_pin_code: "600001"
    },
    asset_details: {
      agmt_id: assetId,
      asset_cost: 81000.0,
      loan_amount: 68712.0,
      asset_model: assetId === 'ASSET_2' ? 'TVS Radeon' : (assetId === 'ASSET_3' ? 'TVS iQube EV' : 'TVS XL 100'),
      asset_fuel_type: assetId === 'ASSET_3' ? 'Electric' : 'Petrol',
      asset_category: assetId === 'ASSET_3' ? 'EV Scooter' : 'Scooter',
      tenure: 36,
      cust_net_irr: 14.5,
      odometer_reading: 17000.0,
      battery_health_pct: 92.0
    }
  }

  try {
    const res = await fetch('http://localhost:8000/generate-report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      throw new Error(`Server returned HTTP ${res.status}`)
    }

    const blob = await res.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `TVS_RiskTwin_Credit_Report_${assetId}.pdf`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  } catch (err) {
    console.error('[DownloadReport Error]', err)
    alert(`Downloading report for ${assetId}... Ensure backend is running on port 8000.`)
  }
}
