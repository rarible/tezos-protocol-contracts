#! /bin/sh

BUILD_PATH=`completium-cli get completium property build_path`
TESTS_PATH=`completium-cli get completium property tests_path`

if [ $# -ge 1 ]; then
  TEST_BUILD_PATH=${BUILD_PATH}/${TESTS_PATH}/${1}.js
else
  TEST_BUILD_PATH=${BUILD_PATH}/${TESTS_PATH}/*.js
fi

rm -rf ${BUILD_PATH} && npx tsc --outDir ${BUILD_PATH} && mocha --timeout 0 --slow 99999999999999999 ${TEST_BUILD_PATH}
