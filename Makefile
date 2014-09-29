MOCHA=./node_modules/mocha/bin/mocha
ISTANBUL=./node_modules/istanbul/lib/cli.js
BROWSERIFY=./node_modules/browserify/bin/cmd.js

api-test:
	env NODE_PATH=./ $(MOCHA) ./test/integration/api/*.test.js

api-test-coverage:
	env NODE_PATH=./ $(ISTANBUL) cover $(MOCHA) ./test/integration/api/*.test.js

client:
	mkdir -p ./bin/javascript
	$(BROWSERIFY) -o ./bin/javascript/ui.js ./lib/client/angular

templates:
	mkdir -p ./bin/templates
	node ./lib/client/views/index.js