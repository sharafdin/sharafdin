(function() {
    // 1. Inject HTML (Terminal Overlay + Trigger Button)
    const terminalHTML = `
      <div id="terminal-overlay" class="hidden">
        <div class="terminal-output" id="terminal-output">
            Welcome to nabadOS Shell v1.1.0
            Type 'help' to see available commands.
        </div>
        <div class="terminal-input-line">
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
    const promptText = document.getElementById('terminal-prompt-text');
    const triggerBtn = document.getElementById('terminal-trigger-btn');
    
    // 3. State & Persistence
    let history = [];
    let historyIndex = -1;
    let userName = localStorage.getItem('terminal_user_name') || 'visitor';
    let currentTheme = localStorage.getItem('terminal_theme') || 'classic';
    
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
    
    // 4. Toggle Visibility
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
        } else {
            triggerBtn.style.display = 'flex';
        }
    }
    
    // 5. Command Logic
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = input.value.trim();
            if (command) {
                printCommand(command);
                handleCommand(command);
                history.push(command);
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
            printOutput("Available commands:\n  help    - Show this help message\n  ls      - List available pages\n  cat     - Go to a page (e.g., 'cat blog')\n  setname - Change your username (e.g., 'setname Master')\n  theme   - Change terminal theme (classic, amber, matrix, cyberpunk, brutalist)\n  clear   - Clear terminal output\n  whoami  - Print current user\n  date    - Print current date\n  exit    - Close terminal");
        },
        ls: () => {
            printOutput("index.html\nblog.html\nuses.html\nposts/\n  welcome.html");
        },
        cat: (args) => {
            const file = args[0] ? args[0].replace('.html', '') : null;
            if (!file) return printOutput("Usage: cat [filename]");
            
            const mapping = {
                'index': 'index.html',
                'blog': 'blog.html',
                'uses': 'uses.html',
                'welcome': 'posts/welcome.html'
            };
            
            // Adjust path for posts if already in posts/
            let prefix = window.location.pathname.includes('/posts/') ? '../' : '';

            if (mapping[file]) {
                let target = mapping[file];
                if (prefix && !target.startsWith('posts/')) {
                    // target is index/blog/uses
                } else if (prefix && target.startsWith('posts/')) {
                     target = target.replace('posts/', '');
                } else if (!prefix && target.startsWith('posts/')) {
                    // target is correct
                }
                
                printOutput(`Navigating to ${file}...`);
                window.location.href = prefix + target;
            } else {
                printOutput(`cat: ${file}: No such file or directory`);
            }
        },
        setname: (args) => {
            const newName = args[0];
            if (!newName) return printOutput("Usage: setname [name]");
            if (newName.length > 20) return printOutput("Error: Name too long (max 20 chars)");
            
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
            output.innerHTML = 'Welcome to SharafdinOS v1.1.0\nType \'help\' to see available commands.';
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
