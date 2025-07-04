// View Toggle Functionality
const viewToggle = document.getElementById("view-toggle");
const logoToggle = document.getElementById("logo-toggle");
const terminalView = document.getElementById("terminal-view");
const alternateView = document.getElementById("alternate-view");

let currentView = "alternate"; // Track current view (matches default HTML state)

// Terminal initialization function (extracted for reuse)
function initializeTerminal() {
  // Reset terminal state
  const terminal = document.getElementById("terminal");
  const progressBar = document.getElementById("progress-bar");
  const executeButton = document.getElementById("execute-button");

  terminal.innerHTML = "";
  currentCommandIndex = 0;
  currentPromptLine = null;
  isTyping = false;
  executeButton.disabled = false;
  executeButton.style.display = "block";

  // Reset progress bar
  if (progressBar) {
    progressBar.style.width = "0%";
  }

  // Add the first command and execute it
  setTimeout(() => {
    currentPromptLine = addLine(
      `<span class="arrow">→</span> <span class="directory">~</span> <span class="prompt">andrew</span> <span class="git-branch">git:(main)</span> <span class="command">${commands[0].command}</span>`,
      ""
    );
    executeCommand();
  }, 100);
}

// Function to show loading overlay and initialize terminal
function showLoadingAndInitialize() {
  const loadingOverlay = document.getElementById("loading-overlay");

  // Show loading overlay
  loadingOverlay.classList.remove("hidden");

  // Hide loading overlay after 1000ms and initialize terminal
  setTimeout(() => {
    loadingOverlay.classList.add("hidden");
    initializeTerminal();
  }, 1000);
}

function switchView() {
  const toggleText = viewToggle.querySelector(".toggle-text");

  if (currentView === "terminal") {
    // Switch to alternate view
    terminalView.classList.remove("active");
    alternateView.classList.add("active");
    currentView = "alternate";
    viewToggle.setAttribute("title", "Switch to Terminal");
    toggleText.textContent = "I'm a coder";
  } else {
    // Switch to terminal view
    alternateView.classList.remove("active");
    terminalView.classList.add("active");
    currentView = "terminal";
    viewToggle.setAttribute("title", "Switch View");
    toggleText.textContent = "I don't code!";

    // Show loading state and initialize terminal
    showLoadingAndInitialize();
  }
}

// Add event listener to toggle button
if (viewToggle) {
  viewToggle.addEventListener("click", switchView);

  // Also allow keyboard navigation
  viewToggle.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      switchView();
    }
  });
}

// Add event listener to logo toggle
if (logoToggle) {
  logoToggle.addEventListener("click", switchView);

  // Also allow keyboard navigation
  logoToggle.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      switchView();
    }
  });
}

const terminal = document.getElementById("terminal");
const executeButton = document.getElementById("execute-button");
const progressBar = document.getElementById("progress-bar");

// Device detection utility
const isMobileDevice = () => window.innerWidth <= 768;

