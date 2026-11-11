# CarePath AI

A demonstration platform for **preventive-care navigation** in Abu Dhabi. It connects health data, risk identification, explanation, preventive pathway, engagement, follow-up and outcome measurement for **children** (Well-Child Visit pathway) and **adults** (Comprehensive Screening pathway).

**All case records are synthetic demo data. No real patients. No Abu Dhabi population statistics are shown. No trained model is connected.** Wherever verified data does not exist, the app says "Not available" instead of inventing numbers.

## What is real and what is demo

| Area | Status |
|---|---|
| Case workflow, status changes, audit trail | Working (synthetic cases) |
| Demo login (clinician / viewer) | Working, demo only, not real security |
| Per-case consent and preferences | Working; declined or unrecorded consent blocks message previews |
| English / Arabic with right-to-left layout | Working; Arabic wording is draft and needs native review |
| Child flags | Rule-based demonstration logic. No child model exists. Adult models are never applied to children |
| Adult risk score | Not connected. /predict/adult refuses until a real model is connected |
| Model metrics, fairness results, population statistics | Not available until real evaluation results and verified datasets exist |
| Messaging | Preview only. Nothing is ever sent |

## Requirements

- Python 3.11 or newer
- Node.js 20 or newer
- Git

## First-time setup (Windows PowerShell)

    git clone https://github.com/Anopa21/carepath-ai.git
    cd carepath-ai

    cd backend
    python -m venv .venv
    .venv\Scripts\Activate.ps1
    pip install -r requirements.txt
    python seed.py
    python migrate_arabic.py
    python add_details.py
    python add_consent.py
    cd ..

    cd frontend
    npm install
    cd ..

Run the four scripts in that order. They create the local SQLite database (backend/carepath.db, git-ignored) and fill it with synthetic demo cases.

## Run

    .\start.ps1

This opens two windows (backend on port 8000, frontend on port 3000) and then the browser. Keep both windows open, because closing one stops that server. API documentation: http://127.0.0.1:8000/docs

## Demo accounts (fake, shown on screen on purpose)

| Username | Password | Can do |
|---|---|---|
| clinician | demo-clinician | Change statuses and consent preferences |
| viewer | demo-viewer | Read only |

## Demo script (about 5 minutes)

1. Home (Preventive Care): point out the synthetic-data notice. Show search and filters.
2. Sign in as the viewer: the status dropdowns stay locked. Then sign in as the clinician and change a status.
3. Open a case reference: show indicators, completeness, the main factors behind the flag, and the status history timeline.
4. Child vs adult: a child case has no risk score and a note that adult models are never applied to children. An adult case says "Model risk score: Not available (no model connected)".
5. Consent: set a case to Declined. The channel locks to "No contact".
6. Engagement: choose that case and the message preview is blocked. Choose a consented case and the message appears in the person's preferred language.
7. Switch to Arabic: the interface flips to right-to-left.
8. Fairness and Data pages: every metric says "Not available" and the page states that having a fairness page does not mean fairness has been achieved.
9. Mobile: narrow the window and show the menu.

## Connecting the real adult model

The adult model is built separately in Python and Google Colab. The website never fakes its output. The connection point is backend/model_adapter.py, which defines:

- Input (AdultFeatures): age, sex, BMI, systolic and diastolic blood pressure, HbA1c, fasting glucose, total cholesterol. All optional, because data can be missing.
- Output (PredictionResponse): model name and version, risk score, risk flag, a list of contributing factors, and evaluation date.
- Endpoint: POST /predict/adult. It returns 503 until ADULT_MODEL_MODE is set and the loader in predict_adult is implemented for the chosen route (an exported joblib file or an HTTP service).

To finish the integration the ML lead needs to provide: the exported model or service address, the exact input features and their units, and the real evaluation results (precision, recall, F1, ROC-AUC, PR-AUC, calibration, subgroup results).

## Known limitations

- Sessions are held in memory, so everyone is signed out when the backend restarts.
- SQLite is used for the demo. PostgreSQL and Docker were preferred in the brief and are not set up.
- Indicator values, thresholds and consent preferences on the demo cases are invented for illustration. The thresholds are demo rules, not clinical guidance.
- Arabic text needs review by a native Arabic-speaking health communicator before any real use.
- Small-cell suppression (groups under 10) is stated in the interface, but no real small groups exist to suppress yet.
- There is no dataset registry in the database yet: the Data and Models page is static text.
