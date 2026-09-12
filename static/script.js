const firebaseConfig = {
  apiKey: "AIzaSyC3r9wr8tgjRNwWFY01mxrVy640sQFs2bg",
  authDomain: "istore-ipa.firebaseapp.com",
  projectId: "istore-ipa",
  storageBucket: "istore-ipa.firebasestorage.app",
  messagingSenderId: "262724812706",
  appId: "1:262724812706:web:b9fae4bb87f0417f557cfb"
};
if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);

firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);

const auth = firebase.auth();
const db = firebase.firestore();

const ADMIN_EMAILS = ["example@gmail.com", "suohaib1415@gmail.com", "benssariyassine@gmail.com"];
let currentUser = null;
let isAdmin = false;
let isUserPreview = false;
let currentTab = 'today';
let allAppsCache = [];
let allReportsCache = [];
let isLightMode = false;

function toggleUserPreview() {
    isUserPreview = !isUserPreview;
    const user = auth.currentUser;
    if (user && ADMIN_EMAILS.map(e => e.toLowerCase()).includes(user.email.toLowerCase())) {
        isAdmin = !isUserPreview;
    }
    document.getElementById('previewBar').style.display = isUserPreview ? 'flex' : 'none';
    document.getElementById('adminAddFloatBtn').style.display = isAdmin ? 'block' : 'none';
    document.getElementById('adminNavTab').style.display = isAdmin ? 'flex' : 'none';
    renderUI();
}

