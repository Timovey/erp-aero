echo 'apply migrations'
tsc
npx typeorm-ts-node-esm migration:run -d $pwd\dist\db\index.js