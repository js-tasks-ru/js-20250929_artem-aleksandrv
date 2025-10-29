import escapeHtml from './utils/escape-html.js';
import fetchJson from './utils/fetch-json.js';

// const IMGUR_CLIENT_ID = '28aaa2e823b03b1';
const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ProductForm {
   element;
  subElements = {};
  categories;
  productForm;
  defaultFormData = {
    title: '',
    description: '',
    quantity: 1,
    subcategory: '',
    status: 1,
    price: 100,
    discount: 0,
    images: []
  };
  constructor (productId) {
    this.productId = productId;
  }

  createLabelTemplate () {
    return (
      `<div class="form-group form-group__half_left">
        <fieldset>
          <label class="form-label">Название товара</label>
          <input id="title" data-element="title" required="" type="text" name="title"
          class="form-control" placeholder="Название товара"
          value="${escapeHtml(this.productForm.title || '')}"
        </fieldset>
      </div>`
    );
  }

  createDescriptionTemplate () {
    return (
      `<div class="form-group form-group__wide">
        <label class="form-label">Описание</label>
        <textarea id="description" required="true" class="form-control" name="description" data-element="productDescription" placeholder="Описание товара">
        ${escapeHtml(this.productForm.description || '')}
        </textarea>
      </div>`
    );
  }

  createImageContainerTemplate () {
    return (
      ` <div class="form-group form-group__wide" data-element="sortable-list-container">
        <label class="form-label">Фото</label>
        <div data-element="imageListContainer">
        ${this.createImageListElement()}
        </div>
        <button type="button" name="uploadImage" class="button-primary-outline"><span>Загрузить</span></button>
      </div>`
    );
  }

  createImageListElement () {
    const images = this.productForm.images || [];
    return `
      <ul class="sortable-list">
        ${(images).map(image => `
            <li class="products-edit__imagelist-item sortable-list__item">
            <input type="hidden" name="url" value="${escapeHtml(image.url)}">
            <input type="hidden" name="source" value="${escapeHtml(image.source)}">
            <span>
              <img src="icon-grab.svg" data-grab-handle alt="grab">
              <img class="sortable-table__cell-img" alt="Image" src="${escapeHtml(image.url)}">
              <span>${escapeHtml(image.source)}</span>
            </span>
            <button type="button">
              <img src="icon-trash.svg" data-delete-handle alt="delete">
            </button>
            </li>
          `).join('')}
        </ul>
    `;
  }

  createCategoriesListTemplate() {
    return `
          <div class="form-group form-group__half_left">
            <label class="form-label">Категория</label>
            <select id="subcategory" class="form-control" name="subcategory" data-element="subcategory">
              ${this.createCategoryTemplate() || ''}
            </select>
          </div>
          `;
  }

  createCategoryTemplate() {
    const selectedSubcategoryId = this.productForm.subcategory?.id || this.productForm.subcategory || '';
    const categories = this.categories || [];

    return categories
      .map(category => {
        const subcategories = category.subcategories || [];
        return subcategories
          .map(subcategory => {
            const isSelected = selectedSubcategoryId === subcategory.id ? 'selected' : '';
            return `
            <option value="${escapeHtml(subcategory.id)}" ${isSelected}>
              ${escapeHtml(category.title)} > ${escapeHtml(subcategory.title)}
            </option>
          `;
          })
          .join('');
      })
      .join('');
  }

  createProductDetailsTemplate() {
    return `
    <div class="form-group form-group__half_left form-group__two-col">
      <fieldset>
        <label class="form-label">Цена ($)</label>
        <input id="price" required="" type="number" name="price" class="form-control" placeholder="100"
         value = ${escapeHtml(String(this.productForm.price)) || ''} data-element="price">
      </fieldset>
      <fieldset>
        <label class="form-label">Скидка ($)</label>
        <input id="discount" required="" type="number" name="discount" class="form-control" placeholder="0"
         value = ${escapeHtml(String(this.productForm.discount)) || ''} data-element="discount">
      </fieldset>
    </div>
    <div class="form-group form-group__part-half">
      <label class="form-label">Количество</label>
      <input id="quantity" required="" type="number" class="form-control" name="quantity" placeholder="1"
      value = ${escapeHtml(String(this.productForm.quantity)) || ''} data-element="quantity">
    </div>
    <div class="form-group form-group__part-half">
      <label class="form-label">Статус</label>
      <select id="status" class="form-control" name="status" data-element="status">

        <option value="1" ${escapeHtml(String(this.productForm.status)) === '1' ? 'selected' : ''}>Активен</option>
        <option value="0" ${escapeHtml(String(this.productForm.status)) === '0' ? 'selected' : ''}>Неактивен</option>

      </select>
    </div>
  `;
  }

  createTemplate () {
    return (
      `<div class="product-form">
        <form data-element="productForm" name="product" class="form-grid">
      ${this.createLabelTemplate()}
       ${this.createDescriptionTemplate()}
       ${this.createImageContainerTemplate()}
       ${this.createCategoriesListTemplate()}
       ${this.createProductDetailsTemplate()}
       <div class="form-buttons">
        <button type="submit" name="save" class="button-primary-outline">
          Сохранить товар
        </button>
      </div>
        </form>
      </div>
      `
    );
  }


  createElement() {
    const element = document.createElement('div');
    element.innerHTML = this.createTemplate();
    this.element = element.firstElementChild;
  }

  async render () {
    this.categories = await this.fetchCategories();
    this.productForm = this.productId ? await this.fetchProduct() :
      [this.defaultFormData];
    this.createElement();
    this.getSubElements();
    this.createEventListeners();
    return this.element;
  }

  getSubElements() {
    this.element.querySelectorAll('[data-element]').forEach(
      element => {
        this.subElements[element.dataset.element] = element;
      });
  }

  async fetchProduct() {
    try {
      const url = new URL('/api/rest/products', BACKEND_URL);
      url.searchParams.set('id', this.productId);
      const [response] = await fetchJson(url);
      return response;
    }
    catch (e) {
      console.error('Error loading product data', e);
    }
  }

  async fetchCategories() {
    try {
      const url = new URL('/api/rest/categories', BACKEND_URL);
      url.searchParams.set('_sort', 'weight');
      url.searchParams.set('_refs', 'subcategory');
      const response = await fetchJson(url);
      return response;
    }
    catch (e) {
      console.error('Error loading categories data', e);
    }
  }

  createEventListeners() {
    this.subElements.productForm.addEventListener('submit', this.handleSubmit.bind(this));
  }

  async handleSubmit (e) {
    e.preventDefault();
    await this.save();
  }

  async save () {

    const productForm = document.forms.product;
    const formData = new FormData(productForm);
    const product = {
      id: this.productId,
      description: formData.get('description'),
      discount: formData.get('discount'),
      price: formData.get('price'),
      quantity: formData.get('quantity'),
      status: formData.get('status'),
      subcategory: formData.get('subcategory'),
      title: formData.get('title'),
      images: this.getImagesData()
    };

    try {
      const sendData = await fetchJson(`${BACKEND_URL}/api/rest/products`, {
        method: this.productId ? 'PATCH' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
      if (this.productId) {
        this.element.dispatchEvent(new CustomEvent('product-updated', {
          bubbles: true
        }));
      } this.element.dispatchEvent(new CustomEvent('product-saved', {
        bubbles: true
      }));
    }

    catch (error) {
      console.error('Ошибка при передаче данных: ', error);
    }
  }

  getImagesData() {
    return Array.from(this.subElements.imageListContainer.querySelectorAll('li')).map(image => ({
      url: image.querySelector('input[name="url"]').value,
      source: image.querySelector('input[name="source"]').value,
    }));
  }

  removeEventListener() {
    this.subElements.productForm.removeEventListener('submit', this.handleSubmit);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.removeEventListener();
    this.remove();
  }

}

