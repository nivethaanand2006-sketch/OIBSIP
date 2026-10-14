(function () {
  var STORE_KEY = 'daybook.tasks.v1';
  var tasks = [];

  function load() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      tasks = raw ? JSON.parse(raw) : [];
    } catch (e) { tasks = []; }
  }
  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(tasks)); } catch (e) {}
  }

  function fmt(ts) {
    if (!ts) return '';
    var d = new Date(ts);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) + ' · ' +
           d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  }

  function uid() { return 't' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

  var checkSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
  var editSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg>';
  var trashSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path></svg>';

  function render() {
    var pending = tasks.filter(function (t) { return !t.completed; })
                        .sort(function (a, b) { return b.createdAt - a.createdAt; });
    var completed = tasks.filter(function (t) { return t.completed; })
                          .sort(function (a, b) { return (b.completedAt || 0) - (a.completedAt || 0); });

    document.getElementById('pendingCount').textContent = pending.length + ' pending';
    document.getElementById('completedCount').textContent = completed.length + ' completed';

    renderList('pendingList', pending, 'Nothing on your plate. Add a task above to get started.');
    renderList('completedList', completed, 'No tasks finished yet — they will land here once checked off.');
  }

  function renderList(elId, list, emptyMsg) {
    var el = document.getElementById(elId);
    el.innerHTML = '';
    if (list.length === 0) {
      var empty = document.createElement('div');
      empty.className = 'empty';
      empty.textContent = emptyMsg;
      el.appendChild(empty);
      return;
    }
    list.forEach(function (t) { el.appendChild(taskEl(t)); });
  }

  function taskEl(t) {
    var li = document.createElement('li');
    li.className = 'task' + (t.completed ? ' completed' : '');

    var check = document.createElement('button');
    check.className = 'check';
    check.type = 'button';
    check.setAttribute('aria-label', t.completed ? 'Mark as pending' : 'Mark complete');
    check.innerHTML = checkSvg;
    check.onclick = function () { toggleComplete(t.id); };

    var body = document.createElement('div');
    body.className = 'body';

    var text = document.createElement('div');
    text.className = 'text';
    text.textContent = t.text;
    body.appendChild(text);

    var meta = document.createElement('div');
    meta.className = 'meta';
    meta.textContent = 'Added ' + fmt(t.createdAt) + (t.completed ? ' · Completed ' + fmt(t.completedAt) : '');
    body.appendChild(meta);

    var actions = document.createElement('div');
    actions.className = 'actions';

    var editBtn = document.createElement('button');
    editBtn.className = 'icon-btn';
    editBtn.type = 'button';
    editBtn.setAttribute('aria-label', 'Edit task');
    editBtn.innerHTML = editSvg;
    editBtn.onclick = function () { startEdit(li, t, body, text); };

    var delBtn = document.createElement('button');
    delBtn.className = 'icon-btn delete';
    delBtn.type = 'button';
    delBtn.setAttribute('aria-label', 'Delete task');
    delBtn.innerHTML = trashSvg;
    delBtn.onclick = function () { deleteTask(t.id); };

    actions.appendChild(editBtn);
    actions.appendChild(delBtn);

    li.appendChild(check);
    li.appendChild(body);
    li.appendChild(actions);
    return li;
  }

  function startEdit(li, t, body, textEl) {
    var input = document.createElement('input');
    input.type = 'text';
    input.className = 'edit-input';
    input.value = t.text;
    input.maxLength = 200;
    body.replaceChild(input, textEl);
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);

    function commit() {
      var v = input.value.trim();
      if (v) { t.text = v; save(); }
      render();
    }
    input.addEventListener('blur', commit);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); input.blur(); }
      if (e.key === 'Escape') { render(); }
    });
  }

  function toggleComplete(id) {
    var t = tasks.find(function (x) { return x.id === id; });
    if (!t) return;
    t.completed = !t.completed;
    t.completedAt = t.completed ? Date.now() : null;
    save();
    render();
  }

  function deleteTask(id) {
    tasks = tasks.filter(function (t) { return t.id !== id; });
    save();
    render();
  }

  function addTask(text) {
    tasks.push({ id: uid(), text: text, completed: false, createdAt: Date.now(), completedAt: null });
    save();
    render();
  }

  document.getElementById('composer').addEventListener('submit', function (e) {
    e.preventDefault();
    var input = document.getElementById('taskInput');
    var v = input.value.trim();
    if (!v) return;
    addTask(v);
    input.value = '';
    input.focus();
  });

  document.getElementById('todayStamp').textContent = new Date().toLocaleDateString(undefined, {
    weekday: 'long', month: 'long', day: 'numeric'
  });

  load();
  render();
})();
