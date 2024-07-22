#!/bin/bash

# 스크립트가 실패할 경우 종료
set -e

# 변수 설정
BRANCH_A="assignment-6_main"
BRANCH_B="assignment-6_test"
COMMIT_MESSAGE="ci test"

# 브랜치 A로 체크아웃
echo "Checking out branch $BRANCH_A..."
git checkout $BRANCH_A

# 현재 변경사항 커밋
echo "Committing changes on branch $BRANCH_A..."
git add .
git commit -m "$COMMIT_MESSAGE"

# 커밋 푸쉬
echo "Pushing changes on branch $BRANCH_A..."
git push origin $BRANCH_A

# 브랜치 B로 체크아웃
echo "Checking out branch $BRANCH_B..."
git checkout $BRANCH_B

# 브랜치 A를 브랜치 B로 머지
echo "Merging branch $BRANCH_A into $BRANCH_B..."
git merge $BRANCH_A

# 머지 커밋 푸쉬
echo "Pushing merged changes on branch $BRANCH_B..."
git push origin $BRANCH_B

echo "Operations completed successfully!"
