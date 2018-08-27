set -e

current_branch=$(git branch | sed -n -e 's/^\* \(.*\)/\1/p')

if [ $current_branch != "develop" ]
then
    echo "[ERROR] To be able to deploy you need to be on the develop branch"
    exit 1
fi

st=$(git status --porcelain 2> /dev/null)

if [[ "$st" != "" ]];
then
    echo "[ERROR] To be able to deploy, 'git status' should be clean meaning, everything need to be commited"
    exit 1
fi

git pull -r origin develop
git checkout master
git pull origin master
git merge --ff-only develop
git push origin master
git checkout develop
#yarn publish