function toggleDarkMode() {
    isLightMode = !isLightMode;
    document.body.classList.toggle('light-mode', isLightMode);
    const icon = document.getElementById('themeIcon');
    if(isLightMode) {
        icon.innerHTML = `<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>`;
    } else {
        icon.innerHTML = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`;
    }
}

function getActualDateString() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
}

function switchTab(tabName, btnElement) {
    currentTab = tabName;
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    if(btnElement) btnElement.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    renderUI();
}

db.collection("apps").orderBy("createdAt", "desc").onSnapshot(snapshot => {
    allAppsCache = [];
    snapshot.forEach(doc => {
        let data = doc.data();
        if(data.name && data.name.toLowerCase().includes("gta") && data.category !== "games") {
            data.category = "games";
        }
        allAppsCache.push({ id: doc.id, ...data });
    });
    renderUI();
});

db.collection("reports").orderBy("createdAt", "desc").onSnapshot(snapshot => {
    allReportsCache = [];
    snapshot.forEach(doc => {
        allReportsCache.push({ id: doc.id, ...doc.data() });
    });
    if(currentTab === 'admin_panel') renderUI();
});

function filterAppsSearch() {
    renderUI();
}

function getTrendingScore(app) {
    const likes = (app.likedBy && Array.isArray(app.likedBy)) ? app.likedBy.length : 0;
    const downloads = app.downloads || 0;
    const comments = app.commentsCount || 0;
    return (likes * 15) + (downloads * 5) + (comments * 10);
}

function renderUI() {
    const container = document.getElementById('dynamicContent');
    const searchInputEl = document.getElementById('searchInput');
    const searchQuery = searchInputEl ? searchInputEl.value.toLowerCase() : '';
    
    let filtered = allAppsCache;
    if (searchQuery.trim() !== "") {
        filtered = allAppsCache.filter(app => app.name.toLowerCase().includes(searchQuery) || (app.info && app.info.toLowerCase().includes(searchQuery)));
        container.innerHTML = `<div class="section-heading">Search Results (${filtered.length})</div><div id="searchResContainer"></div>`;
        const sContainer = document.getElementById('searchResContainer');
        if(filtered.length === 0) {
            sContainer.innerHTML = `<p style="color:var(--subtext-color); text-align:center; font-size:13px; margin-top:30px;">No matching apps found.</p>`;
        } else {
            filtered.forEach(app => sContainer.innerHTML += createAppCardHTML(app));
        }
        return;
    }

    if (currentTab === 'admin_panel' && isAdmin) {
        let totalApps = allAppsCache.length;
        let totalReports = allReportsCache.length;
        let mostActiveApp = "None yet";
        if(totalApps > 0) {
            let sortedByRating = [...allAppsCache].sort((a,b) => getTrendingScore(b) - getTrendingScore(a));
            mostActiveApp = sortedByRating[0].name + " (#1 Trending)";
        }

        let reportsHTML = "";
        if(totalReports === 0) {
            reportsHTML = `<div style="text-align:center; padding:25px 0;"><p style="color:#32d74b; font-weight:700; font-size:13px; margin:0;">✨ Awesome! No pending reports.</p></div>`;
        } else {
            allReportsCache.forEach(rep => {
                let targetApp = allAppsCache.find(a => a.id === rep.appId);
                let appName = targetApp ? targetApp.name : "Unknown/Deleted App";
                reportsHTML += `
                    <div class="report-admin-item">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                            <span style="color:#ff453a; font-weight:900; font-size:12px;">🚨 App: ${appName}</span>
                            <span style="color:var(--subtext-color); font-size:10px;">By: ${rep.user}</span>
                        </div>
                        <div style="color:var(--text-color); font-size:12px; margin-bottom:8px; background:var(--modal-bg); padding:6px 8px; border-radius:6px;">💬 Reason: "${rep.reason}"</div>
                        <div style="display:flex; justify-content:flex-end;">
                            <button onclick="deleteReport('${rep.id}')" style="background:#ff453a; color:#fff; border:none; padding:4px 10px; border-radius:6px; font-weight:bold; font-size:10px; cursor:pointer;">Resolve & Delete</button>
                        </div>
                    </div>
                `;
            });
        }

        container.innerHTML = `
            <div class="today-header">
                <div class="today-title">Admin Dashboard</div>
                <div class="today-subtitle">👑 iStore Control Center</div>
            </div>
            
            <div style="margin-bottom:15px;">
                <button onclick="toggleUserPreview()" style="background:#0a84ff; color:#fff; border:none; padding:9px 15px; border-radius:12px; font-weight:bold; font-size:12px; cursor:pointer; width:100%;">👁️ Switch to User Preview Mode</button>
            </div>

            <div class="admin-dashboard-wrapper">
                <div class="admin-section-card">
                    <h4 style="font-size:13px; margin:0 0 10px 0; color:var(--text-color); border-bottom:1px solid var(--border-color); padding-bottom:6px;">📊 Platform Performance</h4>
                    <div class="admin-stats-grid">
                        <div class="stat-box">
                            <h5>Total Apps</h5>
                            <p style="color:var(--text-color);">${totalApps}</p>
                        </div>
                        <div class="stat-box">
                            <h5>Active Reports</h5>
                            <p>${totalReports}</p>
                        </div>
                    </div>
                </div>

                <div class="admin-section-card">
                    <h4 style="font-size:13px; margin:0 0 10px 0; color:var(--text-color); border-bottom:1px solid var(--border-color); padding-bottom:6px; display:flex; justify-content:space-between; align-items:center;">
                        <span>🚨 User Reports</span>
                        <span style="background:rgba(255,69,58,0.15); color:#ff453a; font-size:10px; padding:2px 8px; border-radius:6px; font-weight:900;">${totalReports} Active</span>
                    </h4>
                    <div style="max-height:350px; overflow-y:auto;">
                        ${reportsHTML}
                    </div>
                </div>
            </div>
        `;
        return;
    }

    if (currentTab === 'today') {
        container.innerHTML = `
            <div class="today-header">
                <div class="today-date">${getActualDateString()}</div>
                <div class="today-title">Today</div>
                <div class="today-subtitle">🔥 Special Updates & Highlights</div>
            </div>
            <div id="todayAppsContainer"></div>
            <div class="section-heading">Trending (#1) & General Apps</div>
            <div id="generalAppsContainer"></div>
        `;
        
        let sortedByTrending = [...allAppsCache].sort((a,b) => getTrendingScore(b) - getTrendingScore(a));
        const todayList = sortedByTrending.filter(app => app.category === 'today' || !app.category);
        const generalList = sortedByTrending;

        const tContainer = document.getElementById('todayAppsContainer');
        if (todayList.length === 0) {
            tContainer.innerHTML = `<p style="color:var(--subtext-color); font-size:13px; text-align:center;">No featured apps in Today yet.</p>`;
        } else {
            todayList.forEach((app, index) => {
                let isTopOne = (index === 0) ? '<span style="background:#ff453a; color:#fff; font-size:9px; font-weight:900; padding:2px 6px; border-radius:5px; margin-left:6px;">#1 Trending</span>' : '';
                let platformType = app.platform || 'IPA';
                let pubText = app.publisher ? `<span class="app-publisher-tag">By ${app.publisher}</span>` : '';
                let likesCount = (app.likedBy && Array.isArray(app.likedBy)) ? app.likedBy.length : 0;
                let isLiked = (currentUser && app.likedBy && app.likedBy.includes(currentUser.email));

                tContainer.innerHTML += `
                    <div class="featured-card">
                        <div class="platform-badge-float">${platformType}</div>
                        <div class="featured-img-wrapper" onclick="openAppDetails('${app.id}')" style="cursor:pointer;">
                            <img src="${app.icon || 'https://via.placeholder.com/300'}" class="featured-img">
                        </div>
                        <div class="featured-body">
                            <div style="display:flex; align-items:center; margin-bottom:6px; justify-content:space-between;">
                                <span class="badge-tag" style="margin-bottom:0;">Featured Today</span>
                                ${isTopOne}
                            </div>
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <div>
                                    <h3 style="margin:4px 0 2px 0; font-size:16px; cursor:pointer;" onclick="openAppDetails('${app.id}')">${app.name}</h3>
                                    ${pubText}
                                </div>
                                
                                <button class="btn-info-blue" onclick="openAppDetails('${app.id}')" title="Detailed App Info">
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                                </button>
                            </div>
                            <div class="app-category-sub" style="margin-bottom:4px;">${getCategoryNameEn(app.category)}</div>
                            <div style="display:flex; gap:6px; align-items:center; margin-top:4px;">
                                <div class="app-size-tag-red">Size: ${app.size || 'N/A'}</div>
                                <div class="download-badge-green">
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                                    ${app.downloads || 0}
                                </div>
                            </div>
                            <p style="color:var(--subtext-color); font-size:12px; margin:8px 0 12px 0;">${app.info || ''}</p>
                            
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <div style="display:flex; gap:8px; align-items:center;">
                                    <button class="btn-install" onclick="startRealDownload('${app.id}', '${app.url}', '${app.name}')">Install Now</button>
                                    
                                    <button class="btn-star-like" onclick="toggleStarLike('${app.id}', event)">
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="${isLiked ? '#ff9f0a' : 'none'}" stroke="#ff9f0a" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                                        <span>${likesCount}</span>
                                    </button>
                                </div>

                                <div style="display:flex; gap:6px; align-items:center;">
                                    <button class="btn-report-text" onclick="openReportModal('${app.id}')">Report</button>
                                    ${isAdmin ? `<div class="admin-btns"><button class="btn-edit" onclick="openEditAppModal('${app.id}')">Edit</button><button class="btn-del" onclick="deleteApp('${app.id}')">Delete</button></div>` : ''}
                                </div>
                            </div>
                            <div id="dl_progress_${app.id}" class="dl-progress-box" style="display:none;">
                                <div class="dl-progress-text" id="dl_text_${app.id}">Loading 0%</div>
                                <div class="dl-progress-bar-bg"><div class="dl-progress-bar-fill" id="dl_fill_${app.id}"></div></div>
                            </div>
                        </div>
                    </div>
                `;
            });
        }

        const gContainer = document.getElementById('generalAppsContainer');
        if (generalList.length === 0) {
            gContainer.innerHTML = `<p style="color:var(--subtext-color); font-size:13px; text-align:center;">No other apps available.</p>`;
        } else {
            generalList.forEach((app, idx) => {
                let rankBadge = (idx === 0) ? '<span style="color:#ff453a; font-weight:900; margin-right:4px;">#1</span>' : '';
                gContainer.innerHTML += createAppCardHTML(app, rankBadge);
            });
        }

    } else if (currentTab === 'trending') {
        let sortedByTrending = [...allAppsCache].sort((a,b) => getTrendingScore(b) - getTrendingScore(a));
        container.innerHTML = `
            <div class="today-header">
                <div class="today-title">🔥 Trending Apps</div>
                <div class="today-subtitle">Most popular & engaged apps and games</div>
            </div>
            <div style="margin-top:15px;" id="trendingContainer"></div>
        `;
        const trContainer = document.getElementById('trendingContainer');
        if (sortedByTrending.length === 0) {
            trContainer.innerHTML = `<p style="color:var(--subtext-color); font-size:13px; text-align:center; margin-top:40px;">No trending apps found.</p>`;
        } else {
            sortedByTrending.forEach((app, idx) => {
                let rankBadge = `<span style="color:#ff453a; font-weight:900; margin-right:4px;">#${idx + 1}</span>`;
                trContainer.innerHTML += createAppCardHTML(app, rankBadge);
            });
        }

    } else if (currentTab === 'tools') {
        container.innerHTML = `
            <div class="today-header">
                <div class="today-title">Installation Tools</div>
                <div class="today-subtitle">Official signing guides & tools</div>
            </div>
            <div style="margin-top:15px;">
                <div class="tool-guide-card" style="background:var(--card-bg); border:1px solid var(--border-color); border-radius:16px; padding:15px; margin-bottom:12px;">
                    <h3 style="color:#ff453a; margin-top:0; font-size:15px;">E-Sign App (Certificate Signing)</h3>
                    <p style="color:var(--subtext-color); font-size:12px; line-height:1.5;"><strong>E-Sign</strong> is one of the best tools to sign and install IPA files directly on your iPhone without a computer.</p>
                </div>
            </div>
        `;
    } else {
        let tabFiltered = allAppsCache.filter(app => app.category === currentTab);
        tabFiltered.sort((a,b) => getTrendingScore(b) - getTrendingScore(a));
        const titles = { games: 'iPhone Games', apps: 'Featured Apps' };
        
        container.innerHTML = `
            <div class="today-header">
                <div class="today-title">${titles[currentTab] || 'Applications'}</div>
                <div class="today-subtitle">Continuously updated IPA library</div>
            </div>
            <div style="margin-top:15px;" id="filteredContainer"></div>
        `;
        
        const fContainer = document.getElementById('filteredContainer');
        if (tabFiltered.length === 0) {
            fContainer.innerHTML = `<p style="color:var(--subtext-color); font-size:13px; text-align:center; margin-top:40px;">No apps in this category yet.</p>`;
        } else {
            tabFiltered.forEach((app, idx) => {
                let rankBadge = (idx === 0) ? '<span style="color:#ff453a; font-weight:900; margin-right:4px;">#1</span>' : '';
                fContainer.innerHTML += createAppCardHTML(app, rankBadge);
            });
        }
    }
}

