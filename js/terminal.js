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
    }
    updatePrompt();
    
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
            printOutput("Available commands:\n  help     - Show this help message\n  ls       - List available pages\n  cat      - Go to a page (e.g., 'cat blog')\n  projects - List major engineering projects\n  stats    - Display system resources\n  setname  - Change your username\n  theme    - Change terminal theme\n  clear    - Clear terminal output\n  whoami   - Print current user\n  date     - Print current date\n  exit     - Close terminal");
        },
        ls: () => {
            printOutput("index.html\nblog.html\nuses.html\nposts/\n  go-simplicity.html\n  rust-reborn.html\n  welcome.html");
        },
        projects: () => {
            printOutput("MAJOR PROJECTS:\n--------------\n[Soplang]  - A high-performance, domain-specific programming language.\n[nabadOS]  - An experimental, security-focused kernel and OS.\n[Research] - Decentralized consensus mechanisms and formal verification.");
        },
        stats: () => {
            const uptime = Math.floor(performance.now() / 1000);
            printOutput(`SYSTEM STATS:\n-------------\nOS: nabadOS v2.4.0\nUptime: ${uptime}s\nKernel: 5.15.0-generic\nCPU: nOS Neural Core (8 Cores)\nMemory: 12.4GB / 32.0GB\nStatus: [OPTIMAL]`);
        },
        cat: (args) => {
            const file = args[0] ? args[0].replace('.html', '') : null;
            if (!file) return printOutput("Usage: cat [filename]");
            
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
