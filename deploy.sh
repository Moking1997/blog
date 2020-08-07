#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e
 
git init
git add -A
git commit -m 'git-deploy'

git push -f https://github.com/Moking1997/blog.git master

# 生成静态文件 
yarn build
 
# 进入生成的文件夹
cd public
 
git init
git add -A
git commit -m 'deploy'
 
# 如果发布到 https://<USERNAME>.github.io/<REPO>
git push -f https://github.com/Moking1997/Moking1997.github.io.git master
 
cd -