// Terminal commands and outputs
const commands = [
  {
    command: "whoami",
    desktopOutput: `<pre>
     _              _                       _            _                       
    / \\   _ __   __| |_ __ _____      __   / \\   _ __ __| | ___ _ __ _ __   ___ 
   / _ \\ | '_ \\ / _\` | '__/ _ \\ \\ /\\ / /  / _ \\ | '__/ _\` |/ _ \\ '__| '_ \\ / _ \\
  / ___ \\| | | | (_| | | |  __/\\ V  V /  / ___ \\| | | (_| |  __/ |  | | | |  __/
 /_/   \\_\\_| |_|\\__,_|_|  \\___| \\_/\\_/  /_/   \\_\\_|  \\__,_|\\___|_|  |_| |_|\\___|
</pre>`,
    mobileOutput: `<pre>Andrew Arderne
Software Engineer</pre>`,
  },
  {
    command: "ls",
    desktopOutput: `<pre>total 5
drwxr-xr-x  2 andrew  staff  <span class="directory">.</span>
drwxr-xr-x  3 andrew  staff  <span class="directory">..</span>
-rw-r--r--  1 andrew  staff  <span class="file">about.txt</span>
-rw-r--r--  1 andrew  staff  <span class="file">skills.txt</span>
-rw-r--r--  1 andrew  staff  <span class="file">experience.txt</span></pre>`,
    mobileOutput: `<pre><span class="file">about.txt</span>
<span class="file">skills.txt</span>
<span class="file">experience.txt</span></pre>`,
  },
  {
    command: "cat about.txt",
    desktopOutput: `<pre>I enjoy building software that helps users while being secure and fault-tolerant. I thrive in tech-curious teams and have a proven track record of leading projects from inception to completion.</pre>`,
  },
  {
    command: "cat skills.txt",
    desktopOutput: `<pre>Go, Python, Clojure, JavaScript</pre>`,
  },
  {
    command: "git log -- experience.txt",
    desktopOutput: `<pre>commit 8a71f92
Company: Ravelin
Date:   Oct 2022 - Present

    Built a distributed locking mechanism for SQL execution on multi-tenant database, 
    served high-profile clients such as Spotify.
    
    Built a breached credentials database with 4 billion rows used to detect account hacking.

    Led projects on TLS fingerprinting, automating data science workloads 
    and building devs' internal tooling.

commit 3e4f5c6
Company: Prolific
Date:   May 2021 - Sep 2022

    Built out the public API and onboarded engineering teams including 
    Google DeepMind.

    Implemented 2-factor authentication from scratch.

commit 1a2b3c4
Company: Navenio
Date:   Nov 2018 - Apr 2021

    Part of a team building a hospital efficiency app which used Wi-Fi routers to 
    localise cell phones.

    Built notification system and analytics download system.</pre>`,
    mobileOutput: `<pre>Ravelin (2022-Present)
• Distributed locking for SQL on multi-tenant DB.
• Breached credentials DB (4 billion rows).
• TLS fingerprinting.
• Data science automation.

Prolific (2021-2022)
• Public API development.
• 2FA implementation.

Navenio (2018-2021)
• Hospital efficiency app using Wi-Fi localization.
• Notifications & analytics.</pre>`,
  },
  {
    command: 'echo "Connect with me:"',
    desktopOutput: `<pre>Connect with me:</pre>
<a href="https://www.linkedin.com/in/andrew-arderne" target="_blank" class="social-icon linkedin">LinkedIn</a>
<a href="https://github.com/zoomie" target="_blank" class="social-icon github">GitHub</a>`,
  },
  {
    command: "pbpaste",
    desktopOutput: `<pre>andrew.arderne@pm.me</pre>`,
  },
  {
    command: "git log --reverse --max-parents=0 HEAD",
    desktopOutput: `<pre>
commit 33fd28d
Author: zoomie <andrew.arderne@pm.me>
Date:   Sat March 12 15:31:01 2015

    Started programming!
</pre>`,
  },
  {
    command: `echo "Andrew has been programming for $(( ($(date +%s) - $(date -j -f "%a %B %d %T %Y" "Sat March 12 15:31:01 2015" +%s)) / 31556952 )) years"`,
    desktopOutput: `<pre>Andrew has been programming for 10 years
</pre>`,
  },
  {
    command: "curl https://favourite.programmer.com",
    desktopOutput: `<pre>
***
TLS handshake (This can be fingerprinted which is super interesting)
***
HTTP/3 protocol (I'm a little sad that HTTP is moving away from plain text)
HTTP/3 socket (Though fun to see UDP making a comeback in a big way)
***

"Simplicity is hard work. But, there's a huge payoff." -- Rich Hickey

<pre>`,
    mobileOutput: `<pre>"Simplicity is hard work. But, there's a huge payoff." -- Rich Hickey</pre>`,
  },
  {
    command: "go run hackcomputer.go",
    desktopOutput: `<pre>System hacked successfully.</pre>`,
    mobileOutput: `<pre>System hacked successfully.</pre>`,
    onExecute: function () {
      setTimeout(() => {
        alert("<script>alert('I also enjoy security!');</script>");
      }, 50);
    },
  },
  {
    command: "exit",
    desktopOutput: `<pre>Thanks for visiting!</pre>`,
    mobileOutput: `<pre>Thanks for visiting!</pre>`,
    onExecute: function () {
      setTimeout(() => {
        launchConfetti();
      }, 500);
    },
  },
];

