install:
	if test $(INSTALL_MODE) = "skip"; then \
		echo "Skipping 'yarn install'..."; \
	elif test $(INSTALL_MODE) = "ci"; then \
		yarn install --frozen-lockfile; \
	else \
	  yarn install; \
	fi

dev: install pathpida
	yarn run next dev -p 3131

build: install pathpida
	yarn run next build

start: install
	yarn run next start -p 3131

export: build
	yarn run next export

lint: install pathpida
	yarn run eslint .

lint.fix: install
	yarn run eslint --fix .

format: install
	yarn run prettier --write .

format.check: install
	yarn run prettier --check .

typecheck: install pathpida
	yarn run tsc --noEmit

typecheck.watch: install pathpida
	yarn run tsc --noEmit --watch

storybook: install pathpida
	yarn run start-storybook -s public -p 6161

build.storybook: install pathpida
	yarn run build-storybook -s public

pathpida: install
	yarn run pathpida --enableStatic

pathpida.watch: install
	yarn run pathpida --enableStatic --watch

scaffold.announcement: install
	yarn run ts-node -r tsconfig-paths/register bin/scaffoldAnnouncement
	yarn run prettier --write src/constants/announcements.ts

.PHONY: install $(MAKECMDGOALS)
