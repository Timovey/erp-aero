$NAME = Read-Host "enter migration name:"
echo $NAME
tsc
npx typeorm-ts-node-esm migration:generate $pwd\src\db\migrations\$NAME -d $pwd\dist\db\index.js