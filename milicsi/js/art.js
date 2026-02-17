/**
 * Generative Background Art
 * Subtle, organic flow field animation that adapts to theme.
 */

(function () {
  'use strict';

  const canvas = document.createElement('canvas');
  canvas.id = 'bg-canvas';
  // Styles are handled in CSS, but we need to ensure it's in the DOM
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let animationId;
  let theme = 'light'; // default

  // Configuration
  const CONFIG = {
    particleCount: 80, // Increased count
    particleSpeed: 0.2,
    particleSize: 1.5, // Reduced size
    noiseScale: 0.005,
    colors: {
      light: {
        bg: 'transparent',
        particle: 'hsla(36, 45%, 42%, 0.3)' // Reduced opacity
      },
      dark: {
        bg: 'transparent',
        particle: 'hsla(40, 33%, 96%, 0.2)' // Reduced opacity
      }
    }
  };

  // Simplex Noise implementation (lightweight version for flow field)
  // Based on standard implementation
  const SimplexNoise = (function() {
    // A simple, fast pseudo-random number generator
    // Using a fixed seed for reproducible fields if needed, or random
    let seed = Math.random();
    
    // Gradient vectors
    const grad3 = [
      [1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],
      [1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],
      [0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]
    ];
    
    // Permutation table
    const p = [];
    for (let i=0; i<256; i++) p[i] = Math.floor(Math.random()*256);
    
    // To remove the need for index wrapping, double the permutation table length
    const perm = new Array(512);
    const gradP = new Array(512);
    
    for (let i=0; i<512; i++) {
        perm[i] = p[i & 255];
        gradP[i] = grad3[perm[i] % 12];
    }
    
    // Skewing and unskewing factors
    const F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
    const G2 = (3.0 - Math.sqrt(3.0)) / 6.0;

    return {
        noise2D: function(xin, yin) {
            let n0, n1, n2; // Noise contributions from the three corners
            // Skew the input space to determine which simplex cell we're in
            const s = (xin + yin) * F2; // Hairy factor for 2D
            const i = Math.floor(xin + s);
            const j = Math.floor(yin + s);
            const t = (i + j) * G2;
            const X0 = i - t; // Unskew the cell origin back to (x,y) space
            const Y0 = j - t;
            const x0 = xin - X0; // The x,y distances from the cell origin
            const y0 = yin - Y0;
            
            // For the 2D case, the simplex shape is an equilateral triangle.
            // Determine which simplex we are in.
            let i1, j1; // Offsets for second (middle) corner of simplex in (i,j) coords
            if (x0 > y0) { i1 = 1; j1 = 0; } // lower triangle, XY order: (0,0)->(1,0)->(1,1)
            else { i1 = 0; j1 = 1; } // upper triangle, YX order: (0,0)->(0,1)->(1,1)
            
            // A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
            // a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
            // c = (3-sqrt(3))/6
            const x1 = x0 - i1 + G2; // Offsets for middle corner in (x,y) unskewed coords
            const y1 = y0 - j1 + G2;
            const x2 = x0 - 1.0 + 2.0 * G2; // Offsets for last corner in (x,y) unskewed coords
            const y2 = y0 - 1.0 + 2.0 * G2;
            
            // Work out the hashed gradient indices of the three simplex corners
            const ii = i & 255;
            const jj = j & 255;
            const gi0 = gradP[ii + perm[jj]];
            const gi1 = gradP[ii + i1 + perm[jj + j1]];
            const gi2 = gradP[ii + 1 + perm[jj + 1]];
            
            // Calculate the contribution from the three corners
            let t0 = 0.5 - x0*x0 - y0*y0;
            if (t0 < 0) n0 = 0.0;
            else {
                t0 *= t0;
                n0 = t0 * t0 * (gi0[0]*x0 + gi0[1]*y0);
            }
            
            let t1 = 0.5 - x1*x1 - y1*y1;
            if (t1 < 0) n1 = 0.0;
            else {
                t1 *= t1;
                n1 = t1 * t1 * (gi1[0]*x1 + gi1[1]*y1);
            }
            
            let t2 = 0.5 - x2*x2 - y2*y2;
            if (t2 < 0) n2 = 0.0;
            else {
                t2 *= t2;
                n2 = t2 * t2 * (gi2[0]*x2 + gi2[1]*y2);
            }
            
            // Add contributions from each corner to get the final noise value.
            // The result is scaled to return values in the interval [-1,1].
            return 70.0 * (n0 + n1 + n2);
        }
    };
  })();

  // Particle Class
  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = 0;
      this.vy = 0;
      this.life = Math.random() * 100 + 100;
      this.alpha = 0;
      this.maxAlpha = Math.random() * 0.5 + 0.2; // Varies per particle
    }

    update() {
      // Get noise value at current position
      const n = SimplexNoise.noise2D(this.x * CONFIG.noiseScale, this.y * CONFIG.noiseScale);
      // Convert noise to angle (0 to 2PI)
      const angle = n * Math.PI * 2;
      
      // Update velocity based on angle
      this.vx = Math.cos(angle) * CONFIG.particleSpeed;
      this.vy = Math.sin(angle) * CONFIG.particleSpeed;
      
      // Add a tiny bit of random drift
      this.vx += (Math.random() - 0.5) * 0.05;
      this.vy += (Math.random() - 0.5) * 0.05;

      // Update position
      this.x += this.vx;
      this.y += this.vy;

      // Wrap around screen
      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      if (this.y > height) this.y = 0;

      // Fade in/out logic
      if (this.life > 20) {
          if (this.alpha < this.maxAlpha) this.alpha += 0.01;
      } else {
          if (this.alpha > 0) this.alpha -= 0.01;
      }
      this.life--;

      if (this.life <= 0) {
          this.reset();
          this.alpha = 0; // Ensure it starts invisible
      }
    }

    draw() {
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = theme === 'dark' ? CONFIG.colors.dark.particle : CONFIG.colors.light.particle;
      ctx.beginPath();
      ctx.arc(this.x, this.y, CONFIG.particleSize, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    
    // Re-initialize particles on drastic resize if needed,
    // but just updating bounds is usually enough.
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < CONFIG.particleCount; i++) {
        particles.push(new Particle());
    }
  }

  function checkTheme() {
    const root = document.documentElement;
    const currentTheme = root.getAttribute('data-theme');
    theme = currentTheme || 'light';
  }

  function animate() {
    // Check if reduced motion is preferred
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Check theme every frame? No, better to listen to attribute changes. 
    // But MutationObserver is safer for standard 'data-theme' toggles.
    // For simplicity, we can check a few times or use an observer.
    // Optimization: Just clear rect.
    
    ctx.clearRect(0, 0, width, height);
    
    particles.forEach(p => {
        p.update();
        p.draw();
    });

    animationId = requestAnimationFrame(animate);
  }

  // Init
  window.addEventListener('resize', resize);
  resize();
  initParticles();
  
  // Theme observer
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
        checkTheme();
      }
    });
  });
  observer.observe(document.documentElement, { attributes: true });
  checkTheme(); // Initial check

  // Start loop
  animate();

})();
