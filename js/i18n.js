const translations = {
    en: {
        "header.title": "Mr Sharafdin",
        "header.subtitle": "Self-taught Innovator, Trier, and Open-Source Contributor",
        "nav.home": "HOME",
        "nav.about": "ABOUT",
        "nav.projects": "PROJECTS",
        "nav.blog": "BLOG",
        "nav.uses": "USES",
        "nav.research": "RESEARCH",
        "nav.contact": "CONTACT",
        "about.title": "About",
        "about.p1": "Sharafdin began coding at age 12, became a tech mentor by 16, created his own programming language Soplang at 17, and built a custom Debian-based operating system by 18. Today, he continues to innovate across open source, language design, and developer mentorship.",
        "about.p2": "His work spans low-level system programming, blockchain development, security research, and software tools, all driven by a commitment to problem-solving and sharing knowledge with others.",
        "projects.title": "Engineering",
        "projects.intro": "As an active developer, he builds and maintains projects that help developers and researchers.",
        "projects.explore": "Explore more on Sharafdin's GitHub Profile.",
        "community.title": "Community",
        "community.p1": "Mr Sharafdin actively contributes to open-source communities and fosters discussions around technology, programming, and security.",
        "research.title": "Science",
        "research.intro": "Beyond programming, Mr Sharafdin is deeply involved in scientific research.",
        "research.item1": "Astrophysics & Cosmology – Exploring the universe through independent research.",
        "research.item2": "Gemology & Chemistry – Studying the structure and properties of materials.",
        "research.item3": "Data Science & Machine Learning – Building practical AI-driven solutions.",
        "research.p1": "His passion for space exploration led him to achieve an astrophysics milestone in August 2021.",
        "contact.title": "Contact",
        "contact.message": "Feel free to reach out for collaboration, questions about projects, or just to connect!",
        "contact.send_email": "Send Email",
        "blog.recent_title": "Latest from the Blog",
        "blog.view_all": "VIEW ALL POSTS",
        "footer.copyright": "Copyright © 2026 Mr Sharafdin. All rights reserved.",
        "footer.designed": "Designed and developed by Mr Sharafdin.",
        "writing.title": "WRITING",
        "writing.subtitle": "Thoughts on systems, security, and open source.",
        "uses.title": "USES",
        "uses.subtitle": "A curated list of the hardware, software, and tools I use daily."
    },
    so: {
        "header.title": "Mr Sharafdin",
        "header.subtitle": "Hal-abuur Is-baray, Tijaabiye, iyo Xubin ka tirsan Open-Source",
        "nav.home": "HOOYGA",
        "nav.about": "KU SAABSAN",
        "nav.projects": "MASHRUUCYADA",
        "nav.blog": "BLOG",
        "nav.uses": "AGABKA",
        "nav.research": "CILMI-BAARIS",
        "nav.contact": "XIRIIR",
        "about.title": "Ku Saabsan",
        "about.p1": "Sharafdin wuxuu bilaabay qorista koodhka isagoo 12 jir ah, wuxuu noqday hage dhanka teknoolojiyadda ah markuu 16 jir ahaa, wuxuu sameeyay luuqaddiisa barnaamijaynta ee 'Soplang' isagoo 17 jir ah, wuxuuna dhisay nidaamka ku-shaqaynta (OS) ee Debian-ka ku salaysan isagoo 18 jir ah. Maanta, wuxuu sii wataa hal-abuurkiisa dhanka Open Source-ka, naqshadaynta luuqadaha, iyo hagidda horumariyayaasha.",
        "about.p2": "Shaqadiisu waxay isugu jirtaa barnaamijaynta nidaamyada hoose (low-level), horumarinta blockchain, baarista amniga, iyo aaladaha software-ka, kuwaas oo dhammaantood ay bud-dhig u tahay xallinta dhibaatooyinka iyo la wadaagidda aqoonta dadka kale.",
        "projects.title": "Engineering",
        "projects.intro": "Maadaama uu yahay horumariye firfircoon, wuxuu dhisaa oo uu dayactiraa mashruucyo caawiya horumariyayaasha iyo baarayaasha.",
        "projects.explore": "Wax badan ka eeg Bogga GitHub ee Sharafdin.",
        "community.title": "Bulshada",
        "community.p1": "Mr Sharafdin wuxuu si firfircoon uga qayb qaataa bulshooyinka open-source-ka, wuxuuna dhiirigeliyaa wadahadallada ku saabsan teknoolojiyadda, barnaamijaynta, iyo amniga.",
        "research.title": "Sayniska",
        "research.intro": "Marka laga soo tago barnaamijaynta, Mr Sharafdin wuxuu si qoto dheer ugu lug leeyahay cilmi-baarista iyo sahaminta sayniska.",
        "research.item1": "Astrophysics & Cosmology – Sahaminta koonka iyadoo la adeegsanayo cilmi-baaris madax-bannaan.",
        "research.item2": "Gemology & Chemistry – Barashada qaab-dhismeedka iyo sifooyinka curiyeyaasha iyo macdanta.",
        "research.item3": "Data Science & Machine Learning – Dhisidda xalal wax-ku-ol ah oo ku shaqeeya AI.",
        "research.p1": "Xiisaha uu u qabo sahaminta hawada sare ayaa u horseeday inuu gaaro guul la taaban karo oo dhanka Astrophysics-ka ah bishii Agoosto 2021.",
        "contact.title": "Xiriir",
        "contact.message": "Fadlan xor u ahow inaad nala soo xiriirto wixii ku saabsan iskaashi, su'aalo ku saabsan mashruucyada, ama si aan isku baranno!",
        "contact.send_email": "Dir Email",
        "blog.recent_title": "Kuwa ugu dambeeyay Blog-ga",
        "blog.view_all": "EIG DHAMMAAN QORAALLADA",
        "footer.copyright": "Xuquuqda daabacaadda © 2026 Mr Sharafdin. Dhammaan xuquuqdu way dhawran tahay.",
        "footer.designed": "Waxaa naqshadeeyay oo horumariyay Mr Sharafdin.",
        "writing.title": "QORAALLADA",
        "writing.subtitle": "Fikirka ku saabsan nidaamyada, amniga, iyo il-furan (open source).",
        "uses.title": "AGABKA",
        "uses.subtitle": "Liis la soo xulay oo ah qalabka ay ku jiraan hardware, software, iyo aaladaha aan isticmaalo maalin kasta."
    }
};

function setLanguage(lang) {
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach((element) => {
        const key = element.getAttribute("data-i18n");
        if (translations[lang] && translations[lang][key]) {
            const translation = translations[lang][key];
            
            // Check if we need to preserve data-text for glitch effect
            if (element.classList.contains('glitch')) {
                element.setAttribute('data-text', translation);
            }
            
            element.textContent = translation;
        }
    });

    document.querySelectorAll(".lang-btn").forEach((btn) => {
        if (btn.getAttribute("data-lang") === lang) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });
    localStorage.setItem("preferredLanguage", lang);
}

document.addEventListener("DOMContentLoaded", function () {
    const savedLang = localStorage.getItem("preferredLanguage") || "en";
    setLanguage(savedLang);
    document.querySelectorAll(".lang-btn").forEach((btn) => {
        btn.addEventListener("click", function () {
            const lang = this.getAttribute("data-lang");
            setLanguage(lang);
        });
    });
});
