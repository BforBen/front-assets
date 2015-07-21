# Checkout master as we are currently have an individual commit checked out on
# a detached tree. This means when we commit later it will be on a branch
git checkout master
git reset --hard origin/master

$VERSION = [IO.File]::ReadAllText(".\VERSION.txt")

# Check for updates to nuget.exe
./tools/nuget.exe update -self

# Publish the new nupkg
./tools/nuget.exe pack GovUK.FrontendToolkit.nuspec -Version $VERSION