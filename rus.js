(function () {
  "use strict";

  function RussianMoviePlugin() {
    const currentDate = new Date().toISOString().slice(0, 10);
    const imgPath = "https://bylampa.github.io/img/";

    const collections = [
      { title: "Premier", img: imgPath + "premier.jpg", id: 2859 },
      { title: "КиноПоиск", img: imgPath + "kinopoisk.jpg", id: 3827 },
      { title: "Wink", img: imgPath + "wink.jpg", id: 3871 },
      { title: "KION", img: imgPath + "kion.jpg", id: 4085 },
      { title: "Okko", img: imgPath + "okko.jpg", id: 3923 },
      { title: "START", img: imgPath + "start.jpg", id: 2493 },
      { title: "ИВИ", img: imgPath + "ivi.jpg", id: "ivi" },
      { title: "СТС", img: imgPath + "sts.jpg", id: 5806 },
      { title: "ТНТ", img: imgPath + "tnt.jpg", id: 1191 },
    ];

    this.createContent = function () {
      return collections.map((item) => {
        let requestUrl = `discover/tv?with_networks=${item.id}&sort_by=first_air_date.desc&air_date.lte=${currentDate}`;

        if (item.id === "ivi") {
          requestUrl = `discover/movie?with_original_language=ru&sort_by=popularity.desc&primary_release_date.lte=${currentDate}`;
        }

        // Исправленная структура объекта: убираем Lampa.Card.only
        return {
          title: item.title,
          img: item.img,
          card_view: "wide", // Указываем тип карточки напрямую
          params: {
            style: "tile",
          },
          data: {
            url: requestUrl,
            title: item.title,
            component: "category_full",
            source: "tmdb",
            page: 1,
          },
        };
      });
    };

    this.initMenu = function () {
      const menuIcon = `<div class="menu__ico"><svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em"><path d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4S4 12.954 4 24s8.954 20 20 20Z" stroke="currentColor" stroke-width="4"/><path d="M24 18a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm0 18a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-9-9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm18 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" fill="currentColor"/></svg></div>`;
      const menuItem = $(
        `<li class="menu__item selector">${menuIcon}<div class="menu__text">Русское</div></li>`,
      );

      menuItem.on("hover:enter", () => {
        Lampa.Activity.push({
          url: "",
          title: "Русские новинки",
          component: "rus_movie",
          page: 1,
        });
      });

      $(".menu .menu__list").eq(0).append(menuItem);
    };
  }

  Lampa.Component.add("rus_movie", function (object) {
    const plugin = new RussianMoviePlugin();
    this.create = function () {
      const results = plugin.createContent();
      // Используем стандартный билд без лишних оберток
      this.build({
        results: results,
        onBack: () => {
          Lampa.Activity.backward();
        },
      });
    };

    this.render = function () {
      return this.build().render();
    };
  });

  // Инициализация
  if (window.appready) {
    new RussianMoviePlugin().initMenu();
  } else {
    Lampa.Listener.follow("app", (e) => {
      if (e.type == "ready") new RussianMoviePlugin().initMenu();
    });
  }
})();
