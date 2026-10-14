(function () {
  var USERS_KEY = 'vault.users.v1';
  var SESSION_KEY = 'vault.session.v1';

  function getUsers() {
    try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; }
    catch (e) { return []; }
  }
  function saveUsers(users) {
    try { localStorage.setItem(USERS_KEY, JSON.stringify(users)); } catch (e) {}
  }
  function getSession() {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY)); }
    catch (e) { return null; }
  }
  function setSession(s) {
    try { localStorage.setItem(SESSION_KEY, JSON.stringify(s)); } catch (e) {}
  }
  function clearSession() {
    try { localStorage.removeItem(SESSION_KEY); } catch (e) {}
  }

  function bufToHex(buf) {
    return Array.from(new Uint8Array(buf)).map(function (b) { return b.toString(16).padStart(2, '0'); }).join('');
  }
  function randomSalt() {
    var arr = new Uint8Array(16);
    crypto.getRandomValues(arr);
    return bufToHex(arr.buffer);
  }
  async function hashPassword(password, salt) {
    var enc = new TextEncoder();
    var data = enc.encode(salt + ':' + password);
    var digest = await crypto.subtle.digest('SHA-256', data);
    return bufToHex(digest);
  }

  function showView(id) {
    document.querySelectorAll('.view').forEach(function (v) { v.classList.remove('active'); });
    document.getElementById(id).classList.add('active');
  }
  function setMsg(el, text, kind) {
    el.textContent = text;
    el.className = 'msg ' + (kind || '');
    el.style.display = text ? 'block' : 'none';
  }
  function setFieldErr(el, text) { el.textContent = text || ''; }

  function fmtDate(ts) {
    if (!ts) return '—';
    return new Date(ts).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
  }

  function findUser(users, name) {
    var n = name.trim().toLowerCase();
    return users.find(function (u) { return u.username.toLowerCase() === n; });
  }

  function validatePassword(pw) {
    if (pw.length < 8) return 'Must be at least 8 characters.';
    if (!/[0-9]/.test(pw)) return 'Must include at least 1 number.';
    return null;
  }

  // ---- Registration ----
  document.getElementById('registerForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    var userEl = document.getElementById('regUser');
    var passEl = document.getElementById('regPass');
    var pass2El = document.getElementById('regPass2');
    var userErr = document.getElementById('regUserErr');
    var passErr = document.getElementById('regPassErr');
    var pass2Err = document.getElementById('regPass2Err');
    var msg = document.getElementById('regMsg');

    setFieldErr(userErr, ''); setFieldErr(passErr, ''); setFieldErr(pass2Err, ''); setMsg(msg, '');

    var username = userEl.value.trim();
    var pass = passEl.value;
    var pass2 = pass2El.value;
    var ok = true;

    if (!username) { setFieldErr(userErr, 'Username or email is required.'); ok = false; }
    var pwErr = pass ? validatePassword(pass) : 'Password is required.';
    if (pwErr) { setFieldErr(passErr, pwErr); ok = false; }
    if (!pass2) { setFieldErr(pass2Err, 'Please confirm your password.'); ok = false; }
    else if (pass2 !== pass) { setFieldErr(pass2Err, 'Passwords do not match.'); ok = false; }

    if (!ok) return;

    var users = getUsers();
    if (findUser(users, username)) {
      setMsg(msg, 'An account with that username or email already exists.', 'error');
      return;
    }

    var salt = randomSalt();
    var hash = await hashPassword(pass, salt);
    var user = { id: 'u' + Date.now().toString(36), username: username, salt: salt, hash: hash, createdAt: Date.now() };
    users.push(user);
    saveUsers(users);

    setMsg(msg, 'Account created. You can log in now.', 'success');
    document.getElementById('registerForm').reset();
    setTimeout(function () {
      showView('view-login');
      document.getElementById('loginUser').value = username;
      document.getElementById('loginPass').focus();
    }, 700);
  });

  // ---- Login ----
  document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    var userEl = document.getElementById('loginUser');
    var passEl = document.getElementById('loginPass');
    var userErr = document.getElementById('loginUserErr');
    var passErr = document.getElementById('loginPassErr');
    var msg = document.getElementById('loginMsg');

    setFieldErr(userErr, ''); setFieldErr(passErr, ''); setMsg(msg, '');

    var username = userEl.value.trim();
    var pass = passEl.value;
    var ok = true;
    if (!username) { setFieldErr(userErr, 'Required.'); ok = false; }
    if (!pass) { setFieldErr(passErr, 'Required.'); ok = false; }
    if (!ok) return;

    var users = getUsers();
    var user = findUser(users, username);
    var validCreds = false;

    if (user) {
      var hash = await hashPassword(pass, user.salt);
      validCreds = (hash === user.hash);
    } else {
      // Still hash something so timing doesn't hint at whether the user exists.
      await hashPassword(pass, 'decoy-salt-000000000000000000');
    }

    if (!validCreds) {
      setMsg(msg, 'Incorrect username or password.', 'error');
      return;
    }

    setSession({ userId: user.id, username: user.username, startedAt: Date.now() });
    document.getElementById('loginForm').reset();
    renderDashboard();
  });

  // ---- Dashboard / session ----
  function renderDashboard() {
    var session = getSession();
    if (!session) { showView('view-login'); return; }
    var users = getUsers();
    var user = users.find(function (u) { return u.id === session.userId; });
    if (!user) { clearSession(); showView('view-login'); return; }

    document.getElementById('dashName').textContent = user.username;
    document.getElementById('dashAvatar').textContent = user.username.trim().charAt(0).toUpperCase();
    document.getElementById('dashCreated').textContent = fmtDate(user.createdAt);
    document.getElementById('dashSession').textContent = fmtDate(session.startedAt);
    showView('view-dashboard');
  }

  document.getElementById('logoutBtn').addEventListener('click', function () {
    clearSession();
    showView('view-login');
  });

  document.getElementById('toRegister').addEventListener('click', function () { showView('view-register'); });
  document.getElementById('toLogin').addEventListener('click', function () { showView('view-login'); });

  // On load: protected page only shows if a session exists, else redirect to login.
  var session = getSession();
  if (session) { renderDashboard(); } else { showView('view-login'); }
})();
