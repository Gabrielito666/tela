.PHONY: bundle clean deb

bundle:
	pnpm bundle
	cp -L node_modules/playwright-core/package.json node_modules/playwright-core/browsers.json usr-lib-tela/
	cp -L node_modules/playwright-core/lib/webp_codec.wasm usr-lib-tela/lib/

clean:
	rm -rf dist usr-lib-tela .debhelper debian/tela debian/*.debhelper* debian/files debian/substvars ../*.deb ../*.buildinfo ../*.changes 2>/dev/null || true

build: bundle
	dpkg-buildpackage -us -uc -b
	mkdir -p dist
	mv ../tela_*_all.deb dist/
	rm ../tela_*
