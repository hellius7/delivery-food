'use strict'

// day1
const cartButton = document.querySelector("#cart-button");
const close = document.querySelector(".close");
const buttonAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeAuth = document.querySelector('.close-auth');
const logInForm = document.querySelector('#logInForm');
const loginInput = document.querySelector('#login');
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');
const buttonLogin = document.querySelector('.button-login');
const cardsRestaurants = document.querySelector('.cards-restaurants');
const containerPromo = document.querySelector('.container-promo');
const restaurants = document.querySelector('.restaurants');
const menu = document.querySelector('.menu');
const logo = document.querySelector('.logo');
const cardsMenu = document.querySelector('.cards-menu');
const restaurantTitle = document.querySelector('.restaurant-title');
const rating = document.querySelector('.rating');
const minPrice = document.querySelector('.price');
const category = document.querySelector('.category');

let login = localStorage.getItem('userNick');



function notAutorized() {
  console.log('Не авторизован');

  function logIn(event) {
    event.preventDefault(); // отменяем перезагрузку страницы по клику на баттон

    if (valid(loginInput.value.trim())) {
      login = loginInput.value;
      localStorage.setItem('userNick', login);
      toogleModalAuth();
      buttonAuth.removeEventListener('click', toogleModalAuth);
      closeAuth.removeEventListener('click', toogleModalAuth);
      logInForm.removeEventListener('submit', logIn);
      logInForm.reset(); // очистка поля ввода
      checkAuth();
    } else {
      loginInput.style.borderColor = 'red';
      loginInput.value = '';
    }
  }

 
  closeAuth.addEventListener('click', toogleModalAuth); //закрытие модального окна
  logInForm.addEventListener('submit', logIn); // на событие сабмит страница перезагружается
}


new Swiper('.swiper-container', {
    // Optional parameters
    slidesPerView: 1,
    // loop: true,
    autoplay: {
      delay: 7000,
    },
  })


function checkAuth() {
  if (login) {
    autorized();
  } else {
    notAutorized();
  }
}

checkAuth();

// генерируем карточку ресторана
function createCardRestaurants(restaurant) {
  const { image, kitchen, name, price, stars, products, time_of_delivery: timeOfDelivery } = restaurant;

  const card = `
        <a class="card card-restaurant" data-products="${products}
        data-info="${[name, price, stars, kitchen]}"
        >
        <img src="${image}" alt="image" class="card-image"/>
        <div class="card-text">
          <div class="card-heading">
            <h3 class="card-title">${name}</h3>
            <span class="card-tag tag">${timeOfDelivery} мин</span>
          </div>
          <div class="card-info">
            <div class="rating">
              ${stars}
            </div>
            <div class="price">От ${price} р.</div>
            <div class="category">${kitchen}</div>
          </div>
        </div>
      </a>  
  `;
  cardsRestaurants.insertAdjacentHTML('beforeend', card);
}

// рендеринг карточек товаров ресторана
function createCardGood({ description, id, image, name, price }) {
  const card = document.createElement('div');
  card.className = 'card';

  card.insertAdjacentHTML('beforeend', `
          <img src="${image}" alt="image" class="card-image"/>
              <div class="card-text">
                <div class="card-heading">
                  <h3 class="card-title card-title-reg">${name}</h3>
                </div>
                <div class="card-info">
                  <div class="ingredients">${description}.
                  </div>
                </div>
                <div class="card-buttons">
                  <button class="button button-primary button-add-cart">
                    <span class="button-card-text">В корзину</span>
                    <span class="button-cart-svg"></span>
                  </button>
                  <strong class="card-price-bold">${price} ₽</strong>
                </div>
  `);
  cardsMenu.insertAdjacentElement('beforeend', card);
}

function openGoods(event) {
  const target = event.target;
  if (login) {
    const restaurant = target.closest('.card-restaurant'); // ищем родительский блок через метод closest, 
    //карточка в любом месте кликабельна
    if (restaurant) {
      // очистка cardMenu
      const info = restaurant.dataset.info.split(',');

      const [name, price, stars, kitchen] = info;

      cardsMenu.textContent = '';
      containerPromo.classList.add('hide');
      restaurants.classList.add('hide');
      menu.classList.remove('hide');


      restaurantTitle.textContent = name;
      rating.textContent = stars;
      minPrice.textContent = price;
      category.textContent = kitchen;

      getData(`./db/${restaurant.dataset.products}`).then(function (data) {
        data.forEach(createCardGood);
      });
    }
  } else {
    toggleModal();
  }
}

function init() {
  getData('./db/partners.json').then(function (data) {
    data.forEach(createCardRestaurants);
  })

  //Обработчики событий
  cartButton.addEventListener("click", toggleModal);

  close.addEventListener("click", toggleModal);

  cardsRestaurants.addEventListener('click', openGoods);

  logo.addEventListener('click', function () {
    containerPromo.classList.remove('hide');
    restaurants.classList.remove('hide');
    menu.classList.add('hide');
  })

 
}

init();