function getCategoryNameEn(cat) {
    if(cat === 'games') return 'Games';
    if(cat === 'apps') return 'Apps';
    if(cat === 'tools') return 'Tools';
    return 'Utilities';
}

function createAppCardHTML(app, rankBadge = '') {
    let appleLogoSVG = `<svg width="13" height="13" viewBox="0 0 170 170" fill="#0a84ff"><path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.1-1.9-14.24-6.08-3.05-2.61-6.91-7.2-11.58-13.78-6.1-8.57-11.05-18.15-14.85-28.74-3.8-10.59-5.7-20.73-5.7-30.43 0-11.58 3.02-21.2 9.07-28.85 6.04-7.65 13.68-11.54 22.9-11.66 4.9 0 10.15 1.3 15.76 3.9 5.6 2.61 9.3 3.91 11.1 3.91 1.52 0 5.37-1.38 11.55-4.14 6.18-2.76 11.45-4.04 15.82-3.85 10.36.76 18.57 5.04 24.63 12.83-9.35 5.72-13.93 13.43-13.73 23.15.22 7.6 3.14 13.88 8.77 18.83 5.62 4.95 12.44 7.55 20.45 7.82-1.85 5.66-4.14 11.31-6.88 16.97zM119.22 31.33c0-7.39 2.68-14.25 8.04-20.58 5.36-6.33 12.18-10.23 20.45-11.72.11.87.16 1.69.16 2.47 0 7.18-2.83 14.28-8.5 23.3-5.66 9.02-12.39 13.6-20.15 13.73-.01-.89-.01-1.78 0-3.2z"/></svg>`;
    
    let platformIcon = (app.platform === 'APK') ? 
        `<svg width="11" height="11" viewBox="0 0 24 24" fill="#32d74b"><path d="M17.6 9.48l1.84-3.18c.16-.27.07-.62-.2-.78-.27-.16-.62-.07-.78.2l-1.87 3.24c-1.32-.58-2.79-.9-4.34-.9s-3.02.32-4.34.9L6.06 5.72c-.16-.27-.51-.36-.78-.2-.27.16-.36.51-.2.78l1.84 3.18C4.6 11.23 3 13.9 3 17h18c0-3.1-1.6-5.77-4.4-7.52zM7 14.5c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm10 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/></svg>` :
        appleLogoSVG;

    let extraFilesDropdown = '';
    if (app.extraFiles && app.extraFiles.length > 0) {
        let items = '';
        app.extraFiles.forEach(file => {
            items += `<a href="${file.url}" class="extra-file-item" download target="_blank">📥 ${file.name}</a>`;
        });
        extraFilesDropdown = `
            <div style="position:relative;">
                <button class="btn-extra-dropdown" onclick="toggleExtraMenu('${app.id}', event)" title="Additional Files">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </button>
                <div id="extraMenu_${app.id}" class="extra-files-menu">
                    <div style="font-size:10px; color:var(--subtext-color); margin-bottom:4px; font-weight:bold; padding:0 4px;">Additional Files:</div>
                    ${items}
                </div>
            </div>
        `;
    }

    let pubText = app.publisher ? `<span class="app-publisher-tag">By ${app.publisher}</span>` : '';
    let likesCount = (app.likedBy && Array.isArray(app.likedBy)) ? app.likedBy.length : 0;
    let isLiked = (currentUser && app.likedBy && app.likedBy.includes(currentUser.email));

    return `
        <div class="app-card-pro" style="flex-direction:column; align-items:stretch;">
            <div style="display:flex; align-items:center; justify-content:space-between; width:100%;">
                <div class="platform-badge-float">${app.platform || 'IPA'}</div>
                
                <div class="app-meta" onclick="openAppDetails('${app.id}')">
                    <div class="app-icon-container">
                        <img src="${app.icon || 'https://via.placeholder.com/54'}" class="app-icon-img">
                    </div>
                    <div class="app-details">
                        <h4>${rankBadge}${platformIcon} <span class="app-title-marquee">${app.name}</span></h4>
                        ${pubText}
                        <div class="app-category-sub">${getCategoryNameEn(app.category)}</div>
                        <p>
                            <span class="app-size-tag-red">Size: ${app.size || 'N/A'}</span>
                            <span class="download-badge-green">
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                                ${app.downloads || 0}
                            </span>
                        </p>
                    </div>
                </div>

                <div class="app-actions">
                    <button class="btn-star-like" onclick="toggleStarLike('${app.id}', event)">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="${isLiked ? '#ff9f0a' : 'none'}" stroke="#ff9f0a" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                        <span>${likesCount}</span>
                    </button>

                    <button class="btn-info-blue" onclick="openAppDetails('${app.id}')" title="Detailed App Info">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                    </button>

                    <button class="btn-install" onclick="startRealDownload('${app.id}', '${app.url}', '${app.name}')">Get</button>
                    ${extraFilesDropdown}
                    <button class="btn-report-text" onclick="openReportModal('${app.id}')">Report</button>
                    ${isAdmin ? `<div class="admin-btns"><button class="btn-edit" onclick="openEditAppModal('${app.id}')">Edit</button><button class="btn-del" onclick="deleteApp('${app.id}')">Delete</button></div>` : ''}
                </div>
            </div>

            <div id="dl_progress_${app.id}" class="dl-progress-box" style="display:none;">
                <div class="dl-progress-text" id="dl_text_${app.id}">Loading 0%</div>
                <div class="dl-progress-bar-bg"><div class="dl-progress-bar-fill" id="dl_fill_${app.id}"></div></div>
            </div>
        </div>
    `;
}

