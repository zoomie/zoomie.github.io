const terminal = document.getElementById("terminal");
const executeButton = document.getElementById("execute-button");

// Terminal commands and outputs
const commands = [
  {
    command: "whoami",
    output: `Andrew Arderne - Software Engineer`,
  },
  {
    command: "ls -la",
    output: `<pre>total 5
drwxr-xr-x  2 andrew  staff  160 Jun 10 10:00 <span class="directory">.</span>
drwxr-xr-x  3 andrew  staff   96 Jun 10 10:00 <span class="directory">..</span>
-rw-r--r--  1 andrew  staff  512 Jun 10 10:00 skills.txt
-rw-r--r--  1 andrew  staff  512 Jun 10 10:00 about.txt
-rw-r--r--  1 andrew  staff  328 Jun 10 10:00 experience.txt</pre>`,
  },
  {
    command: "cat skills.txt",
    output: `<pre>Go, Python, Clojure, JavaScript</pre>`,
  },
  {
    command: "cat about.txt",
    output: `<pre>I enjoy building software that helps users while being secure and fault-tolerant. I thrive in tech-curious teams and have a proven track record of leading projects from inception to completion.</pre>`,
  },
  {
    command: "cat experience.txt",
    output: `<pre>Ravelin | Oct 2022 - Present
• Built a SQL execution locking mechanism for a multi-tenant database and a breached credentials database with 4B+ rows
• Led projects on TLS fingerprinting, automating data science workloads and building devs' internal tooling

Prolific | May 2021 - Sep 2022
• Built out the public API and onboarded engineering teams including Google DeepMind
• Implemented 2-factor authentication from scratch

Navenio | Nov 2018 - Apr 2021
• Built notification system and analytics download system</pre>`,
  },
  {
    command: 'echo "Connect with me:"',
    output: `<pre>Connect with me:</pre>
<a href="https://www.linkedin.com/in/andrew-arderne" target="_blank" class="social-icon linkedin">LinkedIn</a>
<a href="https://github.com/zoomie" target="_blank" class="social-icon github">GitHub</a>`,
  },
  {
    command: "curl https://good.ideas.com | jq",
    output: `<pre>Simple is better than complex.
Complex is better than complicated.
<pre>`,
  },
  {
    command: "cat started-programming.txt",
    output: `<pre>Unix timestamp: 1426602336</pre>`,
  },
  {
    command: 'echo "Unix timestamp today: $(date  +%s)"',
    output: `Unix timestamp today: 1742221576`,
  },
  {
    command:
      'echo "Andrew has been programming for $(( ($(date +%s) - 1426602057) / 31556952 )) years"',
    output: `<pre>Andrew has been programming for 10 years

</pre>`,
  },
];

let currentCommandIndex = 0;
let isTyping = false;
let currentPromptLine = null;

// Function to add a new line to the terminal
function addLine(text, className) {
  const line = document.createElement("div");
  line.className = className;
  line.innerHTML = text;
  terminal.appendChild(line);
  terminal.scrollTop = terminal.scrollHeight;
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

  // The command is already displayed, just execute it

  // Add output line and animate it
  const outputLine = addLine("", "output");
  await animateText(commandObj.output, outputLine);

  // Increment command index
  currentCommandIndex++;

  // If we've reached the end, disable the button
  if (currentCommandIndex >= commands.length) {
    executeButton.style.display = "none";
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
  // Run the first command automatically after a short delay
  setTimeout(() => {
    // Add the first command without a cursor since it will execute immediately
    currentPromptLine = addLine(
      `<span class="arrow">→</span> <span class="directory">~</span> <span class="prompt">andrew</span> <span class="git-branch">git:(main)</span> <span class="command">${commands[0].command}</span>`,
      ""
    );

    // Execute it
    executeCommand();
  }, 1000);
});
