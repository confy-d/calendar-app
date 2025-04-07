const daysContainer = document.getElementById('days');
const monthYear = document.getElementById('monthYear');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const popup = document.getElementById('eventPopup');
const eventInput = document.getElementById('eventTitle');
const saveEventBtn = document.getElementById('saveEvent');
const closePopupBtn = document.getElementById('closePopup');
const eventList = document.getElementById('events');
const searchDateInput = document.getElementById('searchDate');
const searchBtn = document.getElementById('searchBtn');

let currentDate = new Date();
let selectedDate = null;
let events = JSON.parse(localStorage.getItem('events')) || [];

function renderCalendar(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  daysContainer.innerHTML = "";

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  monthYear.textContent = `${monthNames[month]} ${year}`;

  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement('div');
    daysContainer.appendChild(empty);
  }

  for (let day = 1; day <= lastDate; day++) {
    const dayDiv = document.createElement('div');
    dayDiv.textContent = day;

    const today = new Date();
    if (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    ) {
      dayDiv.classList.add('today');
    }

    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    dayDiv.onclick = () => {
      openPopup(dateStr);
      renderEvents(dateStr);
    };

    daysContainer.appendChild(dayDiv);
  }
}

function openPopup(date) {
  selectedDate = date;
  popup.classList.remove('hidden');
}

function closePopup() {
  popup.classList.add('hidden');
  eventInput.value = "";
}

saveEventBtn.onclick = () => {
  const title = eventInput.value.trim();
  if (title) {
    events.push({ date: selectedDate, title });
    localStorage.setItem('events', JSON.stringify(events));
    closePopup();
    renderEvents(selectedDate);
  }
};

closePopupBtn.onclick = closePopup;

function renderEvents(date) {
  eventList.innerHTML = "";

  const filtered = events.filter(e => e.date === date);
  if (filtered.length === 0) {
    eventList.innerHTML = "<li>No events for this date</li>";
  } else {
    filtered.forEach((e, index) => {
      const li = document.createElement('li');

      const title = document.createElement('span');
      title.textContent = e.title;

      const editBtn = document.createElement('button');
      editBtn.textContent = "Edit";
      editBtn.className = "edit-btn";
      editBtn.onclick = () => {
        const newTitle = prompt("Edit your event:", e.title);
        if (newTitle) {
          e.title = newTitle;
          localStorage.setItem('events', JSON.stringify(events));
          renderEvents(date);
        }
      };

      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = "Delete";
      deleteBtn.className = "delete-btn";
      deleteBtn.onclick = () => {
        if (confirm("Are you sure you want to delete this event?")) {
          events = events.filter(ev => ev !== e);
          localStorage.setItem('events', JSON.stringify(events));
          renderEvents(date);
        }
      };

      li.appendChild(title);
      li.appendChild(editBtn);
      li.appendChild(deleteBtn);
      eventList.appendChild(li);
    });
  }
}

searchBtn.onclick = () => {
  const inputDate = searchDateInput.value;
  if (inputDate) {
    renderEvents(inputDate);
    const [year, month, day] = inputDate.split('-');
    currentDate.setFullYear(year, month - 1);
    renderCalendar(currentDate);

    const allDays = document.querySelectorAll('.days div');
    allDays.forEach(d => {
      if (d.textContent === String(Number(day))) {
        d.style.backgroundColor = '#ffc107'; // yellow
      }
    });
  }
};

prevBtn.onclick = () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar(currentDate);
};

nextBtn.onclick = () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar(currentDate);
};

renderCalendar(currentDate);
