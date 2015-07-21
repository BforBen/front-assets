# Checkout master as we are currently have an individual commit checked out on
# a detached tree. This means when we commit later it will be on a branch
git checkout master
git reset --hard origin/master

# Init the submodule and checkout the revision pinned in `.gitmodules`
git submodule update --init

# The version of the toolkit defined by the pinned submodule
$PINNED_SUBMODULE_VERSION = [IO.File]::ReadAllText(".\app\assets\VERSION.txt")

# Force the submodule to pull the latest and checkout origin/master
git submodule foreach git pull origin master

# The version of the toolkit defined in the submodules master branch
$NEW_SUBMODULE_VERSION = [IO.File]::ReadAllText(".\app\assets\VERSION.txt")

# If the submodule has a new version string
IF ($PINNED_SUBMODULE_VERSION -ne $NEW_SUBMODULE_VERSION)
{
  # Check for updates to nuget.exe
  ./tools/nuget.exe update -self
  wait

  # Commit the updated submodule and push it to origin
  git commit -am "Bump to front-assets version $NEW_SUBMODULE_VERSION"
  git push origin master

  # Publish the new nupkg
  ./tools/nuget.exe pack GovUK.FrontendToolkit.nuspec -Version $NEW_SUBMODULE_VERSION
}
ELSE
{
  echo 'VERSION.txt is the same as the version available on the registry'
  echo 'Not publishing anything'
}