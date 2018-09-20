NODE_VER := v10.1.0

INFO_COLOR=\033[1;34m
RESET=\033[0m
BOLD=\033[1m

VERSION = $(shell node -p 'require("./package.json").version')
REVISION = $(shell git describe --always)
ARTIFACTS_BRANCH = do-not-delete--included-artifacts

artifacts:
	@echo "$(INFO_COLOR)==> $(RESET)$(BOLD)Creating artifacts$(RESET)"
	npm install --silent
	npm run build

dist: artifacts
	@echo "$(INFO_COLOR)==> $(RESET)$(BOLD)Distribute artifacts$(RESET)"
	@test "true" = "$(CI)" || exit 1
	@git config user.name 'Royer Peby Depp' && git config user.email 'tec-github-pb-deployer@ml.paperboy.co.jp'
	git checkout -b $(ARTIFACTS_BRANCH)
	git add . -f
	git reset -- node_modules
	git reset -- package-lock.json
	git commit -m "[ci skip] add artifacts for $(REVISION)" --allow-empty
	git push -f origin $(ARTIFACTS_BRANCH)
	git tag -f "v$(VERSION)-$(REVISION)"
	git push -f origin "v$(VERSION)-$(REVISION)"
