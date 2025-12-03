// On Chrome startup, check deadlines and interviews and notify
chrome.runtime.onStartup.addListener(() => {
  checkAndNotifyNearEvents();
});

// Set a repeating alarm every 6 hours (360 minutes)
chrome.alarms.create("periodicNotification", { periodInMinutes: 360 });

// Alarm listener to handle all alarms
chrome.alarms.onAlarm.addListener(async (alarm) => {
  // Handles the periodic scan alarm
  if (alarm.name === "periodicNotification") {
    checkAndNotifyNearEvents();
  }

  // Handles specific, one-time job reminder alarms created from the popup
  // Alarm name format: jobReminder-{type}-{jobId}-{timestamp}
  else if (alarm.name.startsWith("jobReminder-")) {
    const parts = alarm.name.split('-');
    const type = parts[1];
    
    // Find the job ID by removing the first two parts ('jobReminder' and 'type')
    // and the last part (timestamp)
    const timestamp = parts.pop();
    const jobId = parts.slice(2).join('-');

    try {
      const result = await chrome.storage.local.get('jobs');
      const allJobs = result.jobs || [];
      const data = allJobs.find(job => job.id === jobId);

      if (!data) {
        console.error("No job data found for alarm:", jobId);
        chrome.alarms.clear(alarm.name);
        return;
      }

      let notificationTitle = "JobSnap Reminder";
      let notificationMessage = "";

      // One-Time Alarm messaging (This still fires for 'TODAY' deadlines/interviews)
      // CORRECTED/UPDATED: Include the company name in the notificationTitle for clarity
      if (type === "deadline") {
        notificationTitle = `🔥 Deadline TODAY: ${data.title} (${data.company})`;
        notificationMessage = `Your application for 💼 **${data.title}** at **${data.company}** is **due today**! Let's make it a success!`;
      } else if (type === "interview") {
        notificationTitle = `🗣 Interview TODAY: ${data.title} (${data.company})`;
        notificationMessage = `You're on the shortlist—go own it! Your interview for 💼 **${data.title}** at **${data.company}** is **today**!`;
      }

      // Ensure the one-time alarm notification uses a unique ID
      const notificationId = `${data.id}-${type}-${Date.now()}`;
      chrome.notifications.create(notificationId, {
        type: "basic",
        iconUrl: "icons/icon128.png",
        title: notificationTitle,
        message: notificationMessage,
        priority: 2,
      });

      // Crucial: Clear the one-time alarm after it fires and notifies.
      chrome.alarms.clear(alarm.name);
      console.log(`Cleared one-time alarm: ${alarm.name}`);

    } catch (e) {
      console.error("Failed to show notification:", e);
    }
  }
});

// Listener for when a user clicks on a notification
chrome.notifications.onClicked.addListener((notifId) => {
    
    const parts = notifId.split('-');
    
    // Correctly remove the dynamic timestamp component for click handler
    const lastPart = parts[parts.length - 1];
    
    if (!isNaN(lastPart) && lastPart.length > 10) { 
        parts.pop(); // Remove the timestamp
    }
    
    const typeIndex = parts.indexOf('deadline') !== -1 ? parts.indexOf('deadline') : parts.indexOf('interview');
    const jobId = typeIndex !== -1 ? parts.slice(0, typeIndex).join('-') : parts.slice(0, -2).join('-');
    
    chrome.action.openPopup()
        .then(() => {
            chrome.runtime.sendMessage({ action: "scrollToJob", jobId: jobId });
        })
        .catch(err => {
            console.error("Error opening popup:", err);
        });
});

// Listener to receive messages from the popup script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "showNotification" && request.title && request.message) {
    const uniqueId = request.title.replace(/[^a-zA-Z0-9]/g, '') + Date.now();
    chrome.notifications.create(uniqueId, {
      type: "basic",
      iconUrl: "icons/icon128.png",
      title: request.title,
      message: request.message,
      priority: 2,
    });
  }
});