function toggleExtraMenu(appId, event) {
    event.stopPropagation();
    document.querySelectorAll('.extra-files-menu').forEach(m => {
        if(m.id !== 'extraMenu_' + appId) m.style.display = 'none';
    });
    const menu = document.getElementById('extraMenu_' + appId);
    if(menu) {
        menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
    }
}

window.onclick = function() {
    document.querySelectorAll('.extra-files-menu').forEach(m => m.style.display = 'none');
};

function startRealDownload(appId, fileUrl, appName) {
    incrementDownload(appId);

    const progressBox = document.getElementById(`dl_progress_${appId}`);
    const progressText = document.getElementById(`dl_text_${appId}`);
    const progressFill = document.getElementById(`dl_fill_${appId}`);

    if (progressBox) progressBox.style.display = 'block';

    if (!fileUrl || fileUrl === '#' || fileUrl.trim() === '') {
        if (progressText) progressText.innerText = "Download link not available";
        setTimeout(() => { if (progressBox) progressBox.style.display = 'none'; }, 2500);
        return;
    }

    if (progressText) progressText.innerText = "Loading 50%... Starting Download";
    if (progressFill) progressFill.style.width = "50%";

    setTimeout(() => {
        if (progressText) progressText.innerText = "Loading 100% - Redirecting...";
        if (progressFill) progressFill.style.width = "100%";

        const a = document.createElement('a');
        a.href = fileUrl;
        a.target = '_blank';
        a.download = appName;
        document.body.appendChild(a);
        a.click();
        a.remove();

        setTimeout(() => {
            if (progressBox) progressBox.style.display = 'none';
        }, 2000);
    }, 700);
}

