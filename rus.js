(function () {
  "use strict";

  function RussianMoviePlugin() {
    var currentDate = new Date().toISOString().slice(0, 10);
    // Используем оригинальные ссылки на картинки
    var imgPath = "https://bylampa.github.io/img/";

    var collections = [
      {
        title: "Русские фильмы",
        img: imgPath + "rus_movie.jpg",
        url:
          "discover/movie?with_original_language=ru&sort_by=primary_release_date.desc&primary_release_date.lte=" +
          currentDate,
      },
      {
        title: "Русские сериалы",
        img: imgPath + "rus_tv.jpg",
        url:
          "discover/tv?with_original_language=ru&sort_by=first_air_date.desc&air_date.lte=" +
          currentDate,
      },
      {
        title: "Русские мультфильмы",
        img: imgPath + "rus_mult.jpg",
        url:
          "discover/movie?with_genres=16&with_original_language=ru&sort_by=primary_release_date.desc&primary_release_date.lte=" +
          currentDate,
      },
      {
        title: "Wink",
        img: imgPath + "wink.jpg",
        url:
          "discover/tv?with_networks=3871&sort_by=first_air_date.desc&air_date.lte=" +
          currentDate,
      },
      {
        title: "Premier",
        img: imgPath + "premier.jpg",
        url:
          "discover/tv?with_networks=2859&sort_by=first_air_date.desc&air_date.lte=" +
          currentDate,
      },
      {
        title: "KION",
        img: imgPath + "kion.jpg",
        url:
          "discover/tv?with_networks=4085&sort_by=first_air_date.desc&air_date.lte=" +
          currentDate,
      },
      {
        title: "ИВИ",
        img: imgPath + "ivi.jpg",
        url:
          "discover/tv?with_networks=119&sort_by=popularity.desc&first_air_date.lte=" +
          currentDate,
      },
      {
        title: "Okko",
        img: imgPath + "okko.jpg",
        url:
          "discover/tv?with_networks=3923&sort_by=first_air_date.desc&air_date.lte=" +
          currentDate,
      },
      {
        title: "КиноПоиск",
        img: imgPath + "kinopoisk.jpg",
        url:
          "discover/tv?with_networks=3827&sort_by=first_air_date.desc&air_date.lte=" +
          currentDate,
      },
      {
        title: "START",
        img: imgPath + "start.jpg",
        url:
          "discover/tv?with_networks=2493&sort_by=first_air_date.desc&air_date.lte=" +
          currentDate,
      },
      {
        title: "СТС",
        img: imgPath + "sts.jpg",
        url:
          "discover/tv?with_networks=5806&sort_by=first_air_date.desc&air_date.lte=" +
          currentDate,
      },
      {
        title: "ТНТ",
        img: imgPath + "tnt.jpg",
        url:
          "discover/tv?with_networks=1191&sort_by=first_air_date.desc&air_date.lte=" +
          currentDate,
      },
    ];

    this.initMenu = function () {
      var menuItem = $(
        '<li class="menu__item selector">' +
          '<div class="menu__ico">' +
          '<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em"><path d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4S4 12.954 4 24s8.954 20 20 20Z" stroke="currentColor" stroke-width="4"/><path d="M24 18a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm0 18a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-9-9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm18 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" fill="currentColor"/></svg>' +
          "</div>" +
          '<div class="menu__text">Русское</div>' +
          "</li>",
      );

      menuItem.on("hover:enter", function () {
        Lampa.Activity.push({
          url: "",
          title: "Русские новинки",
          component: "rus_movie",
          page: 1,
        });
      });

      $(".menu .menu__list").eq(0).append(menuItem);
    };

    this.getCardsData = function () {
      return collections;
    };
  }

  Lampa.Component.add("rus_movie", function (object) {
    var scroll = new Lampa.Scroll({ mask: true, over: true });
    // Добавляем класс card--wide к контейнеру, чтобы сетка понимала, что карточки широкие
    var container = $('<div class="category-full card--wide"></div>');
    var plugin = new RussianMoviePlugin();

    this.create = function () {
      this.build();
    };

    this.build = function () {
      var cards = plugin.getCardsData();

      cards.forEach(function (item) {
        // ИЗМЕНЕНИЯ ЗДЕСЬ:
        // Мы задаем контейнеру card__view относительное позиционирование и паддинг снизу ~56%.
        // Это принудительно создает пропорцию 16:9.
        // Саму картинку мы позиционируем абсолютно, чтобы она вписалась в этот контейнер.
        var card = $(
          '<div class="card selector">' +
            '<div class="card__view" style="position: relative; width: 100%; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 8px;">' +
            '<img class="card__img" src="' +
            item.img +
            '" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;" />' +
            "</div>" +
            '<div class="card__title" style="text-align: center; margin-top: 8px; font-size: 1.1em;">' +
            item.title +
            "</div>" +
            "</div>",
        );

        card.on("hover:enter", function () {
          Lampa.Activity.push({
            url: item.url,
            title: item.title,
            component: "category_full",
            source: "tmdb",
            page: 1,
          });
        });

        container.append(card);
      });

      scroll.append(container);
    };

    this.start = function () {
      Lampa.Controller.add("content", {
        toggle: function () {
          Lampa.Controller.collectionSet(scroll.render());
          Lampa.Controller.collectionFocus(false, scroll.render());
        },
        left: function () {
          if (Lampa.Navigator.canmove("left")) Lampa.Navigator.move("left");
          else Lampa.Controller.toggle("menu");
        },
        right: function () {
          if (Lampa.Navigator.canmove("right")) Lampa.Navigator.move("right");
        },
        up: function () {
          if (Lampa.Navigator.canmove("up")) Lampa.Navigator.move("up");
          else Lampa.Controller.toggle("head");
        },
        down: function () {
          if (Lampa.Navigator.canmove("down")) Lampa.Navigator.move("down");
        },
        back: function () {
          Lampa.Activity.backward();
        },
      });
      Lampa.Controller.toggle("content");
    };

    this.render = function () {
      return scroll.render();
    };
    this.pause = function () {};
    this.stop = function () {};
    this.destroy = function () {
      scroll.destroy();
      container.empty();
    };
  });

  if (window.appready) new RussianMoviePlugin().initMenu();
  else
    Lampa.Listener.follow("app", function (e) {
      if (e.type == "ready") new RussianMoviePlugin().initMenu();
    });
})();