let currentCommandIndex = 0;
let isTyping = false;
let currentPromptLine = null;

// Function to update progress bar
function updateProgressBar() {
  if (!progressBar) return;

  const totalCommands = commands.length;
  const progress = (currentCommandIndex / totalCommands) * 100;
  progressBar.style.width = `${progress}%`;
}

// Function to add a new line to the terminal
function addLine(text, className) {
  const line = document.createElement("div");
  line.className = className;
  line.innerHTML = text;
  terminal.appendChild(line);

  // Ensure scrolling happens after content is rendered
  setTimeout(() => {
    terminal.scrollTop = terminal.scrollHeight;

    // Add extra padding at the bottom if we're on mobile
    if (isMobileDevice()) {
      const extraPadding = document.createElement("div");
      extraPadding.style.height = "20px";
      terminal.appendChild(extraPadding);
    }
  }, 10);

  return line;
}

// Function to animate text character by character
async function animateText(text, element, speed = 2, chunkSize = 5) {
  return new Promise((resolve) => {
    let i = 0;
    isTyping = true;
    executeButton.disabled = true;

    // Store the original HTML to handle HTML tags properly
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = text;
    const textContent = tempDiv.innerHTML;

    // Create a container for the animated content
    element.innerHTML = "";

    const typing = setInterval(() => {
      if (i < textContent.length) {
        // Add chunk of characters at a time
        const nextChunk = Math.min(i + chunkSize, textContent.length);
        element.innerHTML = textContent.substring(0, nextChunk);
        i = nextChunk;
      } else {
        clearInterval(typing);
        isTyping = false;
        executeButton.disabled = false;
        resolve();
      }
    }, speed);
  });
}

// Function to simulate typing
function typeText(text, element, speed = 50) {
  return new Promise((resolve) => {
    let i = 0;
    isTyping = true;
    executeButton.disabled = true;

    const typing = setInterval(() => {
      if (i < text.length) {
        element.innerHTML =
          text.substring(0, i + 1) + '<span class="cursor"></span>';
        i++;
      } else {
        clearInterval(typing);
        // Remove cursor when typing is complete
        element.innerHTML = text;
        isTyping = false;
        executeButton.disabled = false;
        resolve();
      }
    }, speed);
  });
}

// Function to get the appropriate output based on device type
function getCommandOutput(commandObj) {
  // If the command has a mobileOutput and isMobileDevice, return the mobileOutput
  if (commandObj.mobileOutput && isMobileDevice()) {
    return commandObj.mobileOutput;
  }
  return commandObj.desktopOutput;
}