function incrementDownload(appId) {
    const userId = currentUser ? currentUser.email : 'guest_' + Math.random().toString(36).substring(7);
    const appRef = db.collection("apps").doc(appId);
    
    db.runTransaction(transaction => {
        return transaction.get(appRef).then(doc => {
            if (!doc.exists) return;
            let data = doc.data();
            let downloadedBy = data.downloadedBy || [];
            
            if (!downloadedBy.includes(userId)) {
                downloadedBy.push(userId);
                transaction.update(appRef, {
                    downloads: firebase.firestore.FieldValue.increment(1),
                    downloadedBy: downloadedBy
                });
            }
        });
    }).catch(()=>{});
}

function toggleStarLike(appId, event) {
    if (event) event.stopPropagation();
    if (!currentUser) {
        alert('Please sign in first to like this app.');
        openAccountModal();
        return;
    }

    const appRef = db.collection("apps").doc(appId);
    const userEmail = currentUser.email;

    db.runTransaction(transaction => {
        return transaction.get(appRef).then(doc => {
            if (!doc.exists) return;
            let data = doc.data();
            let likedBy = data.likedBy || [];
            
            if (likedBy.includes(userEmail)) {
                likedBy = likedBy.filter(e => e !== userEmail);
            } else {
                likedBy.push(userEmail);
            }
            transaction.update(appRef, { likedBy: likedBy });
        });
    }).catch(err => alert("Error: " + err.message));
}

