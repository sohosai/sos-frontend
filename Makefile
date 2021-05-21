install:
	yarn install

dev: install pathpida
	yarn next dev -p 3131

build: install pathpida
	yarn next build

start: install
	yarn next start -p 3131

export: build
	yarn next export

lint: install
	yarn eslint .

lint.fix: install
	yarn eslint --fix .

format: install
	yarn prettier --write .

format.check: install
	yarn prettier --check .

typecheck: install pathpida
	yarn tsc --noEmit

typecheck.watch: install pathpida
	yarn tsc --noEmit --watch

storybook: install pathpida
	yarn start-storybook -s public -p 6161

build.storybook: install pathpida
	yarn build-storybook -s public

pathpida: install
	yarn pathpida --enableStatic

pathpida.watch: install
	yarn pathpida --enableStatic --watch
