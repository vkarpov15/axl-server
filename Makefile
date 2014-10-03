MOCHA=./node_modules/mocha/bin/mocha
ISTANBUL=./node_modules/istanbul/lib/cli.js
BROWSERIFY=./node_modules/browserify/bin/cmd.js

api-test:
	env NODE_PATH=./ $(MOCHA) ./test/integration/api/*.test.js

dom-test-sauce:
	make client
	mkdir -p ./bin/templates
	env CONFIG=./test/integration/dom/axl.test.config.yml node ./lib/client/views/index.js
	./node_modules/karma/bin/karma start ./test/integration/dom/karma-sauce.conf.js

dom-test-local:
	make client
	mkdir -p ./bin/templates
	env CONFIG=./test/integration/dom/axl.test.config.yml node ./lib/client/views/index.js
	./node_modules/karma/bin/karma start ./test/integration/dom/karma-local.conf.js

dom-test-server:
	env CONFIG=./test/integration/dom/axl.test.config.yml node lib/server/app.js

client:
	mkdir -p ./bin/javascript
	$(BROWSERIFY) -o ./bin/javascript/ui.js ./lib/client/angular

templates:
	mkdir -p ./bin/templates
	node ./lib/client/views/index.js

build:
	make client
	make templates
