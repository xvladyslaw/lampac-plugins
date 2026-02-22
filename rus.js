(function () {
  "use strict";

  function RussianMoviePlugin() {
    var currentDate = new Date().toISOString().slice(0, 10);
    // Используем прямые ссылки на иконки, чтобы избежать проблем с путями
    var imgPath = "https://bylampa.github.io/img/";

    var collections = [
      { title: "Premier", img: imgPath + "premier.jpg", id: 2859 },
      { title: "КиноПоиск", img: imgPath + "kinopoisk.jpg", id: 3827 },
      { title: "Wink", img: imgPath + "wink.jpg", id: 3871 },
      { title: "KION", img: imgPath + "kion.jpg", id: 4085 },
      { title: "Okko", img: imgPath + "okko.jpg", id: 3923 },
      { title: "START", img: imgPath + "start.jpg", id: 2493 },
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
      return collections.map(function (item) {
        return {
          title: item.title,
          img: item.img,
          url:
            "discover/tv?with_networks=" +
            item.id +
            "&sort_by=first_air_date.desc&air_date.lte=" +
            currentDate,
        };
      });
    };
  }

  Lampa.Component.add("rus_movie", function (object) {
    var scroll = new Lampa.Scroll({ mask: true, over: true });
    var container = $('<div class="category-full"></div>');
    var plugin = new RussianMoviePlugin();
    var lastFocus;

    this.create = function () {
      var self = this;
      var cards = plugin.getCardsData();

      cards.forEach(function (item) {
        var card = new Lampa.Card(item, { card_view: "wide" });
        card.create();
        card.onSelect = function () {
          Lampa.Activity.push({
            url: item.url,
            title: item.title,
            component: "category_full",
            source: "tmdb",
            page: 1,
          });
        };
        container.append(card.render());
      });

      scroll.append(container);
    };

    this.start = function () {
      Lampa.Controller.add("content", {
        toggle: function () {
          Lampa.Controller.toggle("content");
        },
        up: function () {
          Lampa.Controller.toggle("head");
        },
        left: function () {
          Lampa.Controller.toggle("menu");
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

    this.active = function () {
      // Больше не вызываем start() здесь, чтобы не было рекурсии
    };

    this.pause = function () {};
    this.stop = function () {}; // Добавили пустой stop на всякий случай

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
