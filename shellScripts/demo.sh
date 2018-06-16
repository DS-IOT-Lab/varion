mkdir '../src/dist';
rm -r ../src/dist/*;
tsc ../src/main/test.ts;
node ../src/main/test.js;
