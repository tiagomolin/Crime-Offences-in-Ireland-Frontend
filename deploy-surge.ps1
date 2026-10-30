param()

$ErrorActionPreference = "Stop"
$tokenPath = Join-Path $PSScriptRoot ".surge-token"
$domainPath = Join-Path $PSScriptRoot ".surge-domain"
$distPath = Join-Path $PSScriptRoot "dist"

if (-not (Test-Path -LiteralPath $tokenPath -PathType Leaf)) {
  throw "Create .surge-token and add your domain-scoped Surge token there."
}
if (-not (Test-Path -LiteralPath $domainPath -PathType Leaf)) {
  throw "Create .surge-domain and put the target domain on its own line."
}

$token = (Get-Content -LiteralPath $tokenPath -Raw).Trim()
$domain = Get-Content -LiteralPath $domainPath |
  ForEach-Object { $_.Trim() } |
  Where-Object { $_ -and -not $_.StartsWith("#") } |
  Select-Object -First 1

if ([string]::IsNullOrWhiteSpace($token) -or $token -eq "PASTE_TOKEN_HERE") {
  throw ".surge-token is empty. Add the scoped token without quotes or labels."
}
if ([string]::IsNullOrWhiteSpace($domain)) {
  throw ".surge-domain is empty. Add the domain the token is scoped to."
}
if (-not (Test-Path -LiteralPath (Join-Path $distPath "index.html"))) {
  throw "Production output is missing. Run npm run build first."
}
if (-not (Get-Command surge -ErrorAction SilentlyContinue)) {
  throw "Surge CLI was not found. Install it with npm install --global surge."
}

$env:SURGE_TOKEN = $token
try {
  Write-Host "Publishing the frontend to $domain"
  & surge $distPath $domain
  if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
  }
}
finally {
  Remove-Item Env:SURGE_TOKEN -ErrorAction SilentlyContinue
}