// Function to execute a command
async function executeCommand() {
  if (isTyping || currentCommandIndex >= commands.length) return;

  // Remove cursor from current prompt line if it exists
  if (currentPromptLine) {
    const cursorElement = currentPromptLine.querySelector(".cursor");
    if (cursorElement) {
      cursorElement.remove();
    }
  }

  const commandObj = commands[currentCommandIndex];

  // Add output line and animate it
  const outputLine = addLine("", "output");
  const output = getCommandOutput(commandObj);
  await animateText(output, outputLine);

  // Execute any special onExecute function if it exists
  if (commandObj.onExecute) {
    commandObj.onExecute();
  }

  // Increment command index
  currentCommandIndex++;

  // Update progress bar
  updateProgressBar();

  // If we've reached the end, disable the button and ensure scroll to bottom
  if (currentCommandIndex >= commands.length) {
    executeButton.style.display = "none";
    // Add a small delay to ensure all content is rendered
    setTimeout(() => {
      terminal.scrollTop = terminal.scrollHeight;
      // Add extra padding at the bottom if we're on mobile
      if (isMobileDevice()) {
        const extraPadding = document.createElement("div");
        extraPadding.style.height = "20px";
        terminal.appendChild(extraPadding);
        terminal.scrollTop = terminal.scrollHeight;
      }
    }, 50);
  } else {
    // Add next prompt line with the next command already written and cursor flashing at the end
    const nextCommand = commands[currentCommandIndex].command;
    currentPromptLine = addLine(
      `<span class="arrow">→</span> <span class="directory">~</span> <span class="prompt">andrew</span> <span class="git-branch">git:(main)</span> <span class="command">${nextCommand}<span class="cursor"></span></span>`,
      ""
    );
  }
}

// Add event listener to the button
executeButton.addEventListener("click", executeCommand);

// Add keyboard event listener to the document for Enter key
document.addEventListener("keydown", (event) => {
  if (
    event.key === "Enter" &&
    !isTyping &&
    currentCommandIndex < commands.length
  ) {
    executeCommand();
    // Visual feedback on the button when Enter is pressed
    executeButton.classList.add("active");
    setTimeout(() => {
      executeButton.classList.remove("active");
    }, 200);
  }
});

// Also allow keyboard navigation with Enter key when button is focused
executeButton.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    executeCommand();
  }
});

// Start with the first prompt line and automatically run the first command
window.addEventListener("load", () => {
  const loadingOverlay = document.getElementById("loading-overlay");

  // Hide loading overlay after 1000ms (1 second) only on initial page load
  setTimeout(() => {
    loadingOverlay.classList.add("hidden");

    // Only initialize if we're starting on terminal view
    if (currentView === "terminal") {
      initializeTerminal();
    }
  }, 1000);
});

// Add window resize listener to handle orientation changes
let lastDeviceType = isMobileDevice();
window.addEventListener("resize", () => {
  const currentDeviceType = isMobileDevice();
  if (currentDeviceType !== lastDeviceType) {
    lastDeviceType = currentDeviceType;
    // Re-initialize the terminal if we're currently on terminal view
    if (currentView === "terminal") {
      initializeTerminal();
    }
  }
});

// Confetti animation function
function launchConfetti() {
  const colors = [
    "#ff0000",
    "#00ff00",
    "#0000ff",
    "#ffff00",
    "#ff00ff",
    "#00ffff",
  ];
  const confettiCount = 200;

  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement("div");
    confetti.style.position = "fixed";
    confetti.style.left = Math.random() * 100 + "vw";
    confetti.style.top = "-20px";
    confetti.style.width = Math.random() * 10 + 5 + "px";
    confetti.style.height = Math.random() * 5 + 3 + "px";
    confetti.style.backgroundColor =
      colors[Math.floor(Math.random() * colors.length)];
    confetti.style.borderRadius = "2px";
    confetti.style.zIndex = "1000";
    document.body.appendChild(confetti);

    // Animation
    const duration = Math.random() * 3 + 2;
    const rotation = Math.random() * 360;

    confetti.animate(
      [
        {
          transform: `translate(0, 0) rotate(0deg)`,
          opacity: 1,
        },
        {
          transform: `translate(${Math.random() * 200 - 100}px, ${
            window.innerHeight + 100
          }px) rotate(${rotation}deg)`,
          opacity: 0,
        },
      ],
      {
        duration: duration * 1000,
        easing: "cubic-bezier(0, .9, .57, 1)",
        fill: "forwards",
      }
    );

    // Remove after animation completes
    setTimeout(() => {
      confetti.remove();
    }, duration * 1000);
  }
}
