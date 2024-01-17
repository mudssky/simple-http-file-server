


[CmdletBinding()]
param (
	[string]$Path = './conf/version',	#版本文件位置
	[ValidateSet('major', 'minor', 'patch')]
	[string]$UpdateType = 'patch'     
)


function Update-Semver {
	[CmdletBinding()]
	param (
		[Parameter(Mandatory = $true)]
		[string]$Version,	# 版本字符串
		[ValidateSet('major', 'minor', 'patch')]
		[string]$UpdateType = 'patch'     
	)
	$regexPattern = "^(?<major>\d+)\.(?<minor>\d+)\.(?<patch>\d+)$"
	$regexResult = $Version -match $regexPattern
	if (-not $regexResult) {
		Write-Error "无法解析SemVer版本字符串"
		return 
	}
	# 从正则表达式匹配结果中获取版本号各部分
	$majorVersion = [int]$matches["major"]
	$minorVersion = [int]$matches["minor"]
	$patchVersion = [int]$matches["patch"]
	switch ($UpdateType) {
		'major' {
			$majorVersion++
		}
		'minor' {
			$minorVersion++
		}
		'patch' {
			$patchVersion++
		}
	}
	$newVersion = "$($majorVersion).$($minorVersion).$($patchVersion)"
	return $newVersion
}



if ( -not (Test-Path $Path)) {
	Write-Error "版本文件不存在:$Path"
	exit
}



# 取第一行作为版本号
$versionStr = Get-Content $Path | Select-Object -First 1
$newVersion = Update-Semver -Version $versionStr -UpdateType $UpdateType
Set-Content $Path $newVersion
Write-Host "版本号已更新为: $newVersion"


$currentBranch = git rev-parse --abbrev-ref HEAD

if ($currentBranch -notin 'main', 'master') {
	Write-Error "当前分支不是主分支"
}
git tag "v$newVersion"

