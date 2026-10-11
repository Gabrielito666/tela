.PHONY: bundle clean deb

bundle:
	pnpm bundle

clean:
	rm -rf dist .debhelper debian/tela debian/*.debhelper* debian/files debian/substvars ../*.deb ../*.buildinfo ../*.changes 2>/dev/null || true

build: bundle
	dpkg-buildpackage -us -uc -b
	mv ../tela_*_all.deb dist/
	rm ../tela_*
