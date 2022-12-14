[CmdletBinding()]
Param(

)

trap {
 "Error found: $_" 
	exit 1
}

Write-Verbose -Message "move to web dir"
Set-Location web
Write-Verbose -Message "build web app"
pnpm build
Write-Verbose -Message "clean goserver/public"
Remove-Item ..\goserver\public\* -Recurse
Write-Verbose -Message "copy web app"
Copy-Item  -Force -Path .\dist\*  -Destination ..\goserver\public\ -Recurse
Write-Verbose -Message "move to goserver"
Set-Location ../goserver
Write-Verbose -Message "build goserver"
go build