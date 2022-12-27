[CmdletBinding()]
Param(
	[switch]$skipWebbuild = $false,
	[switch]$release = $false
)

trap {
 "Error found: $_" 
	exit 1
}
$workPath = Convert-Path .
# $webPath = Join-Path -Path $workPath -ChildPath 'web'
$goPath = Join-Path -Path $workPath -ChildPath 'goserver'
function buildWeb {
	Write-Verbose -Message "move to web dir"
	Set-Location web
	Write-Verbose -Message "build web app"
	pnpm build
	if (Test-Path ../goserver/public) {
		Write-Verbose -Message "clean goserver/public"
		Remove-Item ..\goserver\public\* -Recurse 
	}
	else {
		mkdir ../goserver/public
	}

	Write-Verbose -Message "move web app"
	Copy-Item  -Path .\dist\*  -Destination ..\goserver\public -Recurse
	Write-Verbose -Message "move to goserver"
	Set-Location ..
}

$token = Get-Content .\githubtoken
$env:GITHUB_TOKEN = $token
if (-not $skipWebbuild) {
	buildWeb
}
if ($release) {
	Write-Verbose -Message ('cd gopath {0}' -f $goPath)
	Set-Location $goPath
	Write-Verbose -Message "release to github"
	goreleaser.exe release  --rm-dist
	Set-Location $workPath
}


