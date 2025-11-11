export default class RangePicker {
    subElements = {};
    element = null;
    input = null;
    selector = null;
    constructor({ from = new Date(), to = new Date() } = {}) {
      this.selected = {
        from: new Date(from.getTime()),
        to: new Date(to.getTime())
      };
      this.globalFrom = new Date(from.getTime());

      this.openCalendar = this.openCalendar.bind(this);
      this.onSelectorClick = this.onSelectorClick.bind(this);

      this.createElement();
      this.setSubElements();
      this.createOnCalendarClickListeners();
      this.createOnClickSelectLiestener();
    }

    createElement() {
      const element = document.createElement('div');
      element.innerHTML = this.getTempalte();
      this.element = element.firstElementChild;
    }

    setSubElements() {
      const dataElements = this.element.querySelectorAll('[data-element]');
      for (const elem of dataElements) {
        const name = elem.dataset.element;
        this.subElements[name] = elem;
      }
    }

    createOnCalendarClickListeners() {
      const { input } = this.subElements;
      this.input = input;
      this.input.addEventListener('click', this.openCalendar);

    }

    openCalendar() {
      this.element.classList.toggle('rangepicker_open');
      const { selector } = this.subElements;
      if (!selector.querySelector('.rangepicker__selector-arrow')) {
        selector.innerHTML = `
              <div class="rangepicker__selector-arrow"></div>
              <div class="rangepicker__selector-control-left"></div>
              <div class="rangepicker__selector-control-right"></div>
            `;
      }
      this.renderCalendar();
    }

    createOnClickSelectLiestener() {
      const { selector } = this.subElements;
      this.selector = selector;
      this.selector.addEventListener('click', this.onSelectorClick);
    }

    onSelectorClick(event) {
      const target = event.target;
      if (target.closest('.rangepicker__selector-control-left')) {
        this.prevMonth();
      } else if (target.closest('.rangepicker__selector-control-right')) {
        this.nextMonth();
      } else if (target.closest('.rangepicker__cell')) {
        this.onSellClick(target);
      }
    }

    onSellClick(target) {
      const dateInCell = new Date(target.dataset.value);
      if (this.selected.to) {
        this.selected = { from: dateInCell, to: null };
      } else {
        this.selected.to = dateInCell;
        if (this.selected.from > this.selected.to) {
          let tmp = null;
          tmp = this.selected.from;
          this.selected.from = this.selected.to;
          this.selected.to = tmp;
        }
        const from = this.subElements.from;
        const to = this.subElements.to;

        from.textContent = this.transformDate(this.selected.from);
        to.textContent = this.transformDate(this.selected.to);
        this.dispatchEvent();
        this.close();
      }
      this.printCells();
    }

    prevMonth() {
      this.globalFrom.setMonth(this.globalFrom.getMonth() - 1);
      this.renderCalendar();
    }

    nextMonth() {
      this.globalFrom.setMonth(this.globalFrom.getMonth() + 1);
      this.renderCalendar();
    }

    renderCalendar() {
      const { selector } = this.subElements;
      const secondMonth = new Date(this.globalFrom);
      secondMonth.setMonth(secondMonth.getMonth() + 1);

      const calendars = selector.querySelectorAll('.rangepicker__calendar');
      calendars.forEach(calendar => calendar.remove());

      selector.insertAdjacentHTML('beforeend', this.renderMonthBody(this.globalFrom));
      selector.insertAdjacentHTML('beforeend', this.renderMonthBody(secondMonth));

      this.printCells();
    }

    renderMonthBody(date) {
      return `
          <div class="rangepicker__calendar">
              <div class="rangepicker__month-indicator">
                  ${this.transformMonth(date)}
              </div>
              <div class="rangepicker__day-of-week">
                  <div>Пн</div>
                  <div>Вт</div>
                  <div>Ср</div>
                  <div>Чт</div>
                  <div>Пт</div>
                  <div>Сб</div>
                  <div>Вс</div>
              </div>
              <div class="rangepicker__date-grid">
              ${this.renderDaysInCalendar(date)}
              </div>
          </div>
      `;
    }

    renderDaysInCalendar(date) {
      let cells = '';
      const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      const firstDayWeek = firstDayOfMonth.getDay() || 7;

      for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
        const dateFromMonth = new Date(date.getFullYear(), date.getMonth(), day);
        cells += `<button type="button"
                   class="rangepicker__cell"
                   data-value="${dateFromMonth.toISOString()}"
                   ${day === 1 ? `style="--start-from: ${firstDayWeek}"` : ''}
                 >${day}</button>`;
      }

      return cells;
    }

    printCells() {
      const cells = this.subElements.selector.querySelectorAll('.rangepicker__cell');
      cells.forEach(cell => {

        const dateInCell = new Date(cell.dataset.value);
        cell.className = 'rangepicker__cell';
        if (this.selected.to && this.selected.to.getTime() === this.selected.from.getTime()) {
          cell.classList.add('rangepicker__selected-from');
          cell.classList.add('rangepicker__selected-to');
        } else if (dateInCell.getTime() === this.selected.from.getTime()) {
          cell.classList.add('rangepicker__selected-from');
        } else if (this.selected.to && dateInCell.getTime() === this.selected.to.getTime()) {
          cell.classList.add('rangepicker__selected-to');
        } else if (this.selected.to && dateInCell.getTime() > this.selected.from.getTime() &&
                dateInCell.getTime() < this.selected.to.getTime()) {
          cell.classList.add('rangepicker__selected-between');
        }
      });
    }

    getTempalte() {
      return `
         <div class = "rangepicker">
              <div class = "rangepicker__input" data-element = "input">
                  <span data-element="from">${this.transformDate(this.selected.from)}</span>
                   -
                  <span data-element="to">${this.transformDate(this.selected.to)}</span>
              </div>
              <div class = "rangepicker__selector" data-element="selector"></div>
          </div>
      `;
    }

    transformDate(date) {
      const options = { month: "numeric", day: "numeric", year: "numeric" };
      return date.toLocaleDateString("ru-RU", options);
    }

    transformMonth(date) {
      const options = { month: "long" };
      return date.toLocaleDateString("ru-RU", options);
    }

    destroyOpenCalendarListeners() {
      this.input.removeEventListener('click', this.openCalendar);

    }

    dispatchEvent() {
      this.element.dispatchEvent(new CustomEvent('date-select', {
        bubbles: true,
        detail: this.selected
      }));
    }

    close() {
      this.element.classList.remove('rangepicker_open');
    }

    destroyOnClickSelectLiestener() {
      this.selector.removeEventListener('click', this.onSelectorClick);
    }

    destroy() {
      this.destroyOpenCalendarListeners();
      this.destroyOnClickSelectLiestener();
      this.remove();
    }

    remove() {
      this.element.remove();
    }

}