// Function to scan saved jobs for deadlines and interview dates, then show notifications
async function checkAndNotifyNearEvents() {
  const result = await chrome.storage.local.get('jobs');
  const jobsArray = result.jobs || [];

  jobsArray.forEach(job => {
    function getDaysRemaining(dateStr) {
      const todayStart = new Date().setHours(0, 0, 0, 0);
      const eventTimeStart = new Date(dateStr).setHours(0, 0, 0, 0);
      return (eventTimeStart - todayStart) / (1000 * 60 * 60 * 24);
    }

    const daysLeftD = job.deadline ? getDaysRemaining(job.deadline) : null;
    const daysLeftI = job.interviewDate ? getDaysRemaining(job.interviewDate) : null;
    const dayTextD = Math.ceil(daysLeftD) + " day" + (Math.ceil(daysLeftD) > 1 ? "s" : "");
    const dayTextI = Math.ceil(daysLeftI) + " day" + (Math.ceil(daysLeftI) > 1 ? "s" : "");

    // --- DEADLINE NOTIFICATION LOGIC (CORRECTED: Job Title added to all ranges) ---
    if (job.deadline && daysLeftD >= 0 && daysLeftD <= 7) { 
      let notificationTitle;
      let notificationMessage;
      const notificationId = `${job.id}-deadline-periodic-${Date.now()}`; 

      // 1. Launch Day (0)
      if (daysLeftD === 0) {
        notificationTitle = `🔥 SUBMIT & SECURE: ${job.title} DUE!`;
        notificationMessage = `The future is now! Send your final application and secure this role. You are prepared for this success.`;
      }
      // 2. Final Push (1)
      else if (daysLeftD === 1) {
        notificationTitle = `🚀 APPLY! Last Call: ${job.title} Due Tomorrow.`;
        notificationMessage = `Finish Strong! Use today to polish your documents. A perfect application means a premium candidate. APPLY today!`;
      }
      // 3. Mid-Prep (2-3) - ADDED job.title
      else if (daysLeftD >= 2 && daysLeftD <= 3) {
        notificationTitle = `📝 APPLY! Priority Action: ${job.title} - ${dayTextD} Left.`;
        notificationMessage = `Make it count! Focus on tailoring your cover letter—that small effort guarantees a big impact. APPLY before it's too late!`;
      }
      // 4. Initial Alert (4-5) - ADDED job.title
      else if (daysLeftD >= 4 && daysLeftD <= 5) {
        notificationTitle = `💡 APPLY! Big Opportunity: ${job.title} - ${dayTextD} Out.`;
        notificationMessage = `Don't delay! Block out time today to start planning. This role is a massive step for your career. Start your application now!`;
      }
      // 5. Gentle Nudge (6-7)
      else if (daysLeftD >= 6 && daysLeftD <= 7) {
        notificationTitle = `✅ APPLY! Future Focus: ${job.title} is ${dayTextD} Away.`;
        notificationMessage = `You have a full week! Add this to your weekly goals; your career is calling. Start your application process today!`;
      }

      chrome.notifications.create(notificationId, {
        type: "basic",
        iconUrl: "icons/icon128.png",
        title: notificationTitle,
        message: notificationMessage,
        priority: 2,
      });

    } else if (job.deadline && daysLeftD < 0) {
        // Cleanup for expired deadlines
        chrome.notifications.clear(`${job.id}-deadline-periodic`);
    }

    // --- INTERVIEW NOTIFICATION LOGIC (Job Title is present in ALL ranges) ---
    if (job.interviewDate && daysLeftI >= 0 && daysLeftI <= 7) {
      let notificationTitle;
      let notificationMessage;
      const notificationId = `${job.id}-interview-periodic-${Date.now()}`;

      // 1. Launch Day (0)
      if (daysLeftI === 0) {
        notificationTitle = `🏆 INTERVIEW! Go Win It: ${job.title} TODAY!`;
        notificationMessage = `This is your victory day! Your skills are ready. INTERVIEW NOW! Go in with full confidence and secure the offer.`;
      } 
      // 2. Final Push (1)
      else if (daysLeftI === 1) {
        notificationTitle = `🚀 INTERVIEW TOMORROW! Last Prep: ${job.title}`;
        notificationMessage = `Finalize your pitch! Use today to master your talking points. A flawless interview means a premium candidate. INTERVIEW ready!`;
      } 
      // 3. Mid-Prep (2-3)
      else if (daysLeftI >= 2 && daysLeftI <= 3) {
        notificationTitle = `🧠 INTERVIEW! Strategy Check: ${job.title} - ${dayTextI}.`;
        notificationMessage = `Master your message! Focus on demonstrating the value you bring. INTERVIEW smart! You're the solution they need.`;
      } 
      // 4. Initial Alert (4-5)
      else if (daysLeftI >= 4 && daysLeftI <= 5) {
        notificationTitle = `💡 INTERVIEW ALERT! ${job.title} is ${dayTextI} Out.`;
        notificationMessage = `Dream role is close! Block out prep time today. This is a massive step for your career. Prepare for your INTERVIEW now!`;
      } 
      // 5. Gentle Nudge (6-7)
      else if (daysLeftI >= 6 && daysLeftI <= 7) {
        notificationTitle = `🗓️ INTERVIEW NUDGE: ${job.title} is ${dayTextI} Away.`;
        notificationMessage = `Exciting news! You have a full week to prepare. INTERVIEW focused! Add this to your weekly goals; your career is calling.`;
      }

      chrome.notifications.create(notificationId, {
        type: "basic",
        iconUrl: "icons/icon128.png",
        title: notificationTitle,
        message: notificationMessage,
        priority: 2,
      });

    } else if (job.interviewDate && daysLeftI < 0) {
        // Cleanup for passed interviews
        chrome.notifications.clear(`${job.id}-interview-periodic`);
    }
  });
} 