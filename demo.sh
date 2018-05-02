find './src/dist' -name '*.ts' -type f -delete
tsc ./src/main/test.ts;
node ./src/main/test.js;