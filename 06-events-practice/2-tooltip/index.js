class Tooltip {

  static tooltipInstance
  element

  constructor() {
    if (Tooltip.tooltipInstance) {
      return Tooltip.tooltipInstance;
    } Tooltip.tooltipInstance = this;
  }

  initialize () {
    this.createListeners();
  }

  createTooltipElement(text) {
    const element = document.createElement('div');
    element.className = 'tooltip';
    element.textContent = text;
    return element;
  }

  render (text) {
    this.element = this.createTooltipElement(text);
    document.body.appendChild(this.element);
  }

  onDocumentPointerOver (e) {
    const data = e.target.dataset.tooltip;
    if (data) {
      this.render(data);
    }
  }

  removeTooltip (e) {
    if (e.target.dataset.tooltip) {
      this.remove();
    }
  }

  changeTooltipPosition (e) {
    if (e.target.dataset.tooltip) {
      this.element.style.left = `${e.clientX + 15}px`;
      this.element.style.top = `${e.clientY + 15}px`;
    }
  }

  createListeners () {
    document.addEventListener('pointerover', (e) => this.onDocumentPointerOver(e));
    document.addEventListener('pointerout', (e) => this.removeTooltip(e));
    document.addEventListener('pointermove', (e) => this.changeTooltipPosition(e));
  }

  removeListeneres () {
    document.removeEventListener('pointerover', (e) => this.removeTooltip(e));
    document.removeEventListener('pointerout', (e) => this.removeTooltip(e));
    document.removeEventListener('pointermove', (e) => this.changeTooltipPosition(e));
  }

  remove () {
    this.element.remove();
  }

  destroy () {
    this.removeListeneres();
    this.remove();
  }

}

export default Tooltip;
