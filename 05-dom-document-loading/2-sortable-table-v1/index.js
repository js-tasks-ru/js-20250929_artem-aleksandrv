export default class SortableTable {
  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;
    this.element = this.createElement();
    this.subElements = this.getSubElements();
  }
  getSubElements() {
    const subElements = {};
    const elements = this.element.querySelectorAll('[data-element]');

    for (const subElement of elements) {
      const name = subElement.dataset.element;
      subElements[name] = subElement;
    }

    return subElements;
  }

  createTableHeaderTemplate() {
    return this.headerConfig.map(columnConfig => (
      `<div class="sortable-table__cell" data-id="${columnConfig['id']}" data-sortable="${columnConfig['sortable']}">
                <span>${columnConfig['title']}</span>
            </div>`
    )).join('');
  }
  createTableBodyCellTemplate(product, columnConfig) {
    if (columnConfig['template']) {
      return columnConfig['template'](product);
    }
    const fieldId = columnConfig['id'];
    return `<div class="sortable-table__cell">${product[fieldId]}</div>`;
  }
  createTableBodyRowTemplate(product) {
    return `
            <a href="/products/${product.id}" class="sortable-table__row">
                ${this.headerConfig.map(columnConfig =>
    this.createTableBodyCellTemplate(product, columnConfig)
  ).join('')}
            </a>
        `;
  }
  createTableBodyTemplate() {
    return this.data.map(product => (
      this.createTableBodyRowTemplate(product)
    )).join('');
  }
  createTemplate() {
    return `
              <div data-element="header" class="sortable-table__header sortable-table__row">
                  ${this.createTableHeaderTemplate()}
              </div>
              <div data-element="body" class="sortable-table__body">
                  ${this.createTableBodyTemplate()}
              </div>
              <div data-element="loading" class="loading-line sortable-table__loading-line"></div>
              <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
                  <div>
                      <p>No products satisfies your filter criteria</p>
                      <button type="button" class="button-primary-outline">Reset all filters</button>
                  </div>
              </div>
    `;
  }
  createElement() {
    const element = document.createElement('div');
    element.classList.add('sortable-table');
    element.innerHTML = this.createTemplate();
    return element;
  }
  destroy() {
    this.element.remove();
  }
  // sort(field, order = 'asc') {
  //   const type = this.data[0][field];
  //   if (typeof type === 'string') {
  //     if (order === "desc") {
  //       this.data.sort((a, b) =>
  //         (b[field]).localeCompare(a[field], ["ru", "en"], {
  //           caseFirst: "upper",
  //         })
  //       );
  //     } else {
  //       this.data.sort((a, b) =>
  //         (a[field]).localeCompare(b[field], ["ru", "en"], {
  //           caseFirst: "upper",
  //         })
  //       );
  //     }
  //   } else {
  //     if (order === 'desc') {
  //       this.data.sort((a, b) => b[field] - a[field]);
  //     } else {
  //       this.data.sort((a, b) => a[field] - b[field]);
  //     }
  //   }
  //   this.subElements.body.innerHTML = this.createTableBodyTemplate();
  // }

  sortStringData (data = [], field, order = 'asc') {
    if (order === "desc") {
      data.sort((a, b) =>
        (b[field]).localeCompare(a[field], ["ru", "en"], {
          caseFirst: "upper",
        })
      );
    } else {
      data.sort((a, b) =>
        (a[field]).localeCompare(b[field], ["ru", "en"], {
          caseFirst: "upper",
        })
      );
    }
  }
  sortNumbersData (data = [], field, order = 'asc') {
    if (order === 'desc') {
      this.data.sort((a, b) => b[field] - a[field]);
    } else {
      this.data.sort((a, b) => a[field] - b[field]);
    }
  }
  sort(field, order = 'asc') {
    const sortParams = this.headerConfig.find((el) => el.id === field);
    const {sortable, sortType} = sortParams;
    if (!sortable) {
      return;
    } else {
      if (sortType === 'string') {
        this.sortStringData(this.data, field, order);
      } else {
        this.sortNumbersData(this.data, field, order);
      }
    }


    this.subElements.body.innerHTML = this.createTableBodyTemplate();
  }
}

