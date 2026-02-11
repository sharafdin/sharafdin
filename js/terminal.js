(function() {
    // 1. Inject HTML (Terminal Overlay + Trigger Button + CRT Overlay)
    const terminalHTML = `
      <div id="crt-scanline" class="crt-overlay"></div>
      <div id="terminal-overlay" class="hidden" tabindex="0">
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

    // 3.2 Virtual Filesystem
    const initialFs = {
        name: '/',
        type: 'dir',
        children: {
            'home': {
                type: 'dir',
                children: {
                    'visitor': { type: 'dir', children: {} }
                }
            },
            'site': {
                type: 'dir',
                children: {
                    'index.html': { type: 'file' },
                    'blog.html': { type: 'file' },
                    'uses.html': { type: 'file' }
                }
            },
            'readme.txt': { type: 'file', content: 'Welcome to nabadOS terminal. Type help to get started.' }
        }
    };

    let fs = JSON.parse(localStorage.getItem('terminal_fs') || JSON.stringify(initialFs));
    let currentPath = localStorage.getItem('terminal_cwd') || '/home/visitor';

    function saveFs() {
        localStorage.setItem('terminal_fs', JSON.stringify(fs));
        localStorage.setItem('terminal_cwd', currentPath);
    }

    function getDirAndName(path) {
        let parts = path.split('/').filter(p => p);
        if (path.startsWith('/')) {
            // Absolute path logic simplifies to just processing parts from root
        } else {
            // Relative path logic
            const currentParts = currentPath.split('/').filter(p => p);
            parts = [...currentParts, ...parts];
        }
        
        // Handle .. and .
        const resolvedParts = [];
        for (const part of parts) {
            if (part === '..') resolvedParts.pop();
            else if (part !== '.') resolvedParts.push(part);
        }
        
        let current = fs;
        for (const part of resolvedParts) {
            if (current.children && current.children[part]) {
                current = current.children[part];
            } else {
                return null;
            }
        }
        return current;
    }

    function applyTheme(themeName) {
        if (themes[themeName]) {
            document.documentElement.style.setProperty('--term-color', themes[themeName]);
            localStorage.setItem('terminal_theme', themeName);
            return true;
        }
        return false;
    }
    applyTheme(currentTheme);
    
    // 3.3 Audio Framework (Progammatic Clicks)
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    function playClick() {
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(150 + Math.random() * 50, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.05);
    }

    function updatePrompt() {
        const shortPath = currentPath === '/home/' + userName ? '~' : currentPath;
        promptText.textContent = `${userName}@sharafdin:${shortPath}$`;
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
            overlay.focus(); // Focus overlay first
            input.focus();
            triggerBtn.style.display = 'none';
            if (!hasBooted) {
                runBootSequence();
            }
        } else {
            triggerBtn.style.display = 'flex';
        }
    }

    // Add click-to-focus for the entire overlay
    overlay.addEventListener('click', () => {
        input.focus();
    });
    
    // 6. Command Logic
    input.addEventListener('keydown', (e) => {
        playClick();
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

        if (e.key === 'Tab') {
            e.preventDefault();
            const val = input.value.toLowerCase();
            const cmdList = Object.keys(commands);
            const matches = cmdList.filter(c => c.startsWith(val));
            
            if (matches.length === 1) {
                input.value = matches[0];
            } else if (matches.length > 1) {
                printCommand(val);
                printOutput(`Suggestions: ${matches.join(', ')}`);
            }
        }
    });

    function printCommand(cmd) {
        const shortPath = currentPath === '/home/' + userName ? '~' : currentPath;
        output.innerHTML += `<div><span class="terminal-prompt">${userName}@sharafdin:${shortPath}$</span> ${escapeHtml(cmd)}</div>`;
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
            printOutput("Available commands:\n  help     - Show this help message\n  man      - View system manual / command details\n  ls       - List available pages\n  cat      - Go to a page (e.g., 'cat blog')\n  tree     - Show site directory structure\n  demo     - Automated OS tour\n  scan     - Run security audit\n  scanline - Toggle live scan overlay\n  neofetch - Show nabadOS system info\n  projects - List major engineering projects\n  stats    - Display system resources\n  history  - Show command history\n  setname  - Change your username\n  theme    - Change terminal theme\n  unlock   - Toggle Developer Mode\n  clear    - Clear terminal output\n  whoami   - Print current user\n  date     - Print current date\n  exit     - Close terminal\n\n[TIP] Type 'man [command]' for detailed usage.");
        },
        man: (args) => {
            const topic = args[0] ? args[0].toLowerCase() : null;
            if (!topic) {
                printOutput("nabadOS SYSTEM MANUAL\n---------------------\nUsage: man [command]\n\nAvailable topics: help, ls, cat, tree, demo, scan, scanline, neofetch, projects, stats, history, theme, setname, unlock, hud, visuals.\n\nType 'man visuals' for aesthetic features.");
                return;
            }

            const manual = {
                help: "Description: Show the list of available commands.",
                man: "Description: View the system manual for a specific command.\nUsage: man [command]",
                ls: "Description: List all pages and posts on the site.\nOutput: A list of filenames.",
                cat: "Description: Navigates to a page or reads a secret file.\nUsage: cat blog, cat welcome, cat [ENCRYPTED].bin\nOutput: 'Navigating to...' or the file content.",
                tree: "Description: Displays a hierarchical view of the filesystem.\nOutput: An ASCII directory tree.",
                demo: "Description: Runs an automated tour of the terminal's core features.",
                scan: "Description: Simulates a deep system security audit.",
                scanline: "Description: Toggles the CRT 'Live Scan' background animation.",
                neofetch: "Description: Shows hardware info and the nabadOS logo.",
                projects: "Description: Detailed list of major engineering projects like Soplang and nabadOS.",
                stats: "Description: Displays real-time mock system resource usage.",
                history: "Description: Show the last 50 commands executed in the current session.",
                theme: "Description: Changes the terminal color palette.\nUsage: theme [classic|amber|matrix|cyberpunk|brutalist]",
                setname: "Description: Updates your terminal username saved in session.\nUsage: setname [new_name]",
                clear: "Description: Clears the terminal screen buffer.",
                whoami: "Description: Prints the currently logged-in username.",
                date: "Description: Prints the current system date and time.",
                exit: "Description: Closes the nabadOS terminal interface.",
                unlock: "Description: Secret command to activate Developer Mode.\nOutput: Shifted accent color and status badge.",
                hud: "Display: View persistent CPU, Network, and Locale stats in the corner.",
                visuals: "Display: Aesthetic features including CRT scanlines, Glitch headers, and background grain."
            };

            if (manual[topic]) {
                printOutput(`\nMANUAL: ${topic.toUpperCase()}\n----------------------\n${manual[topic]}`);
            } else {
                printOutput(`man: no entry for ${topic}`);
            }
        },
        ls: (args) => {
            const targetPath = args[0] || '.';
            const target = getDirAndName(targetPath);
            if (target && target.type === 'dir') {
                const names = Object.keys(target.children).sort();
                if (names.length === 0) return;
                printOutput(names.join('  '));
            } else if (target && target.type === 'file') {
                printOutput(targetPath);
            } else {
                printOutput(`ls: cannot access '${targetPath}': No such file or directory`);
            }
        },
        cd: (args) => {
            const targetPath = args[0] || '/home/' + userName;
            const target = getDirAndName(targetPath);
            if (target && target.type === 'dir') {
                // Resolve the actual new path
                let parts = targetPath.split('/').filter(p => p);
                if (!targetPath.startsWith('/')) {
                    const currentParts = currentPath.split('/').filter(p => p);
                    parts = [...currentParts, ...parts];
                }
                const resolvedParts = [];
                for (const part of parts) {
                    if (part === '..') resolvedParts.pop();
                    else if (part !== '.') resolvedParts.push(part);
                }
                currentPath = '/' + resolvedParts.join('/');
                if (currentPath === '') currentPath = '/';
                saveFs();
                updatePrompt();
            } else if (target && target.type === 'file') {
                printOutput(`bash: cd: ${targetPath}: Not a directory`);
            } else {
                printOutput(`bash: cd: ${targetPath}: No such file or directory`);
            }
        },
        pwd: () => {
            printOutput(currentPath);
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
            
            const getOS = () => {
                const ua = window.navigator.userAgent;
                if (ua.indexOf("Win") != -1) return "Windows";
                if (ua.indexOf("Mac") != -1) return "macOS";
                if (ua.indexOf("Linux") != -1) return "Linux";
                if (ua.indexOf("Android") != -1) return "Android";
                if (ua.indexOf("like Mac") != -1) return "iOS";
                return "Unknown OS";
            };

            const getBrowser = () => {
                const ua = window.navigator.userAgent;
                if (ua.indexOf("Chrome") != -1) return "Chrome";
                if (ua.indexOf("Firefox") != -1) return "Firefox";
                if (ua.indexOf("Safari") != -1) return "Safari";
                if (ua.indexOf("Edge") != -1) return "Edge";
                return "Unknown Browser";
            };

            const stats = `
  OS: ${getOS()} (Guest)
  Host: sharafdin.com
  Browser: ${getBrowser()}
  Resolution: ${window.screen.width}x${window.screen.height}
  Uptime: ${Math.floor(performance.now() / 1000)}s
  Shell: nabad-sh 1.2.0
  Theme: ${currentTheme}
  Locale: ${document.documentElement.lang.toUpperCase()}
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
            let inputPath = args[0] || "";
            if (!inputPath) return printOutput("Usage: cat [filename]");
            
            const target = getDirAndName(inputPath);
            if (target && target.type === 'file') {
                if (target.content !== undefined) {
                    printOutput(target.content);
                } else {
                    // It's a site file placeholder in our FS
                    handleSiteFile(inputPath);
                }
            } else if (inputPath.toLowerCase().includes("encrypted.bin") || inputPath.toLowerCase() === "encrypted") {
                 startHacking();
            } else if (target && target.type === 'dir') {
                printOutput(`cat: ${inputPath}: Is a directory`);
            } else {
                // Fallback for direct site file access if not in virtual FS
                handleSiteFile(inputPath);
            }
        },
        mkdir: (args) => {
            const name = args[0];
            if (!name) return printOutput("Usage: mkdir [directory]");
            let targetDir = getDirAndName('.');
            if (!targetDir || targetDir.type !== 'dir') return;
            if (targetDir.children[name]) return printOutput(`mkdir: cannot create directory ‘${name}’: File exists`);
            targetDir.children[name] = { type: 'dir', children: {} };
            saveFs();
        },
        touch: (args) => {
            const name = args[0];
            if (!name) return printOutput("Usage: touch [file]");
            let targetDir = getDirAndName('.');
            if (!targetDir || targetDir.type !== 'dir') return;
            if (!targetDir.children[name]) {
                targetDir.children[name] = { type: 'file', content: '' };
                saveFs();
            }
        },
        rm: (args) => {
            const name = args[0];
            if (!name) return printOutput("Usage: rm [file/dir]");
            let targetDir = getDirAndName('.');
            if (!targetDir || targetDir.type !== 'dir') return;
            if (targetDir.children[name]) {
                delete targetDir.children[name];
                saveFs();
            } else {
                printOutput(`rm: cannot remove '${name}': No such file or directory`);
            }
        },
        sudo: () => {
             printOutput(`${userName} is not in the sudoers file. This incident will be reported.`);
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
            if (!newTheme) {
                const available = Object.keys(themes).join(', ');
                return printOutput(`Current theme: ${currentTheme}\nAvailable themes: ${available}\nUsage: theme [name]`);
            }
            
            if (applyTheme(newTheme)) {
                currentTheme = newTheme;
                printOutput(`Success: Theme changed to '${newTheme}'`);
            } else {
                printOutput(`Error: Theme '${newTheme}' not found. Try: ${Object.keys(themes).join(', ')}`);
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
        }
    };

    async function startHacking() {
        overlay.classList.add('hacking-alert');
        printOutput("[ALRT] UNAUTHORIZED DATA ACCESS DETECTED", false);
        await new Promise(r => setTimeout(r, 600));
        
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+";
        const lines = 8;
        for (let i = 0; i < lines; i++) {
            let garbled = "";
            for (let j = 0; j < 30; j++) garbled += chars[Math.floor(Math.random() * chars.length)];
            printOutput(`DECODING: ${garbled}...`, false);
            await new Promise(r => setTimeout(r, 100));
            overlay.scrollTop = overlay.scrollHeight;
        }

        overlay.classList.remove('hacking-alert');
        printOutput("BYPASSING ENCRYPTION LAYER... [OK]", false);
        await new Promise(r => setTimeout(r, 400));
        
        // Progress Bar
        const barLength = 20;
        const progressDiv = document.createElement('div');
        output.appendChild(progressDiv);
        for (let i = 0; i <= barLength; i++) {
            const percent = Math.floor((i / barLength) * 100);
            const bar = "█".repeat(i) + "░".repeat(barLength - i);
            progressDiv.textContent = `DECRYPTING: [${bar}] ${percent}%`;
            await new Promise(r => setTimeout(r, 80));
            overlay.scrollTop = overlay.scrollHeight;
        }

        await new Promise(r => setTimeout(r, 500));
        printOutput("\nACCESS GRANTED.\n", false);
        
        const vision = "--- VISION 2027 ---\n'Technology is a tool for liberation. Soplang will bridge the gap between low-level engineering and the Somali people.'\n- Sharafdin";
        
        // Typewriter reveal
        const visionDiv = document.createElement('div');
        visionDiv.style.color = "var(--accent, #33ff00)";
        visionDiv.style.textShadow = "0 0 10px var(--accent, #33ff00)";
        output.appendChild(visionDiv);
        
        for (let i = 0; i < vision.length; i++) {
            visionDiv.textContent += vision[i];
            if (vision[i] === "\n") overlay.scrollTop = overlay.scrollHeight;
            await new Promise(r => setTimeout(r, 30));
        }
        overlay.scrollTop = overlay.scrollHeight;
    }

    function handleSiteFile(input) {
        const file = input.replace('site/', '').replace('posts/', '').replace('.html', '').toLowerCase();
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
            printOutput(`cat: ${input}: No such file or directory`);
        }
    }

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
