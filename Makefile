install:
	yarn install

dev: install
	yarn next dev -p 3131

build: install
	yarn next build

start: install
	yarn next start -p 3131

lint: install
	yarn eslint .

lint.fix: install
	yarn eslint --fix .

format: install
	yarn prettier --write .

format.check: install
	yarn prettier --check .

typecheck: install
	yarn tsc --noEmit

typecheck.watch: install
	yarn tsc --noEmit --watch

storybook: install
	yarn start-storybook -p 6161

build.storybook: install
	yarn build-storybook
