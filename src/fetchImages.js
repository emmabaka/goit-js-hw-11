export class UrlForFetch {
  constructor() {
    this.nameOfImg = '';
    this.page = 1;
    this.KEY_API = '34326641-0fc4acfa7a4e5a40cb89ff9f3';
    this.BASE_URL = 'https://pixabay.com/api/';
    this.params =
      'image_type=photo&orientation=horizontal&safesearch=true&per_page=40';
  }

  getUrl() {
    return `${this.BASE_URL}?key=${this.KEY_API}&q=${this.nameOfImg}&${this.params}&page=${this.page}`;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get value() {
    return this.nameOfImg;
  }

  set value(newValue) {
    this.nameOfImg = newValue;
  }
}
