import { chromium } from "playwright";
import { execSync } from "node:child_process";
import { existsSync, writeFileSync } from "node:fs";

const pythonExe = `${process.env.LOCALAPPDATA}\\Programs\\Python\\Python312\\python.exe`;
const chromeExe = "C:/Users/Administrator/AppData/Local/ms-playwright/chromium-1248/chrome-win64/chrome.exe";
const launchOptions = existsSync(chromeExe) ? { executablePath: chromeExe } : {};

// Definitions for projects requiring mockups
const projects = [
  {
    slug: "jooblie",
    mockup: "assets/mockups/mock-desktop-phone.png",
    out: "public/images/work/jooblie.webp",
    screens: 2,
    htmlDesktop: `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
      body{margin:0;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;background:#0F172A;color:#F8FAFC}
      .nav{display:flex;justify-content:space-between;align-items:center;padding:24px 48px;border-bottom:1px solid #1E293B}
      .logo{font-size:24px;font-weight:800;color:#38BDF8;letter-spacing:-0.5px}
      .hero{padding:80px 48px;max-width:960px}
      h1{font-size:52px;line-height:1.1;margin:0 0 20px 0;letter-spacing:-1px}
      h1 span{color:#38BDF8}
      p{font-size:20px;color:#94A3B8;line-height:1.6}
      .search-box{background:#1E293B;padding:12px;border-radius:12px;display:flex;gap:12px;margin-top:36px;border:1px solid #334155}
      .input{flex:1;background:transparent;border:none;color:#fff;font-size:16px;padding:12px}
      .btn{background:#38BDF8;color:#0F172A;font-weight:700;border:none;padding:14px 28px;border-radius:8px;font-size:16px}
      .tags{display:flex;gap:10px;margin-top:20px}
      .tag{background:#1E293B;padding:6px 14px;border-radius:20px;font-size:14px;color:#CBD5E1}
      .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:40px}
      .card{background:#1E293B;border-radius:12px;padding:24px;border:1px solid #334155}
      .card h3{margin:0 0 8px 0;font-size:18px}
      .card p{font-size:14px;color:#94A3B8;margin:0}
    </style></head><body>
      <div class="nav"><div class="logo">jooblie</div><div>Jobs · Companies · Salaries · Post a Job</div></div>
      <div class="hero">
        <h1>Connect with top tech companies in <span>Canada</span></h1>
        <p>Curated tech jobs, verified salaries and seamless applications for modern professionals.</p>
        <div class="search-box">
          <div class="input">Role: Senior Full-Stack Engineer</div>
          <div class="input">Location: Toronto, ON · Remote</div>
          <button class="btn">Find Jobs</button>
        </div>
        <div class="tags">
          <div class="tag">Next.js</div><div class="tag">React</div><div class="tag">TypeScript</div><div class="tag">Node.js</div><div class="tag">Remote</div>
        </div>
        <div class="grid">
          <div class="card"><h3>Staff Platform Engineer</h3><p>CloudScale · $140k - $170k CAD · Toronto</p></div>
          <div class="card"><h3>Lead UI/UX Architect</h3><p>Nexus Global · $125k - $150k CAD · Vancouver</p></div>
          <div class="card"><h3>AI Systems Developer</h3><p>Vector Labs · $130k - $160k CAD · Montreal</p></div>
        </div>
      </div>
    </body></html>`,
    htmlMobile: `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
      body{margin:0;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;background:#0F172A;color:#F8FAFC;padding:20px}
      .top{display:flex;justify-content:space-between;align-items:center;padding-bottom:16px;border-bottom:1px solid #1E293B}
      .logo{font-size:22px;font-weight:800;color:#38BDF8}
      h2{font-size:28px;line-height:1.2;margin:24px 0 12px 0}
      .card{background:#1E293B;border-radius:12px;padding:16px;margin-bottom:14px;border:1px solid #334155}
      .btn{background:#38BDF8;color:#0F172A;font-weight:700;border:none;padding:12px;border-radius:8px;width:100%;text-align:center;font-size:15px;margin-top:12px}
    </style></head><body>
      <div class="top"><div class="logo">jooblie</div><div>☰</div></div>
      <h2>Find your next role</h2>
      <div class="card"><strong>Staff Platform Engineer</strong><br><span style="color:#94A3B8;font-size:14px">CloudScale · $140k-$170k</span><div class="btn">Apply Now</div></div>
      <div class="card"><strong>Lead UI Architect</strong><br><span style="color:#94A3B8;font-size:14px">Nexus Global · Remote</span><div class="btn">Apply Now</div></div>
    </body></html>`
  },
  {
    slug: "laptopsouq",
    mockup: "assets/mockups/mock-phone-pair.png",
    out: "public/images/work/laptopsouq.webp",
    screens: 2,
    htmlScreen1: `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
      body{margin:0;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;background:#FAFAFA;color:#18181B;padding:20px}
      .header{display:flex;justify-content:space-between;align-items:center;padding-bottom:16px}
      .logo{font-size:20px;font-weight:800;color:#EA580C}
      .banner{background:#18181B;color:#FFF;padding:24px 18px;border-radius:16px;margin:12px 0}
      .grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
      .item{background:#FFF;border-radius:12px;padding:14px;border:1px solid #E4E4E7;text-align:center}
      .price{color:#EA580C;font-weight:700;margin-top:6px}
    </style></head><body>
      <div class="header"><div class="logo">LaptopSouq.ae</div><div>🇦🇪 Dubai</div></div>
      <div class="banner"><h3>Certified Laptops in UAE</h3><p style="color:#A1A1AA;font-size:13px">Direct warranty & express dispatch</p></div>
      <div class="grid">
        <div class="item"><div style="font-size:32px">💻</div><strong>ThinkPad X1</strong><div class="price">Verified Stock</div></div>
        <div class="item"><div style="font-size:32px">💻</div><strong>MacBook Pro</strong><div class="price">Verified Stock</div></div>
      </div>
    </body></html>`,
    htmlScreen2: `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
      body{margin:0;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;background:#FFF;color:#18181B;padding:20px}
      .back{color:#71717A;font-size:14px;margin-bottom:16px}
      .img{background:#F4F4F5;border-radius:16px;padding:40px;text-align:center;font-size:54px}
      h2{font-size:22px;margin:16px 0 6px 0}
      .status{display:inline-block;background:#DCFCE7;color:#15803D;padding:4px 10px;border-radius:20px;font-size:12px;font-weight:600}
      .btn{background:#EA580C;color:#FFF;padding:14px;border-radius:12px;text-align:center;font-weight:700;margin-top:24px}
    </style></head><body>
      <div class="back">← Back to catalogue</div>
      <div class="img">💻</div>
      <h2>Apple MacBook Pro 16" M3</h2>
      <div class="status">In Stock · Ready to ship</div>
      <p style="color:#71717A;font-size:14px;line-height:1.5">36GB Unified Memory · 1TB SSD Storage · Dubai Warranty</p>
      <div class="btn">Order via WhatsApp / Checkout</div>
    </body></html>`
  },
  {
    slug: "zelvomart",
    mockup: "assets/mockups/mock-laptop-front.png",
    out: "public/images/work/zelvomart.webp",
    screens: 1,
    htmlDesktop: `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
      body{margin:0;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;background:#FFF;color:#0F172A}
      .top{background:#0F172A;color:#FFF;padding:10px 48px;font-size:13px;display:flex;justify-content:space-between}
      .nav{display:flex;justify-content:space-between;align-items:center;padding:24px 48px;border-bottom:1px solid #E2E8F0}
      .logo{font-size:26px;font-weight:900;color:#0284C7;letter-spacing:-0.5px}
      .hero{display:flex;padding:64px 48px;align-items:center;background:#F8FAFC;gap:40px}
      .hero-text{flex:1}
      h1{font-size:46px;margin:0 0 16px 0;line-height:1.15}
      .grid{display:grid;grid-template-columns:repeat(4,1fr);gap:24px;padding:48px}
      .card{border:1px solid #E2E8F0;border-radius:12px;padding:20px;text-align:center;background:#FFF}
      .card-img{font-size:44px;margin-bottom:12px}
      .card strong{display:block;font-size:16px}
      .card span{color:#0284C7;font-weight:600;display:block;margin-top:8px}
    </style></head><body>
      <div class="top"><div>Pakistan's Trusted Online Lifestyle Store</div><div>Nationwide Express Delivery</div></div>
      <div class="nav"><div class="logo">ZELVOMART</div><div>Electronics · Fashion · Home Essentials · Deals</div><div>Cart (0)</div></div>
      <div class="hero">
        <div class="hero-text">
          <h1>Curated products with <span>Cash on Delivery</span></h1>
          <p style="font-size:18px;color:#64748B">Engineered for lightning-fast mobile shopping and instant WhatsApp ordering across Pakistan.</p>
        </div>
      </div>
      <div class="grid">
        <div class="card"><div class="card-img">🎧</div><strong>Wireless ANC Headset</strong><span>Featured Item</span></div>
        <div class="card"><div class="card-img">⌚</div><strong>Smart Fitness Watch</strong><span>Featured Item</span></div>
        <div class="card"><div class="card-img">🎒</div><strong>Travel Water-Resistant Bag</strong><span>Featured Item</span></div>
        <div class="card"><div class="card-img">💡</div><strong>LED Studio Desk Light</strong><span>Featured Item</span></div>
      </div>
    </body></html>`
  },
  {
    slug: "ccog-portal",
    mockup: "assets/mockups/mock-laptop-angle.png",
    out: "public/images/work/ccog-portal.webp",
    screens: 1,
    htmlDesktop: `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
      body{margin:0;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;background:#0A0F1D;color:#F8FAFC}
      .header{background:#111827;padding:18px 48px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #1F2937}
      .brand{font-size:20px;font-weight:700;color:#60A5FA}
      .body{padding:48px;max-width:1200px;margin:auto}
      .stats{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;margin-bottom:32px}
      .stat{background:#1E293B;padding:24px;border-radius:12px;border:1px solid #334155}
      .stat strong{font-size:28px;color:#60A5FA;display:block}
      .panel{background:#1E293B;border-radius:16px;padding:32px;border:1px solid #334155}
      table{width:100%;border-collapse:collapse;margin-top:16px}
      th,td{padding:14px;text-align:left;border-bottom:1px solid #334155;font-size:15px}
      th{color:#94A3B8;font-weight:600}
      .badge{background:#10B98122;color:#34D399;padding:4px 10px;border-radius:12px;font-size:13px}
    </style></head><body>
      <div class="header"><div class="brand">University Student & Faculty Portal</div><div>Term: Fall 2026 · Role: Administrator</div></div>
      <div class="body">
        <div class="stats">
          <div class="stat"><strong>2,840</strong>Enrolled Students</div>
          <div class="stat"><strong>142</strong>Faculty Members</div>
          <div class="stat"><strong>98.4%</strong>Course Attendance</div>
          <div class="stat"><strong>48</strong>Active Departments</div>
        </div>
        <div class="panel">
          <h2 style="margin:0">Active Department Modules</h2>
          <table>
            <tr><th>Department</th><th>Dean</th><th>Enrolled</th><th>Status</th></tr>
            <tr><td>Computer Science & AI</td><td>Dr. R. Vance</td><td>620</td><td><span class="badge">Active</span></td></tr>
            <tr><td>Software Engineering</td><td>Dr. M. Chen</td><td>540</td><td><span class="badge">Active</span></td></tr>
            <tr><td>Business & Management</td><td>Dr. S. Miller</td><td>490</td><td><span class="badge">Active</span></td></tr>
          </table>
        </div>
      </div>
    </body></html>`
  },
  {
    slug: "hciorlando",
    mockup: "assets/mockups/mock-laptop-angle.png",
    out: "public/images/work/hciorlando.webp",
    screens: 1,
    url: "https://hciorlando.com/"
  },
  {
    slug: "clubc-education",
    mockup: "assets/mockups/mock-laptop-front.png",
    out: "public/images/work/clubc-education.webp",
    screens: 1,
    url: "https://clubc.education/"
  },
  {
    slug: "vivonow",
    mockup: "assets/mockups/mock-laptop-angle.png",
    out: "public/images/work/vivonow.webp",
    screens: 1,
    url: "https://vivonow.com/"
  },
  {
    slug: "partner-solar-au",
    mockup: "assets/mockups/mock-laptop-angle.png",
    out: "public/images/work/partner-solar-au.webp",
    screens: 1,
    htmlDesktop: `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
      body{margin:0;font-family:-apple-system,BlinkMacSystemFont,sans-serif;background:#FFF;color:#0F172A}
      .header{background:#0F172A;color:#FFF;padding:20px 48px;display:flex;justify-content:space-between;align-items:center}
      .hero{background:linear-gradient(135deg,#0284C7,#0369A1);color:#FFF;padding:80px 48px}
      h1{font-size:48px;margin:0 0 16px 0}
      .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;padding:48px}
      .card{background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;padding:24px}
    </style></head><body>
      <div class="header"><div>Solar Energy Solutions · Australia</div><div>Residential · Commercial · Batteries</div></div>
      <div class="hero">
        <h1>Clean energy systems engineered for Australian homes</h1>
        <p style="font-size:20px;opacity:0.9">High-efficiency solar panels, intelligent battery storage, and complete CEC accreditation.</p>
      </div>
      <div class="grid">
        <div class="card"><h3>Residential Solar</h3><p>Optimized solar arrays designed to eliminate daylight utility expenses.</p></div>
        <div class="card"><h3>Battery Storage</h3><p>Continuous backup power and night-time discharge optimization.</p></div>
        <div class="card"><h3>Commercial Arrays</h3><p>Scalable 30kW - 100kW rooftop generation for enterprises.</p></div>
      </div>
    </body></html>`
  },
  {
    slug: "partner-screens-au",
    mockup: "assets/mockups/mock-laptop-front.png",
    out: "public/images/work/partner-screens-au.webp",
    screens: 1,
    htmlDesktop: `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
      body{margin:0;font-family:-apple-system,BlinkMacSystemFont,sans-serif;background:#0F172A;color:#FFF}
      .header{padding:24px 48px;border-bottom:1px solid #1E293B;display:flex;justify-content:space-between}
      .hero{padding:72px 48px;max-width:960px}
      h1{font-size:46px;margin:0 0 16px 0;color:#F8FAFC}
      p{font-size:18px;color:#94A3B8}
      .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;padding:0 48px 48px 48px}
      .card{background:#1E293B;border:1px solid #334155;border-radius:12px;padding:24px}
    </style></head><body>
      <div class="header"><div>Security Screens & Barrier Doors · Australia</div><div>AS 5039 Certified</div></div>
      <div class="hero">
        <h1>Stainless steel security mesh & architectural doors</h1>
        <p>Manufactured to Australian standards for maximum home protection and unimpeded coastal airflow.</p>
      </div>
      <div class="grid">
        <div class="card"><h3>Hinged Doors</h3><p>316 marine-grade mesh with triple-point locking mechanisms.</p></div>
        <div class="card"><h3>Sliding Systems</h3><p>Heavy-duty extruded frames custom-fitted to patio openings.</p></div>
        <div class="card"><h3>Window Screens</h3><p>Tamper-resistant perimeter retention and fly protection.</p></div>
      </div>
    </body></html>`
  }
];

