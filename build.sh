#!/bin/sh

echo "Starting kinsjen build script build.sh"

echo "Checking for node.js installation"
if which node > /dev/null
then
  echo "node.js installed, found version: $(node -v)"
else
  echo "node.js installation was not found"
  echo "Install node.js before running this script"
  exit 0
fi

if type -p java; then
  echo "found java executable in PATH"
  _java=java
elif [[ -n "$JAVA_HOME" ]] && [[ -x "$JAVA_HOME/bin/java" ]];  then
  echo "found java executable in JAVA_HOME"
  _java="$JAVA_HOME/bin/java"
else
  echo "java installation was not found"
  echo "Install java before running this script"
  exit 0
fi

if [[ "$_java" ]]; then
  version=$("$_java" -version 2>&1 | awk -F '"' '/version/ {print $2}')
  echo "java version = $version"
  if [[ ! "$version" > "10" ]]; then
    echo "java version must be 11 or higher"
    exit 0
  fi
fi

cd client/kinsjen
echo "Starting npm run build"
npm run build

echo "Removing src/main/resources/templates/"
rm -r ../../server/kinsjen/src/main/resources/templates/
mkdir ../../server/kinsjen/src/main/resources/templates/
echo "Removing src/main/resources/static/"
rm -r ../../server/kinsjen/src/main/resources/static/

echo "Copying all artifacts to src/main/resources/static/"
cp -r dist/kinsjen/browser/ ../../server/kinsjen/src/main/resources/static/
echo "Moving index.html from /static to /templates"
mv ../../server/kinsjen/src/main/resources/static/index.html ../../server/kinsjen/src/main/resources/templates/index.html

echo "Entering kinsjen server"
cd ../../server/kinsjen

echo "Running mvn clean install"
mvn clean install

echo "Building docker image"
docker build --build-arg KINSJEN_JAR=target/kinsjen.jar -t kinsjen .

echo "Launching kinsjen jar from /target/"
cd target
java -jar kinsjen.jar
