# create-repo

**IMPORTANT** I've transfered this package to someone else on
npm. You can still use this deprecated module by cloning the repo
and starting from there.

## Set up a new GitHub repo.

* Runs `git init`, if not already in a git repo.
* Reads the name and description from your `package.json`, if present.
  * (Takes arguments, optionally, to override those.)
* Creates new repo on GitHub, adds it as a remote.
* Adds all files, commits, sets origin upstream.
* Pushes to your new repo on GitHub.

## Installation & Usage

* `create-repo` will read your `package.json` and use that name and description.
* You can pass values to use, instead: `create-repo --name some-name --description 'some description'`.

* [License: MIT](LICENSE.md)
* Issues and PRs very welcome.
