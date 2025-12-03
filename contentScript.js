// ========================
// JobSnap Content Script
// ========================

// Listen for messages from popup or background to extract job info
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "extractJobInfo") {
    try {
      const jobInfo = extractJobInfo();
      console.log("📦 JobSnap extracted:", jobInfo);
      sendResponse(jobInfo);
    } catch (error) {
      console.error("JobSnap extraction error:", error);
      sendResponse(null);
    }
    return true; // Indicates async response possible
  }
});

/**
 * Main job info extraction entry point.
 * Routes to the correct platform extractor, or uses fallback.
 */
function extractJobInfo() {
  const hostname = window.location.hostname.toLowerCase();
  const deadline = detectDeadline();

  if (hostname.includes("linkedin.com")) return extractLinkedIn();
  if (hostname.includes("indeed.com")) return extractIndeed();
  if (hostname.includes("internshala.com")) return extractInternshala();
  if (hostname.includes("monster.com")) return extractMonster();
  if (hostname.includes("glassdoor.com")) return extractGlassdoor();

  // Generic fallback for other platforms
  return {
    title:
      fallbackRegex(/(Job Title|Position|Title)\s*[:\-\n]+\s*(.+)/i) ||
      getText([".job-title", "h1"]) ||
      "Untitled Position",
    company:
      fallbackRegex(/(Company|Organization|Firm)\s*[:\-\n]+\s*(.+)/i) ||
      getText([".company", ".employer"]) ||
      "Unknown Company",
    url: window.location.href,
    description:
      getText([
        ".job-description",
        "article",
        "#description",
        ".description",
        ".listing-section",
        "section"
      ]) || "",
    deadline,
  };
}

// ---------------- Platform-Specific Extractors ----------------

function extractLinkedIn() {
  return {
    title: getText([
      ".jobs-unified-top-card__job-title",
      ".top-card-layout__title",
      "h1"
    ]),
    company: getText([
      ".jobs-unified-top-card__company-name a",
      ".jobs-unified-top-card__company-name",
      ".topcard__org-name-link"
    ]),
    url: location.href,
    description: getText([
      ".description__text",
      ".jobs-description__container",
      "article"
    ]),
    deadline: detectDeadline()
  };
}

function extractIndeed() {
  return {
    title: getText([
      ".jobsearch-JobInfoHeader-title",
      '[class*="jobTitle"]',
      "h1"
    ]),
    company: getText([
      '[data-company-name]',
      '[class*="company"]',
      ".jobsearch-CompanyReview--heading"
    ]),
    url: location.href,
    description: getText([
      "#jobDescriptionText",
      ".jobsearch-jobDescriptionText"
    ]),
    deadline: detectDeadline()
  };
}

function extractInternshala() {
  return {
    title: getText([
      "div.heading_4_5.profile", // current Internshala job title
      "h1",
      ".profile"
    ]),
    company: getText([
      "a.link_display_like_text", // current Internshala company
      ".company-name",
      "a[title]"
    ]),
    url: location.href,
    description: getText([
      ".container .heading + div",
      "article",
      ".text-container"
    ]),
    deadline: extractInternshalaDeadline()
  };
}

function extractMonster() {
  return {
    title: getText([
      'h1.job-title', // Monster's job title selector
      '.heading',
      'h1'
    ]),
    company: getText([
      'span.subtitle', // Monster's company name selector
      '.job-company',
      '.company-name'
    ]),
    url: location.href,
    description: getText([
      'div#job-content', // Monster's job description selector
      '.job-details',
      '.job-description'
    ]),
    deadline: detectDeadline()
  };
}

function extractGlassdoor() {
  return {
    title: getText([
      'h1.heading_Level1__w42c9', 
      '[data-test="job-title"]', 
      'h1'
    ]),
    company: getText([
      'h4.heading_Heading__aomVx.heading_Subhead__jiUbT',
      '[data-test="employer-name"]',
      '.employerName'
    ]),
    url: location.href,
    description: getText([
      '[data-test="job-details"]',
      '#JobDescription'
    ]),
    deadline: detectDeadline()
  };
}

// ---------------- Generic helpers ----------------

function getText(selectors) {
  for (const selector of selectors) {
    const el = document.querySelector(selector);
    if (el && el.textContent.trim()) {
      return el.textContent.trim();
    }
  }
  if (document.querySelector("h1")) {
    return document.querySelector("h1").textContent.trim();
  }
  if (document.title) {
    return document.title.trim();
  }
  return "";
}

function fallbackRegex(regex) {
  const bodyText = document.body.textContent;
  const match = bodyText.match(regex);
  return match?.[2]?.trim() || "";
}

// ---------------- Deadline extraction ----------------

function detectDeadline() {
  const text = document.body.textContent || "";
  if (location.hostname.includes("linkedin.com")) {
    return text.match(/Apply by\s+(\d{1,2} \w+ \d{4})/i)?.[1] || null;
  }
  if (location.hostname.includes("indeed.com")) {
    return text.match(/Apply by\s+(\w+ \d{1,2},? \d{4})/i)?.[1] || null;
  }
  // Fallback for other sites
  return text.match(/(Apply by|Deadline)[\s:]*([\d\w ,\-]+)/i)?.[2]?.trim() || null;
}

function extractInternshalaDeadline() {
  const text = document.body.textContent;
  const match = text.match(
    /Apply by\s*:?\s*(\d{1,2}[\s\-]?[A-Za-z]{3,9}(?:'?\s*\d{2,4})?)/
  );
  return match?.[1] || null;
}

// ---------------- URL sanitation ----------------

function sanitizeUrl(str) {
  try {
    const url = new URL(str);
    if (!["http:", "https:"].includes(url.protocol)) return "";
    return url.href;
  } catch {
    return "";
  }
}