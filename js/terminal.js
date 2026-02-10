(function() {
    // 1. Inject HTML (Terminal Overlay + Trigger Button + CRT Overlay)
    const terminalHTML = `
      <div id="crt-scanline" class="crt-overlay"></div>
      <div id="terminal-overlay" class="hidden">
        <div class="terminal-output" id="terminal-output"></div>
        <div class="terminal-input-line hidden" id="terminal-input-row">
            <span class="terminal-prompt" id="terminal-prompt-text">visitor@sharafdin:~$</span>
            <input type="text" id="terminal-input" autocomplete="off" spellcheck="false" />
        </div>
        <div class="terminal-hint">Press ESC or type 'exit' to close</div>
      </div>
      <button id="terminal-trigger-btn" class="terminal-trigger" title="Open Terminal">TERM</button>
      <div id="system-hud" class="hud-overlay">
        <span id="hud-cpu">CPU: [||||      ] 32%</span>
        <span id="hud-net">NET: ENCRYPTED</span>
        <span id="hud-locale">LOCALE: EN_US</span>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', terminalHTML);
    
    // 2. DOM Elements
    const overlay = document.getElementById('terminal-overlay');
    const input = document.getElementById('terminal-input');
    const output = document.getElementById('terminal-output');
    const promptRow = document.getElementById('terminal-input-row');
    const promptText = document.getElementById('terminal-prompt-text');
    const triggerBtn = document.getElementById('terminal-trigger-btn');
    
    // 3. State & Persistence
    let history = JSON.parse(localStorage.getItem('terminal_history') || '[]');
    let historyIndex = history.length;
    let userName = localStorage.getItem('terminal_user_name') || 'visitor';
    let currentTheme = localStorage.getItem('terminal_theme') || 'classic';
    let hasBooted = false;
    
    const themes = {
        classic: '#33ff00',
        amber: '#ffb000',
        matrix: '#00ff41',
        cyberpunk: '#ff00ff',
        brutalist: '#ffffff'
    };

    function applyTheme(themeName) {
        if (themes[themeName]) {
            document.documentElement.style.setProperty('--term-color', themes[themeName]);
            localStorage.setItem('terminal_theme', themeName);
            return true;
        }
        return false;
    }
    applyTheme(currentTheme);
    
    function updatePrompt() {
        promptText.textContent = `${userName}@sharafdin:~$`;
        const hudLocale = document.getElementById('hud-locale');
        if (hudLocale) {
            const currentLang = document.documentElement.lang.toUpperCase();
            hudLocale.textContent = `LOCALE: ${currentLang === 'SO' ? 'SO_639' : 'EN_US'}`;
        }
    }
    updatePrompt();

    // 3.1 HUD Real-time Mock Stats
    function updateHUDStats() {
        const cpu = document.getElementById('hud-cpu');
        if (!cpu) return;
        const load = Math.floor(Math.random() * 40) + 10;
        const bars = Math.floor(load / 10);
        const barStr = "[" + "|".repeat(bars) + " ".repeat(10 - bars) + "]";
        cpu.textContent = `CPU: ${barStr} ${load}%`;
    }
    setInterval(updateHUDStats, 3000);
    
    // 4. Boot Sequence
    async function runBootSequence() {
        hasBooted = true;
        promptRow.classList.add('hidden');
        output.innerHTML = '';
        
        const bootLines = [
            "nabadOS(tm) Kernel Version 2.4.0-release",
            "Checking memory... 32768MB OK",
            "Initializing sharafdin-core modules...",
            "Loading drivers: Soplang-VM, nabad-FS, grid-NET",
            "Mounting /dev/sda1 on / (nabadfs, read-only)",
            "System check complete. No errors found.",
            "Starting nabadOS Shell v1.2.0...",
            "---------------------------------------",
            "Welcome back, " + userName + ".",
            "Type 'help' for a list of available commands."
        ];

        for (const line of bootLines) {
            await new Promise(r => setTimeout(r, Math.random() * 200 + 50));
            printOutput(line);
            overlay.scrollTop = overlay.scrollHeight;
        }
        
        promptRow.classList.remove('hidden');
        input.focus();
    }

    // 5. Toggle Visibility
    triggerBtn.addEventListener('click', toggleTerminal);

    document.addEventListener('keydown', (e) => {
        if (e.key === '`' || e.key === '~') {
            e.preventDefault();
            toggleTerminal();
        }
        if (e.key === 'Escape' && !overlay.classList.contains('hidden')) {
            toggleTerminal();
        }
    });
    
    function toggleTerminal() {
        overlay.classList.toggle('hidden');
        if (!overlay.classList.contains('hidden')) {
            input.focus();
            triggerBtn.style.display = 'none';
            if (!hasBooted) {
                runBootSequence();
            }
        } else {
            triggerBtn.style.display = 'flex';
        }
    }
    
    // 6. Command Logic
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = input.value.trim();
            if (command) {
                printCommand(command);
                handleCommand(command);
                history.push(command);
                if (history.length > 50) history.shift();
                localStorage.setItem('terminal_history', JSON.stringify(history));
                historyIndex = history.length;
            }
            input.value = '';
            overlay.scrollTop = overlay.scrollHeight;
        }
        
        if (e.key === 'ArrowUp') {
            if (historyIndex > 0) {
                historyIndex--;
                input.value = history[historyIndex];
            }
            e.preventDefault();
        }
        
        if (e.key === 'ArrowDown') {
            if (historyIndex < history.length - 1) {
                historyIndex++;
                input.value = history[historyIndex];
            } else {
                historyIndex = history.length;
                input.value = '';
            }
            e.preventDefault();
        }
    });

    function printCommand(cmd) {
        output.innerHTML += `<div><span class="terminal-prompt">${userName}@sharafdin:~$</span> ${escapeHtml(cmd)}</div>`;
    }
    
    function printOutput(text, isHTML = false) {
        const div = document.createElement('div');
        if (isHTML) div.innerHTML = text;
        else div.textContent = text;
        output.appendChild(div);
    }
    
    function escapeHtml(text) {
        return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }

    const commands = {
        help: () => {
            printOutput("Available commands:\n  help     - Show this help message\n  ls       - List available pages\n  cat      - Go to a page (e.g., 'cat blog')\n  tree     - Show site directory structure\n  demo     - Automated OS tour\n  scan     - Run security audit\n  scanline - Toggle live scan overlay\n  neofetch - Show nabadOS system info\n  projects - List major engineering projects\n  stats    - Display system resources\n  history  - Show command history\n  setname  - Change your username\n  theme    - Change terminal theme\n  clear    - Clear terminal output\n  whoami   - Print current user\n  date     - Print current date\n  exit     - Close terminal");
        },
        ls: () => {
            printOutput("index.html\nblog.html\nuses.html\nposts/\n  go-simplicity.html\n  rust-reborn.html\n  welcome.html");
        },
        tree: () => {
            printOutput(".\n├── index.html\n├── blog.html\n├── uses.html\n├── js/\n│   ├── i18n.js\n│   └── terminal.js\n├── css/\n│   └── style.css\n└── posts/\n    ├── go-simplicity.html\n    ├── rust-reborn.html\n    └── welcome.html\n    └── [ENCRYPTED].bin");
        },
        projects: () => {
            printOutput("MAJOR PROJECTS:\n--------------\n[Soplang]  - A high-performance, domain-specific programming language.\n[nabadOS]  - An experimental, security-focused kernel and OS.\n[Research] - Decentralized consensus mechanisms and formal verification.");
        },
        stats: () => {
            const uptime = Math.floor(performance.now() / 1000);
            printOutput(`SYSTEM STATS:\n-------------\nOS: nabadOS v2.4.0\nUptime: ${uptime}s\nKernel: 5.15.0-generic\nCPU: nOS Neural Core (8 Cores)\nMemory: 12.4GB / 32.0GB\nStatus: [OPTIMAL]`);
        },
        scan: async () => {
            printOutput("Initializing security audit...");
            const steps = [
                "[*] Checking SSL/TLS configuration... [OK]",
                "[*] Scanning for SQL injection entry points... [NONE FOUND]",
                "[*] Verifying firewall rules (grid-NET)... [ACTIVE]",
                "[*] Audit complete: System status [SECURE]"
            ];
            for (const step of steps) {
                await new Promise(r => setTimeout(r, 600 + Math.random() * 400));
                printOutput(step);
                overlay.scrollTop = overlay.scrollHeight;
            }
        },
        neofetch: () => {
            const logo = `
   _ __   __ _ | |__   __ _   __| | / _ \\ / ___|
  | '_ \\ / _\` || '_ \\ / _\` | / _\` | | | | |\\___ \\
  | | | | (_| || |_) | (_| || (_| | | |_| | ___) |
  |_| |_|\\__,_||_.__/ \\__,_| \\__,_|  \\___/ |____/
            `;
            const stats = `
  OS: nabadOS v2.4.0 x86_64
  Host: sharafdin.com
  Kernel: 5.15.0-generic
  Uptime: ${Math.floor(performance.now() / 1000)}s
  Shell: nabad-sh 1.2.0
  CPU: nOS Neural Core i7
  Memory: 12.4GB / 32.0GB
  Theme: ${currentTheme}
            `;
            printOutput(logo + "\n" + stats, false);
        },
        history: () => {
            printOutput(history.join("\n"));
        },
        unlock: () => {
            document.body.classList.toggle('dev-mode');
            const isActive = document.body.classList.contains('dev-mode');
            document.documentElement.style.setProperty('--accent', isActive ? '#ffcc00' : '#333333');
            printOutput(isActive ? "[SUCCESS] Developer Mode unlocked. Accent color shifted." : "Developer Mode disabled.");
        },
        scanline: () => {
            document.body.classList.toggle('live-scan');
            const isScanning = document.body.classList.contains('live-scan');
            printOutput(isScanning ? "[ACTIVE] Live Scan overlay enabled." : "[OFF] Live Scan overlay disabled.");
        },
        demo: async () => {
            printOutput("[TOUR] Starting automated nabadOS demonstration...");
            const sequence = [
                { cmd: "neofetch", delay: 1500 },
                { cmd: "tree", delay: 1500 },
                { cmd: "stats", delay: 1500 },
                { cmd: "scan", delay: 3000 },
                { cmd: "scanline", delay: 1000 }
            ];
            
            for (const step of sequence) {
                await new Promise(r => setTimeout(r, 1000));
                printCommand(step.cmd);
                handleCommand(step.cmd);
                await new Promise(r => setTimeout(r, step.delay));
                overlay.scrollTop = overlay.scrollHeight;
            }
            printOutput("[TOUR] Demonstration complete. Feel free to explore manually.");
        },
        cat: (args) => {
            const file = args[0] ? args[0].replace('.html', '') : null;
            if (!file) return printOutput("Usage: cat [filename]");
            
            if (file === "[ENCRYPTED].bin" || file === "encrypted") {
                printOutput("HACKING ATTEMPT DETECTED...\nDECRYPTING: #################### 100%\nACCESS GRANTED.");
                printOutput("\n--- VISION 2027 ---\n'Technology is a tool for liberation. nabadOS will bridge the gap between low-level engineering and the Somali people.'\n- Sharafdin");
                return;
            }
            
            const mapping = {
                'index': 'index.html',
                'blog': 'blog.html',
                'uses': 'uses.html',
                'welcome': 'posts/welcome.html',
                'go': 'posts/go-simplicity.html',
                'rust': 'posts/rust-reborn.html'
            };
            
            let prefix = window.location.pathname.includes('/posts/') ? '../' : '';

            if (mapping[file]) {
                let target = mapping[file];
                if (prefix && target.startsWith('posts/')) {
                     target = target.replace('posts/', '');
                }
                
                printOutput(`Navigating to ${file}...`);
                setTimeout(() => {
                    window.location.href = prefix + target;
                }, 500);
            } else {
                printOutput(`cat: ${file}: No such file or directory`);
            }
        },
        setname: (args) => {
            const newName = args[0];
            if (!newName) return printOutput("Usage: setname [name]");
            if (newName.length > 20) return printOutput("Error: Name too long");
            
            userName = newName;
            localStorage.setItem('terminal_user_name', userName);
            updatePrompt();
            printOutput(`Success: User name changed to '${userName}'`);
        },
        theme: (args) => {
            const newTheme = args[0] ? args[0].toLowerCase() : null;
            if (!newTheme) return printOutput(`Current theme: ${currentTheme}\nUsage: theme [classic|amber|matrix|cyberpunk|brutalist]`);
            
            if (applyTheme(newTheme)) {
                currentTheme = newTheme;
                printOutput(`Success: Theme changed to '${newTheme}'`);
            } else {
                printOutput(`Error: Theme '${newTheme}' not found.`);
            }
        },
        clear: () => {
            output.innerHTML = '';
        },
        whoami: () => {
            printOutput(userName);
        },
        date: () => {
            printOutput(new Date().toString());
        },
        exit: () => {
            toggleTerminal();
        },
        sudo: () => {
             printOutput(`${userName} is not in the sudoers file. This incident will be reported.`);
        }
    };

    function handleCommand(inputStr) {
        const parts = inputStr.split(' ');
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1);
        
        if (commands[cmd]) {
            commands[cmd](args);
        } else {
            printOutput(`bash: ${cmd}: command not found`);
        }
    }
})();
