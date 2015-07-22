# Checkout master as we are currently have an individual commit checked out on
# a detached tree. This means when we commit later it will be on a branch
# git checkout master
# git reset --hard origin/master

$VERSION = $env:APPVEYOR_BUILD_VERSION # Get-Content ".\VERSION.txt" -TotalCount 1

# Check for updates to nuget.exe
./tools/nuget.exe update -self

# Pack the new nupkg
./tools/nuget.exe pack GuildfordGovUK.FrontAssetsKit.nuspec -Version $VERSION

# Push the new nupkg
./tools/nuget.exe push "GuildfordGovUK.FrontAssetsKit." $VERSION ".nupkg" $env:MYGET_KEY -Source https://www.myget.org/F/guildford-bc/api/v2/package