function openAppDetails(appId) {
    const app = allAppsCache.find(a => a.id === appId);
    if (!app) return;
    
    let screenshotsHTML = '';
    if (app.screenshots && app.screenshots.length > 0) {
        app.screenshots.forEach(imgUrl => {
            screenshotsHTML += `<img src="${imgUrl}" class="screenshot-item">`;
        });
    } else {
        screenshotsHTML = `<p style="color:var(--subtext-color); font-size:11px;">No screenshots available.</p>`;
    }

    db.collection("apps").doc(appId).collection("comments").orderBy("createdAt", "desc").get().then(snapshot => {
        let commentsList = [];
        snapshot.forEach(doc => commentsList.push({ id: doc.id, ...doc.data() }));
        
        let commentsHTML = '';
        if(commentsList.length === 0) {
            commentsHTML = `<p style="color:var(--subtext-color); font-size:12px; text-align:center;">No comments yet. Be the first!</p>`;
        } else {
            commentsList.forEach(c => {
                commentsHTML += `
                    <div class="comment-box" style="display:flex; justify-content:space-between; align-items:center;">
                        <div>
                            <div class="comment-user">${c.userName}</div>
                            <div>${c.text}</div>
                        </div>
                        ${isAdmin ? `<button onclick="deleteComment('${app.id}', '${c.id}')" style="background:#ff453a; color:#fff; border:none; padding:3px 7px; border-radius:6px; font-size:10px; cursor:pointer; font-weight:bold;">Delete Comment</button>` : ''}
                    </div>
                `;
            });
        }

        let pubText = app.publisher ? `<div style="color:#0a84ff; font-size:12px; font-weight:bold; margin-bottom:4px;">By ${app.publisher}</div>` : '';

        document.getElementById('appDetailBody').innerHTML = `
            <div style="width:40px; height:4px; background:var(--border-color); border-radius:10px; margin:0 auto 16px auto;"></div>
            <div class="detail-header">
                <img src="${app.icon || 'https://via.placeholder.com/70'}" class="detail-icon">
                <div>
                    <h3 style="margin:0 0 2px 0; font-size:16px; color:var(--text-color);">${app.name}</h3>
                    ${pubText}
                    <div style="font-size:11px; color:var(--subtext-color); font-weight:600; margin-bottom:3px;">${getCategoryNameEn(app.category)} • <span style="color:#ff453a;">${app.platform || 'IPA'}</span></div>
                    <div style="font-size:12px; color:var(--text-color); font-weight:bold; margin-bottom:3px;">Size: ${app.size || 'N/A'}</div>
                </div>
            </div>

            <div style="background:var(--input-bg); padding:12px; border-radius:12px; margin-bottom:12px; font-size:12px; color:var(--text-color);">
                <strong style="color:#0a84ff; display:block; margin-bottom:4px;">ℹ️ Detailed App Information:</strong>
                ${app.info || app.desc || 'No additional detailed information available.'}
            </div>

            <button class="btn-install" style="display:block; width:100%; text-align:center; padding:11px; margin-bottom:12px; font-size:13px;" onclick="startRealDownload('${app.id}', '${app.url}', '${app.name}')">Direct Download (${app.platform || 'IPA'})</button>
            
            <div style="border-top:1px solid var(--border-color); padding-top:10px; margin-bottom:10px;">
                <h4 style="font-size:12px; margin:0 0 6px 0; color:var(--text-color);">Screenshots:</h4>
                <div class="screenshots-container">
                    ${screenshotsHTML}
                </div>
            </div>

            <div style="border-top:1px solid var(--border-color); padding-top:10px;">
                <h4 style="font-size:12px; margin:0 0 8px 0; color:var(--text-color);">Comments (${commentsList.length}):</h4>
                <div style="max-height:140px; overflow-y:auto; margin-bottom:8px;" id="commentsListArea">
                    ${commentsHTML}
                </div>
                ${currentUser ? `
                    <input type="text" id="newCommentText" class="input-field" placeholder="Write a comment..." style="margin-bottom:6px;">
                    <button onclick="postComment('${app.id}')" style="background:#0a84ff; color:#fff; border:none; width:100%; padding:8px; border-radius:8px; font-weight:bold; cursor:pointer; font-size:12px;">Post Comment</button>
                ` : `<p style="color:#ff453a; font-size:11px; text-align:center;">Sign in via account menu to comment.</p>`}
            </div>
            
            <button onclick="document.getElementById('appDetailModal').style.display='none'" style="background:var(--input-bg); color:var(--text-color); border:none; width:100%; padding:9px; border-radius:10px; margin-top:12px; cursor:pointer; font-weight:bold;">Close</button>
        `;
        document.getElementById('appDetailModal').style.display = 'flex';
    });
}

