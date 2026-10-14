(function(){
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Painting frame mouse-tilt ---------- */
  var frame = document.getElementById('paintingFrame');
  var hero = document.querySelector('.hero');
  if (frame && hero && !reduceMotion) {
    hero.addEventListener('mousemove', function(e){
      var rect = frame.getBoundingClientRect();
      var cx = rect.left + rect.width/2;
      var cy = rect.top + rect.height/2;
      var rotY = ((e.clientX - cx) / rect.width) * 16;
      var rotX = -((e.clientY - cy) / rect.height) * 16;
      frame.style.transform = 'rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg)';
    });
    hero.addEventListener('mouseleave', function(){
      frame.style.transform = 'rotateX(0deg) rotateY(0deg)';
    });
  }

  /* ---------- Timeline card mouse-tilt ---------- */
  if (!reduceMotion) {
    document.querySelectorAll('[data-tilt]').forEach(function(card){
      card.addEventListener('mousemove', function(e){
        var rect = card.getBoundingClientRect();
        var px = (e.clientX - rect.left) / rect.width;
        var py = (e.clientY - rect.top) / rect.height;
        var rotY = (px - 0.5) * 10;
        var rotX = -(py - 0.5) * 10;
        card.style.transform = 'rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg) translateZ(4px)';
      });
      card.addEventListener('mouseleave', function(){
        card.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(0px)';
      });
    });
  }

  /* ---------- Flip cards: keyboard support ---------- */
  document.querySelectorAll('.flip').forEach(function(card){
    card.addEventListener('keydown', function(e){
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.classList.toggle('is-flipped');
        var inner = card.querySelector('.flip-inner');
        inner.style.transform = card.classList.contains('is-flipped') ? 'rotateY(180deg)' : 'rotateY(0deg)';
      }
    });
  });

  /* ---------- Full-page scroll-driven 3D backdrop ---------- */
  var canvas = document.getElementById('scene-canvas');
  var bgGradient = document.getElementById('bgGradient');
  if (!canvas || !window.THREE) return;

  var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.z = 13;

  function sizeRenderer(){
    var w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  var isSmall = window.innerWidth < 640;

  /* ---- Zone 1: Sun + falling embers (Hero) ---- */
  var sunGroup = new THREE.Group();
  var sun = new THREE.Mesh(
    new THREE.IcosahedronGeometry(2.4, 1),
    new THREE.MeshBasicMaterial({ color: 0xe8b667, wireframe: true, transparent: true, opacity: 0 })
  );
  var core = new THREE.Mesh(
    new THREE.SphereGeometry(1.5, 24, 24),
    new THREE.MeshBasicMaterial({ color: 0xd69a4c, transparent: true, opacity: 0 })
  );
  sunGroup.add(sun, core);
  sunGroup.position.set(4.2, 2.6, -5);
  scene.add(sunGroup);

  var EMBER_N = isSmall ? 90 : 170;
  var emberPos = new Float32Array(EMBER_N * 3);
  var emberSpeed = new Float32Array(EMBER_N);
  for (var i = 0; i < EMBER_N; i++) {
    emberPos[i*3]   = (Math.random() - 0.5) * 22;
    emberPos[i*3+1] = Math.random() * 18 - 6;
    emberPos[i*3+2] = (Math.random() - 0.5) * 10 - 2;
    emberSpeed[i] = 0.008 + Math.random() * 0.018;
  }
  var emberGeo = new THREE.BufferGeometry();
  emberGeo.setAttribute('position', new THREE.BufferAttribute(emberPos, 3));
  var emberMat = new THREE.PointsMaterial({ color: 0xf3ecdd, size: 0.085, transparent: true, opacity: 0 });
  var emberPoints = new THREE.Points(emberGeo, emberMat);
  scene.add(emberPoints);

  /* ---- Zone 2: Labyrinth wireframe corridor (Bio) ---- */
  var labyrinthGroup = new THREE.Group();
  var GATES = 6;
  for (var g = 0; g < GATES; g++) {
    var w = 6 + g * 0.6, h = 4 + g * 0.4;
    var box = new THREE.BoxGeometry(w, h, 0.1);
    var edges = new THREE.EdgesGeometry(box);
    var mat = new THREE.LineBasicMaterial({ color: g % 2 === 0 ? 0xd69a4c : 0x8a7860, transparent: true, opacity: 0 });
    var lines = new THREE.LineSegments(edges, mat);
    lines.position.set((g % 2 === 0 ? -1 : 1) * 0.6, 0, -g * 3 - 2);
    labyrinthGroup.add(lines);
  }
  scene.add(labyrinthGroup);

  /* ---- Zone 3: Rising wings / flight particles (Timeline) ---- */
  var WING_N = isSmall ? 90 : 160;
  var wingPos = new Float32Array(WING_N * 3);
  var wingSpeed = new Float32Array(WING_N);
  for (var j = 0; j < WING_N; j++) {
    wingPos[j*3]   = (Math.random() - 0.5) * 24;
    wingPos[j*3+1] = Math.random() * 20 - 10;
    wingPos[j*3+2] = (Math.random() - 0.5) * 12 - 3;
    wingSpeed[j] = 0.006 + Math.random() * 0.016;
  }
  var wingGeo = new THREE.BufferGeometry();
  wingGeo.setAttribute('position', new THREE.BufferAttribute(wingPos, 3));
  var wingMat = new THREE.PointsMaterial({ color: 0xe8b667, size: 0.1, transparent: true, opacity: 0 });
  var wingPoints = new THREE.Points(wingGeo, wingMat);
  scene.add(wingPoints);

  /* ---- Zone 4: Rising sea bubbles (Quote / the fall) ---- */
  var SEA_N = isSmall ? 80 : 150;
  var seaPos = new Float32Array(SEA_N * 3);
  var seaSpeed = new Float32Array(SEA_N);
  for (var k = 0; k < SEA_N; k++) {
    seaPos[k*3]   = (Math.random() - 0.5) * 20;
    seaPos[k*3+1] = Math.random() * 18 - 9;
    seaPos[k*3+2] = (Math.random() - 0.5) * 10 - 2;
    seaSpeed[k] = 0.004 + Math.random() * 0.012;
  }
  var seaGeo = new THREE.BufferGeometry();
  seaGeo.setAttribute('position', new THREE.BufferAttribute(seaPos, 3));
  var seaMat = new THREE.PointsMaterial({ color: 0x9fd1e8, size: 0.075, transparent: true, opacity: 0 });
  var seaPoints = new THREE.Points(seaGeo, seaMat);
  scene.add(seaPoints);

  /* ---- Zone 5: Starfield / legacy (Facts + footer) ---- */
  var STAR_N = isSmall ? 140 : 260;
  var starPos = new Float32Array(STAR_N * 3);
  var starPhase = new Float32Array(STAR_N);
  for (var s = 0; s < STAR_N; s++) {
    starPos[s*3]   = (Math.random() - 0.5) * 26;
    starPos[s*3+1] = (Math.random() - 0.5) * 20;
    starPos[s*3+2] = (Math.random() - 0.5) * 14 - 3;
    starPhase[s] = Math.random() * Math.PI * 2;
  }
  var starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  var starMat = new THREE.PointsMaterial({ color: 0xf3ecdd, size: 0.07, transparent: true, opacity: 0 });
  var starPoints = new THREE.Points(starGeo, starMat);
  scene.add(starPoints);

  /* ---- Mouse parallax ---- */
  var mouseX = 0, mouseY = 0;
  window.addEventListener('mousemove', function(e){
    mouseX = (e.clientX / window.innerWidth) - 0.5;
    mouseY = (e.clientY / window.innerHeight) - 0.5;
  });

  /* ---- Scroll progress + background gradient ---- */
  function scrollProgress(){
    var max = document.documentElement.scrollHeight - window.innerHeight;
    return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
  }

  function hexToRgb(hex){
    var v = hex.replace('#','');
    return [parseInt(v.substring(0,2),16), parseInt(v.substring(2,4),16), parseInt(v.substring(4,6),16)];
  }
  function lerp(a,b,t){ return a + (b - a) * t; }
  function lerpColor(c1, c2, t){
    var a = hexToRgb(c1), b = hexToRgb(c2);
    return 'rgb(' + Math.round(lerp(a[0],b[0],t)) + ',' + Math.round(lerp(a[1],b[1],t)) + ',' + Math.round(lerp(a[2],b[2],t)) + ')';
  }

  var stops = [
    { p: 0.00, top: '#0a1b2a', bottom: '#14314a' }, /* hero: night sky over the sea */
    { p: 0.20, top: '#241f1a', bottom: '#4a3521' }, /* bio: labyrinth stone + torchlight */
    { p: 0.44, top: '#2c4a63', bottom: '#c98f4c' }, /* timeline: dusk sky into sunlight */
    { p: 0.66, top: '#0a1a28', bottom: '#123650' }, /* quote: undersea, the fall */
    { p: 0.86, top: '#14110d', bottom: '#241f18' }, /* facts: night / legacy */
    { p: 1.00, top: '#0a1420', bottom: '#0f2436' }  /* footer: settled night */
  ];
  function gradientForProgress(p){
    for (var i = 0; i < stops.length - 1; i++) {
      var a = stops[i], b = stops[i+1];
      if (p >= a.p && p <= b.p) {
        var t = (b.p - a.p) === 0 ? 0 : (p - a.p) / (b.p - a.p);
        return { top: lerpColor(a.top, b.top, t), bottom: lerpColor(a.bottom, b.bottom, t) };
      }
    }
    var last = stops[stops.length - 1];
    return { top: last.top, bottom: last.bottom };
  }

  function bandOpacity(p, start, peakStart, peakEnd, end){
    if (p <= start || p >= end) return 0;
    if (p < peakStart) return (p - start) / (peakStart - start);
    if (p > peakEnd) return Math.max(0, 1 - (p - peakEnd) / (end - peakEnd));
    return 1;
  }

  var clock = new THREE.Clock();

  function render(){
    requestAnimationFrame(render);
    var progress = scrollProgress();

    if (!reduceMotion) {
      var g = gradientForProgress(progress);
      bgGradient.style.background = 'linear-gradient(180deg, ' + g.top + ', ' + g.bottom + ')';

      var dt = Math.min(clock.getDelta(), 0.05);

      /* Sun zone */
      var sunOp = bandOpacity(progress, 0, 0.02, 0.12, 0.20);
      sunGroup.rotation.y += 0.12 * dt;
      sunGroup.rotation.x += 0.04 * dt;
      sun.material.opacity = 0.5 * sunOp;
      core.material.opacity = 0.16 * sunOp;

      var emberOp = bandOpacity(progress, 0, 0.02, 0.14, 0.22);
      emberMat.opacity = 0.8 * emberOp;
      var ePos = emberGeo.attributes.position;
      for (var i = 0; i < EMBER_N; i++) {
        var y = ePos.getY(i) - emberSpeed[i];
        if (y < -9) y = 9;
        ePos.setY(i, y);
        ePos.setX(i, ePos.getX(i) + Math.sin(y * 0.4 + i) * 0.003);
      }
      ePos.needsUpdate = true;

      /* Labyrinth zone */
      var labOp = bandOpacity(progress, 0.08, 0.17, 0.33, 0.42);
      labyrinthGroup.rotation.y += 0.05 * dt;
      labyrinthGroup.children.forEach(function(line){ line.material.opacity = 0.55 * labOp; });

      /* Flight / wings zone */
      var wingOp = bandOpacity(progress, 0.30, 0.37, 0.57, 0.65);
      wingMat.opacity = 0.85 * wingOp;
      var wPos = wingGeo.attributes.position;
      for (var j = 0; j < WING_N; j++) {
        var wy = wPos.getY(j) + wingSpeed[j];
        if (wy > 10) wy = -10;
        wPos.setY(j, wy);
        wPos.setX(j, wPos.getX(j) + Math.cos(wy * 0.3 + j) * 0.004);
      }
      wPos.needsUpdate = true;

      /* Sea / fall zone */
      var seaOp = bandOpacity(progress, 0.55, 0.63, 0.80, 0.88);
      seaMat.opacity = 0.75 * seaOp;
      var sPos = seaGeo.attributes.position;
      for (var k = 0; k < SEA_N; k++) {
        var sy = sPos.getY(k) + seaSpeed[k];
        if (sy > 9) sy = -9;
        sPos.setY(k, sy);
        sPos.setX(k, sPos.getX(k) + Math.sin(sy * 0.5 + k) * 0.0035);
      }
      sPos.needsUpdate = true;

      /* Starfield / legacy zone */
      var starOp = bandOpacity(progress, 0.76, 0.85, 1.3, 1.4);
      var t = clock.elapsedTime;
      starMat.opacity = starOp * (0.55 + 0.35 * Math.sin(t * 1.3));
      starPoints.rotation.y += 0.01 * dt;

      /* Camera parallax + gentle dolly */
      camera.position.x += (mouseX * 1.4 - camera.position.x) * 0.03;
      camera.position.y += (-mouseY * 0.9 - camera.position.y) * 0.03;
      camera.position.z = 13 - progress * 2.2;
      camera.lookAt(0, 0, 0);
    }

    renderer.render(scene, camera);
  }

  sizeRenderer();
  window.addEventListener('resize', sizeRenderer);
  render();
})();