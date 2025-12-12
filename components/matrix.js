class MatrixBackground extends HTMLElement {
  connectedCallback() {
    // Evitar inicializar dos veces
    if (this._initialized) return;
    this._initialized = true;

    // Inserta canvas como fondo fijo
    this.innerHTML = `<canvas id="matrix-canvas" style="position:fixed;inset:0;z-index:-1;display:block;"></canvas>`;
    const canvas = this.querySelector('#matrix-canvas');
    const ctx = canvas.getContext('2d');

    // Parámetros
    let fontSize = 14;
    let letters = '01';
    let drops = [];
    let columns = 0;
    let width = 0;
    let height = 0;
    let rafId = null;

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // recalcula columnas y drops
      columns = Math.floor(width / fontSize);
      drops = new Array(columns).fill(1);
    }

    function draw() {
      // semitransparente para efecto rastro
      ctx.fillStyle = 'rgba(0, 0, 0, 0.07)';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = '#00ff9d';
      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = letters[Math.floor(Math.random() * letters.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      rafId = requestAnimationFrame(draw);
    }

    // iniciar
    resize();
    window.addEventListener('resize', resize, { passive: true });
    rafId = requestAnimationFrame(draw);

    // limpiar cuando se elimine el elemento
    this._cleanup = () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }

  disconnectedCallback() {
    if (this._cleanup) this._cleanup();
  }
}

customElements.define('matrix-background', MatrixBackground);