function deleteComment(appId, commentId) {
    if (!isAdmin) return;
    if (confirm('Are you sure you want to delete this comment?')) {
        db.collection("apps").doc(appId).collection("comments").doc(commentId).delete().then(() => {
            db.collection("apps").doc(appId).update({
                commentsCount: firebase.firestore.FieldValue.increment(-1)
            }).catch(()=>{});
            openAppDetails(appId);
        });
    }
}

function postComment(appId) {
    if (!currentUser) { alert('Sign in first'); return; }
    const text = document.getElementById('newCommentText').value.trim();
    if (!text) return;

    db.collection("apps").doc(appId).collection("comments").add({
        userName: currentUser.email.split('@')[0],
        text: text,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        db.collection("apps").doc(appId).update({
            commentsCount: firebase.firestore.FieldValue.increment(1)
        }).catch(()=>{});

        document.getElementById('newCommentText').value = '';
        openAppDetails(appId);
    });
}

function openReportModal(appId) {
    document.getElementById('reportAppId').value = appId;
    document.getElementById('reportReason').value = '';
    document.getElementById('reportModal').style.display = 'flex';
}

function setReportReasonText(reasonText) {
    document.getElementById('reportReason').value = reasonText;
}

function submitReport() {
    const appId = document.getElementById('reportAppId').value;
    const reason = document.getElementById('reportReason').value.trim();
    if (!reason) { alert('Please select or type a report reason'); return; }

    db.collection("reports").add({
        appId, reason,
        user: currentUser ? currentUser.email : 'Guest',
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        alert('Report sent to admin successfully!');
        document.getElementById('reportModal').style.display = 'none';
    });
}

function deleteReport(reportId) {
    if (!isAdmin) return;
    if (confirm('Delete this report permanently?')) {
        db.collection("reports").doc(reportId).delete();
    }
}

auth.onAuthStateChanged(user => {
    currentUser = user;
    const floatBtn = document.getElementById('adminAddFloatBtn');
    const adminBadge = document.getElementById('adminBadge');
    const adminNavTab = document.getElementById('adminNavTab');
    
    if (user) {
        document.getElementById('loggedOutView').style.display = 'none';
        document.getElementById('loggedInView').style.display = 'block';
        document.getElementById('userEmailText').innerText = user.email;
        
        if (user.email && ADMIN_EMAILS.map(e => e.toLowerCase()).includes(user.email.toLowerCase())) {
            isAdmin = !isUserPreview;
            floatBtn.style.display = isAdmin ? 'block' : 'none';
            adminBadge.style.display = 'block';
            adminNavTab.style.display = isAdmin ? 'flex' : 'none';
        } else {
            isAdmin = false;
            floatBtn.style.display = 'none';
            adminBadge.style.display = 'none';
            adminNavTab.style.display = 'none';
        }
    } else {
        isAdmin = false;
        floatBtn.style.display = 'none';
        adminBadge.style.display = 'none';
        adminNavTab.style.display = 'none';
        document.getElementById('loggedOutView').style.display = 'block';
        document.getElementById('loggedInView').style.display = 'none';
    }
    renderUI();
});

function handleSignOut() {
    auth.signOut().then(() => {
        currentUser = null;
        isAdmin = false;
        document.getElementById('accountModal').style.display = 'none';
        renderUI();
    });
}

function loginWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).catch(() => auth.signInWithRedirect(provider));
}

function openAccountModal() { document.getElementById('accountModal').style.display = 'flex'; }

function openAddAppModal() {
    if (!isAdmin) return;
    document.getElementById('modalTitleText').innerText = "Add App to Cloud";
    document.getElementById('editingAppId').value = "";
    document.getElementById('appPublisher').value = "";
    document.getElementById('appName').value = "";
    document.getElementById('appSize').value = "";
    document.getElementById('appInfo').value = "";
    document.getElementById('appUrl').value = "";
    document.getElementById('appImgFile').value = "";
    document.getElementById('appScreenshotsFile').value = "";
    document.getElementById('appExtraFiles').value = "";
    document.getElementById('addAppModal').style.display = 'flex';
}

