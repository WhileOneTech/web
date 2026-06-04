(function () {
    const REPO = 'WhileOneTech/yearwheel-releases';
    const RELEASES_LATEST = `https://github.com/${REPO}/releases/latest`;
    const API_LATEST = `https://api.github.com/repos/${REPO}/releases/latest`;
    const OS_ORDER = ['windows', 'macos', 'linux'];
    const OS_LABELS = {
        windows: 'Windows',
        macos: 'Mac',
        linux: 'Linux'
    };
    const PLATFORM_MARKS = {
        windows: 'Win',
        macos: 'Mac',
        linux: 'Linux'
    };

    function detectOS() {
        const ua = navigator.userAgent || '';
        const platform = navigator.userAgentData && navigator.userAgentData.platform ? navigator.userAgentData.platform : navigator.platform || '';

        if (/Win/i.test(ua) || /Win/i.test(platform)) {
            return { os: 'windows', label: 'Windows' };
        }

        if (/Mac/i.test(ua) || /Mac/i.test(platform)) {
            return { os: 'macos', label: 'Mac' };
        }

        if (/Linux/i.test(ua) || /Linux/i.test(platform)) {
            return { os: 'linux', label: 'Linux' };
        }

        return { os: 'unknown', label: 'your platform' };
    }

    function classify(name) {
        const lowerName = name.toLowerCase();

        if (lowerName.endsWith('-setup.exe')) {
            return { os: 'windows', kind: 'Installer (.exe)', downloadLabel: 'EXE', weight: 1 };
        }

        if (lowerName.endsWith('.msi')) {
            return { os: 'windows', kind: 'Installer (.msi)', downloadLabel: 'MSI', weight: 2 };
        }

        if (lowerName.endsWith('.dmg')) {
            const arch = /(aarch64|arm64)/.test(lowerName) ? 'Apple Silicon' : /(x64|x86_64|intel)/.test(lowerName) ? 'Intel' : '';

            return { os: 'macos', kind: `Disk image (.dmg)${arch ? ` - ${arch}` : ''}`, downloadLabel: 'DMG', weight: arch === 'Apple Silicon' ? 1 : 2 };
        }

        if (lowerName.endsWith('.appimage')) {
            return { os: 'linux', kind: 'AppImage', downloadLabel: 'AppImage', weight: 1 };
        }

        if (lowerName.endsWith('.deb')) {
            return { os: 'linux', kind: 'Debian package (.deb)', downloadLabel: 'DEB', weight: 2 };
        }

        if (lowerName.endsWith('.rpm')) {
            return { os: 'linux', kind: 'RPM package', downloadLabel: 'RPM', weight: 3 };
        }

        return null;
    }

    function formatSize(bytes) {
        if (!bytes) {
            return '';
        }

        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }

    function getAssets(release) {
        return (release.assets || [])
            .map((asset) => ({ ...asset, info: classify(asset.name) }))
            .filter((asset) => asset.info)
            .sort((a, b) => OS_ORDER.indexOf(a.info.os) - OS_ORDER.indexOf(b.info.os) || a.info.weight - b.info.weight);
    }

    function groupAssets(assets) {
        return OS_ORDER.reduce((groups, os) => {
            groups[os] = assets.filter((asset) => asset.info.os === os).sort((a, b) => a.info.weight - b.info.weight);
            return groups;
        }, {});
    }

    function bestAssetForOS(groups, os) {
        return groups[os] && groups[os][0] ? groups[os][0] : null;
    }

    function updateVersion(release) {
        const version = release.tag_name || release.name || '';

        if (!version) {
            return;
        }

        document.querySelectorAll('[data-yearwheel-version]').forEach((element) => {
            element.textContent = version;
            element.hidden = false;
        });
    }

    function updateSpotlight(release, groups, detected) {
        const primaryButton = document.querySelector('#primary-download');
        const primaryLabel = document.querySelector('#primary-download-label');
        const osNote = document.querySelector('#os-note');
        const list = document.querySelector('#downloads-list');
        const assets = OS_ORDER.flatMap((os) => groups[os] || []);

        if (!primaryButton || !primaryLabel || !osNote || !list) {
            return;
        }

        const best = bestAssetForOS(groups, detected.os);

        if (best) {
            primaryButton.href = best.browser_download_url;
            primaryLabel.textContent = `Download for ${detected.label}`;
            osNote.textContent = `Detected ${detected.label}. ${best.info.kind}${best.size ? ` - ${formatSize(best.size)}` : ''}.`;
        } else if (assets.length > 0) {
            primaryButton.href = release.html_url || RELEASES_LATEST;
            primaryLabel.textContent = 'Choose a download';
            osNote.textContent = `No automatic match for ${detected.label}. Choose an installer below.`;
        } else {
            primaryButton.href = release.html_url || RELEASES_LATEST;
            primaryLabel.textContent = 'View latest release';
            osNote.textContent = 'No installers are attached to the latest release yet.';
        }

        renderDownloadsList(list, assets);
    }

    function renderDownloadsList(list, assets) {
        list.textContent = '';

        if (assets.length === 0) {
            const item = document.createElement('li');
            item.className = 'muted';
            item.textContent = 'No installers are available yet.';
            list.appendChild(item);
            return;
        }

        assets.forEach((asset) => {
            const item = document.createElement('li');
            const link = document.createElement('a');
            const label = document.createElement('span');
            const os = document.createElement('strong');
            const meta = document.createElement('span');

            link.href = asset.browser_download_url;
            link.rel = 'noopener';
            link.target = '_blank';
            os.textContent = OS_LABELS[asset.info.os];
            label.append(os, ` - ${asset.info.kind}`);
            meta.className = 'dl-meta';
            meta.textContent = formatSize(asset.size);
            link.append(label, meta);
            item.appendChild(link);
            list.appendChild(item);
        });
    }

    function updateDownloadGrid(groups, detected) {
        const grid = document.querySelector('[data-yearwheel-download-grid]');

        if (!grid) {
            return;
        }

        grid.textContent = '';

        OS_ORDER.forEach((os) => {
            const assets = groups[os] || [];

            if (assets.length === 0) {
                return;
            }

            grid.appendChild(createDownloadCard(os, assets, detected.os === os));
        });

        if (!grid.children.length) {
            const fallback = document.createElement('p');
            fallback.className = 'download-note';
            fallback.textContent = 'No installer assets are available on the latest GitHub release yet.';
            grid.appendChild(fallback);
        }
    }

    function createDownloadCard(os, assets, isDetected) {
        const best = assets[0];
        const card = document.createElement('article');
        const mark = document.createElement('div');
        const copy = document.createElement('div');
        const heading = document.createElement('h3');
        const text = document.createElement('p');
        const button = document.createElement('a');

        card.className = `download-card${isDetected ? ' is-detected' : ''}`;
        mark.className = 'platform-mark';
        mark.setAttribute('aria-hidden', 'true');
        mark.textContent = PLATFORM_MARKS[os];
        heading.textContent = OS_LABELS[os];
        text.textContent = `${best.info.kind}${best.size ? ` - ${formatSize(best.size)}` : ''}`;
        copy.append(heading, text);
        button.className = 'btn btn-primary';
        button.href = best.browser_download_url;
        button.rel = 'noopener';
        button.target = '_blank';
        button.textContent = `Download ${best.info.downloadLabel}`;
        card.append(mark, copy, button);

        if (assets.length > 1) {
            const alternatives = document.createElement('div');
            alternatives.className = 'package-links';
            alternatives.setAttribute('aria-label', `${OS_LABELS[os]} package alternatives`);

            assets.slice(1).forEach((asset) => {
                const link = document.createElement('a');
                link.className = 'text-link';
                link.href = asset.browser_download_url;
                link.rel = 'noopener';
                link.target = '_blank';
                link.textContent = asset.info.downloadLabel;
                alternatives.appendChild(link);
            });

            card.appendChild(alternatives);
        }

        return card;
    }

    function updateQuickDownloads(groups) {
        const container = document.querySelector('[data-yearwheel-quick-downloads]');

        if (!container) {
            return;
        }

        container.textContent = '';

        OS_ORDER.forEach((os) => {
            const best = bestAssetForOS(groups, os);

            if (!best) {
                return;
            }

            const link = document.createElement('a');
            link.href = best.browser_download_url;
            link.rel = 'noopener';
            link.target = '_blank';
            link.textContent = OS_LABELS[os];
            container.appendChild(link);
        });
    }

    async function init() {
        if (!document.querySelector('[data-yearwheel-downloads]')) {
            return;
        }

        const detected = detectOS();

        try {
            const response = await fetch(API_LATEST, { headers: { Accept: 'application/vnd.github+json' } });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const release = await response.json();
            const groups = groupAssets(getAssets(release));
            updateVersion(release);
            updateSpotlight(release, groups, detected);
            updateDownloadGrid(groups, detected);
            updateQuickDownloads(groups);
        } catch (error) {
            const osNote = document.querySelector('#os-note');

            if (osNote) {
                osNote.textContent = 'Could not load the latest release automatically. Static download links are shown below.';
            }
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
}());
