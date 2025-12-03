document.addEventListener("DOMContentLoaded", function () {

    // 🔴 CRITICAL: INSERT YOUR VALID GEMINI API KEY HERE.
    // NOTE: In a real-world scenario, this should be fetched from a secure backend.
    const YOUR_GEMINI_API_KEY = "AIzaSyA7ajeFM8m-vh8na8moI8SLR6K9VuKRyQ8"; 
    // ---------------------------------------------------------------------

    // --- THEME ---
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") document.body.classList.add("dark-mode");

    // --- PAYMENT URL (Razorpay) ---
    const paymentUrl = "https://job-snap-payment-page-lvxd.vercel.app/";

    // --- TASK MANAGER DEFAULTS ---
    const DEFAULT_TASKS = [
        { text: "Tailor resume keywords for the ATS/job description", completed: false },
        { text: "Draft a strong cover letter (if required)", completed: false },
        { text: "Research the interviewer(s) on LinkedIn", completed: false },
        { text: "Prepare 3-5 thoughtful questions about the role/team", completed: false },
        { text: "Confirm interview time and video link/address", completed: false },
        { text: "(Internship Specific): Clarify start date, duration, and academic credit", completed: false },
        { text: "Clarify salary, benefits, and bond/legal details (Negotiation Prep)", completed: false },
        { text: "Send a personalized thank you email to interviewer(s)", completed: false },
        { text: "Follow up with recruiter (if no response in 5-7 days)", completed: false },
    ];
    // ------------------------------------

    const CORRECT_SHEET_ID = '1CUu4Utqxk7wDgHFkhqYx-YM6MpZwBfceEC32qBvLxno';

    const INTEL_URLS = {
        "Student": `https://docs.google.com/spreadsheets/d/${CORRECT_SHEET_ID}/gviz/tq?tqx=out:json&gid=589531843&tq=SELECT *&headers=1`,
        "Job Seekers": `https://docs.google.com/spreadsheets/d/${CORRECT_SHEET_ID}/gviz/tq?tqx=out:json&gid=2140766536&tq=SELECT *&headers=1`,
        "Working Professionals": `https://docs.google.com/spreadsheets/d/${CORRECT_SHEET_ID}/gviz/tq?tqx=out:json&gid=2084554007&tq=SELECT *&headers=1`,
        "Startup Essentials & Skill Mastery": `https://docs.google.com/spreadsheets/d/${CORRECT_SHEET_ID}/gviz/tq?tqx=out:json&gid=666666666&tq=SELECT *&headers=1`,
        "AI & Automation Fluency": `https://docs.google.com/spreadsheets/d/${CORRECT_SHEET_ID}/gviz/tq?tqx=out:json&gid=777777777&tq=SELECT *&headers=1`,
        "Green Tech & Sustainability": `https://docs.google.com/spreadsheets/d/${CORRECT_SHEET_ID}/gviz/tq?tqx=out:json&gid=888888888&tq=SELECT *&headers=1`,
    };
    
    const COLUMN_MAP = [
        'SEGMENT_ID', 'ICON', 'TITLE_TEXT', 'DETAIL_TEXT', 'METRIC_TYPE', 'ACTION_TIP', 'EXTERNAL_LINK', 'LAST_UPDATE', 'TOPIC_TAG'
    ];
    
    // --- Element references ---
    const elements = {
        saveBtn: document.getElementById("saveBtn"),
        clearFormBtn: document.getElementById("clearFormBtn"),
        searchInput: document.getElementById("searchInput"),
        list: document.getElementById("list"),
        dashboard: document.getElementById("dashboard"),
        toggleBtn: document.getElementById("toggleTheme"),
        autoFillBtn: document.getElementById("autoFill"),
        
        resumeInput: document.getElementById("resume"),
        coverLetterInput: document.getElementById("coverLetter"),
        form: document.getElementById("jobForm"),
        jobCount: document.getElementById("jobCount"),
        motivationLine: document.getElementById("motivationLine"),
        toast: document.getElementById("toast"),

        deletePopupBtn: document.getElementById("deletePopupBtn"),
        deleteOptionsModal: document.getElementById("deleteOptionsModal"),
        closeDeleteModal: document.getElementById("closeDeleteModal"),
        modalOverlay: document.getElementById("modalOverlay"),

        tasksModalOverlay: document.getElementById("tasksModalOverlay"),
        tasksModal: document.getElementById("tasksModal"),
        tasksModalTitle: document.getElementById("tasksModalTitle"),
        tasksList: document.getElementById("tasksList"),
        newTaskInput: document.getElementById("newTaskInput"),
        addTaskBtn: document.getElementById("addTaskBtn"),
        closeTasksModal: document.getElementById("closeTasksModal"),
        
        // --- CORRECTED AI ELEMENTS ---
        aiOptimizeBtn: document.getElementById("aiOptimizeBtn"),
        aiOptimizationOutputCard: document.getElementById("aiOptimizationOutputCard"),

        offerModalOverlay: document.getElementById("offerModalOverlay"),
        offerModal: document.getElementById("offerModal"),
        offerModalTitle: document.getElementById("offerModalTitle"),
        offerModalContent: document.getElementById("offerModalContent"),
        closeOfferModal: document.getElementById("closeOfferModal"),

        exportCSVBtn: document.getElementById("exportCSVBtn"),
        licensePage: document.getElementById("licensePage"),
        mainDashboardSection: document.getElementById("mainDashboardSection"),
        licenseInput: document.getElementById("licenseInput"),
        verifyLicenseBtn: document.getElementById("verifyLicenseBtn"),
        licenseError: document.getElementById("licenseError"),
        newUserBtn: document.getElementById("newUserBtn"),
        premiumFeatures: document.getElementById("premiumFeatures"),
        payUnlockBtn: document.getElementById("payUnlockBtn"),
        additionalButtons: document.querySelector(".additional-buttons"),
        start10minBtn: document.getElementById("tryFreeBtn"),

        navMyJobs: document.getElementById("navMyJobs"),
        navAddJob: document.getElementById("navAddJob"),
        navAtsOptimizer: document.getElementById("navAtsOptimizer"),
        navOfferCompare: document.getElementById("navOfferCompare"),
        navAnalytics: document.getElementById("navAnalytics"),
        
        navCareerIntel: document.getElementById("navCareerIntel"),
        careerIntelPage: document.getElementById("careerIntelPage"),
        intelCategoryLanding: document.getElementById("intelCategoryLanding"),
        intelInsightsContainer: document.getElementById("intelInsightsContainer"),
        intelUpdateMonth: document.getElementById("intelUpdateMonth"),
        
        intelSliderWrapper: document.getElementById("intelSliderWrapper"),
        intelPrevBtn: document.getElementById("intelPrevBtn"),
        intelNextBtn: document.getElementById("intelNextBtn"),
        
        navInfo: document.getElementById("navInfo"),
        
        myJobsPage: document.getElementById("myJobsPage"),
        addJobPage: document.getElementById("addJobPage"),
        atsOptimizerPage: document.getElementById("atsOptimizerPage"),
        offerComparePage: document.getElementById("offerComparePage"),
        payUnlockOfferPage: document.getElementById("payUnlockOfferPage"),
        analyticsPage: document.getElementById("analyticsPage"),
        analyticsPageContent: document.getElementById("analyticsPageContent"),
        analyticsEmptyState: document.getElementById("analyticsEmptyState"),
        infoPage: document.getElementById("infoPage"),
        goToAddJobBtn: document.getElementById("goToAddJobBtn"),
        emptyStateCta: document.getElementById("emptyStateCta"),
        
        // CRITICAL FIX: Use the correct IDs from the HTML structure
        atsInputPage: document.getElementById("aiInputCard"), 
        atsReportPage: document.getElementById("aiOptimizationOutputCard"), 
        backToInputBtn: document.getElementById("backToInputBtn"),

        // NEW LOADING MODAL REFERENCES
        aiLoadingModalOverlay: document.getElementById("aiLoadingModalOverlay"),
        aiLoadingModal: document.getElementById("aiLoadingModal"),

        startComparisonBtn: document.getElementById("startComparisonBtn"),
        calculateSalaryBtn: document.getElementById("calculateSalaryBtn"),
        generateScriptBtn: document.getElementById("generateScriptBtn"),
        
        backToLicenseBtn: document.getElementById("backToLicenseBtn"),
        payUnlockTrialBtnDashboard: document.getElementById("payUnlockTrialBtnDashboard"),
        backToLicenseBtnAddJob: document.getElementById("backToLicenseBtnAddJob"),
        payUnlockTrialBtnDashboardAddJob: document.getElementById("payUnlockTrialBtnDashboardAddJob"),
        freeTrialMessageMyJobs: document.getElementById("freeTrialMessageMyJobs"),
        freeTrialMessageAddJob: document.getElementById("freeTrialMessageAddJob"),
        getLinkBtn: document.getElementById("getLinkBtn"),
        themeLabel: document.getElementById("themeLabel"),
        sidebar: document.querySelector('.fixed-sidebar-menu'),
        
        // NEW ELEMENTS FOR DUAL SCORE/TABS (from HTML structure)
        tabATS: document.getElementById("tabATS"),
        tabRecruiter: document.getElementById("tabRecruiter"),
        atsContent: document.getElementById("ats-content"),
        recruiterContent: document.getElementById("recruiter-content"),
        atsReportContainer: document.getElementById("atsReportContainer")
    };

    // --- Form Fields Object ---
    const formFields = {
        title: document.getElementById("title"),
        company: document.getElementById("company"),
        rating: document.getElementById("rating"),
        platform: document.getElementById("platform"),
        dateApplied: document.getElementById("dateApplied"),
        deadline: document.getElementById("deadline"),
        interviewDate: document.getElementById("interviewDate"),
        status: document.getElementById("status"),
        jobLink: document.getElementById("jobLink"),
        recruiterInfo: document.getElementById("recruiterInfo"),
        notes: document.getElementById("notes"),
        workType: document.getElementById("workType"),
        aiJobTitle: document.getElementById("aiJobTitle")
    };

    // ------------------------------------
    // --- STATE AND NEW NAVIGATION LOGIC ---
    // ------------------------------------

    let currentPage = "myJobs";
    let jobs = [];
    let editingIndex = null;
    let dashboardFilter = null;
    let isManualDashboardClick = false;
    let currentJobIndexForTasks = null;
    let lastWeekMetrics = {};
    const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;
    
    let autoplayInterval = null;
    const AUTOPLAY_DELAY_MS = 2000;
    const SCROLL_DURATION_MS = 1500;
    
    // 🟢 Key reference for the ATS function
    const YOUR_API_KEY = YOUR_GEMINI_API_KEY; 
    
    // 🟢 FIX: Define this utility function globally to resolve the 'not defined' error.
    const getCssColor = (varName) => {
        // Reads color variable value from the CSS root
        return window.getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
    };
    
    /**
     * Core function to handle the entire AI Resume Optimization process.
     * This is the logic for the 'Analyze Resume' button.
     */
    async function aiOptimizeResume() {
        const aiOptimizeBtn = elements.aiOptimizeBtn;

        // 1. --- Input Validation & Pre-Check ---
        const resumeFile = document.getElementById("resume").files[0];
        const jobDescription = formFields.notes ? formFields.notes.value.trim() : "";
        const jobTitle = formFields.aiJobTitle ? formFields.aiJobTitle.value.trim() : "";

        if (!resumeFile) {
            showToast("❌ Error: Please upload your Resume file.", "error");
            return;
        }
        if (!jobDescription || !jobTitle) {
            showToast("❌ Error: Job Title and Description are required.", "error");
            return;
        }

        if (!YOUR_API_KEY || YOUR_API_KEY === "AIzaSyA7ajeFM8m-vh8na8moI8SLR6K9VuKRy") {
            showToast("⚠️ API Key Missing: Please provide a valid Gemini API key.", "error");
            sendNotificationToBackground("ATS Error", "Gemini API Key is missing or invalid. Check popup.js.");
            return;
        }
        
        // 2. --- UI State: Start Loading ---
        aiOptimizeBtn.disabled = true;
        aiOptimizeBtn.innerHTML = `<span class="loading-spinner"></span> Analyzing...`;
        toggleAiLoadingModal(true);
        runLoadingSequence(); // Start the progress animation

        // Utility function to convert file to base64
        const fileToBase64 = (file) => new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result.split(',')[1]); // Only need the base64 part
            reader.onerror = error => reject(error);
            reader.readAsDataURL(file);
        });

        try {
            const resumeBase64 = await fileToBase64(resumeFile);

            // 3. --- Construct Gemini API Request Payload ---
            const requestBody = {
                contents: [{
                    parts: [
                        {
                            text: `
                            You are JobSnap AI, a career and ATS optimization expert. 
                            Your task is to analyze the provided resume against the provided Job Description (JD).
                            The analysis must cover two areas: technical ATS compatibility and human recruiter appeal.
                            
                            **Job Title:** ${jobTitle}
                            **Job Description (JD):** ${jobDescription}
                            
                            **Instructions:**
                            1.  Analyze the attached PDF/DOCX resume (provided as base64) against the JD.
                            2.  Provide an overall ATS Match Score (0-100) and a Recruiter Impact Score (0-100).
                            3.  Generate the response ONLY as a single, valid JSON object following the required structure below.
                            
                            **CRITICAL INSTRUCTIONS FOR RESUME PARSING & DATA INTEGRITY:**
                            4. **RESILIENCE MANDATE:** The resume layout may be complex (multi-column, visual boxes). You MUST prioritize extracting logical text content over layout structure. If the text is mangled, use the job title and JD to infer and generate a report based on best effort.
                            5. For ALL nested objects (keyword_saturation, experience_match, etc.) you MUST return the object structure. DO NOT return null for any field.
                            6. If a field cannot be analyzed, you MUST return a specific, actionable recommendation instead of "N/A" for the action_item field.
                            7. The summary fields (summary, issue_found, gap_warning) MUST contain 5-10 words of detailed analysis or observation, even if inferred.
                            8. The 'audit_sample' array MUST contain at least one object with an 'original' and 'rewrite' field, even if the quantification is weak.

                            **Required JSON Output Structure:**
                            {
                              "ats_match_score": <number 0-100>,
                              "recruiter_score": <number 0-100>,
                              "diagnostic_factors": {
                                "keyword_saturation": {
                                  "rating": "<Critical|Warning|Strong>",
                                  "missing_keywords": ["keyword1", "keyword2", "..."],
                                  "action_item": "<Brief, actionable step to improve>"
                                },
                                "quantifiable_achievements": {
                                  "rating": <number 0-100>,
                                  "summary": "<Summary of quantification quality>",
                                  "audit_sample": [
                                    {
                                      "original": "Managed project timelines",
                                      "grade": 2,
                                      "rewrite": "Reduced project delivery time by 15% (3 days) using Agile methodologies."
                                    }
                                  ]
                                },
                                "action_verb_strength": {
                                  "score": <number 0-100>,
                                  "flagged_verbs": ["used", "helped", "worked"],
                                  "action_item": "<Brief, actionable step>"
                                },
                                "ats_formatting_compliance": {
                                  "status": "<PASS|FAIL>",
                                  "issue_found": "<Brief description of formatting risk or 'N/A'>"
                                },
                                "experience_match": {
                                  "relevance": "<Low|Medium|High>",
                                  "gap_warning": "<If Low/Medium, describe the gap>"
                                },
                                "tone_readability": {
                                   "reading_level": "<e.g., 10th Grade>",
                                   "tone": "<e.g., Professional, Technical>",
                                   "action_item": "<Brief, actionable step>"
                                }
                              }
                            }
                            `,
                        },
                        {
                            inlineData: {
                                mimeType: resumeFile.type,
                                data: resumeBase64
                            }
                        }
                    ]
                }],
                // 🛑 FIXED: Renamed 'config' to 'generationConfig' and structured the schema correctly
                "generationConfig": { 
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: "object",
                        properties: {
                            ats_match_score: { type: "integer" },
                            recruiter_score: { type: "integer" },
                            
                            diagnostic_factors: { 
                                type: "object", 
                                properties: {
                                    // Defined top-level metric fields
                                    "keyword_saturation": { 
                                        "type": "object", 
                                        "properties": { 
                                            "rating": {"type": "string"},
                                            "missing_keywords": {"type": "array", "items": {"type": "string"}},
                                            "action_item": {"type": "string"}
                                        }
                                    }, 
                                    
                                    "quantifiable_achievements": { 
                                        "type": "object", 
                                        "properties": {
                                            "rating": {"type": "integer"},
                                            "summary": {"type": "string"},
                                            
                                            // 💡 CRITICAL FIX HERE: Define the properties for the items inside the audit_sample array
                                            "audit_sample": {
                                                "type": "array", 
                                                "items": {
                                                    "type": "object",
                                                    "properties": {
                                                        "original": {"type": "string"},
                                                        "grade": {"type": "integer"},
                                                        "rewrite": {"type": "string"},
                                                        
                                                        // 💡 CRITICAL FINAL FIX: Define the properties of the resource_suggestion object
                                                        "resource_suggestion": {
                                                            "type": "object",
                                                            "properties": {
                                                                "title": {"type": "string"}, // e.g., "Quantifiable Achievements Guide"
                                                                "url": {"type": "string"}   // e.g., "https://example.com/guide"
                                                            }
                                                        } 
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    
                                    "action_verb_strength": { 
                                        "type": "object",
                                        "properties": {
                                            "score": {"type": "integer"},
                                            "flagged_verbs": {"type": "array", "items": {"type": "string"}},
                                            "action_item": {"type": "string"}
                                        }
                                    },
                                    
                                    "ats_formatting_compliance": { 
                                        "type": "object", 
                                        "properties": {
                                             "status": {"type": "string"},
                                             "issue_found": {"type": "string"}
                                        }
                                    },
                                    
                                    "experience_match": { 
                                        "type": "object", 
                                        "properties": {
                                             "relevance": {"type": "string"},
                                             "gap_warning": {"type": "string"}
                                        }
                                    },
                                    
                                    "tone_readability": { 
                                        "type": "object", 
                                        "properties": {
                                            "reading_level": {"type": "string"},
                                            "tone": {"type": "string"},
                                            "action_item": {"type": "string"}
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            };

            // 4. --- Call Gemini API ---
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${YOUR_API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                 const errorData = await response.json().catch(() => ({}));
                 let errorMessage = errorData.error?.message || `API call failed with status ${response.status}.`;
                 
                 // Check for common API key issues
                 if (response.status === 400 && errorMessage.includes('API key not valid')) {
                     errorMessage = "Invalid API Key. Please check the key and billing status.";
                 } else if (response.status === 429) {
                     errorMessage = "Rate limit exceeded. Please try again in a few minutes.";
                 } else if (response.status === 500) {
                     errorMessage = "Internal Server Error. The AI model may be temporarily down or your request failed the safety filter.";
                 }
                 throw new Error(errorMessage);
            }

            const data = await response.json();
            
            // Ensure the data structure is as expected from the JSON schema configuration
            const report = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!report) {
                throw new Error("AI response was empty or malformed. Ensure your file is readable.");
            }
            
            // The API returns the content as a string of JSON, so we need to parse it.
            let parsedReport;
            try {
                parsedReport = JSON.parse(report);
            } catch (e) {
                console.error("Failed to parse AI JSON response:", report);
                throw new Error("AI returned unreadable data. Try again with a cleaner prompt/JD.");
            }


            // 5. --- Process & Render Report ---
            const score = parsedReport.ats_match_score || 0;
            const recruiterScore = parsedReport.recruiter_score || 0;
            
            // 🟢 CRITICAL FIX 1: Deep validation and guaranteed structure for rendering.
            // This prevents rendering functions from crashing if the AI skips a diagnostic block.
            const rawFactors = parsedReport.diagnostic_factors || {}; 
            const diagnosticFactors = {
                // ATS Factors:
                keyword_saturation: rawFactors.keyword_saturation || {},
                ats_formatting_compliance: rawFactors.ats_formatting_compliance || {},
                experience_match: rawFactors.experience_match || {},
                
                // Recruiter Factors:
                quantifiable_achievements: rawFactors.quantifiable_achievements || {},
                action_verb_strength: rawFactors.action_verb_strength || {},
                tone_readability: rawFactors.tone_readability || {},
            };
            // END CRITICAL FIX 1

            // Generate the HTML for the new report structure
            const reportHtml = generateNewAtsReportHtml(score, recruiterScore, diagnosticFactors);
            elements.aiOptimizationOutputCard.innerHTML = reportHtml;
            
            // Attach listeners to the dynamically created elements (tabs, back button, save button)
            setupNewAtsReportListeners(score, recruiterScore, diagnosticFactors);

            // Switch view from input form to report card
            switchAtsView(true);
            
            // Optional: Save scores temporarily for the 'Save to Job Tracker' button click later
            chrome.storage.local.set({ tempAtsMatchScore: score, tempRecruiterScore: recruiterScore });
            
            showToast("✅ Analysis complete! Check your dual score.", "success");
            sendNotificationToBackground("ATS Analysis Success", `ATS Score: ${score}%, Recruiter Score: ${recruiterScore}%`);

        } catch (e) {
            console.error("ATS Optimization Error:", e);
            showToast(`❌ Analysis Failed: ${e.message}`, "error");
            sendNotificationToBackground("ATS Analysis Failure", e.message);
        } finally {
            // 6. --- UI State: Stop Loading ---
            toggleAiLoadingModal(false);
            aiOptimizeBtn.disabled = false;
            aiOptimizeBtn.innerHTML = `Analyze Resume`;
        }
    }


    // --- NEW: Helper function to get status class based on metric name ---
    const getStatusClassFromMetric = (metricName) => {
        const lowerName = String(metricName).toLowerCase();
        // Updated to include 'undetermined' in warning category
        if (lowerName.includes('critical') || lowerName.includes('low') || lowerName.includes('fail')) return 'status-border-critical';
        if (lowerName.includes('warning') || lowerName.includes('moderate') || lowerName.includes('undetermined')) return 'status-border-warning';
        if (lowerName.includes('pass') || lowerName.includes('strong') || lowerName.includes('high')) return 'status-border-good';
        return 'status-border-neutral';
    };

    // --- NEW: Report Rendering Logic (Handles the complex JSON structure) ---
    function generateDiagnosticBlock(key, data) {
        // Data is now guaranteed to be at least {} thanks to CRITICAL FIX 1
        let blockHtml = '';
        let statusText = '';
        let statusClass = 'status-border-neutral';
        let contentHtml = '';
        
        switch (key) {
            case 'keyword_saturation':
                statusText = data.rating || 'N/A';
                statusClass = getStatusClassFromMetric(statusText);
                contentHtml = `
                    <p class="summary-text">
                        <strong>Missing Keywords:</strong> ${data.missing_keywords?.length > 0 ? data.missing_keywords.join(', ') : 'None found.'}
                    </p>
                    <p class="summary-text">
                        <strong>Action:</strong> ${data.action_item || 'Review the JD for key skills and tools.'}
                    </p>
                    ${data.resource_suggestion ? renderResourceSuggestion(data.resource_suggestion) : ''}
                `;
                break;
            case 'quantifiable_achievements':
                // Logic to determine status based on rating score for visual indicator
                statusText = (data.rating || 0) + '% Score';
                statusClass = getStatusClassFromMetric(data.rating > 70 ? 'good' : (data.rating > 40 ? 'warning' : 'critical'));
                
                // 💥 FIX: Ensure the Summary field is never blank
                const summaryText = data.summary && data.summary.length > 5 ? data.summary : 'The model was unable to provide a summary. Focus on quantifiable metrics.';

                contentHtml = `
                    <p class="summary-text">
                        <strong>Quantification Score:</strong> ${data.rating || 'N/A'}%
                    </p>
                    <p class="summary-text">
                        <strong>Summary:</strong> ${summaryText}
                    </p>
                    ${data.audit_sample?.length > 0 
                        ? renderAchievementAudit(data.audit_sample) 
                        : '<p class="summary-text">**Action Required:** No quantifiable statements found. Rewrite bullets using metrics (e.g., increased sales, reduced time, saved $XX, increased by X%).</p>'
                    }
                `;
                break;
            case 'action_verb_strength':
                statusText = (data.score || 0) + '% Score';
                statusClass = getStatusClassFromMetric(data.score > 70 ? 'good' : 'warning');
                
                // 💥 FIX: Ensure Action and Flagged Verbs are not blank
                contentHtml = `
                    <p class="summary-text">
                        <strong>Score:</strong> ${data.score || 'N/A'}%
                    </p>
                    <p class="summary-text">
                        <strong>Flagged Verbs:</strong> ${data.flagged_verbs?.length > 0 ? data.flagged_verbs.join(', ') : 'None detected.'}
                    </p>
                    <p class="summary-text">
                        <strong>Action:</strong> ${data.action_item || 'Ensure bullet points start with strong, dynamic action verbs.'}
                    </p>
                `;
                break;
            case 'ats_formatting_compliance':
                // 💥 FIX: Force critical/warning status color if data is missing
                statusText = data.status || 'WARNING';
                statusClass = getStatusClassFromMetric(data.status || 'Critical'); 

                contentHtml = `
                    <p class="summary-text">
                        <strong>Status:</strong> ${data.status || 'Undetermined'}
                    </p>
                    <p class="summary-text">
                        <strong>Issue Found:</strong> ${data.issue_found && data.issue_found.length > 5 ? data.issue_found : 'The formatting review failed to complete. Check for complex tables, images, or custom fonts.'}
                    </p>
                `;
                break;
            case 'experience_match':
                statusText = data.relevance || 'N/A';
                statusClass = data.relevance === 'High' ? 'status-border-good' : 'status-border-warning';
                
                // 💥 FIX: Ensure a strong message appears for the gap warning
                contentHtml = `
                    <p class="summary-text">
                        <strong>Relevance:</strong> ${data.relevance || 'N/A'}
                    </p>
                    <p class="summary-text">
                        <strong>Gap Warning:</strong> ${data.gap_warning || 'Model found no critical experience gaps versus the JD.'}
                    </p>
                `;
                break;
            case 'tone_readability':
                statusText = data.reading_level || 'N/A';
                statusClass = getStatusClassFromMetric(data.tone === 'Professional' ? 'good' : 'warning');
                contentHtml = `
                    <p class="summary-text">
                        <strong>Reading Level:</strong> ${data.reading_level || 'N/A'}
                    </p>
                    <p class="summary-text">
                        <strong>Tone:</strong> ${data.tone || 'N/A'}
                    </p>
                    <p class="summary-text">
                        <strong>Action:</strong> ${data.action_item || 'Ensure bullet points are concise and professional.'}
                    </p>
                `;
                break;
            default:
                return '';
        }

        const formattedTitle = key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        
        // Final metric block wrapper
        blockHtml = `
            <div class="ai-metric-block-video ${statusClass}" data-metric-key="${key}">
                <div class="metric-header-row">
                    <span class="metric-label-video">${formattedTitle}</span>
                    <span class="status-tag-video status-${statusClass.replace('status-border-', '')}">${statusText}</span>
                </div>
                <div class="metric-feedback-content">
                    ${contentHtml}
                </div>
            </div>
        `;
        return blockHtml;
    }

    // Renders the resource link and micro-feedback loop.
    function renderResourceSuggestion(resource) {
        if (!resource || !resource.url) return '';
        
        // Ensure the URL starts with https:// for safety
        const safeUrl = resource.url.startsWith('http') ? resource.url : `https://${resource.url}`;

        return `
            <div class="resource-tip" style="margin-top: 15px; padding-top: 10px; border-top: 1px dashed var(--border-light);">
                <p style="font-size: 12px; font-weight: 700; color: var(--success);">🎯 Suggested Resource:</p>
                <a href="${safeUrl}" target="_blank" class="link-button" style="display: inline-block; padding: 6px 10px; background: var(--info); color: white; border-radius: 6px; font-size: 13px; margin-bottom: 8px;">
                    🔗 ${resource.title || 'View Resource'}
                </a>
                <div class="micro-feedback" style="display: flex; align-items: center; gap: 8px; font-size: 12px;">
                    <span>Was this resource useful?</span>
                    <button class="feedback-btn feedback-yes" style="background: var(--success); padding: 4px 8px; font-size: 11px;">👍 Yes</button>
                    <button class="feedback-btn feedback-no" style="background: var(--danger); padding: 4px 8px; font-size: 11px;">👎 No</button>
                </div>
            </div>
        `;
    }

    // Renders the audit table for quantifiable achievements (before/after comparison).
    function renderAchievementAudit(auditSample) {
        // auditSample should now be guaranteed to be an array due to CRITICAL FIX 1
        if (!Array.isArray(auditSample) || auditSample.length === 0) return '';
        
        let auditHtml = `<div class="audit-table" style="margin-top: 10px; font-size: 12px; border: 1px solid var(--border-light); border-radius: 8px; overflow: hidden;">`;
        
        // Table Header
        auditHtml += `<div style="display: grid; grid-template-columns: 1fr 1fr; background: var(--hover-light); font-weight: 600; padding: 8px;">
                        <div>Original (Grade)</div>
                        <div>Metric Rewrite</div>
                      </div>`;

        // Table Rows (Data)
        auditSample.forEach((sample, index) => {
            auditHtml += `<div style="display: grid; grid-template-columns: 1fr 1fr; padding: 10px; border-top: 1px solid var(--border-light);">
                            <div style="color: var(--danger);">
                                ${sample.original || 'N/A'} <span style="font-weight: 700; color: #555;">(${sample.grade || 0}/5)</span>
                            </div>
                            <div style="color: var(--success);">
                                ${sample.rewrite || 'N/A'}
                            </div>
                         </div>`;
            // Include the nested resource suggestion if available
            if (sample.resource_suggestion) {
                 auditHtml += `<div style="grid-column: 1 / -1; padding: 5px 10px;">${renderResourceSuggestion(sample.resource_suggestion)}</div>`;
            }
        });

        auditHtml += `</div>`;
        return auditHtml;
    }
    
    // Main function to generate the entire report HTML structure.
    function generateNewAtsReportHtml(score, recruiterScore, diagnosticFactors) {
        
        // Helper to determine the color class for the main score numbers
        const getScoreStatusClass = (value) => {
            if (value <= 39) return 'score-status-critical';
            if (value <= 79) return 'score-status-warning';
            return 'score-status-good';
        };

        // Separate factors into ATS and Recruiter related for the tabs
        let atsFactorsHtml = '';
        let recruiterFactorsHtml = '';
        
        // Define which factors belong where (based on JSON key names)
        const atsKeys = ['keyword_saturation', 'ats_formatting_compliance', 'experience_match'];
        
        // Iterates over the GUARANTEED structure created in CRITICAL FIX 1
        for (const key in diagnosticFactors) {
            if (diagnosticFactors.hasOwnProperty(key)) {
                const block = generateDiagnosticBlock(key, diagnosticFactors[key]);
                
                // Heuristic to separate content into tabs
                if (atsKeys.includes(key)) {
                    atsFactorsHtml += block;
                } else {
                    recruiterFactorsHtml += block; // Default to Recruiter tab if not explicitly ATS-focused
                }
            }
        }

        // The final HTML structure, including the Dual Score Header and Tab controls.
        return `
            <div class="ai-report-card">
                <button type="button" id="backToInputBtn" class="secondary" style="margin-bottom: 15px;">
                    ← Back to Input Form
                </button>

                <div class="dual-score-header" id="scoreHeader">
                    <div class="score-card-summary score-ats">
                        <p>Machine Readability</p>
                        <span class="score-value-lg score-ats-value ${getScoreStatusClass(score)}">${score}%</span>
                        <p class="score-label">ATS Score</p>
                    </div>
                    <div class="score-separator"></div>
                    <div class="score-card-summary score-recruiter">
                        <p>Content Impact (Estimated)</p>
                        <span class="score-value-lg score-recruiter-value ${getScoreStatusClass(recruiterScore)}">${recruiterScore}%</span>
                        <p class="score-label">Recruiter Score</p>
                    </div>
                </div>
                
                <div class="segmented-control-container">
                    <div class="segmented-control">
                        <button type="button" id="tabATS" class="tab-btn active" data-target="ats-content">
                            🏛️ ATS Compatibility
                        </button>
                        <button type="button" id="tabRecruiter" class="tab-btn" data-target="recruiter-content">
                            🧑‍💼 Human Review
                        </button>
                    </div>
                </div>
                
                <div class="ai-report-details" id="ats-content" style="gap: 12px; display: flex;">
                    ${atsFactorsHtml || '<p style="text-align: center; color: var(--text-light); padding: 20px;">No ATS factors available or received.</p>'}
                </div>
                
                <div class="ai-report-details" id="recruiter-content" style="gap: 12px; display: none;">
                    ${recruiterFactorsHtml || '<p style="text-align: center; color: var(--text-light); padding: 20px;">No Human Review factors available or received.</p>'}
                </div>

                <button id="saveScoreToJobBtn" class="primary" style="margin-top: 20px; width: 100%; background: var(--success);">
                    💾 Save Dual Score to Job Tracker
                </button>
            </div>
        `;
    }

    // Listener setup for the newly rendered report.
    function setupNewAtsReportListeners(score, recruiterScore, diagnosticFactors) {
        
        // Re-reference elements as they are dynamically inserted
        const tabATS = document.getElementById('tabATS');
        const tabRecruiter = document.getElementById('tabRecruiter');
        const atsContent = document.getElementById('ats-content');
        const recruiterContent = document.getElementById('recruiter-content');
        const backBtn = document.getElementById("backToInputBtn");
        const saveBtn = document.getElementById('saveScoreToJobBtn');
        
        if (!tabATS || !tabRecruiter || !atsContent || !recruiterContent) return;

        // Tab Switching Logic
        const switchTab = (targetId) => {
            document.querySelectorAll('#aiOptimizationOutputCard .tab-btn').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('#aiOptimizationOutputCard .ai-report-details').forEach(c => c.style.display = 'none'); 

            if (targetId === 'ats-content') {
                tabATS.classList.add('active');
                atsContent.style.display = 'flex'; 
            } else if (targetId === 'recruiter-content') {
                tabRecruiter.classList.add('active');
                recruiterContent.style.display = 'flex';
            }
        };

        tabATS.onclick = () => switchTab('ats-content');
        tabRecruiter.onclick = () => switchTab('recruiter-content');
        switchTab('ats-content'); // Default active tab

        // Back Button Listener
        if (backBtn) {
            backBtn.addEventListener('click', () => switchAtsView(false));
        }

        // Save Button Listener
        if (saveBtn) {
            saveBtn.addEventListener('click', async () => {
                const jobId = prompt("Enter the ID of the job you want to update (e.g., 'job-1700000000'):");
                if (!jobId) return showToast("Save cancelled.", "info");

                const jobIndex = jobs.findIndex(j => j.id === jobId);
                if (jobIndex === -1) return showToast("Job ID not found.", "error");

                jobs[jobIndex].atsMatchScore = score;
                jobs[jobIndex].recruiterScore = recruiterScore;
                
                await new Promise(resolve => {
                    chrome.storage.local.set({ jobs }, resolve);
                });
                
                showToast(`Scores saved to job: ${jobs[jobIndex].title}!`, "success");
                switchPage('myJobs');
            });
        }
        
        // Micro-Feedback Listeners (Attaches listeners to the newly rendered buttons)
        document.querySelectorAll('.micro-feedback .feedback-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                // Simple feedback placeholder logic (e.g., change button style)
                const parent = e.target.closest('.micro-feedback');
                parent.querySelector('span').textContent = (e.target.classList.contains('feedback-yes') ? 'Thanks for the feedback! 👍' : 'Feedback recorded.👎');
                parent.querySelectorAll('.feedback-btn').forEach(btn => btn.style.opacity = '0.4');
                e.target.style.opacity = '1';
            });
        });
        
    }
    
    // 💡 CRITICAL FIX: Tab Switching Logic (Needed to fix visual state and content swap)
    function setupAtsTabListeners(score, recruiterScore) {
        // This old function is now a temporary wrapper for the new listener function
        // It's kept here for compatibility until all references are updated, 
        // but its logic is now delegated to setupNewAtsReportListeners in Phase 2.
    }


    // --- UTILITY FUNCTIONS ---
    
    function easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    function animateScrollTo(element, targetX, duration) {
        if (!element) return;
        const startX = element.scrollLeft;
        const changeX = targetX - startX;
        const startTime = performance.now();

        function animateScroll(currentTime) {
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(1, timeElapsed / duration);
            const easedProgress = easeInOutQuad(progress);

            element.scrollLeft = startX + changeX * easedProgress;

            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            } else {
                pulseCurrentTitle();
            }
        }
        requestAnimationFrame(animateScroll);
    }
    
    function pulseCurrentTitle() {
        if (!elements.intelSliderWrapper) return;
        const currentCard = elements.intelSliderWrapper.children[currentSegmentIndex];
        if (currentCard) {
            const titleStrong = currentCard.querySelector('.insight-content strong');
            if (titleStrong) {
                titleStrong.classList.add('pulse-title');
                setTimeout(() => {
                    titleStrong.classList.remove('pulse-title');
                }, 400);
            }
        }
    }

    let currentSegmentIndex = 0;
    let totalSegments = 0;

    function navigateSlider(direction) {
        if (!elements.intelSliderWrapper || totalSegments === 0) return;

        let newIndex = currentSegmentIndex + direction;

        if (newIndex < 0) {
            newIndex = totalSegments - 1;
        } else if (newIndex >= totalSegments) {
            newIndex = 0;
        }

        const targetX = newIndex * elements.intelSliderWrapper.clientWidth;
        animateScrollTo(elements.intelSliderWrapper, targetX, SCROLL_DURATION_MS);
        currentSegmentIndex = newIndex;
        updateSliderButtons();
    }
    
    function updateSliderButtons() {
        if (elements.intelPrevBtn) {
            elements.intelPrevBtn.style.display = totalSegments > 1 ? 'flex' : 'none';
        }
        if (elements.intelNextBtn) {
            elements.intelNextBtn.style.display = totalSegments > 1 ? 'flex' : 'none';
        }
    }

    function startAutoplay() {
        stopAutoplay();
        if (totalSegments > 1) {
            autoplayInterval = setInterval(() => {
                navigateSlider(1);
            }, AUTOPLAY_DELAY_MS + SCROLL_DURATION_MS + 200);
        }
    }

    function stopAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
            autoplayInterval = null;
        }
    }
    
    // NEW FUNCTION: Toggles the dedicated AI loading modal
    function toggleAiLoadingModal(show) {
        if (elements.aiLoadingModalOverlay && elements.aiLoadingModal) {
            elements.aiLoadingModalOverlay.style.display = show ? 'block' : 'none';
            elements.aiLoadingModal.style.display = show ? 'flex' : 'none';
            document.body.style.overflow = show ? 'hidden' : '';
        }
    }
    
    // NEW FUNCTION: Runs the multi-stage progress animation
    async function runLoadingSequence() {
        const loadingStepEl = document.getElementById('aiLoadingStep');
        const loadingMessageEl = document.getElementById('aiLoadingMessage');
        const loadingProgressEl = document.getElementById('aiLoadingProgress');
        
        if (!loadingStepEl || !loadingMessageEl || !loadingProgressEl) return;
        
        // INCREASED DURATION FOR BETTER UX on slow API calls
        const steps = [
            { step: "1/4", message: "Establishing Secure Connection & Validating Inputs...", duration: 1000, width: "20%" },
            { step: "2/4", message: "Ingesting & Parsing Job Description (JD) and Resume Content...", duration: 3500, width: "45%" }, // Increased
            { step: "3/4", message: "Deep Scanning ATS Compliance & Cross-Referencing Keywords...", duration: 4500, width: "70%" }, // Increased
            { step: "4/4", message: "Finalizing Recruiter Impact Score & Generating Improvement Report...", duration: 2000, width: "95%" }
        ];

        // Ensure the ball animation starts
        const bounceBall = elements.aiLoadingModal.querySelector('.bounce-ball');
        if (bounceBall) {
            bounceBall.classList.remove("do-bounce");
            void bounceBall.offsetWidth;
            bounceBall.classList.add("do-bounce");
        }
        
        for (const step of steps) {
            loadingStepEl.textContent = step.step;
            loadingMessageEl.textContent = step.message;
            loadingProgressEl.style.width = step.width;
            
            // Wait for the simulated duration of the step
            await new Promise(resolve => setTimeout(resolve, step.duration));
        }
    }

    
    // NEW: Function to toggle between ATS Input and ATS Report views
    function switchAtsView(showReport) {
        // We use the existing parent IDs from the HTML structure to toggle visibility
        const inputView = document.getElementById("aiInputCard");
        const reportView = document.getElementById("aiOptimizationOutputCard");
        
        if (inputView && reportView) {
             inputView.style.display = showReport ? 'none' : 'block';
             reportView.style.display = showReport ? 'block' : 'none';
        } else {
             // Fallback if elements aren't found, keep showing both or show error
             if (inputView) inputView.style.display = 'block';
             if (reportView) reportView.style.display = 'none';
        }
        
        // Ensure the global app content scrolls to the top of the new view
        const appContent = document.getElementById("appContent");
        if (appContent) {
            appContent.scrollTo({ top: 0, behavior: "smooth" });
        }
    }
    
    // Add event listener for the new Back button (must be added here as it is only present on the Report page)
    if (elements.backToInputBtn) {
        elements.backToInputBtn.addEventListener('click', () => switchAtsView(false));
    }


    // ... (rest of the functions remain the same)
    
    function calculatePrepScore(job) {
        const tasks = job.tasks || [];
        if (tasks.length === 0) return { score: null, total: 0 };
        const completedTasks = tasks.filter(t => t.completed).length;
        const totalTasks = tasks.length;
        const score = Math.round((completedTasks / totalTasks) * 100);
        return { score, total: totalTasks };
    }

    async function loadLastWeekMetrics() {
        return new Promise(resolve => {
            try {
                chrome.storage.local.get(["jobsnapLastWeekMetrics"], (result) => {
                    lastWeekMetrics = result.jobsnapLastWeekMetrics || {};
                    resolve();
                });
            } catch(e) {
                console.error("Error loading last week metrics:", e);
                resolve();
            }
        });
    }

    function saveWeeklyMetricsSnapshot(currentMetrics) {
        const now = Date.now();
        const lastSnapshotTime = lastWeekMetrics.timestamp || 0;
        const MS_PER_WEEK_CONST = 7 * 24 * 60 * 60 * 1000;
        if (now - lastSnapshotTime > MS_PER_WEEK_CONST) {
             const snapshot = {
                timestamp: now,
                applied: currentMetrics.totalApplied,
                interviewed: jobs.filter(j => j.status === "Interviewed" || j.status === "Offer").length,
                offer: jobs.filter(j => j.status === "Offer").length
             };
             try {
                 chrome.storage.local.set({ jobsnapLastWeekMetrics: snapshot });
                 console.log("Analytics snapshot saved for comparison.");
             } catch(e) {
                 console.error("Error saving weekly metrics:", e);
             }
        }
    }

    function getChangeIndicator(current, last) {
        if (last === undefined || last === null || last === 0) {
            return { icon: "🆕", text: "New Data", class: "diff-new" };
        }
        const diff = current - last;
        if (diff > 0) return { icon: "▲", text: (diff / last * 100).toFixed(0) + "%", class: "diff-up" };
        if (diff < 0) return { icon: "▼", text: (Math.abs(diff) / last * 100).toFixed(0) + "%", class: "diff-down" };
        return { icon: "●", text: "No Change", class: "diff-none" };
    }

    function generateAnalytics() {
        if (!jobs.length) return null;
        const activeJobs = jobs.filter(j => j.status !== "Not Applied");
        const jobsWithDateApplied = jobs.filter(j => j.dateApplied);
        const totalAppliedCount = activeJobs.length;
        const totalOffers = jobs.filter(j => j.status === "Offer").length;
        const totalInterviewedOrOffer = jobs.filter(j => j.status === "Interviewed" || j.status === "Offer").length;
        
        let oldestApplicationDate = null;
        let daysToInterviewSum = 0;
        let daysToInterviewCount = 0;
        let daysToOfferSum = 0;
        let daysToOfferCount = 0;
        let maxDaysSinceLastFollowUp = 0;

        jobsWithDateApplied.forEach(job => {
            const date = new Date(job.dateApplied);
            if (!oldestApplicationDate || date.getTime() < oldestApplicationDate.getTime()) {
                oldestApplicationDate = date;
            }
        });

        jobsWithDateApplied.forEach(job => {
            if (!job.dateApplied) return;
            const dateApplied = new Date(job.dateApplied + 'T00:00:00');
            
            if (job.interviewDate && (job.status === "Interviewed" || job.status === "Offer")) {
                const interviewDate = new Date(job.interviewDate + 'T00:00:00');
                if (interviewDate.getTime() > dateApplied.getTime()) {
                    const diffTime = Math.abs(interviewDate.getTime() - dateApplied.getTime());
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    daysToInterviewSum += diffDays;
                    daysToInterviewCount++;
                }
            }
            
            if (job.status === "Offer" && job.lastUpdated) {
                const offerUpdateDate = new Date(job.lastUpdated);
                if (offerUpdateDate.getTime() > dateApplied.getTime()) {
                    const diffTime = Math.abs(offerUpdateDate.getTime() - dateApplied.getTime());
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    daysToOfferSum += diffDays;
                    daysToOfferCount++;
                }
            }
        });

        const stuckJobs = jobs.filter(j => j.status === "Applied" || j.status === "Shortlisted");
        const today = Date.now();
        stuckJobs.forEach(job => {
            const lastUpdated = new Date(job.lastUpdated || job.createdAt).getTime();
            const daysDiff = Math.floor((today - lastUpdated) / (1000 * 60 * 60 * 24));
            if (daysDiff > maxDaysSinceLastFollowUp) {
                maxDaysSinceLastFollowUp = daysDiff;
            }
        });


        const conversionRate = totalAppliedCount > 0 ? (totalInterviewedOrOffer / totalAppliedCount) * 100 : 0;
        const interviewToOfferRate = totalInterviewedOrOffer > 0 ? (totalOffers / totalInterviewedOrOffer) * 100 : 0;
        
        let averageAppliedPerWeek = 0;
        if (oldestApplicationDate) {
            const totalDaysTracking = Math.floor((Date.now() - oldestApplicationDate.getTime()) / (1000 * 60 * 60 * 24));
            const totalWeeksTracking = totalDaysTracking / 7;
            
            if (totalWeeksTracking >= 1) {
                averageAppliedPerWeek = jobsWithDateApplied.length / totalWeeksTracking;
            } else if (totalDaysTracking > 0 && jobsWithDateApplied.length > 0) {
                 averageAppliedPerWeek = jobsWithDateApplied.length / (totalDaysTracking / 7);
            }
        }
        
        const avgDaysToInterview = daysToInterviewCount > 0 ? daysToInterviewSum / daysToInterviewCount : null;
        const avgDaysToOffer = daysToOfferCount > 0 ? daysToOfferSum / daysToOfferCount : null;

        const appliedDiff = getChangeIndicator(totalAppliedCount, lastWeekMetrics.applied);
        const interviewDiff = getChangeIndicator(totalInterviewedOrOffer, lastWeekMetrics.interviewed);
        const offerDiff = getChangeIndicator(totalOffers, lastWeekMetrics.offer);

        const appsNeededForNextInterview = conversionRate > 0 ? Math.ceil(100 / conversionRate) : 'N/A';
        const interviewsNeededForNextOffer = interviewToOfferRate > 0 ? Math.ceil(100 / interviewToOfferRate) : 'N/A';
        
        const sourceCounts = {};
        const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 'No Rating': 0 };
        const rejectionStages = {
            'Application/ATS': 0,
            'After Screening/Shortlist': 0,
            'After Interview(s)': 0,
            'Other': 0
        };
        const allRejectedJobs = jobs.filter(j => j.status === 'Rejected');
        const totalRejections = allRejectedJobs.length;

        allRejectedJobs.forEach(job => {
            if (!job.dateApplied) {
                 rejectionStages['Other']++;
            } else if (job.interviewDate) {
                rejectionStages['After Interview(s)']++;
            } else if (job.statusHistory?.includes('Shortlisted') || job.status === 'Shortlisted') {
                 rejectionStages['After Screening/Shortlist']++;
            } else {
                rejectionStages['Application/ATS']++;
            }
        });

        activeJobs.forEach(job => {
            if (job.status === 'Interviewed' || job.status === 'Offer') {
                const source = job.platform || 'Direct/Unknown';
                sourceCounts[source] = (sourceCounts[source] || 0) + 1;
            }
            
            const rating = job.rating || 0;
            if (rating >= 1 && rating <= 5) {
                ratingCounts[rating] += 1;
            } else {
                ratingCounts['No Rating'] += 1;
            }
        });
        
        const weeklyActivityData = [
            { label: 'This Week', count: jobsWithDateApplied.length },
            { label: 'Last Week', count: lastWeekMetrics.applied || 0 },
        ];


        return {
            totalApplied: totalAppliedCount,
            totalInterviewed: totalInterviewedOrOffer,
            totalOffers,
            conversionRate,
            interviewToOfferRate,
            averageAppliedPerWeek,
            avgDaysToInterview,
            avgDaysToOffer,
            maxDaysSinceLastFollowUp,
            hasData: activeJobs.length > 0,
            appliedDiff,
            interviewDiff,
            offerDiff,
            appsNeededForNextInterview,
            interviewsNeededForNextOffer,
            chartData: {
                source: sourceCounts,
                rating: ratingCounts,
                weeklyActivity: weeklyActivityData,
                rejectionStages: { data: rejectionStages, total: totalRejections }
            }
        };
    }

    function renderAnalyticsPage() {
        if (jobs.length === 0) {
            if (elements.analyticsEmptyState) elements.analyticsEmptyState.style.display = "block";
            if (elements.analyticsPageContent) elements.analyticsPageContent.style.display = "none";
            const chartsSection = document.getElementById('chartsSection');
            if (chartsSection) chartsSection.innerHTML = '';
            return;
        }
        
        const analytics = generateAnalytics();
        if (elements.analyticsEmptyState) elements.analyticsEmptyState.style.display = "none";
        const hasAppliedData = analytics && analytics.hasData;

        if (elements.analyticsPageContent) {
            elements.analyticsPageContent.style.display = hasAppliedData ? "grid" : "block";
            elements.analyticsPageContent.innerHTML = '';
        }

        if (!hasAppliedData) {
             if (elements.analyticsPageContent) {
                 elements.analyticsPageContent.innerHTML =
                     `<div style="text-align: center; padding: 40px; color: var(--text-light); grid-column: 1 / -1;">
                         <h2>Metrics Pending</h2>
                         <p>We found ${jobs.length} tracked job${jobs.length !== 1 ? 's' : ''}. To see performance insights, please update their status (from 'Not Applied') and ensure a Date Applied is set for accurate rates.</p>
                     </div>`;
             }
             const chartsSection = document.getElementById('chartsSection');
             if (chartsSection) chartsSection.innerHTML = '';
             return;
        }
    
        saveWeeklyMetricsSnapshot(analytics);
        
        const formatMetric = (value, diffObj, suffix = '') => {
            const valueStr = (typeof value === 'number' && isFinite(value) ? value.toFixed(value % 1 !== 0 ? 1 : 0) : value);
            let diffHtml = '';
            if (lastWeekMetrics.timestamp && value !== 'N/A') {
                if (diffObj.text === "New Data" || diffObj.text === "No Change") {
                    diffHtml = `<span class="diff ${diffObj.class}">${diffObj.icon} ${diffObj.text}</span>`;
                } else {
                    diffHtml = `<span class="diff ${diffObj.class}">${diffObj.icon} ${diffObj.text} vs. Last Week</span>`;
                }
            }
            return `${valueStr}${suffix} ${diffHtml}`;
        };


        const metricsHtml = `
            <div class="metric-card success-metric">
                <span class="metric-value">${analytics.conversionRate.toFixed(1)}%</span>
                <span class="metric-label">Application-to-Interview Rate</span>
            </div>
            <div class="metric-card">
                <span class="metric-value">${formatMetric(analytics.totalApplied, analytics.appliedDiff)}</span>
                <span class="metric-label">Total Applications Submitted</span>
            </div>
            <div class="metric-card success-metric">
                <span class="metric-value">${analytics.interviewToOfferRate.toFixed(1)}%</span>
                <span class="metric-label">Interview-to-Offer Rate</span>
            </div>
            <div class="metric-card">
                <span class="metric-value">${formatMetric(analytics.totalInterviewed, analytics.interviewDiff)}</span>
                <span class="metric-label">Interviews Secured</span>
            </div>
        `;
        
        const goalCardHtml = `
            <div class="recommendations-box" style="grid-column: 1 / -1; margin-left: 0 !important; width: 100% !important;">
                <h3 style="color: var(--primary);">🎯 Personalized Job Search Goals</h3>
                <ul style="list-style: none; padding-left: 0;">
                    <li>
                        <span style="font-weight: 700; color: var(--success);">To Secure Your Next Interview:</span>
                        Based on your ${analytics.conversionRate.toFixed(1)}% conversion rate, you need to submit approximately
                        <span style="font-size: 1.1em; color: var(--primary-hover);">${analytics.appsNeededForNextInterview}</span>
                        quality applications.
                    </li>
                    <li style="margin-top: 10px;">
                        <span style="font-weight: 700; color: #f59e0b;">To Land Your Next Offer:</span>
                        Your current rate suggests you need to convert
                        <span style="font-size: 1.1em; color: var(--primary-hover);">${analytics.interviewsNeededForNextOffer}</span>
                        interviews into an offer. Focus on preparation!
                    </li>
                </ul>
            </div>
        `;

        if (elements.analyticsPageContent) {
            elements.analyticsPageContent.innerHTML = metricsHtml + goalCardHtml;
        }
        
        renderFunnelChart(analytics);
        renderRejectionAnalysisChart(analytics.chartData.rejectionStages);
        renderSourceChart(analytics.chartData.source);
        renderRatingChart(analytics.chartData.rating);
        renderActivityChart(analytics.chartData.weeklyActivity);
    }

    function renderRejectionAnalysisChart(rejectionData) {
        const container = document.getElementById('rejectionAnalysisChart');
        if (!container) return;

        const totalRejections = rejectionData.total;
        const stages = rejectionData.data;

        if (totalRejections === 0) {
            container.innerHTML = `<p style="text-align: center; color: var(--text-light);">No jobs marked as 'Rejected' yet for analysis.</p>`;
            return;
        }

        let chartHTML = '<div class="horizontal-bar-chart">';
        const orderedStages = [
            { label: 'Application/ATS', count: stages['Application/ATS'], color: '#ef4444' },
            { label: 'After Screening/Shortlist', count: stages['After Screening/Shortlist'], color: '#f59e0b' },
            { label: 'After Interview(s)', count: stages['After Interview(s)'], color: '#9333ea' },
            { label: 'Other/No Date', count: stages['Other'], color: '#64748b' }
        ];

        orderedStages.forEach(item => {
            if (item.count > 0) {
                const percentage = (item.count / totalRejections) * 100;
                chartHTML += `
                    <div class="h-bar-item">
                        <div class="h-bar-label">
                            <span>${item.label}</span>
                            <span>${item.count} (${percentage.toFixed(0)}% of Rejections)</span>
                        </div>
                        <div class="h-bar-visualization">
                            <div class="h-bar-fill" style="width: ${percentage.toFixed(0)}%; background-color: ${item.color};"></div>
                        </div>
                    </div>
                `;
            }
        });

        chartHTML += '</div>';
        container.innerHTML = chartHTML;
    }

    function renderSourceChart(sourceData) {
        const container = document.getElementById('sourceRoiChart');
        if (!container) return;
        const totalInterviews = Object.values(sourceData).reduce((sum, count) => sum + count, 0);
        if (totalInterviews === 0) {
            container.innerHTML = `<p style="text-align: center; color: var(--text-light);">No interviews secured yet to analyze source effectiveness.</p>`;
            return;
        }
        let chartHTML = '<div class="donut-chart">';
        let legendHTML = '<ul style="list-style: none; padding-left: 0;">';
        const colorPalette = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#6366f1', '#a3a3a3'];
        let colorIndex = 0;

        Object.entries(sourceData).forEach(([source, count]) => {
            const percentage = (count / totalInterviews) * 100;
            const color = colorPalette[colorIndex % colorPalette.length];
            colorIndex++;
            legendHTML += `<li><span style="background-color: ${color}; width: 10px; height: 10px; display: inline-block; margin-right: 5px; border-radius: 50%;"></span>${source}: ${count} (${percentage.toFixed(0)}%)</li>`;
        });

        legendHTML += '</ul>';
        chartHTML += legendHTML;
        chartHTML += '</div>';
        container.innerHTML = chartHTML;
    }

    function renderRatingChart(ratingData) {
        const container = document.getElementById('excitementScoreChart');
        if (!container) return;

        const ratedJobs = Object.entries(ratingData).filter(([key]) => key !== 'No Rating');
        const totalRated = ratedJobs.reduce((sum, [, count]) => sum + count, 0);

        if (totalRated === 0) {
            container.innerHTML = `<p style="text-align: center; color: var(--text-light);">No jobs with a rating (1-5 stars) found for analysis.</p>`;
            return;
        }
        let chartHTML = '<div class="horizontal-bar-chart">';
        ratedJobs.sort(([a], [b]) => parseInt(b) - parseInt(a));

        ratedJobs.forEach(item => {
            const percentage = (item[1] / totalRated) * 100;
            const color = item[0] >= 4 ? '#f59e0b' : (item[0] >= 3 ? '#3b82f6' : '#64748b');

            chartHTML += `
                <div class="h-bar-item">
                    <div class="h-bar-label">
                        <span>${item[0]} Star Jobs</span>
                        <span>${item[1]} (${percentage.toFixed(0)}%)</span>
                    </div>
                    <div class="h-bar-visualization">
                        <div class="h-bar-fill" style="width: ${percentage.toFixed(0)}%; background-color: ${color};"></div>
                    </div>
                </div>
            `;
        });

        chartHTML += '</div>';
        container.innerHTML = chartHTML;
    }

    function renderActivityChart(activityData) {
        const container = document.getElementById('weeklyActivityChart');
        if (!container) return;

        if (activityData[0].count === 0 && activityData[1].count === 0) {
            container.innerHTML = `<p style="text-align: center; color: var(--text-light);">No application volume detected in the last two weeks.</p>`;
            return;
        }

        const maxCount = Math.max(activityData[0].count, activityData[1].count);

        let chartHTML = '<div class="horizontal-bar-chart" style="padding: 10px 0;">';
        
        activityData.forEach(item => {
            const percentage = (item.count / maxCount) * 100;
            const color = item.label === 'This Week' ? '#10b981' : '#3b82f6';
            const label = item.label;

            chartHTML += `
                <div class="h-bar-item">
                    <div class="h-bar-label">
                        <span>${label}</span>
                        <span>${item.count} Applications</span>
                    </div>
                    <div class="h-bar-visualization">
                        <div class="h-bar-fill" style="width: ${percentage.toFixed(0)}%; background-color: ${item.color};"></div>
                    </div>
                </div>
            `;
        });

        chartHTML += '</div>';
        container.innerHTML = chartHTML;
    }

    function renderFunnelChart(analytics) {
        const totalSubmitted = analytics.totalApplied;
        const jobsApplied = jobs.filter(j => j.status === 'Applied').length;
        const jobsShortlisted = jobs.filter(j => j.status === 'Shortlisted').length;
        const jobsInterviewed = jobs.filter(j => j.status === 'Interviewed').length;
        const jobsOffer = jobs.filter(j => j.status === 'Offer').length;
        const jobsRejected = jobs.filter(j => j.status === 'Rejected').length;
        
        const stages = [
            { status: 'Applied', count: jobsApplied, label: 'Applied (Waiting)', className: 'stage-applied' },
            { status: 'Shortlisted', count: jobsShortlisted, label: 'Shortlisted', className: 'stage-shortlisted' },
            { status: 'Interviewed', count: jobsInterviewed, label: 'Interviews', className: 'stage-interviewed' },
            { status: 'Offer', count: jobsOffer, label: 'Offers Received', className: 'stage-offer' },
            { status: 'Rejected', count: jobsRejected, label: 'Rejected', className: 'stage-rejected' },
        ];

        const chartsSection = document.getElementById('chartsSection');
        if (!chartsSection) return;
        

        if (totalSubmitted === 0) {
            chartsSection.innerHTML = `
                <h3 class="chart-title" style="margin: 10px 0 0 0; padding: 0; font-size: 16px; color: var(--primary);">
                    🎯 Pipeline Funnel
                </h3>
                <div id="funnelVisual" class="funnel-chart" style="text-align: center; color: var(--text-light);">
                    No submitted applications to build the funnel.
                </div>
                ${getChartContainersHtml()}
            `;
            return;
        }

        let funnelHTML = `
            <h3 class="chart-title" style="margin: 10px 0 0 0; padding: 0; font-size: 16px; color: var(--primary);">
                🎯 Pipeline Funnel
            </h3>
            <div id="funnelVisual" class="funnel-chart">
                <div class="funnel-stage" style="margin-bottom: 10px; border-bottom: 1px dashed var(--border-light); padding-bottom: 10px;">
                    <div class="funnel-label" style="font-size: 14px;">
                        <span style="font-weight: 700;">Total Submitted Applications</span>
                        <span class="count" style="font-weight: 700;">${totalSubmitted}</span>
                    </div>
                </div>
        `;
        
        const maxStageCount = Math.max(...stages.map(s => s.count));

        stages.forEach(stage => {
            if (stage.count > 0) {
                const percentageOfMax = (stage.count / maxStageCount) * 100;
                const percentageOfSubmitted = (stage.count / totalSubmitted) * 100;
                
                funnelHTML += `
                    <div class="funnel-stage">
                        <div class="funnel-label">
                            <span>${stage.label}</span>
                            <span class="count">${stage.count} (${percentageOfSubmitted.toFixed(0)}% of Total)</span>
                        </div>
                        <div class="funnel-bar-container">
                            <div class="funnel-bar ${stage.className}"
                                style="width: ${percentageOfMax.toFixed(0)}%;">
                            </div>
                        </div>
                    </div>
                `;
            }
        });
        
        funnelHTML += '</div>';

        function getChartContainersHtml() {
            return `
                 <h3 class="chart-title" style="margin-top: 20px;">🚫 Rejection Analysis by Stage</h3>
                 <div id="rejectionAnalysisChart" class="visual-chart"></div>

                 <h3 class="chart-title" style="margin-top: 20px;">📍 Source Effectiveness (Interviews Secured by Platform)</h3>
                 <div id="sourceRoiChart" class="visual-chart"></div>

                 <h3 class="chart-title" style="margin-top: 20px;">⭐ Excitement Score Distribution</h3>
                 <div id="excitementScoreChart" class="visual-chart"></div>

                 <h3 class="chart-title" style="margin-top: 20px;">🗓️ Weekly Application Trend</h3>
                 <div id="weeklyActivityChart" class="visual-chart"></div>
             `;
        }
        
        chartsSection.innerHTML = funnelHTML + getChartContainersHtml();
    }

    function generateRecommendations(analytics) {
        const recs = [];
        if (analytics.maxDaysSinceLastFollowUp >= 7) {
            recs.push(`🚨 **Urgent Follow-up:** You have jobs stuck in 'Applied/Shortlisted' for **${analytics.maxDaysSinceLastFollowUp} days}**. Prioritize sending a check-in email!`);
        } else if (analytics.maxDaysSinceLastFollowUp >= 3) {
            recs.push(`📝 **Action Needed:** Follow up on your older applications. A personalized email can make the difference.`);
        }
        if (analytics.conversionRate < 5 && analytics.totalApplied >= 5) {
             recs.push(`🔍 **Review Materials:** Your **Application-to-Interview Rate** is low. Focus on tailoring your resume keywords for the ATS before applying.`);
        }
        if (analytics.interviewToOfferRate < 30 && analytics.totalInterviewed >= 3) {
            recs.push(`🗣️ **Practice Interviews:** Your **Interview-to-Offer Rate** is low. Focus on behavioral questions, mock interviews, and refining your negotiation strategy.`);
        }
        if (recs.length === 0) {
            if (analytics.conversionRate > 20 && analytics.interviewToOfferRate > 50) {
                recs.push(`🎉 **Excellent Pipeline!** Your conversion rates are stellar. Keep your volume high and stay focused on closing those offers.`);
            } else if (analytics.totalApplied > 10) {
                recs.push(`✅ **Maintain Momentum:** Your search is in good shape. Keep updating your notes and following up strategically.`);
            } else {
                 recs.push(`💡 **Getting Started:** All the best for your job search! Your current data is being recorded and insights will appear soon.`);
            }
        }
        return `<div class="recommendations-box"><h3>💡 Proactive Recommendations</h3><ul>${recs.map(r => `<li>${r}</li>`).join('')}</ul></div>`;
    }

    // --- NEW CAREER INTEL SLIDER FUNCTIONS (REMAINS THE SAME) ---

    // Helper function to derive icon color class based on on the segment ID/Title
    function getIconClass(segmentId) {
        const id = segmentId.toUpperCase();
        if (id.includes('TREND') || id.includes('MARKET') || id.includes('DATA')) return 'icon-data';
        if (id.includes('TECH') || id.includes('SKILL') || id.includes('COMPETITION')) return 'icon-tech';
        if (id.includes('HEALTH') || id.includes('CAREER') || id.includes('CULTURE')) return 'icon-career';
        if (id.includes('AI') || id.includes('STRATEGY') || id.includes('INNOVATION')) return 'icon-strategy';
        return ''; // Default
    }

    // Helper function to format the titles for the UI (e.g., OVERALL_HEALTH -> Overall Health)
    function formatSegmentTitle(id) {
        return id.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    }

    // Helper function to render the HTML structure for a single segment group (NOW A SINGLE HORIZONTAL CARD)
    function renderSegment(dataArray, segmentTitle) {
        // CRITICAL CHANGE: This returns ONE .insight-segment DIV for the horizontal slider
        let html = `<div class="insight-segment">
                        <h3 class="segment-title" style="color: var(--primary); margin-top: 0; font-weight: 700;">${segmentTitle}</h3>
                        <ul style="list-style: none; padding-left: 0;">`;
        
        const iconClass = getIconClass(segmentTitle);
        

        dataArray.forEach(item => {
            // Check for valid URL to generate the link button HTML
            const linkButtonHtml = item.EXTERNAL_LINK && item.EXTERNAL_LINK.startsWith('http')
                ? `<div class="link-button-row">
                      <a href="${item.EXTERNAL_LINK}" target="_blank" class="link-button" style="
                          display: inline-flex;
                          padding: 4px 10px;
                          border-radius: 6px;
                          background-color: var(--info);
                          color: #fff;
                          font-size: 11px;
                          font-weight: 600;
                          transition: background-color 0.2s, transform 0.2s;
                      ">
                          🔗 View Source
                      </a>
                    </div>`
                : '';

            if (item.SEGMENT_ID === 'METADATA') return;
            
            // Added pulse-title class placeholder to trigger the animation from JS
            html += `
                <li class="insight-item" style="display: flex; align-items: flex-start;">
                    <span class="insight-icon ${iconClass}" style="font-size: 1.4em; margin-right: 12px; flex-shrink: 0;">${item.ICON}</span>
                    <div class="insight-content" style="flex-grow: 1;">
                        <strong class="pulse-title" style="display: block; font-size: 17px; letter-spacing: 0.01em;">${item.TITLE_TEXT}</strong>
                        <p class="detail-text" style="font-size: 13px; color: #333c53; margin: 6px 0 22px 0; line-height: 1.5;">
                            ${item.DETAIL_TEXT}
                        </p>
                        <div class="action-tip-highlight" style="padding: 12px 15px; border-radius: 12px; margin-top: 15px; margin-bottom: 18px; background: #93c5fd; color: #333c53;">
                            <span style="font-size: 0.9em; font-weight: 600;">
                                🎯 **Action:** ${item.ACTION_TIP}
                            </span>
                        </div>
                        ${linkButtonHtml}
                    </div>
                </li>
            `;
        });
        html += `</ul></div>`;
        return html;
    }


    // CORE FUNCTION: loadAndRenderCareerIntel - FETCHES DATA FROM SHEET
    async function loadAndRenderCareerIntel(category) {
        const container = elements.intelInsightsContainer;
        const sliderWrapper = elements.intelSliderWrapper;
        const GOOGLE_SHEET_API_URL = INTEL_URLS[category];

        // CRITICAL: Hide the category landing page and show the insights/loading container
        if (elements.intelCategoryLanding) elements.intelCategoryLanding.style.display = 'none';
        if (container) container.style.display = 'flex';
        
        // Update the page title to reflect the category being loaded
        const titleEl = document.getElementById("intelPageTitle");
        if (titleEl) titleEl.innerHTML = `🧠 Career Intel: ${category}`;
        
        // Stop any existing autoplay before loading new content
        stopAutoplay();

        // Show loading message inside the insights container
        if (sliderWrapper) sliderWrapper.innerHTML = '<div id="loadingMessage" style="flex: 0 0 100%; text-align: center; padding: 40px; color: var(--primary);">Fetching the latest market intelligence for ' + category + '...</div>';
        elements.intelUpdateMonth.textContent = '';
        
        // Reset slider state
        currentSegmentIndex = 0;
        totalSegments = 0;
        updateSliderButtons();
        
        // Scroll to top of the content area
        const appContent = document.getElementById("appContent");
        if (appContent) {
            appContent.scrollTo({ top: 0, behavior: "smooth" });
        }
        
        try {
            const response = await fetch(GOOGLE_SHEET_API_URL);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}. Check if sheet is published and URL is correct.`);
            }
            
            const text = await response.text();
            
            // --- CRITICAL FIX: Restored JSONP stripping logic for /gviz/tq endpoint ---
            let jsonString = text.replace('/*O_o*/\n', '').replace('google.visualization.Query.setResponse(', '').slice(0, -2);
            
            const data = JSON.parse(jsonString);
            const table = data.table;

            // Convert the data rows into an array of objects, mapping column index to key
            const rawData = table.rows.map(row => {
                const rowObject = {};
                row.c.forEach((cell, i) => {
                    const keyName = COLUMN_MAP[i];
                    rowObject[keyName] = cell ? (cell.v !== undefined ? cell.v : cell.f) : null;
                });
                return rowObject;
            }).filter(row => row.SEGMENT_ID && row.TITLE_TEXT);
            
            // --- CRITICAL FIX: Dynamic Render Order ---
            const insights = {};

            // 1. Group all retrieved data by SEGMENT_ID
            rawData.forEach(row => {
                const id = row.SEGMENT_ID;
                if (!insights[id]) {
                    insights[id] = [];
                }
                insights[id].push(row);
            });
            
            // 2. Create a dynamic render order from all unique segment IDs found in the data
            let dynamicRenderOrder = Object.keys(insights);
            
            // Filter out the METADATA row, if present
            dynamicRenderOrder = dynamicRenderOrder.filter(id => id !== 'METADATA');

            // Optional: Sort the segments alphabetically by title for a stable UI order
            dynamicRenderOrder.sort((a, b) => a.localeCompare(b));
            
            // --- End CRITICAL FIX ---
            
            if (insights.METADATA && insights.METADATA[0]) {
                elements.intelUpdateMonth.textContent = `(Source: ${insights.METADATA[0].TITLE_TEXT.split(' ')[1]} ${insights.METADATA[0].TITLE_TEXT.split(' ')[2]})`;
            }

            let finalHtml = '';
            
            // 3. Iterate over the DYNAMIC list to render every segment that was fetched
            dynamicRenderOrder.forEach(segmentId => {
                if (insights[segmentId] && insights[segmentId].length > 0) {
                    finalHtml += renderSegment(insights[segmentId], formatSegmentTitle(segmentId));
                }
            });

            // Inject all segments into the horizontal wrapper
            if (sliderWrapper) sliderWrapper.innerHTML = finalHtml;
            
            // Update total segment count and buttons
            totalSegments = dynamicRenderOrder.length;
            
            // Start autoplay after content is loaded
            if (totalSegments > 1) startAutoplay();
            updateSliderButtons();

            showToast(`Career Intel loaded successfully! ${category} insights fetched.`, "success");

        } catch (error) {
            console.error("Error loading Career Intel data:", error);
            // This is the error being displayed on the screen.
            if (sliderWrapper) sliderWrapper.innerHTML = `<div class="error-message" style="flex: 0 0 100%; color: var(--danger); text-align: center; padding: 20px;">❌ Failed to load external data for ${category}. Ensure the Sheet is publicly shared and the ID is correct. Error: ${error.message}</div>`;
            totalSegments = 0;
            updateSliderButtons();
            showToast("Failed to load Career Intel data.", "error");
        }
    }


    // ------------------------------------
    // --- MAIN EXECUTION LOGIC (REMAINS THE SAME) ---
    // ------------------------------------


    function switchPage(pageId, skipScroll = false) {
        // 2. Hide all content pages
        if (elements.myJobsPage) elements.myJobsPage.style.display = "none";
        if (elements.addJobPage) elements.addJobPage.style.display = "none";
        if (elements.atsOptimizerPage) elements.atsOptimizerPage.style.display = "none";
        if (elements.offerComparePage) elements.offerComparePage.style.display = "none";
        if (elements.analyticsPage) elements.analyticsPage.style.display = "none";
        if (elements.infoPage) elements.infoPage.style.display = "none";
        if (elements.careerIntelPage) elements.careerIntelPage.style.display = "none";

        // 3. Update active state of nav buttons
        if (elements.navMyJobs) elements.navMyJobs.classList.remove("active");
        if (elements.navAddJob) elements.navAddJob.classList.remove("active");
        if (elements.navAtsOptimizer) elements.navAtsOptimizer.classList.remove("active");
        if (elements.navOfferCompare) elements.navOfferCompare.classList.remove("active");
        if (elements.navAnalytics) elements.navAnalytics.classList.remove("active");
        if (elements.navInfo) elements.navInfo.classList.remove("active");
        if (elements.navCareerIntel) elements.navCareerIntel.classList.remove("active");

        currentPage = pageId;
        chrome.storage.local.set({ jobsnapLastPage: pageId });

        const isAddJobPage = pageId === "addJob";
        // CRITICAL UPDATE: AutoFill is mostly useful on the Add Job page for quick data extraction
        if (elements.autoFillBtn) {
            elements.autoFillBtn.style.display = isAddJobPage || pageId === "atsOptimizer" ? "flex" : "none";
        }
        
        // CRITICAL FIX: Get Link button is only shown on the Add Job page
        if (elements.getLinkBtn) {
            // Only visible on Add Job Page. Not needed on ATS Optimizer Page.
            elements.getLinkBtn.style.display = isAddJobPage ? "flex" : "none";
        }


        chrome.storage.local.get("jobsnapTrialEnd", (result) => {
            const trialEnd = result.jobsnapTrialEnd;
            const isTrialActive = trialEnd && Date.now() < trialEnd;

            if (elements.freeTrialMessageMyJobs) elements.freeTrialMessageMyJobs.style.display = isTrialActive ? "block" : "none";
            if (elements.freeTrialMessageAddJob) elements.freeTrialMessageAddJob.style.display = isTrialActive ? "block" : "none";

            const trialBtns = [elements.backToLicenseBtn, elements.payUnlockTrialBtnDashboard,
                elements.backToLicenseBtnAddJob, elements.payUnlockTrialBtnDashboardAddJob
            ];
            trialBtns.forEach(btn => btn && (btn.style.display = isTrialActive ? 'flex' : 'none'));
        });


        if (pageId === "myJobs") {
            if (elements.navMyJobs) elements.navMyJobs.classList.add("active");
            if (elements.myJobsPage) elements.myJobsPage.style.display = "block";
            renderJobs();
            const allJobs = jobs.length || 0;
            if (elements.emptyStateCta) elements.emptyStateCta.style.display = allJobs === 0 ? "block" : "none";

        } else if (pageId === "addJob") {
            if (elements.navAddJob) elements.navAddJob.classList.add("active");
            if (elements.addJobPage) elements.addJobPage.style.display = "block";
            startPlaceholderRotation();
            
        } else if (pageId === "atsOptimizer") { // <--- NEW PAGE LOGIC
            if (elements.navAtsOptimizer) elements.navAtsOptimizer.classList.add("active");
            if (elements.atsOptimizerPage) elements.atsOptimizerPage.style.display = "block";
            // Clear previous report when entering the page
            if (elements.aiOptimizationOutputCard) elements.aiOptimizationOutputCard.innerHTML = '';
            
            // Set initial state: show input form, hide report page
            if (elements.atsInputPage) elements.atsInputPage.style.display = 'block';
            if (elements.atsReportPage) elements.atsReportPage.style.display = 'none';

        } else if (pageId === "offerCompare") {
            if (elements.navOfferCompare) elements.navOfferCompare.classList.add("active");
            if (elements.offerComparePage) elements.offerComparePage.style.display = "block";
            elements.payUnlockOfferPage && elements.payUnlockOfferPage.addEventListener("click", () => {
                showToast("Payment options will be updated soon!", "info");
            });

        } else if (pageId === "analytics") {
            if (elements.navAnalytics) elements.navAnalytics.classList.add("active");
            if (elements.analyticsPage) elements.analyticsPage.style.display = "block";
            renderAnalyticsPage();
            
        } else if (pageId === "careerIntel") { // --- UPDATED PAGE ROUTE ---
            if (elements.navCareerIntel) elements.navCareerIntel.classList.add("active");
            if (elements.careerIntelPage) elements.careerIntelPage.style.display = "block";

            // CRITICAL CHANGE: Show the landing page with buttons, hide the insights container
            if (elements.intelCategoryLanding) elements.intelCategoryLanding.style.display = 'flex';
            if (elements.intelInsightsContainer) elements.intelInsightsContainer.style.display = 'none';
            
        } else if (pageId === "info") {
            if (elements.navInfo) elements.navInfo.classList.add("active");
            if (elements.infoPage) elements.infoPage.style.display = "block";
            setupFaqAccordion();
        }

        if (!skipScroll) {
            const appContent = document.getElementById("appContent");
            if (appContent) {
                appContent.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            } else {
                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            }
        }
    }

    // ... (rest of the code including listeners and utility functions)
    
    // --- ATTACH LISTENERS (CRITICALLY RE-ADDED) ---

    // --- AI Button Listeners (CRITICAL FIX) ---
    if (elements.aiOptimizeBtn) elements.aiOptimizeBtn.addEventListener("click", () => {
        // Call the AI logic directly
        aiOptimizeResume();
    });

    // Close AI Modal via Overlay (REMOVED: Only check other modals)
    if (elements.modalOverlay) elements.modalOverlay.addEventListener('click', () => {
        // Handle deletion modal overlay click
        elements.deleteOptionsModal.style.display = 'none';
        
        // Handle Tasks modal overlay click
        if (elements.tasksModalOverlay && elements.tasksModalOverlay.style.display === 'block') {
            closeTasksModal();
        }
        
        // Handle Offer modal overlay click
        if (elements.offerModalOverlay && elements.offerModalOverlay.style.display === 'block') {
            closeOfferModal();
        }
        
        elements.modalOverlay.style.display = 'none';
    });

    // NEW: Close AI Loading Modal via Overlay
    if (elements.aiLoadingModalOverlay) elements.aiLoadingModalOverlay.addEventListener('click', () => {
        // This closes the loading modal if clicked outside
        // Prevent accidental closing of the loading modal by requiring a deliberate action (like a close button, not implemented here)
        // For now, we only allow it to close when the AI process finishes or errors.
        // toggleAiLoadingModal(false); 
    });

    // --- END AI Button Listeners ---

    if (elements.navMyJobs) elements.navMyJobs.addEventListener("click", () => switchPage("myJobs"));
    if (elements.navAddJob) elements.navAddJob.addEventListener("click", () => {
        editingIndex = null;
        if (elements.form) elements.form.reset();
        if (elements.saveBtn) elements.saveBtn.innerHTML = "💾 Save Job";
        const banner = document.querySelector(".editing-banner");
        if (banner) banner.remove();
        switchPage("addJob");
    });

    // --- NEW ATS OPTIMIZER LISTENER ---
    if (elements.navAtsOptimizer) elements.navAtsOptimizer.addEventListener("click", () => switchPage("atsOptimizer"));

    // CRITICAL FIX: Add listeners for Offer Page buttons to open the modal
    if (elements.startComparisonBtn) elements.startComparisonBtn.addEventListener("click", () => openOfferModal("Offer Matrix"));
    if (elements.calculateSalaryBtn) elements.calculateSalaryBtn.addEventListener("click", () => openOfferModal("Relocation Calculator"));
    if (elements.generateScriptBtn) elements.generateScriptBtn.addEventListener("click", () => openOfferModal("Negotiation Script"));
    if (elements.closeOfferModal) elements.closeOfferModal.addEventListener('click', closeOfferModal);
    if (elements.offerModalOverlay) elements.offerModalOverlay.addEventListener('click', closeOfferModal);
    // End Offer Page Listeners

    if (elements.navOfferCompare) elements.navOfferCompare.addEventListener("click", () => switchPage("offerCompare"));
    if (elements.navAnalytics) elements.navAnalytics.addEventListener("click", () => switchPage("analytics"));

    // --- UPDATED: Career Intel Listener to load landing page ---
    if (elements.navCareerIntel) elements.navCareerIntel.addEventListener("click", () => {
        switchPage("careerIntel");
        // Update the page title to the default state
        document.getElementById("intelPageTitle").innerHTML = '🧠 Career Intel';
    });
    // --- END UPDATED LISTENER ---

    // --- NEW: Career Intel Category Button Listeners (Now on content page) ---
    document.querySelectorAll('#intelCategoryLanding .intel-category-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const category = e.currentTarget.dataset.category;
            
            // 1. Load the specific content for this category (which handles showing/hiding landing/insights)
            loadAndRenderCareerIntel(category);
            
            // 2. Set the parent sidebar button as actively selected
            elements.navCareerIntel.classList.add("active");
            
            // 3. Optional: Scroll to top of content area
            const appContent = document.getElementById("appContent");
            if (appContent) {
                appContent.scrollTo({ top: 0, behavior: "smooth" });
            }
        });
    });
    // --- END NEW LISTENERS ---

    // --- NEW: Slider Navigation Listeners ---
    if (elements.intelPrevBtn) elements.intelPrevBtn.addEventListener('click', () => {
        if (autoplayInterval) clearInterval(autoplayInterval);
        navigateSlider(-1);
        startAutoplay(); // Restart timer after manual click
    });
    if (elements.intelNextBtn) elements.intelNextBtn.addEventListener('click', () => {
        if (autoplayInterval) clearInterval(autoplayInterval);
        navigateSlider(1);
        startAutoplay(); // Restart timer after manual click
    });

    // --- NEW: Autoplay Pause/Resume Listeners on the main container ---
    if (elements.intelInsightsContainer) {
        // CRITICAL FIX: Pauses autoplay when mouse is over the ENTIRE card/button area
        elements.intelInsightsContainer.addEventListener('mouseenter', () => { if (autoplayInterval) clearInterval(autoplayInterval); });
        elements.intelInsightsContainer.addEventListener('mouseleave', startAutoplay);
    }
    // --- END NEW LISTENers ---

    if (elements.navInfo) elements.navInfo.addEventListener("click", () => switchPage("info"));
    if (elements.goToAddJobBtn) elements.goToAddJobBtn.addEventListener("click", () => switchPage("addJob"));
    // RE-ADDED LISTENER (CRITICAL)
    if (elements.saveBtn) elements.saveBtn.addEventListener("click", saveCurrentJob);

    if (elements.searchInput) elements.searchInput.addEventListener("input", debounce(renderJobs, 300));
    if (elements.toggleBtn) elements.toggleBtn.addEventListener("click", toggleTheme);
    if (elements.autoFillBtn) elements.autoFillBtn.addEventListener("click", autoFillFromTab);
    if (elements.list) elements.list.addEventListener("click", handleListActions);

    // CRITICAL: Ensure appContent exists before attaching scroll listener
    const appContent = document.getElementById("appContent");
    if (appContent) {
        appContent.addEventListener("scroll", debounce(detectVisibleStatusOnScroll, 100));
    }

    if (elements.exportCSVBtn) elements.exportCSVBtn.addEventListener("click", exportToCSV);
    if (elements.deletePopupBtn) elements.deletePopupBtn.addEventListener("click", () => {
        elements.deleteOptionsModal.style.display = 'flex';
        elements.modalOverlay.style.display = 'block';
    });
    if (elements.closeDeleteModal) elements.closeDeleteModal.addEventListener("click", () => {
        elements.deleteOptionsModal.style.display = 'none';
        elements.modalOverlay.style.display = 'none';
    });
    if (elements.modalOverlay) elements.modalOverlay.addEventListener('click', () => {
        // Handle deletion modal overlay click
        elements.deleteOptionsModal.style.display = 'none';
        
        // Handle Tasks modal overlay click
        if (elements.tasksModalOverlay && elements.tasksModalOverlay.style.display === 'block') {
            closeTasksModal();
        }
        
        // Handle Offer modal overlay click
        if (elements.offerModalOverlay && elements.offerModalOverlay.style.display === 'block') {
            closeOfferModal();
        }
        
        elements.modalOverlay.style.display = 'none';
    });

    // CRITICAL: Add clear form listener
    if (elements.clearFormBtn) elements.clearFormBtn.addEventListener("click", (e) => {
        e.preventDefault();
        elements.form.reset();
        editingIndex = null;
        if (elements.saveBtn) elements.saveBtn.innerHTML = "💾 Save Job";
        const banner = document.querySelector(".editing-banner");
        if (banner) banner.remove();
        chrome.storage.local.remove("tempJobForm");
        showToast("Form cleared!", "info");
    });

    document.querySelectorAll(".delete-modal-option").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const statusToDelete = e.target.getAttribute("data-status");
            let confirmationMessage = '';
            if (statusToDelete === 'ALL') {
                confirmationMessage = `Are you sure you want to permanently delete ALL ${jobs.length} jobs? This action cannot be undone.`;
            } else {
                confirmationMessage = `Are you sure you want to permanently delete ALL jobs with status: ${statusToDelete}? This action cannot be undone.`;
            }

            if (confirm(confirmationMessage)) {
                if (statusToDelete === 'ALL') {
                    jobs = [];
                    chrome.alarms.clearAll();
                    saveJobsToLocal(`All jobs have been permanently deleted.`);
                } else {
                    jobs = jobs.filter(job => job.status !== statusToDelete);
                    saveJobsToLocal(`All jobs with status "${statusToDelete}" deleted.`);
                }
                elements.deleteOptionsModal.style.display = 'none';
                elements.modalOverlay.style.display = 'none';
            }
        });
    });
    if (elements.dashboard) elements.dashboard.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-status]");
        if (btn) {
            const status = btn.getAttribute("data-status");
            isManualDashboardClick = true;
            if (status === "Total" || status === "ALL_APPLIED") {
                dashboardFilter = status === "Total" ? null : status;
                const appContent = document.getElementById("appContent");
                if (appContent) appContent.scrollTop = 0;
            } else {
                dashboardFilter = status;
                const section = document.getElementById(`section-${status.replace(/\s/g, "-").toLowerCase()}`);
                if (section) {
                    const appContent = document.getElementById("appContent");
                    if (appContent) {
                        const headerOffset = document.querySelector(".header-inline")?.offsetHeight || 0;
                        const scrollPosition = section.offsetTop - headerOffset;
                        appContent.scrollTo({
                            top: scrollPosition,
                            behavior: "smooth"
                        });
                    }
                }
            }
            renderJobs();
            setTimeout(() => {
                isManualDashboardClick = false;
            }, 400);
        }
    });

    // --- RESTORED CORE FUNCTIONS ---

    function setupExpandButton() {
        const expandIcon = `<svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
            <path fill="currentColor" d="M4 12v4h4v2H4a2 2 0 0 1-2-2v-4h2zm14-8a2 2 0 0 0-2-2h-4v2h4v4h2V4zM16 12v4h-4v2h4a2 2 0 0 0 2-2v-4h-2zM8 2H4a2 2 0 0 0-2 2v4h2V4h4V2z"/>
          </svg>`;
        const minimizeIcon = `<svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
            <rect x="4" y="8" width="12" height="4" fill="currentColor" rx="1" />
          </svg>`;
        const expandBtn = document.getElementById('expandBtn');
        if (expandBtn) {
            expandBtn.innerHTML = expandIcon;
            expandBtn.addEventListener('click', (e) => {
                e.preventDefault();
                toggleFullscreen();
            });
            document.addEventListener('fullscreenchange', () => {
                if (document.fullscreenElement) {
                    expandBtn.innerHTML = minimizeIcon;
                } else {
                    expandBtn.innerHTML = expandIcon;
                }
            });
        }
    }
    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error("Fullscreen error:", err);
            });
        } else {
            document.exitFullscreen();
        }
    }
    function calculateMatrixScore() {
        // Mock function for demo purposes
        const offer1Salary = parseInt(document.getElementById('offerSalary1')?.value) || 0;
        const mockLifestyleWeight = 4;
        const mockScore = Math.round((offer1Salary * 0.7) + (mockLifestyleWeight * 5));
        return mockScore > 0 ? mockScore : 90;
    }
    function renderOfferToolContent(toolType) {
        let title = "Offer Tool";
        let contentHtml = "";

        if (toolType === "Offer Matrix") {
            title = "📊 Multi-Offer Evaluation Matrix";
            contentHtml = `
                <p class="tool-intro">Enter compensation and non-monetary ratings for up to 3 offers. The tool calculates a weighted score based on your priorities.</p>
                <div class="form-group" style="display: flex; gap: 10px;">
                    <input type="text" placeholder="Offer 1 Title (e.g., Google SWE)" id="offerTitle1" />
                    <input type="number" placeholder="Base Salary (K)" id="offerSalary1" />
                </div>
                <div style="margin-top: 15px;">
                    <h4 style="font-size: 14px; margin-bottom: 5px;">Personal Priority Weights (1-5):</h4>
                    <label>Growth Potential (3): <input type="range" min="1" max="5" value="3" /></label><br/>
                    <label>Work-Life Balance (4): <input type="range" min="1" max="5" value="4" /></label>
                </div>
                <button class="primary calc-button" data-tool="matrix" style="margin-top: 20px; background-color: var(--primary);">Calculate Weighted Score</button>
                <div id="offerMatrixResult" style="margin-top: 15px; padding: 10px; border: 1px dashed var(--border-light);">
                    <strong>Result:</strong> Offer 1 Score: <strong>Awaiting Data...</strong>
                </div>
            `;
        }
        
        else if (toolType === "Relocation Calculator") {
            title = "🚚 Relocation & Real Salary Calculator";
            contentHtml = `
                <p class="tool-intro">Find the equivalent salary needed in a new city to maintain your current standard of living.</p>
                <div class="form-group">
                    <label>Current Location & Salary (e.g., Austin, $75,000)</label>
                    <input type="text" placeholder="Your City, State" id="currentCity" />
                    <input type="number" placeholder="Current Base Salary" id="currentSalary" style="margin-top: 8px;" />
                </div>
                <div class="form-group">
                    <label>New Job Location (e.g., San Francisco, CA)</label>
                    <input type="text" placeholder="New City, State" id="newCity" />
                </div>
                <button class="primary calc-button" data-tool="relocation" style="margin-top: 10px; background-color: #14b8a6;">Calculate Equivalent Salary</button>
                <div id="relocationResult" style="margin-top: 15px; padding: 10px; border: 1px dashed var(--border-light);">
                    <strong>Result:</strong> Equivalent Salary Needed: $XX,XXX
                </div>
            `;
        }
        
        else if (toolType === "Negotiation Script") {
            title = "💬 Negotiation Script Generator";
            contentHtml = `
                <p class="tool-intro">Generate a professional, data-backed email for your negotiation scenario.</p>
                <div class="form-group">
                    <label>Scenario / Target Ask:</label>
                    <select id="negotiationScenario">
                        <option>Request Higher Base Salary</option>
                        <option>Request Higher Signing Bonus</option>
                        <option>Leverage Competing Offer</option>
                        <option>Ask for Better Vacation/WLB</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="recruiterName">Recruiter Name:</label>
                    <input type="text" id="recruiterName" autocomplete="off" placeholder="e.g., John Smith" />
                </div>
                <button class="primary calc-button" data-tool="script" style="margin-top: 10px; background-color: #8b5cf6;">Generate Email Draft</button>
                <div id="scriptResult" style="margin-top: 15px; padding: 10px; border: 1px solid #ccc; background: var(--hover-light); max-height: 200px; overflow-y: auto;">
                    <strong>Generated Script:</strong>
                    <pre style="white-space: pre-wrap; font-size: 12px; margin: 5px 0;">
Dear [Recruiter Name],

Thank you for the kind offer. I'm very excited about the [Role] at [Company].

Regarding compensation, I was hoping for a base salary closer to [Negotiation Ask] based on my market research and experience. I believe this aligns more closely with the value I will bring to the team.

I am eager to accept and look forward to your response.
</pre>
                </div>
            `;
        }

        if (elements.offerModalTitle) elements.offerModalTitle.textContent = title;
        if (elements.offerModalContent) elements.offerModalContent.innerHTML = contentHtml;
        if (elements.offerModalOverlay) elements.offerModalOverlay.style.display = 'block';
        if (elements.offerModal) elements.offerModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        const calcBtn = elements.offerModalContent.querySelector('button.primary');
        if (calcBtn) {
            calcBtn.addEventListener('click', () => {
                const tool = calcBtn.getAttribute('data-tool');
                if (tool === 'matrix') {
                    const score = calculateMatrixScore();
                    const resultDiv = document.getElementById('offerMatrixResult');
                    if (resultDiv) {
                        resultDiv.innerHTML = `<strong>Result:</strong> Offer 1 Score: <span style="color: var(--primary); font-size: 1.2em;">${score} points</span>`;
                    }
                    showToast('Matrix score calculated!', 'success');
                } else if (tool === 'relocation') {
                    const resultDiv = document.getElementById('relocationResult');
                    if (resultDiv) {
                        const currentSalary = parseInt(document.getElementById('currentSalary')?.value) || 75000;
                        const equivalentSalary = Math.round(currentSalary * 1.4); // Mock calculation
                        resultDiv.innerHTML = `<strong>Result:</strong> Equivalent Salary Needed: <span style="color: #14b8a6; font-size: 1.2em;">$${equivalentSalary.toLocaleString()}</span>`;
                    }
                    showToast('Relocation equivalent calculated!', 'success');
                } else if (tool === 'script') {
                    showToast('Script drafted and displayed!', 'success');
                }
            });
        }
    }
    function openOfferModal(toolType) {
        chrome.storage.local.get("jobsnapPremium", (result) => {
            const isPremium = result.jobsnapPremium || (result.jobsnapTrialEnd && Date.now() < result.jobsnapTrialEnd);
            
            if (isPremium) {
                renderOfferToolContent(toolType);
            } else {
                showToast(`🔒 ${toolType} is a premium feature. Please unlock!`, "error");
            }
        });
    }
    function closeOfferModal() {
        if (elements.offerModalOverlay) elements.offerModalOverlay.style.display = 'none';
        if (elements.offerModal) elements.offerModal.style.display = 'none';
        document.body.style.overflow = '';
    }
    
    // --- END RESTORED CORE FUNCTIONS ---

    let autosaveTimeout;
    function saveFormState() {
        // CRITICAL UPDATE: Ensure ALL relevant fields are captured, including ATS form fields.
        const currentFormState = {
            company: formFields.company ? formFields.company.value : '',
            title: formFields.title ? formFields.title.value : '',
            rating: formFields.rating ? formFields.rating.value : '0',
            platform: formFields.platform ? formFields.platform.value : '',
            dateApplied: formFields.dateApplied ? formFields.dateApplied.value : '',
            deadline: formFields.deadline ? formFields.deadline.value : '',
            interviewDate: formFields.interviewDate ? formFields.interviewDate.value : '',
            status: formFields.status ? formFields.status.value : 'Not Applied',
            jobLink: formFields.jobLink ? (isValidUrl(formFields.jobLink.value) ? sanitizeUrl(formFields.jobLink.value) : formFields.jobLink.value.trim()) : "",
            recruiterInfo: formFields.recruiterInfo ? sanitizeInput(formFields.recruiterInfo.value) : "",
            
            // The notes field (which might contain JD) is now only on the ATS Optimizer page, but accessible here.
            notes: formFields.notes ? sanitizeInput(formFields.notes.value) : "",
            
            workType: formFields.workType ? formFields.workType.value : "",
            
            // 🟢 FIX: Explicitly include the AI/ATS fields here:
            aiJobTitle: formFields.aiJobTitle ? formFields.aiJobTitle.value : '',
        };
        try {
            chrome.storage.local.set({
                tempJobForm: currentFormState
            });
        } catch(e) {
            console.error("Error saving form state:", e);
        }
    }
    function handleFormChange() {
        clearTimeout(autosaveTimeout);
        autosaveTimeout = setTimeout(saveFormState, 500);
    }
    if (elements.form) {
        elements.form.addEventListener("input", handleFormChange);
    }

    // 🟢 FIX: Attach change listeners to the ATS Optimizer fields manually
    if (formFields.aiJobTitle) {
        formFields.aiJobTitle.addEventListener("input", handleFormChange);
    }
    if (formFields.notes) {
        formFields.notes.addEventListener("input", handleFormChange);
    }
    // END FIX 🟢

    try {
        chrome.storage.local.get("tempJobForm", (result) => {
            if (result.tempJobForm) {
                Object.keys(formFields).forEach((key) => {
                    // CRITICAL: Only autofill the fields that exist on the ADD JOB form
                    // FIX: Removed the exclusion for 'notes' and 'aiJobTitle' from here, allowing them to load via the generic loop.
                    if (result.tempJobForm[key] !== undefined && formFields[key]) {
                        formFields[key].value = result.tempJobForm[key];
                    }
                });
            }
        });
    } catch(e) {
        console.error("Error loading form state:", e);
    }

    async function getLinkFromTab() {
        if (elements.getLinkBtn) {
            elements.getLinkBtn.disabled = true;
            const originalText = elements.getLinkBtn.innerHTML;
            elements.getLinkBtn.innerHTML = `<span class="small-spinner"></span>`;
        }

        try {
            const [tab] = await chrome.tabs.query({
                active: true,
                currentWindow: true
            });
            if (tab && tab.url && tab.url.startsWith('http')) {
                if (formFields.jobLink) formFields.jobLink.value = tab.url;
                showToast("Link extracted successfully!", "success");
            } else {
                showToast("⚠ Could not get a valid URL. Ensure you're on a job page.", "error");
            }
        } catch (error) {
            console.error("Error getting tab URL:", error);
            showToast("❌ Error accessing current tab.", "error");
        }

        await new Promise((resolve) => setTimeout(resolve, 300));
        if (elements.getLinkBtn) {
            elements.getLinkBtn.disabled = false;
            elements.getLinkBtn.innerHTML = `🔗`; // Restored icon
        }
    }
    if (elements.getLinkBtn) elements.getLinkBtn.addEventListener("click", getLinkFromTab);
    let ballAnimationInterval;
    function startBallAnimation() {
        clearInterval(ballAnimationInterval);
        ballAnimationInterval = setInterval(() => {
            document.querySelectorAll('.bounce-o, .bounce-ball').forEach(ball => {
                ball.classList.remove("do-bounce");
                void ball.offsetWidth;
                ball.classList.add("do-bounce");
            });
        }, 3000);
    }
    function showLicensePage() {
        if (elements.licensePage) elements.licensePage.style.display = "block";
        if (elements.mainDashboardSection) elements.mainDashboardSection.style.display = "none";
        if (elements.payUnlockTrialBtnDashboard) elements.payUnlockTrialBtnDashboard.style.display = 'none';
        if (elements.payUnlockTrialBtnDashboardAddJob) elements.payUnlockTrialBtnDashboardAddJob.style.display = 'none';
        if (elements.freeTrialMessageMyJobs) elements.freeTrialMessageMyJobs.style.display = "none";
        if (elements.freeTrialMessageAddJob) elements.freeTrialMessageAddJob.style.display = "none";
        if (elements.autoFillBtn) elements.autoFillBtn.style.display = "none";
        if (elements.getLinkBtn) elements.getLinkBtn.style.display = "none";
        if (trialCountdownInterval) clearInterval(trialCountdownInterval);
        startBallAnimation();
        const backBtn = document.getElementById("backToLicenseBtn");
        const backBtnAddJob = document.getElementById("backToLicenseBtnAddJob");
        if (backBtn) backBtn.style.display = 'none';
        if (backBtnAddJob) backBtnAddJob.style.display = 'none';
        
        // The width is now controlled entirely by popup.css for hover state.
    }
    const companyPlaceholders = [
        "Google", "Infosys", "Microsoft", "TCS", "Amazon",
        "Wipro", "HCL Tech", "Meta", "Apple", "Netflix"
    ];
    const titlePlaceholders = [
        "Software Engineer", "Digital Marketer", "Product Manager", "UX Designer", "Data Analyst",
        "Frontend Developer", "Recruiter", "Cloud Architect", "Financial Planner", "HR Specialist"
    ];
    const platformPlaceholders = [
        "LinkedIn", "Indeed", "Internshala", "Naukri", "Glassdoor",
        "Monster", "AngelList", "Remote.co", "SimplyHired", "Company Careers Page"
    ];
    let placeholderInterval;
    function startPlaceholderRotation() {
        let companyIndex = 0;
        let titleIndex = 0;
        let platformIndex = 0;
        clearInterval(placeholderInterval);
        if (formFields.company) formFields.company.placeholder = `e.g. ${companyPlaceholders[companyIndex]}`;
        if (formFields.title) formFields.title.placeholder = `e.g. ${titlePlaceholders[titleIndex]}`;
        if (formFields.platform) formFields.platform.placeholder = `e.g. ${platformPlaceholders[platformIndex]}`;

        placeholderInterval = setInterval(() => {
            companyIndex = (companyIndex + 1) % companyPlaceholders.length;
            if (formFields.company) formFields.company.placeholder = `e.g. ${companyPlaceholders[companyIndex]}`;
            titleIndex = (titleIndex + 1) % titlePlaceholders.length;
            if (formFields.title) formFields.title.placeholder = `e.g. ${titlePlaceholders[titleIndex]}`;
            platformIndex = (platformIndex + 1) % platformPlaceholders.length;
            if (formFields.platform) formFields.platform.placeholder = `e.g. ${platformPlaceholders[platformIndex]}`;
        }, 3000);
    }
    function showMainDashboard(isTrial = false, startPage = "myJobs") {
        if (elements.licensePage) elements.licensePage.style.display = "none";
        if (elements.mainDashboardSection) elements.mainDashboardSection.style.display = "flex";
        const trialMessageMyJobs = document.getElementById("freeTrialMessageMyJobs");
        const trialMessageAddJob = document.getElementById("freeTrialMessageAddJob");
        if (trialMessageMyJobs) trialMessageMyJobs.style.display = isTrial ? "block" : "none";
        if (trialMessageAddJob) elements.freeTrialMessageAddJob.style.display = isTrial ? "block" : "none";
        if (quoteInterval) clearInterval(quoteInterval); // Prevent duplicate rotation
        startQuoteRotation();
        startBallAnimation();
        startPlaceholderRotation();
        if (isTrial) addBackToLicenseBtn();
        setupExpandButton();
        switchPage(startPage, true);
    }
    function addBackToLicenseBtn() {
        const backBtn = document.getElementById("backToLicenseBtn");
        const backBtnAddJob = document.getElementById("backToLicenseBtnAddJob");
        if (backBtn) backBtn.style.display = 'flex';
        if (backBtnAddJob) backBtnAddJob.style.display = 'flex';
        const payBtn = document.getElementById("payUnlockTrialBtnDashboard");
        const payBtnAddJob = document.getElementById("payUnlockTrialBtnDashboardAddJob");
        if (payBtn) payBtn.style.display = 'flex';
        if (payBtnAddJob) payBtnAddJob.style.display = 'flex';
    }
    let trialExpiryInterval;
    let trialCountdownInterval;
    let quoteInterval;
    const quotes = [
        "The secret of getting ahead is getting started. - Mark Twain",
        "Success is the sum of small efforts, repeated day in and day out. - Robert Collier",
        "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
        "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
        "The only way to do great work is to love what you do. - Steve Jobs",
        "Believe you can and you're halfway there. - Theodore Roosevelt",
        "Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do what you believe is great work. - Steve Jobs",
        "Opportunities don't happen, you create them. - Chris Grosser",
        "The only limit to our realization of tomorrow will be our doubts of today. - Franklin D. Roosevelt"
    ];
    function startQuoteRotation() {
        if (!elements.motivationLine) return;
        if (quoteInterval) clearInterval(quoteInterval);
        let idx = 0;
        updateQuote(idx);
        quoteInterval = setInterval(() => {
            idx = (idx + 1) % quotes.length;
            updateQuote(idx);
        }, 6000);
    }
    function updateQuote(index) {
        const motivation = elements.motivationLine;
        if (!motivation) return;
        motivation.innerHTML = `<div style="font-style: italic;">${quotes[index]}</div>`;
        motivation.dataset.quoteIndex = index;
    }
    function startTrialExpiryChecker(trialEnd) {
        clearInterval(trialExpiryInterval);
        trialExpiryInterval = setInterval(() => {
            if (Date.now() >= trialEnd) {
                clearInterval(trialExpiryInterval);
                showLicensePage();
                showToast("Your trial has expired. Please subscribe to continue.", "error");
                sendNotificationToBackground("Trial Expired", "Your trial has expired. Please subscribe to continue.");
            }
        }, 30 * 1000);
    }
    function startTrialCountdown(trialEnd) {
        if (trialCountdownInterval) clearInterval(trialCountdownInterval);
        const countdownElem = document.getElementById("trialCountdown");
        if (!countdownElem) return;

        function updateCountdown() {
            const now = Date.now();
            const diff = trialEnd - now;
            if (diff <= 0) {
                if (trialCountdownInterval) clearInterval(trialCountdownInterval);
                countdownElem.textContent = "";
                if (elements.payUnlockTrialBtnDashboard) elements.payUnlockTrialBtnDashboard.style.display = 'none';
                if (elements.payUnlockTrialBtnDashboardAddJob) elements.payUnlockTrialBtnDashboardAddJob.style.display = 'none';
                return;
            }
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            let countdownStr = "";
            if (days > 0) countdownStr += `${days}d `;
            if (hours > 0 || days > 0) countdownStr += `${hours}h `;
            countdownStr += `${minutes}m ${seconds}s`;
            countdownElem.textContent = `⏳ Trial ends in: ${countdownStr}`;
        }
        updateCountdown();
        trialCountdownInterval = setInterval(updateCountdown, 1000);
        if (elements.payUnlockTrialBtnDashboard) elements.payUnlockTrialBtnDashboard.style.display = 'flex';
        if (elements.payUnlockTrialBtnDashboardAddJob) elements.payUnlockTrialBtnDashboardAddJob.style.display = 'flex';
    }
    function stopTrialCountdown() {
        if (trialCountdownInterval) {
            clearInterval(trialCountdownInterval);
            trialCountdownInterval = null;
        }
        const countdownElem = document.getElementById("trialCountdown");
        if (countdownElem) countdownElem.textContent = "";
    }
    async function loadJobsFromLocal(skipRender = false) {
        await loadLastWeekMetrics();
        
        return new Promise(resolve => {
            try {
                chrome.storage.local.get(["jobs"], (result) => {
                    jobs = result.jobs || [];
                    
                    if (skipRender) {
                        resolve();
                        return;
                    }
                    
                    if (currentPage === "analytics") {
                        renderAnalyticsPage();
                    } else {
                        renderJobs();
                    }

                    resolve();
                });
            } catch(e) {
                console.error("Error loading jobs from local storage:", e);
                resolve();
            }
        });
    }

    function showMainDashboard(isTrial = false, startPage = "myJobs") {
        if (elements.licensePage) elements.licensePage.style.display = "none";
        if (elements.mainDashboardSection) elements.mainDashboardSection.style.display = "flex";
        const trialMessageMyJobs = document.getElementById("freeTrialMessageMyJobs");
        const trialMessageAddJob = document.getElementById("freeTrialMessageAddJob");
        if (trialMessageMyJobs) trialMessageMyJobs.style.display = isTrial ? "block" : "none";
        if (trialMessageAddJob) elements.freeTrialMessageAddJob.style.display = isTrial ? "block" : "none";
        if (quoteInterval) clearInterval(quoteInterval); // Prevent duplicate rotation
        startQuoteRotation();
        startBallAnimation();
        startPlaceholderRotation();
        if (isTrial) addBackToLicenseBtn();
        setupExpandButton();
        switchPage(startPage, true);
    }

    function startTrialLogic() {
        chrome.storage.local.get(['jobsnapPremium', 'jobsnapTrialEnd', 'trialUsed'], (result) => {
            const now = Date.now();
            const prevTrialEnd = result.jobsnapTrialEnd ? Number(result.jobsnapTrialEnd) : null;

            if (result.trialUsed && prevTrialEnd && prevTrialEnd > now) {
                showMainDashboard(true);
                loadJobsFromLocal();
                showToast("Resuming your trial.", "info");
                sendNotificationToBackground("Trial Resumed", "Your trial is active.");
                startTrialExpiryChecker(prevTrialEnd);
                startTrialCountdown(prevTrialEnd);
                addBackToLicenseBtn();
                return;
            }

            if (result.trialUsed && prevTrialEnd && prevTrialEnd <= now) {
                showToast("Trial already used. Please subscribe.", "error");
                return;
            }

            const trialDuration = 14 * 24 * 60 * 60 * 1000;
            const trialEndTimestamp = now + trialDuration;

            chrome.storage.local.set({
                jobsnapPremium: true,
                jobsnapTrialEnd: trialEndTimestamp,
                trialUsed: true
            }, () => {
                showMainDashboard(true);
                loadJobsFromLocal();
                showToast("14-Days trial unlocked!", "success");
                sendNotificationToBackground("Trial Activated", "Your 14-days trial has begun.");
                startTrialExpiryChecker(trialEndTimestamp);
                startTrialCountdown(trialEndTimestamp);
                addBackToLicenseBtn();
            });
        });
    }

    // --- MAIN EXECUTION BLOCK ---
    try {
        chrome.storage.local.get(["jobsnapPremium", "jobsnapTrialEnd", "trialUsed", "jobsnapLastPage"], async function (result) {
            
            await loadJobsFromLocal(true);
            
            const isPremium = result.jobsnapPremium;
            const trialEnd = result.jobsnapTrialEnd;
            const isTrialActive = trialEnd && Date.now() < trialEnd;
            const lastPage = result.jobsnapLastPage || 'myJobs';
            
            const start10minBtn = elements.start10minBtn;
            const restoreTrialBtn = document.getElementById("restoreTrialBtn");
            
            if (!isPremium && isTrialActive) {
                if (start10minBtn) start10minBtn.innerHTML = "▶️ Resume Free Trial";
                if (restoreTrialBtn) restoreTrialBtn.innerHTML = "▶️ Resume Free Trial";
            }
            else if (start10minBtn) {
                start10minBtn.innerHTML = "⏱️ Start 14-Days Free Trial";
            }
            
            if (isPremium || isTrialActive) {
                showMainDashboard(isTrialActive, lastPage);
                
                if (lastPage === "analytics") {
                    renderAnalyticsPage();
                } else {
                    renderJobs();
                }

                if (isTrialActive) {
                    startTrialExpiryChecker(trialEnd);
                    startTrialCountdown(trialEnd);
                }
            } else {
                showLicensePage();
            }
        });
    } catch (e) {
        console.error("CRITICAL Startup Error in main chrome.storage block:", e);
        // Fallback to show license page in case of a crash
        showLicensePage();
    }
    // --- END MAIN EXECUTION BLOCK ---

    if (elements.verifyLicenseBtn && elements.licenseInput && elements.licenseError) {
        elements.verifyLicenseBtn.addEventListener("click", function () {
            const key = elements.licenseInput.value.trim();
            const validKeys = ["ABC", "F8R3Z-KT2VD", "JK5YQ-98LUN", "A1B9X-ZT4QP", "D4F2M-GH7JK", "L8N7V-PZRQ", "W0K5S-YNDU", "C5EZI-FTXV", "RHPVX-MZAX", "YZBFAB-GFQT", "QWEASD-XCVU", "FGHIJK-PLMN", "ZXCVBN-MQWE", "POIUYT-REWQ", "LKJHGF-DWES", "MJNBVC-XYZU", "TGBFDR-VJKL", "HNBCXZ-QRSE", "UYTREQ-ASDF", "PLMKOI-JHGF", "NBVCXZ-ASDF", "MKILOJ-UNBH", "ZAQWSX-EDCR", "VFRNYC-TGBH", "POKJNB-VFRE", "LKJHUG-YTRE", "MNBHYT-FRDC", "VBGHNJ-MKOI", "QWEASD-ZXCV", "RTYUKM-JHGF", "PLMNBV-EDCR", "XCVBNM-ASDF", "QWERTY-UIOP", "LKJHGF-DSAQ", "MNBGVF-REWS", "XCVBHN-JMKO", "QASZXE-DCRF", "VTGBYH-JMKO", "PLMOKN-IJHU", "ZAQXSW-CDER", "VTFGBY-NHJM", "OLKIUJ-MNHY", "QAZXSW-EDCR", "VTGBHN-MKOJ", "PLMOKN-JIHU", "ZAQXSW-CDER", "VTFGBY-NHJU", "OLKIUJ-MNHY", "QAZXSW-EDCR", "VTFGBHN-MKOJ", "PLMOKN-JIHU", "ZAQXSW-CDER", "VTFGBY-NHJU", "OLKIUJ-MNHB"];

            if (validKeys.includes(key)) {
                chrome.storage.local.set({
                    jobsnapPremium: true,
                    jobsnapTrialEnd: null,
                    trialUsed: true
                }, function () {
                    if (elements.licenseError) elements.licenseError.style.display = "none";
                    showMainDashboard(false);
                    loadJobsFromLocal();
                    showToast("License verified! Welcome to JobSnap Premium.", "success");
                    sendNotificationToBackground("License Verified", "Welcome to JobSnap Premium!");
                });
            } else {
                if (elements.licenseError) {
                    elements.licenseError.textContent = "Invalid license key. Please check and try again.";
                    elements.licenseError.style.display = "block";
                }
            }
        });
    }

    if (elements.newUserBtn) {
        elements.newUserBtn.addEventListener("click", function () {
            if (elements.premiumFeatures) {
                elements.premiumFeatures.style.display = "block";
                elements.premiumFeatures.scrollIntoView({
                    behavior: "smooth"
                });
            }
            if (elements.additionalButtons) elements.additionalButtons.style.display = "none";

            let restoreTrialBtn = document.getElementById("restoreTrialBtn");
            if (!restoreTrialBtn) {
                restoreTrialBtn = document.createElement("button");
                restoreTrialBtn.id = "restoreTrialBtn";
                restoreTrialBtn.className = "trial-btn";

                chrome.storage.local.get(['jobsnapPremium', 'jobsnapTrialEnd', 'trialUsed'], (result) => {
                    const trialEnd = result.jobsnapTrialEnd ? Number(result.jobsnapTrialEnd) : null;
                    const isTrialActive = trialEnd && Date.now() < trialEnd;
                    if (isTrialActive) {
                        restoreTrialBtn.innerHTML = "▶️ Resume Free Trial";
                    } else {
                        restoreTrialBtn.innerHTML = "⏱️ Start 14-Days Free Trial";
                    }
                });

                restoreTrialBtn.style.marginTop = "15px";
                restoreTrialBtn.onclick = () => {
                    startTrialLogic();
                };
                if (elements.premiumFeatures) elements.premiumFeatures.appendChild(restoreTrialBtn);
            } else {
                restoreTrialBtn.style.display = "block";
                restoreTrialBtn.onclick = () => {
                    startTrialLogic();
                };
            }
        });
    }

    if (elements.start10minBtn) {
        elements.start10minBtn.addEventListener("click", startTrialLogic);
    }

    function sendNotificationToBackground(title, message) {
        try {
            chrome.runtime.sendMessage({
                action: "showNotification",
                title: title,
                message: message
            });
        } catch(e) {
            console.warn("Could not send message to background script:", e);
        }
    }

    function saveJobsToLocal(successMsg = "Jobs saved locally!") {
        try {
            chrome.storage.local.set({
                jobs
            }, function () {
                renderJobs();
                if (currentPage === "analytics") renderAnalyticsPage();
                showToast(`✅ ${successMsg}`, "success");
                sendNotificationToBackground("Success", successMsg);
            });
        } catch(e) {
            console.error("Error saving jobs to local storage:", e);
            showToast(`❌ Failed to save jobs: ${e.message}`, "error");
        }
    }

    function exportToCSV() {
        if (jobs.length === 0) {
            showToast("No jobs to export.", "error");
            return;
        }

        const headers = ["ID", "Company", "Title", "Status", "Date Applied", "Deadline", "Interview Date", "Platform", "Job Link", "Recruiter Info", "Notes", "Work Type", "Rating", "Created At", "Last Updated"];
        
        const escapeCSV = (str) => {
            if (str === null || str === undefined) return "";
            let result = String(str).replace(/"/g, '""');
            if (result.includes(',') || result.includes('\n') || result.includes('"')) {
                result = `"${result}"`;
            }
            return result;
        };

        const rows = [headers.join(',')];

        jobs.forEach(job => {
            const row = [
                escapeCSV(job.id),
                escapeCSV(job.company),
                escapeCSV(job.title),
                escapeCSV(job.status),
                escapeCSV(job.dateApplied),
                escapeCSV(job.deadline),
                escapeCSV(job.interviewDate),
                escapeCSV(job.platform),
                escapeCSV(job.jobLink),
                escapeCSV(job.recruiterInfo),
                escapeCSV((job.notes || '').replace(/\n/g, ' ')),
                escapeCSV(job.workType),
                job.rating,
                job.createdAt,
                escapeCSV(job.lastUpdated) 
            ].join(',');
            rows.push(row);
        });

        const csvContent = rows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'JobSnap_Export_' + new Date().toISOString().slice(0, 10) + '.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        

        showToast("Exported all jobs to CSV!", "success");
        sendNotificationToBackground("Export Successful", "Job data exported to CSV file.");
    }

    function setupFaqAccordion() {
        document.querySelectorAll('.faq-item').forEach(faqItem => {
            const questionButton = faqItem.querySelector('.faq-question');
            const answer = faqItem.querySelector('.faq-answer');

            // CRITICAL: Remove old listeners to prevent duplication
            questionButton.removeEventListener('click', questionButton.clickHandler);
            
            questionButton.clickHandler = (e) => {
                e.preventDefault();
                document.querySelectorAll('.faq-answer').forEach(ans => {
                    if (ans !== answer) {
                        ans.style.display = 'none';
                        ans.previousElementSibling.classList.remove('active');
                    }
                });
                const isOpen = answer.style.display === 'block';
                answer.style.display = isOpen ? 'none' : 'block';
                questionButton.classList.toggle('active', !isOpen);
            };

            questionButton.addEventListener('click', questionButton.clickHandler);
        });
    }

    function openTasksModal(index) {
        currentJobIndexForTasks = index;
        const job = jobs[index];
        
        if (elements.tasksModalTitle) {
            elements.tasksModalTitle.textContent = `Tasks for: ${job.title} (${job.company})`;
        }
        
        if (elements.tasksModalOverlay) elements.tasksModalOverlay.style.display = 'block';
        if (elements.tasksModal) elements.tasksModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        renderTasks();
        elements.newTaskInput.focus();
    }

    function closeTasksModal() {
        if (elements.tasksModalOverlay) elements.tasksModalOverlay.style.display = 'none';
        if (elements.tasksModal) elements.tasksModal.style.display = 'none';
        document.body.style.overflow = '';
        currentJobIndexForTasks = null;
        elements.newTaskInput.value = '';
    }

    function renderTasks() {
        if (!elements.tasksList || currentJobIndexForTasks === null) return;
        
        const job = jobs[currentJobIndexForTasks];
        const tasks = job.tasks || [];
        elements.tasksList.innerHTML = '';

        if (tasks.length === 0) {
            elements.tasksList.innerHTML = `<div style="text-align: center; color: var(--text-light); padding: 20px;">No tasks added yet.</div>`;
            return;
        }

        tasks.forEach((task, taskIndex) => {
            const taskEl = document.createElement('div');
            taskEl.className = `task-item ${task.completed ? 'completed' : ''}`;
            taskEl.innerHTML = `
                <input type="checkbox" id="task-${taskIndex}" data-task-index="${taskIndex}" ${task.completed ? 'checked' : ''} />
                <span class="task-text">${escapeHtml(task.text)}</span>
            `;
            elements.tasksList.appendChild(taskEl);
        });

        elements.tasksList.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', toggleTaskCompletion);
        });
    }

    function toggleTaskCompletion(e) {
        const taskIndex = parseInt(e.target.dataset.taskIndex);
        if (currentJobIndexForTasks === null) return;

        const job = jobs[currentJobIndexForTasks];
        job.tasks[taskIndex].completed = e.target.checked;
        job.lastUpdated = new Date().toISOString();
        

        saveJobsToLocal("Task updated!");
        renderTasks();
        renderJobs();
    }

    if (elements.closeTasksModal) elements.closeTasksModal.addEventListener('click', closeTasksModal);
    if (elements.addTaskBtn) elements.addTaskBtn.addEventListener('click', addNewTask);
    if (elements.tasksModalOverlay) elements.tasksModalOverlay.addEventListener('click', closeTasksModal);

    if (elements.newTaskInput) elements.newTaskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addNewTask();
        }
    });

    function addNewTask() {
        const text = elements.newTaskInput.value.trim();
        if (!text || currentJobIndexForTasks === null) {
            showToast("Task cannot be empty.", "error");
            return;
        }
        const job = jobs[currentJobIndexForTasks];
        if (!job.tasks) job.tasks = [];
        job.tasks.push({
            text: text,
            completed: false
        });
        job.lastUpdated = new Date().toISOString();
        saveJobsToLocal("New task added!");
        elements.newTaskInput.value = '';
        renderTasks();
        renderJobs();
    }


    function detectVisibleStatusOnScroll(e) {
        if (isManualDashboardClick) return;
        const listContainer = e.target;
        const listRect = listContainer.getBoundingClientRect();
        if (!listRect) return;
        const sections = Array.from(elements.list.querySelectorAll(".status-section"));
        let best = null;
        let minDist = Infinity;
        
        sections.forEach((section) => {
            const rect = section.getBoundingClientRect();
            // Use the top of the content view as the reference point
            const viewTop = listContainer.scrollTop;
            const sectionTop = section.offsetTop;
            const dist = Math.abs(sectionTop - viewTop);

            if (dist < minDist) {
                minDist = dist;
                best = section;
            }
        });
        
        if (best) {
            const match = best.id && best.id.match(/^section-(.+)$/);
            let detectedStatus = match ? best.id.replace("section-", "").replace(/-/g, " ") : null;
            detectedStatus = capitalizeStatus(detectedStatus);
            
            // Handle the ALL_APPLIED case separately as it's a derived dashboard filter
            if (detectedStatus && dashboardFilter !== detectedStatus && detectedStatus !== "All Applied") {
                dashboardFilter = detectedStatus;
                updateDashboardStats();
            } else if (detectedStatus && (dashboardFilter === null || dashboardFilter === "ALL_APPLIED") && detectedStatus !== "All Applied") {
                // If the filter is 'Total' or 'All Applied' and we scroll into a specific section, change the filter
                dashboardFilter = detectedStatus;
                updateDashboardStats();
            }
        }
    }

    function capitalizeStatus(str) {
        if (!str) return "";
        return str.replace(/\b\w/g, (c) => c.toUpperCase());
    }

    function toggleTheme() {
        const isDark = document.body.classList.toggle("dark-mode");
        localStorage.setItem("theme", isDark ? "dark" : "light");

        if (elements.toggleBtn) {
            const themeLabel = elements.toggleBtn.querySelector("#themeLabel");
            // The icon node is now inside the button's innerHTML
            
            if (themeLabel) themeLabel.textContent = isDark ? "Light Mode" : "Dark Mode";

            // Update the icon display
            elements.toggleBtn.innerHTML = isDark
                ? `☀ <span id="themeLabel">${themeLabel.textContent}</span>`
                : `🌙 <span id="themeLabel">${themeLabel.textContent}</span>`;
        }
    }

    async function autoFillFromTab() {
        if (elements.autoFillBtn) {
            elements.autoFillBtn.disabled = true;
            elements.autoFillBtn.innerHTML = `<span class="loading-spinner"></span> Auto-Filling...`;
        }

        try {
            const [tab] = await chrome.tabs.query({
                active: true,
                currentWindow: true
            });
            if (tab.url && !tab.url.startsWith('http')) {
                throw new Error("Invalid tab URL for auto-fill.");
            }
            
            await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ['contentScript.js'],
            });

            const response = await chrome.tabs.sendMessage(tab.id, {
                type: "extractJobInfo"
            });
            await new Promise((resolve) => setTimeout(resolve, 350));
            if (!response) throw new Error("No response from content script");
            
            // CRITICAL UPDATE: AutoFill places data into the ADD JOB form fields
            if (formFields.title) formFields.title.value = response.title || "";
            if (formFields.company) formFields.company.value = response.company || "";
            if (formFields.jobLink) formFields.jobLink.value = response.url || "";
            
            // If the user is on the ATS Optimizer page, fill the notes and AI Title field too
            if(currentPage === "atsOptimizer") {
                if (formFields.notes) formFields.notes.value = response.description || "";
                if (formFields.aiJobTitle) formFields.aiJobTitle.value = response.title || "";
            }
            
            try {
                const platformMap = {
                    "linkedin.com": "LinkedIn",
                    "indeed.com": "Indeed",
                    "internshala.com": "Internshala",
                    "naukri.com": "Naukri",
                    "monster.com": "Monster",
                    "monsterindia.com": "Monster",
                    "glassdoor.com": "Glassdoor"
                };
                let friendlyPlatform = "Other";
                try {
                    const urlObj = new URL(response.url);
                    const rawPlatform = urlObj.hostname.replace("www.", "");
                    friendlyPlatform = platformMap[rawPlatform] || rawPlatform;
                } catch {}

                if (formFields.platform) formFields.platform.value = friendlyPlatform;
            } catch {}
            if (response.deadline) {
                if (formFields.deadline) formFields.deadline.value = formatDate(response.deadline);
            }
            const description = `${response.title || ""} ${response.description || ""}`.toLowerCase();
            detectWorkType(description);
            showToast("Auto-fill successful!", "success");
        } catch (e) {
            console.error("Auto-fill error:", e);
            showToast("⚠ Couldn't auto-fill from this page", "error");
            sendNotificationToBackground("AutoFill Failed", "Couldn't auto-fill from this page.");
        }
        if (elements.autoFillBtn) {
            elements.autoFillBtn.disabled = false;
            elements.autoFillBtn.innerHTML = `🧠 Auto-Fill`;
        }
    }

    function saveJobAndScheduleAlarm(jobId, deadlineTimestamp, interviewTimestamp) {
        const now = Date.now();
        const timestamp = Date.now();

        if (deadlineTimestamp && deadlineTimestamp > now) {
            const deadlineAlarmTime = new Date(deadlineTimestamp);
            deadlineAlarmTime.setUTCHours(9, 0, 0, 0);

            try {
                chrome.alarms.getAll(alarms => {
                    alarms.filter(a => a.name.startsWith(`jobReminder-deadline-${jobId}`)).forEach(a => chrome.alarms.clear(a.name));
                });
            } catch(e) {
                console.error("Error clearing old alarms:", e);
            }

            if (deadlineAlarmTime.getTime() > now) {
                chrome.alarms.create(`jobReminder-deadline-${jobId}-${timestamp}`, {
                    when: deadlineAlarmTime.getTime()
                });
                console.log("Deadline alarm scheduled for", new Date(deadlineAlarmTime.getTime()));
            } else {
                console.log("Deadline alarm time already passed, no alarm set");
            }
        }

        if (interviewTimestamp && interviewTimestamp > now) {
            const interviewAlarmTime = new Date(interviewTimestamp);
            interviewAlarmTime.setUTCHours(9, 0, 0, 0);

            try {
                chrome.alarms.getAll(alarms => {
                    alarms.filter(a => a.name.startsWith(`jobReminder-interview-${jobId}`)).forEach(a => chrome.alarms.clear(a.name));
                });
            } catch(e) {
                console.error("Error clearing old alarms:", e);
            }

            if (interviewAlarmTime.getTime() > now) {
                chrome.alarms.create(`jobReminder-interview-${jobId}-${timestamp}`, {
                    when: interviewAlarmTime.getTime()
                });
                console.log("Interview alarm scheduled for", new Date(interviewAlarmTime.getTime()));
            } else {
                console.log("Interview alarm time already passed, no alarm set");
            }
        }
    }

    async function saveCurrentJob() {
        if (elements.saveBtn) {
            elements.saveBtn.disabled = true;
            elements.saveBtn.innerHTML = `<span class="loading-spinner"></span>Saving...`;
            elements.saveBtn.classList.add("premium-anim");
        }

        const jobId = editingIndex !== null ? jobs[editingIndex].id : "job-" + Date.now();

        let initialTasks = [];
        if (editingIndex !== null && jobs[editingIndex].tasks) {
             initialTasks = jobs[editingIndex].tasks;
        } else if (editingIndex === null) {
             initialTasks = JSON.parse(JSON.stringify(DEFAULT_TASKS));
        }
        
        // CRITICAL: Pull 'notes', 'resume', 'coverLetter', and 'atsMatchScore' from the correct element IDs
        // The saveJobToStorage function expects a job object with these keys.
        let job = {
            id: jobId,
            company: formFields.company ? sanitizeInput(formFields.company.value) : "",
            title: formFields.title ? sanitizeInput(formFields.title.value) : "",
            rating: formFields.rating ? parseInt(formFields.rating.value) : 0,
            platform: formFields.platform ? sanitizeInput(formFields.platform.value) : "",
            dateApplied: formFields.dateApplied ? formFields.dateApplied.value : "",
            deadline: formFields.deadline ? formFields.deadline.value : "",
            interviewDate: formFields.interviewDate ? formFields.interviewDate.value : "",
            status: formFields.status ? formFields.status.value : "Not Applied",
            jobLink: formFields.jobLink ? (isValidUrl(formFields.jobLink.value) ? sanitizeUrl(formFields.jobLink.value) : formFields.jobLink.value.trim()) : "",
            recruiterInfo: formFields.recruiterInfo ? sanitizeInput(formFields.recruiterInfo.value) : "",
            
            // The notes field (which might contain JD) is now only on the ATS Optimizer page, but accessible here.
            notes: formFields.notes ? sanitizeInput(formFields.notes.value) : "",
            
            workType: formFields.workType ? formFields.workType.value : "",
            
            // Preserve existing file data if not editing, otherwise overwrite below
            resume: editingIndex !== null && jobs[editingIndex] ? jobs[editingIndex].resume : "",
            coverLetter: editingIndex !== null && jobs[editingIndex] ? jobs[editingIndex].coverLetter : "",
            
            tasks: initialTasks,
            atsMatchScore: editingIndex !== null ? (jobs[editingIndex].atsMatchScore || null) : null,
            recruiterScore: editingIndex !== null ? (jobs[editingIndex].recruiterScore || null) : null,
            createdAt: editingIndex !== null && jobs[editingIndex] ? jobs[editingIndex].createdAt : new Date().toISOString()
        };

        if (!job.title.trim()) {
            showToast("❌ Job title is required", "error");
            sendNotificationToBackground("Save Failed", "Job title is required.");
            if (elements.saveBtn) {
                elements.saveBtn.classList.remove("premium-anim");
                elements.saveBtn.disabled = false;
                elements.saveBtn.innerHTML = "💾 Save Job";
            }
            return;
        }

        if (job.deadline && !isValidDate(job.deadline)) {
            showToast("❌ Invalid deadline date format (must be YYYY-MM-DD)", "error");
            if (elements.saveBtn) {
                elements.saveBtn.classList.remove("premium-anim");
                elements.saveBtn.disabled = false;
                elements.saveBtn.innerHTML = "💾 Save Job";
            }
            return;
        }

        if (job.interviewDate && !isValidDate(job.interviewDate)) {
            showToast("❌ Invalid interview date format (must be YYYY-MM-DD)", "error");
            if (elements.saveBtn) {
                elements.saveBtn.classList.remove("premium-anim");
                elements.saveBtn.disabled = false;
                elements.saveBtn.innerHTML = "💾 Save Job";
            }
            return;
        }
        
        // Get file inputs, which are on the ATS Optimizer page's form.
        const resumeFile = document.getElementById("resume").files[0];
        const coverLetterFile = document.getElementById("coverLetter").files[0];

        const readFile = (file) =>
            new Promise((resolve, reject) => {
                if (!file) return resolve("");
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target.result);
                reader.onerror = () => reject(new Error("Error reading file"));
                reader.readAsDataURL(file);
            });

        try {
            if (resumeFile) job.resume = await readFile(resumeFile);
            if (coverLetterFile) job.coverLetter = await readFile(coverLetterFile);
            
            // Look for a temporary ATS score stored in local storage
            const tempScoreResult = await new Promise(resolve => {
                chrome.storage.local.get(["tempAtsMatchScore", "tempRecruiterScore"], resolve);
            });
            if (tempScoreResult.tempAtsMatchScore !== undefined) {
                job.atsMatchScore = tempScoreResult.tempAtsMatchScore;
                job.recruiterScore = tempScoreResult.tempRecruiterScore;
                chrome.storage.local.remove(["tempAtsMatchScore", "tempRecruiterScore"]); // Clear after use
            }

            saveJobToStorage(job);
            

            const deadlineTimestamp = job.deadline && isValidDate(job.deadline) ? new Date(job.deadline).getTime() : null;
            const interviewTimestamp = job.interviewDate && isValidDate(job.interviewDate) ? new Date(job.interviewDate).getTime() : null;

            saveJobAndScheduleAlarm(job.id, deadlineTimestamp, interviewTimestamp);

        } catch (e) {
            showToast(`Error reading attached files: ${e.message}`, "error");
            sendNotificationToBackground("Save Failed", `Error reading attached files: ${e.message}`);
        } finally {
            if (elements.saveBtn) {
                elements.saveBtn.innerHTML = "✅ Saved!";
                await new Promise((res) => setTimeout(res, 1000));
                elements.saveBtn.classList.remove("premium-anim");
                elements.saveBtn.disabled = false;
                elements.saveBtn.innerHTML = "💾 Save Job";
            }
            switchPage("myJobs");
        }
    }

    function saveJobToStorage(job) {
        try {
            if (!job.title?.trim()) throw new Error("Job title is required");
            
            const now = new Date().toISOString();
            job.lastUpdated = now;
            let successMsg;

            if (editingIndex !== null) {
                jobs[editingIndex] = job;
                editingIndex = null;
                successMsg = "Job edited and saved locally!";
            } else {
                if (!job.tasks) job.tasks = [];
                jobs.push(job);
                successMsg = "Job added and saved locally!";
            }

            chrome.storage.local.remove("tempJobForm");
            saveJobsToLocal(successMsg);
            if (elements.form) elements.form.reset();
            // We do NOT clear the file inputs here as they are on the ATS Optimizer page,
            // but we might want to clear them after saving a new job using the Save button.
            // if (elements.resumeInput) elements.resumeInput.value = "";
            // if (elements.coverLetterInput) elements.coverLetterInput.value = "";
            const banner = document.querySelector(".editing-banner");
            if (banner) banner.remove();
            if (elements.saveBtn) {
                elements.saveBtn.classList.add("savePulse");
                setTimeout(() => elements.saveBtn.classList.remove("savePulse"), 600);
            }
            return true;
        } catch (error) {
            console.error(error);
            showToast(`❌ ${error.message}`, "error");
            sendNotificationToBackground("Save Failed", error.message);
            return false;
        }
    }

    function showToast(message, type = "success") {
        const toast = elements.toast;
        if (!toast) return;
        toast.textContent = message;
        toast.className = `toast-notification toast-show toast-${type}`;
        setTimeout(() => {
            toast.classList.remove("toast-show");
        }, 1900);
    }

    function renderJobs() {
        if (elements.list) elements.list.innerHTML = "";
        if (elements.dashboard) elements.dashboard.innerHTML = "";
        const searchTerm = elements.searchInput ? elements.searchInput.value.toLowerCase() : "";
        let filteredJobs = filterJobs(searchTerm);
        
        // Apply dashboard filter logic
        if (dashboardFilter === "ALL_APPLIED") {
            filteredJobs = filteredJobs.filter((j) => j.status !== "Not Applied");
        } else if (dashboardFilter && dashboardFilter !== "Total") {
            filteredJobs = filteredJobs.filter((j) => j.status === dashboardFilter);
        }
        
        if (elements.jobCount) elements.jobCount.textContent = `${filteredJobs.length} ${filteredJobs.length === 1 ? "job" : "jobs"}`;
        renderStatusGroups(groupJobsByStatus(filteredJobs));
        
        const deleteArea = document.querySelector(".delete-area-premium");

        if (currentPage === "myJobs") {
            const allJobs = jobs.length || 0;
            if (elements.emptyStateCta) elements.emptyStateCta.style.display = allJobs === 0 ? "block" : "none";
        }

        if (filteredJobs.length === 0 && jobs.length > 0) {
            if (elements.list) elements.list.innerHTML =
                dashboardFilter && dashboardFilter !== "Total" ?
                `<div class="empty-state">No ${dashboardFilter.toLowerCase()} jobs found.</div>` :
                '<div class="empty-state">No jobs found matching search criteria.</div>';
        } else if (jobs.length === 0) {
            if (elements.list) elements.list.innerHTML = '';
            if (elements.emptyStateCta) elements.emptyStateCta.style.display = "block";
        }
        
        if (deleteArea) {
            deleteArea.style.display = jobs.length > 0 ? "flex" : "none";
        }
        
        updateDashboardStats();
    }

    function filterJobs(term) {
        return jobs.filter(
            (j) =>
            j.title.toLowerCase().includes(term) ||
            j.company.toLowerCase().includes(term) ||
            (j.notes && j.notes.toLowerCase().includes(term))
        );
    }

    function groupJobsByStatus(list) {
        const groups = {
            "Not Applied": [],
            Applied: [],
            Shortlisted: [],
            Interviewed: [],
            Offer: [],
            Rejected: [],
        };
        list.forEach((job) => {
            (groups[job.status] || groups["Not Applied"]).push(job);
        });
        return groups;
    }

    function renderStatusGroups(groups) {
        const jobListEl = elements.list;
        if (!jobListEl) return;
        jobListEl.innerHTML = '';
        
        // Define the desired order for display
        const displayOrder = ["Offer", "Interviewed", "Shortlisted", "Applied", "Rejected", "Not Applied"];

        displayOrder.forEach((status) => {
            const list = groups[status] || [];
            if (list.length) {
                const section = document.createElement("div");
                section.className = "status-section";
                section.id = `section-${status.replace(/\s/g, "-").toLowerCase()}`;
                const header = document.createElement("div");
                header.className = "status-header";
                header.innerHTML = `
          <h3 class="status-title">${status}</h3>
          <span class="status-count">${list.length} ${list.length === 1 ? "job" : "jobs"}</span>
        `;
                section.appendChild(header);
                list.forEach((job) => section.appendChild(createJobElement(job, jobs.indexOf(job))));
                jobListEl.appendChild(section);
            }
        });
    }

    function createJobElement(job, index) {
        const el = document.createElement("div");
        el.className = "job-card";
        el.setAttribute("data-job-id", job.id);
        const deadlineTag = getDeadlineInfo(job.deadline);
        const interviewTag = getInterviewInfo(job.interviewDate);

        const rating = job.rating || 0;
        const starIcon = '⭐';
        const ratingHtml = rating > 0 ?
                             `<span class="job-rating" title="Excitement Score: ${rating}/5">${starIcon.repeat(rating)}</span>`
                            : '';
        
        // --- NEW: Prep Score Logic ---
        const prep = calculatePrepScore(job);
        const prepScoreHtml = prep.score !== null ?
                             `<span class="prep-score-tag prep-score-${Math.floor(prep.score / 25) * 25}" title="Interview Prep Score: ${prep.score}% Complete">
                                             🧠 ${prep.score}% Prep
                                            </span>`
                                             : '';
        // --- END NEW LOGIC ---
        
        // --- NEW: ATS Score Logic ---
        const atsScore = job.atsMatchScore;
        const atsScoreHtml = atsScore !== null ?
                             `<span class="ats-score-tag" title="AI ATS Match Score: ${atsScore}%">
                                             🤖 ${atsScore}% ATS Match
                                            </span>`
                                             : '';
        // --- END NEW LOGIC ---

        const pendingTasksCount = (job.tasks || []).filter(t => !t.completed).length;
        const tasksButton = `<button class="tasksBtn" data-index="${index}">
                                             ${pendingTasksCount > 0 ? `📝 ${pendingTasksCount} Pending` : '✅ Tasks'}
                                            </button>`;

        const resumeBtn = job.resume ?
            `<button class="viewResumeBtn" data-index="${index}">View Resume</button>` :
            "";
        const coverLetterBtn = job.coverLetter ?
            `<button class="viewCoverLetterBtn" data-index="${index}">View Cover Letter</button>` :
            "";

        const notesHtml = job.notes ?
            `<div class="job-detail-item full-width-note"><span class="label">Notes:</span> ${escapeHtml(job.notes).replace(/\n/g, '<br>')}</div>` :
            "";

        const recruiterHtml = job.recruiterInfo ?
            `<div class="job-detail-item"><span class="label">Recruiter:</span> ${escapeHtml(job.recruiterInfo)}</div>` :
            "";

        const workTypeHtml = job.workType ?
            `<div class="job-detail-item"><span class="label">Work Type:</span> ${job.workType}</div>` :
            "";

        const jobLinkButtonHtml = isValidUrl(job.jobLink) ?
            `<div class="job-detail-item"><a href="${job.jobLink}" target="_blank" class="job-link-btn">View Job</a></div>` :
            "";
        
        const jobLinkDisplay = job.jobLink && !isValidUrl(job.jobLink) ?
             `<div class="job-detail-item"><span class="label">Link/ID:</span> ${escapeHtml(job.jobLink)}</div>` :
             "";

        el.innerHTML = `
<div class="job-header">
<h3 class="job-title">💼 ${job.title} ${ratingHtml} ${atsScoreHtml}</h3>
<p class="company-name">${job.company}</p>
<div class="job-status"><span class="label">Status:</span> ${job.status}</div>
${prepScoreHtml}
</div>

<div class="job-details">
<div class="job-detail-item-row">
    <div class="job-detail-item"><span class="label">Platform:</span> ${job.platform || "N/A"}</div>
    <div class="job-detail-item"><span class="label">Date Applied:</span> ${job.dateApplied || "N/A"}</div>
</div>

<div class="job-detail-item-row">
    <div class="job-detail-item"><span class="label">Interview Date:</span> ${job.interviewDate || "N/A"}</div>
    <div class="job-detail-item">${deadlineTag}</div>
</div>

<div class="job-detail-item-row">
    ${recruiterHtml}
    ${workTypeHtml}
</div>

<div class="job-detail-item-row">
    ${interviewTag}
</div>

${jobLinkButtonHtml}
${jobLinkDisplay}
${notesHtml}
</div>
<div class="job-actions">
${tasksButton}
<button class="editBtn" data-index="${index}">Edit</button>
<button class="deleteBtn" data-index="${index}">Delete</button>
${resumeBtn}
${coverLetterBtn}
</div>
`;
        return el;
    }

    function getInterviewInfo(interviewDate) {
        if (!interviewDate) return "";
        const today = new Date();
        const interview = new Date(interviewDate);
        today.setHours(0, 0, 0, 0);
        interview.setHours(0, 0, 0, 0);
        
        const diffTime = interview.getTime() - today.getTime();
        const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (days >= 0 && days <= 3)
            return `<span class="tag interview-urgent">🗣 Interview in ${days} day${days === 1 ? "" : "s"}</span>`;
        if (days > 3 && days <= 7)
            return `<span class="tag interview-soon">🗣 Interview in ${days} days</span>`;
        if (days < 0)
            return `<span class="tag interview-expired">🗣 Interview Passed</span>`;
        return "";
    }

    function getDeadlineInfo(deadline) {
        if (!deadline) return "";
        const today = new Date();
        const deadlineDate = new Date(deadline);
        today.setHours(0, 0, 0, 0);
        deadlineDate.setHours(0, 0, 0, 0);

        const diffTime = deadlineDate.getTime() - today.getTime();
        const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (days >= 0 && days <= 3) {
            return `<span class="tag deadline-urgent">🔥 Deadline in ${days} day${days === 1 ? "" : "s"}</span>`;
        }
        if (days > 3 && days <= 7) {
            return `<span class="tag deadline-soon">⚠ Deadline in ${days} days</span>`;
        }
        if (days < 0) {
            return `<span class="tag deadline-expired">⌛ Deadline Expired</span>`;
        }
        return "";
    }

    function updateDashboardStats() {
        if (elements.dashboard) elements.dashboard.innerHTML = "";
        
        const strictStats = {
            "Not Applied": jobs.filter((j) => j.status === "Not Applied").length,
            "Applied": jobs.filter((j) => j.status === "Applied").length,
            "Shortlisted": jobs.filter((j) => j.status === "Shortlisted").length,
            "Interviewed": jobs.filter((j) => j.status === "Interviewed").length,
            "Offer": jobs.filter((j) => j.status === "Offer").length,
            "Rejected": jobs.filter((j) => j.status === "Rejected").length,
        };

        const allApplicationsCount = jobs.filter(j => j.status !== "Not Applied").length;
        
        const displayStats = [
            { label: "Total", count: jobs.length, dataStatus: "Total" },
            { label: "Total Applications", count: allApplicationsCount, dataStatus: "ALL_APPLIED" },
            { label: "Not Applied", count: strictStats["Not Applied"], dataStatus: "Not Applied" },
            { label: "Applied (Current)", count: strictStats["Applied"], dataStatus: "Applied" },
            { label: "Shortlisted", count: strictStats["Shortlisted"], dataStatus: "Shortlisted" },
            { label: "Interviewed", count: strictStats["Interviewed"], dataStatus: "Interviewed" },
            { label: "Offer", count: strictStats["Offer"], dataStatus: "Offer" },
            { label: "Rejected", count: strictStats["Rejected"], dataStatus: "Rejected" }
        ];

        displayStats.forEach(stat => {
            const label = stat.label;
            const count = stat.count;
            const dataStatus = stat.dataStatus;
            
            // Determine active state
            let isActive = false;
            if (dashboardFilter === null && dataStatus === "Total") {
                isActive = true;
            } else if (dashboardFilter === dataStatus) {
                isActive = true;
            } else if (dashboardFilter === "ALL_APPLIED" && dataStatus === "ALL_APPLIED") {
                isActive = true;
            }

            const statBtn = document.createElement("button");
            statBtn.type = "button";
            
            statBtn.className =
                "dashboard-stat " + dataStatus.replace(/\s+/g, "-").toLowerCase() +
                (isActive ? " active" : "");
                
            statBtn.setAttribute("data-status", dataStatus);
            
            statBtn.innerHTML = `<span>${label}</span><span class="stat-count">${count}</span>`;
            if (elements.dashboard) elements.dashboard.appendChild(statBtn);
        });
    }

    function handleListActions(e) {
        if (e.target.classList.contains("export-calendar-btn")) {
            const jobIdx = e.target.getAttribute("data-index");
            const type = e.target.getAttribute("data-type");
            const job = jobs[jobIdx];
            let title, date, description;
            if (type === "deadline" && job.deadline) {
                title = `Application Deadline: ${job.title} at ${job.company}`;
                date = job.deadline;
                description = `Application deadline for ${job.title} at ${job.company} on ${job.platform || ""}`;
            } else if (type === "interview" && job.interviewDate) {
                title = `Interview: ${job.title} at ${job.company}`;
                date = job.interviewDate;
                description = `Interview scheduled for ${job.title} at ${job.company}`;
            } else {
                showToast("No date found for export", "error");
                sendNotificationToBackground("Export Failed", "No date found for calendar export.");
                return;
            }
            exportToCalendar(title, date, description);
            return;
        }
        if (!e.target.dataset.index) return;
        const index = parseInt(e.target.dataset.index, 10);
        
        if (e.target.classList.contains("tasksBtn")) {
            e.stopPropagation();
            openTasksModal(index);
            return;
        } else if (e.target.classList.contains("editBtn")) {
            fillForm(jobs[index], index);
            switchPage("addJob", true);
        } else if (e.target.classList.contains("deleteBtn")) {
            if (confirm("Are you sure?")) {
                const jobIdToDelete = jobs[index].id;
                jobs.splice(index, 1);

                try {
                    chrome.alarms.getAll(alarms => {
                        alarms.filter(a => a.name.includes(jobIdToDelete)).forEach(a => chrome.alarms.clear(a.name));
                    });
                } catch(e) {
                    console.error("Error clearing job-specific alarms:", e);
                }

                saveJobsToLocal("Job deleted and saved locally!");
                sendNotificationToBackground("Job Deleted", "A job has been deleted successfully.");
            }
        } else if (e.target.classList.contains("viewResumeBtn")) {
            viewFile(jobs[index].resume, "Resume");
        } else if (e.target.classList.contains("viewCoverLetterBtn")) {
            viewFile(jobs[index].coverLetter, "Cover Letter");
        } else if (e.target.classList.contains("job-link-btn")) {
            e.stopPropagation();
        }
    }

    function exportToCalendar(title, dateStr, description) {
        const eventDate = dateStr.replace(/-/g, '');
        const icsContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'BEGIN:VEVENT',
            `SUMMARY:${title}`,
            `DESCRIPTION:${description}`,
            `DTSTART;VALUE=DATE:${eventDate}`,
            `DTEND;VALUE=DATE:${eventDate}`,
            'END:VEVENT',
            'END:VCALENDAR'
        ].join('\r\n');
        const blob = new Blob([icsContent], {
            type: 'text/calendar'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title.replace(/[^a-zA-Z0-9]/g, '_')}.ics`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        

        showToast("Exported to Calendar (.ics)!", "success");
        sendNotificationToBackground("Export Successful", "Event exported to Calendar file.");
    }

    function fillForm(job, index) {
        editingIndex = index;
        if (!document.querySelector(".editing-banner")) {
            const banner = document.createElement("div");
            banner.className = "editing-banner";
            banner.textContent = "✏ Editing Job";
            if (elements.form) elements.form.prepend(banner);
        }
        
        // CRITICAL: Fill both the Add Job form AND the ATS Optimizer form fields if they exist
        Object.keys(formFields).forEach((k) => {
            if (formFields[k] && job[k] !== undefined) {
                if (k === 'rating' && formFields.rating) {
                    formFields.rating.value = job.rating || 0;
                } else if (k === 'notes' && formFields.notes) {
                    // Fill Notes field on ATS Optimizer page
                    formFields.notes.value = job.notes;
                } else if (k === 'aiJobTitle' && formFields.aiJobTitle) {
                    // Fill AI Job Title field on ATS Optimizer page
                    formFields.aiJobTitle.value = job.title;
                } else if (formFields[k] && formFields[k].closest('#jobForm')) {
                    // Fill fields on the main Add Job form
                    formFields[k].value = job[k];
                }
            }
        });
        // Clear file inputs, regardless of the page they are on
        if (elements.resumeInput) elements.resumeInput.value = "";
        if (elements.coverLetterInput) elements.resumeInput.value = "";
    }

    function debounce(fn, delay) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => fn.apply(this, args), delay);
        };
    }

    function sanitizeInput(v) {
        return (v || "").replace(/[<>]/g, "");
    }

    function sanitizeUrl(v) {
        try {
            const url = new URL(v);
            return ["http:", "https:"].includes(url.protocol) ? url.href : "";
        } catch {
            return "";
        }
    }

    function escapeHtml(v) {
        const div = document.createElement("div");
        div.textContent = v || "";
        return div.innerHTML;
    }

    function formatDate(v) {
        try {
            if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;

            const date = new Date(v);
            if (isNaN(date.getTime())) return "";

            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        } catch {
            return "";
        }
    }

    function isValidUrl(v) {
        try {
            const url = new URL(v);
            return ["http:", "https:"].includes(url.protocol);
        } catch {
            return false;
        }
    }

    function isValidDate(v) {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        if (!v || !v.match(regex)) return false;

        const date = new Date(v + 'T00:00:00');
        
        if (isNaN(date.getTime())) return false;

        const [year, month, day] = v.split('-').map(Number);
        return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
    }


    function detectWorkType(desc) {
        if (!desc) return;
        if (desc.includes("remote")) {
            if (formFields.workType) formFields.workType.value = "Remote";
        } else if (desc.includes("hybrid")) {
            if (formFields.workType) formFields.workType.value = "Hybrid";
        } else if (desc.includes("on-site") || desc.includes("in-office")) {
            if (formFields.workType) formFields.workType.value = "In-office";
        }
    }

    function viewFile(data, label) {
        if (!data) return showToast(`${label} not found`, "error");
        const newTab = window.open();
        if (!newTab) return showToast("Popup blocked!", "error");
        if (data.startsWith("data:application/pdf")) {
            newTab.document.write(
                `<title>${label}</title><iframe src="${data}" style="width:100vw;height:100vh;border:none;"></iframe>`
            );
        } else {
            newTab.location.href = data;
        }
    }

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === "scrollToJob" && request.jobId) {
            const jobCard = document.querySelector(`.job-card[data-job-id="${request.jobId}"]`);
            if (jobCard) {
                if (currentPage !== "myJobs") {
                    switchPage("myJobs");
                }
                const appContent = document.getElementById("appContent");
                    
                const jobCard = document.querySelector(`.job-card[data-job-id="${request.jobId}"]`);
                if (jobCard) {
                    if (currentPage !== "myJobs") {
                        switchPage("myJobs");
                    }
                    const appContent = document.getElementById("appContent");
                    if (appContent) {
                        const cardRect = jobCard.getBoundingClientRect();
                        const appRect = appContent.getBoundingClientRect();
                        const offset = cardRect.top - appRect.top + appContent.scrollTop - (appRect.height / 4);
                        
                        appContent.scrollTo({
                            top: offset,
                            behavior: "smooth"
                        });
                    } else {
                        jobCard.scrollIntoView({
                            behavior: "smooth",
                            block: "center"
                        });
                    }
                }
            }
        }
    });

});