function openEditAppModal(id) {
    if (!isAdmin) return;
    const app = allAppsCache.find(a => a.id === id);
    if (!app) return;
    document.getElementById('modalTitleText').innerText = "Edit App & URL";
    document.getElementById('editingAppId').value = app.id;
    document.getElementById('appPublisher').value = app.publisher || '';
    document.getElementById('appCategory').value = app.category || 'today';
    document.getElementById('appPlatform').value = app.platform || 'IPA';
    document.getElementById('appName').value = app.name || '';
    document.getElementById('appSize').value = app.size || '';
    document.getElementById('appInfo').value = app.info || '';
    document.getElementById('appUrl').value = app.url || '';
    document.getElementById('addAppModal').style.display = 'flex';
}

function saveNewApp() {
    if (!isAdmin) return;
    const editingId = document.getElementById('editingAppId').value;
    const publisher = document.getElementById('appPublisher').value.trim();
    const category = document.getElementById('appCategory').value;
    const platform = document.getElementById('appPlatform').value;
    const name = document.getElementById('appName').value;
    const size = document.getElementById('appSize').value;
    const info = document.getElementById('appInfo').value;
    const url = document.getElementById('appUrl').value || '#';
    const fileInput = document.getElementById('appImgFile');
    const screenshotsInput = document.getElementById('appScreenshotsFile');
    const extraFilesInput = document.getElementById('appExtraFiles');

    if (!name) { alert('Please enter app name'); return; }

    let iconResult = 'https://via.placeholder.com/54';
    if (editingId) {
        const found = allAppsCache.find(a => a.id === editingId);
        if (found) iconResult = found.icon;
    }

    let existingScreenshots = [];
    let existingExtraFiles = [];
    if (editingId) {
        const found = allAppsCache.find(a => a.id === editingId);
        if (found) {
            if(found.screenshots) existingScreenshots = found.screenshots;
            if(found.extraFiles) existingExtraFiles = found.extraFiles;
        }
    }

    const processExtraFilesAndSave = (screenshotsList) => {
        let extraFilesList = [...existingExtraFiles];
        if (extraFilesInput.files && extraFilesInput.files.length > 0) {
            let extraLoaded = 0;
            Array.from(extraFilesInput.files).forEach((file) => {
                extraFilesList.push({ name: file.name, url: url });
                extraLoaded++;
                if (extraLoaded === extraFilesInput.files.length) {
                    commitAppToCloud(editingId, publisher, category, platform, name, size, info, url, iconResult, screenshotsList, extraFilesList);
                }
            });
        } else {
            commitAppToCloud(editingId, publisher, category, platform, name, size, info, url, iconResult, screenshotsList, extraFilesList);
        }
    };

    const processScreenshotsAndSave = () => {
        let screenshotsList = [...existingScreenshots];
        if (screenshotsInput.files && screenshotsInput.files.length > 0) {
            let filesLoaded = 0;
            Array.from(screenshotsInput.files).forEach((file) => {
                const reader = new FileReader();
                reader.onload = function(e) {
                    screenshotsList.push(e.target.result);
                    filesLoaded++;
                    if (filesLoaded === screenshotsInput.files.length) {
                        processExtraFilesAndSave(screenshotsList);
                    }
                };
                reader.readAsDataURL(file);
            });
        } else {
            processExtraFilesAndSave(screenshotsList);
        }
    };

    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            iconResult = e.target.result;
            processScreenshotsAndSave();
        };
        reader.readAsDataURL(fileInput.files[0]);
    } else {
        processScreenshotsAndSave();
    }
}

function commitAppToCloud(editingId, publisher, category, platform, name, size, info, url, icon, screenshots, extraFiles) {
    if (editingId) {
        db.collection("apps").doc(editingId).update({
            publisher, category, platform, name, size, info, url, icon, screenshots, extraFiles
        }).then(() => {
            document.getElementById('addAppModal').style.display = 'none';
            alert('App updated successfully!');
        }).catch(err => alert("Error: " + err.message));
    } else {
        db.collection("apps").add({
            publisher, category, platform, name, size, info, url, icon, screenshots, extraFiles,
            likedBy: [],
            downloadedBy: [],
            downloads: 0,
            commentsCount: 0,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            document.getElementById('appPublisher').value = '';
            document.getElementById('appName').value = '';
            document.getElementById('appSize').value = '';
            document.getElementById('appInfo').value = '';
            document.getElementById('appUrl').value = '';
            document.getElementById('appImgFile').value = '';
            document.getElementById('appScreenshotsFile').value = '';
            document.getElementById('appExtraFiles').value = '';
            document.getElementById('addAppModal').style.display = 'none';
        }).catch(err => alert("Error: " + err.message));
    }
}

function deleteApp(id) {
    if (!isAdmin) return;
    if (confirm('Are you sure you want to delete this app permanently?')) {
        db.collection("apps").doc(id).delete();
    }
}