async function main() {
  const browser = await chromium.launch(launchOptions);

  for (const p of projects) {
    console.log(`Building mockup for ${p.slug}...`);
    const shotFiles = [];

    if (p.url) {
      // Live URL capture
      const desktopShot = `shots/${p.slug}-desktop.png`;
      if (!existsSync(desktopShot)) {
        try {
          const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
          await page.goto(p.url, { waitUntil: "networkidle", timeout: 20000 }).catch(() => {});
          await page.waitForTimeout(1000);
          await page.screenshot({ path: desktopShot });
          await page.close();
        } catch (e) {
          console.warn(`  Live fetch failed for ${p.url}, rendering backup.`);
        }
      }
      if (existsSync(desktopShot)) {
        shotFiles.push(desktopShot);
      }
    }

    if (shotFiles.length === 0 && p.htmlDesktop) {
      const desktopShot = `shots/${p.slug}-desktop.png`;
      const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
      await page.setContent(p.htmlDesktop);
      await page.screenshot({ path: desktopShot });
      await page.close();
      shotFiles.push(desktopShot);
    }

    if (p.screens === 2 && p.htmlMobile) {
      const mobileShot = `shots/${p.slug}-mobile.png`;
      const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, deviceScaleFactor: 2 });
      await page.setContent(p.htmlMobile);
      await page.screenshot({ path: mobileShot });
      await page.close();
      shotFiles.push(mobileShot);
    }

    if (p.screens === 2 && p.htmlScreen1 && p.htmlScreen2) {
      const s1 = `shots/${p.slug}-s1.png`;
      const s2 = `shots/${p.slug}-s2.png`;
      const p1 = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, deviceScaleFactor: 2 });
      await p1.setContent(p.htmlScreen1);
      await p1.screenshot({ path: s1 });
      await p1.close();

      const p2 = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, deviceScaleFactor: 2 });
      await p2.setContent(p.htmlScreen2);
      await p2.screenshot({ path: s2 });
      await p2.close();

      shotFiles.length = 0;
      shotFiles.push(s1, s2);
    }

    if (shotFiles.length > 0) {
      const cmd = `"${pythonExe}" scripts/compose_mockups.py --mockup ${p.mockup} --shots ${shotFiles.join(" ")} --out ${p.out}`;
      console.log(`  Executing: ${cmd}`);
      execSync(cmd, { stdio: "inherit" });
    }
  }

  await browser.close();
  console.log("All portfolio mockups generated successfully!");
}

main().catch(console.error);
