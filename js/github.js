(function() {
    async function fetchRepoStats(repo) {
        try {
            const response = await fetch(`https://api.github.com/repos/${repo}`);
            if (!response.ok) return null;
            const data = await response.json();
            return {
                stars: data.stargazers_count,
                forks: data.forks_count,
                language: data.language
            };
        } catch (e) {
            return null;
        }
    }

    async function updateAllStats() {
        const cards = document.querySelectorAll('.project-card[data-repo]');
        for (const card of cards) {
            const repo = card.getAttribute('data-repo');
            const statsDiv = card.querySelector('.project-stats');
            if (repo && statsDiv) {
                const stats = await fetchRepoStats(repo);
                if (stats) {
                    statsDiv.innerHTML = `
                        <span>⭐️ ${stats.stars}</span>
                        <span>🍴 ${stats.forks}</span>
                        <span>${stats.language || ''}</span>
                    `;
                }
            }
        }
    }

    document.addEventListener('DOMContentLoaded', updateAllStats);
})();
