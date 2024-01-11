#!/bin/bash

echo "请输入提交信息"
read commit_input

pnpm run build
git add .
git commit -m "$commit_input"
git push
