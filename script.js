// Opening status, today's row in the hours table — based on Belgian time
(function () {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Brussels', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23'
  }).formatToParts(new Date());
  const get = t => parts.find(p => p.type === t).value;
  const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
  const mins = +get('hour') * 60 + +get('minute');
  const weekday = day >= 1 && day <= 5;
  const open = weekday && mins >= 9 * 60 && mins < 17 * 60;

  const row = document.querySelector(`[data-hours] tr[data-day="${day}"]`);
  if (row) row.classList.add('is-today');

  const status = document.querySelector('[data-status]');
  if (status) {
    let text;
    if (open) text = 'Nu open · tot 17u';
    else if (weekday && mins < 9 * 60) text = 'Gesloten · opent vandaag om 9u';
    else if (day >= 1 && day <= 4) text = 'Gesloten · morgen open vanaf 9u';
    else text = 'Gesloten · maandag open vanaf 9u';
    status.textContent = text;
    status.classList.toggle('is-open', open);
  }

  const year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
})();

// Header border on scroll
const header = document.querySelector('[data-header]');
const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 10);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Mobile menu
const menuBtn = document.querySelector('[data-menu]');
const nav = document.querySelector('[data-nav]');
menuBtn.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  menuBtn.setAttribute('aria-expanded', open);
  menuBtn.setAttribute('aria-label', open ? 'Menu sluiten' : 'Menu openen');
});
nav.addEventListener('click', e => {
  if (e.target.closest('a')) {
    nav.classList.remove('is-open');
    menuBtn.setAttribute('aria-expanded', false);
  }
});

// Team bios in a dialog
const dialog = document.querySelector('[data-dialog]');
const dialogBody = document.querySelector('[data-dialog-body]');
document.querySelectorAll('.person').forEach(person => {
  person.querySelector('.person__more').addEventListener('click', () => {
    const tpl = document.getElementById('bio-' + person.dataset.bio);
    dialogBody.replaceChildren(tpl.content.cloneNode(true));
    dialog.showModal();
  });
});
dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
