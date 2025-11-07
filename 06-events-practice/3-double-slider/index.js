export default class DoubleSlider {
  activeThumb;
  constructor({
    min = 100,
    max = 200,
    formatValue = (value) => value,
    selected = {},
  } = {}) {
    const { from, to } = selected;
    this.min = min;
    this.max = max;
    this.formatValue = formatValue;
    this.from = from ?? min;
    this.to = to ?? max;
    this.element = this.createElement(this.createTemplate());
    this.createEventListeners();
  }
  createTemplate() {
    const leftProgress = this.toPercent("left-thubm");
    const rightProgress = this.toPercent("right-thubm");
    return `
            <span data-element="from">${this.formatValue(this.from)}</span>
            <div class="range-slider__inner">
              <span data-element="thumb-progress" class="range-slider__progress" style="left: ${leftProgress}%; right: ${rightProgress}%"></span>
              <span data-element="thumbLeft" class="range-slider__thumb-left" style="left: ${leftProgress}%"></span>
              <span data-element="thumbRight" class="range-slider__thumb-right" style="right: ${rightProgress}%"></span>
            </div>
            <span data-element="to">${this.formatValue(this.to)}</span>
    `;
  }

  toPercent(thubmSide) {
    const total = this.max - this.min;
    const value =
      thubmSide === "left-thubm" ? this.from - this.min : this.max - this.to;
    return Math.round((value / total) * 100);
  }

  processPointerMove = (event) => {
    const sliderContainer = document.querySelector(".range-slider__inner");
    const { left, width } = sliderContainer.getBoundingClientRect();

    const containerLeftX = left;
    const containerRightX = left + width;
    const pointerX = event.clientX;
    const normalizedPointerX = Math.min(
      containerRightX,
      Math.max(containerLeftX, pointerX)
    );
    const percentPointerX = Math.round(((normalizedPointerX - containerLeftX) / (containerRightX - containerLeftX)) * 100
    );
    return this.min + ((this.max - this.min) * percentPointerX) / 100;
  };

  onThumbPointerDown = (event) => {
    this.activeThumb = event.target.dataset.element;
    document.addEventListener("pointermove", this.onThumbPointerMove);
    document.addEventListener("pointerup", this.onThumbPointerUp);
  };

  onThumbPointerMove = (event) => {
    const sliderProgress = this.element.querySelector(".range-slider__progress");
    const leftSlider = this.element.querySelector(".range-slider__thumb-left");
    const rightSlider = this.element.querySelector(".range-slider__thumb-right");
    const fromElementValue = this.element.querySelector('[data-element="from"]');
    const toElementValue = this.element.querySelector('[data-element="to"]');

    if (this.activeThumb === "thumbLeft") {
      this.from = this.processPointerMove(event);
      const value = this.toPercent("left-thubm");
      leftSlider.style.left = value + "%";
      sliderProgress.style.left = value + "%";
      fromElementValue.textContent = this.formatValue(this.from);
    }

    if (this.activeThumb === "thumbRight") {
      this.to = this.processPointerMove(event);
      const value = this.toPercent("right-thubm");
      toElementValue.textContent = this.formatValue(this.to);
      rightSlider.style.right = value + "%";
      sliderProgress.style.right = value + "%";
    }

  };

  onThumbPointerUp = (event) => {
    this.dispatchCustomEvent();
    document.removeEventListener("pointermove", this.onThumbPointerMove);
    document.removeEventListener("pointerup", this.onThumbPointerUp);
  };

  dispatchCustomEvent() {
    const event = new CustomEvent("range-select", {
      detail: { from: this.from, to: this.to },
    });
    this.element.dispatchEvent(event);
  }

  createElement(template) {
    const element = document.createElement("div");
    element.classList.add("range-slider");
    element.innerHTML = template;
    return element;
  }

  createEventListeners() {
    this.element.addEventListener("pointerdown", this.onThumbPointerDown);
  }

  removeEventListeners() {
    this.element.removeEventListener("pointerdown", this.onThumbPointerDown);
  }

  remove() {
    this.element.remove();
  }
  destroy() {
    this.remove();
    this.removeEventListeners();
  }
}
