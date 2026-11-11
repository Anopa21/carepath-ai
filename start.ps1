Start-Process powershell -ArgumentList "-NoExit","-Command","cd '$PSScriptRoot\backend'; .\.venv\Scripts\Activate.ps1; uvicorn main:app --reload"
Start-Process powershell -ArgumentList "-NoExit","-Command","cd '$PSScriptRoot\frontend'; npm run dev"
Start-Sleep -Seconds 10
Start-Process "http://localhost:3000"
