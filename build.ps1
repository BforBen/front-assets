﻿# Checkout master as we are currently have an individual commit checked out on
# a detached tree. This means when we commit later it will be on a branch
# git checkout master
# git reset --hard origin/master

$VERSION = $env:APPVEYOR_BUILD_VERSION # Get-Content ".\VERSION.txt" -TotalCount 1

# Pack the new nupkg
nuget pack GuildfordGovUK.FrontAssets.nuspec -Version $VERSION

if($env:APPVEYOR_REPO_BRANCH -eq 'master') {
  # Push the new nupkg only from the Master branch
  nuget push GuildfordGovUK.FrontAssets.$VERSION.nupkg $env:MYGET_KEY -Source https://www.myget.org/F/guildford-bc/api/v2/package
}
