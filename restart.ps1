# Stop anything left over from an earlier session on the app's ports
foreach ($port in 3000,3001,8000) {
  Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue |
    ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }
}
Start-Sleep -Seconds 2

Start-Process powershell -ArgumentList "-NoExit","-Command","cd '$PSScriptRoot\backend'; .\.venv\Scripts\Activate.ps1; uvicorn main:app --reload"
Start-Process powershell -ArgumentList "-NoExit","-Command","cd '$PSScriptRoot\frontend'; npm run dev"

Start-Sleep -Seconds 30
Start-Process "http://localhost:3000"
