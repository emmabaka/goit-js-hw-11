import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';
import { UrlForFetch } from './fetchImages';
import './css/styles.css';

const createUrl = new UrlForFetch();

let lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
});

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

loadMoreBtn.classList.add('hidden');
form.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMore);

function onSearch(e) {
  e.preventDefault();

  createUrl.value = e.currentTarget.elements.searchQuery.value.trim();
  createUrl.resetPage();
  if (createUrl.value === '') {
    return Notiflix.Notify.info('Search field is empty');
  }

  fetchImages(createUrl.getUrl()).then(response => {
    if (response.totalHits > 40) {
      Notiflix.Notify.success(`Hooray! We found ${response.totalHits} images.`);
    }
    gallery.innerHTML = '';
    createMarkup(response.hits);
  });
}

async function fetchImages(url) {
  let data;
  try {
    const response = await axios.get(url);
    data = response.data;
    if (data.hits.length === 0) {
      loadMoreBtn.classList.add('hidden');
      return Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else if (createUrl.page * 40 >= data.totalHits) {
      loadMoreBtn.classList.add('hidden');
      return Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    } else {
      loadMoreBtn.classList.remove('hidden');
    }
    return data;
  } catch (e) {
    console.log(e);
  }
}

async function onLoadMore() {
  createUrl.incrementPage();
  const response = await fetchImages(createUrl.getUrl());
  createMarkup(response.hits);
}

function createMarkup(images) {
  const markup = images
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
    <a href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" loading="lazy"/></a> 
    <div class="info">
      <p class="info-item">
        <b>Likes: ${likes}</b>
      </p>
      <p class="info-item">
        <b>Views: ${views}</b>
      </p>
      <p class="info-item">
        <b>Comments: ${comments}</b>
      </p>
      <p class="info-item">
        <b>Downloads: ${downloads}</b>
      </p>
    </div>
  </div>`;
      }
    )
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}
