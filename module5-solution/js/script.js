$(function () {

  $("#navbarToggle").blur(function (event) {
    var screenWidth = window.innerWidth;
    if (screenWidth < 768) {
      $("#collapsable-nav").collapse('hide');
    }
  });

});

(function (global) {

var dc = {};

var homeHtmlUrl = "snippets/home-snippet.html";
var allCategoriesUrl =
  "https://coursera-jhu-default-rtdb.firebaseio.com/categories.json";
var categoriesTitleHtml = "snippets/categories-title-snippet.html";
var categoryHtml = "snippets/category-snippet.html";
var menuItemsUrl =
  "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items/";
var menuItemsTitleHtml = "snippets/menu-items-title.html";
var menuItemHtml = "snippets/menu-item.html";

var insertHtml = function (selector, html) {
  var targetElem = document.querySelector(selector);
  targetElem.innerHTML = html;
};

var showLoading = function (selector) {
  var html = "<div class='text-center'>";
  html += "<img src='images/ajax-loader.gif'></div>";
  insertHtml(selector, html);
};

var insertProperty = function (string, propName, propValue) {
  var propToReplace = "{{" + propName + "}}";
  string = string.replace(new RegExp(propToReplace, "g"), propValue);
  return string;
};

var switchMenuToActive = function () {
  var classes = document.querySelector("#navHomeButton").className;
  classes = classes.replace(new RegExp("active", "g"), "");
  document.querySelector("#navHomeButton").className = classes;

  classes = document.querySelector("#navMenuButton").className;
  if (classes.indexOf("active") === -1) {
    classes += " active";
    document.querySelector("#navMenuButton").className = classes;
  }
};

// ===============================
// HOME PAGE (FIXED MODULE 5)
// ===============================
document.addEventListener("DOMContentLoaded", function () {

  showLoading("#main-content");

  $ajaxUtils.sendGetRequest(
    allCategoriesUrl,
    buildAndShowHomeHTML,
    true
  );

});

function buildAndShowHomeHTML(categories) {

  $ajaxUtils.sendGetRequest(
    homeHtmlUrl,
    function (homeHtml) {

      // STEP 2
      var chosenCategoryShortName =
        chooseRandomCategory(categories).short_name;

      // STEP 3
      var homeHtmlToInsertIntoMainPage =
        insertProperty(
          homeHtml,
          "randomCategoryShortName",
          "'" + chosenCategoryShortName + "'"
        );

      // STEP 4
      insertHtml("#main-content", homeHtmlToInsertIntoMainPage);

    },
    false
  );
}

// Random category picker
function chooseRandomCategory (categories) {
  var randomArrayIndex =
    Math.floor(Math.random() * categories.length);
  return categories[randomArrayIndex];
}

// ===============================
// MENU CATEGORIES
// ===============================
dc.loadMenuCategories = function () {
  showLoading("#main-content");
  $ajaxUtils.sendGetRequest(
    allCategoriesUrl,
    buildAndShowCategoriesHTML);
};

function buildAndShowCategoriesHTML (categories) {
  $ajaxUtils.sendGetRequest(
    categoriesTitleHtml,
    function (categoriesTitleHtml) {
      $ajaxUtils.sendGetRequest(
        categoryHtml,
        function (categoryHtml) {

          switchMenuToActive();

          var categoriesViewHtml =
            buildCategoriesViewHtml(categories,
                                    categoriesTitleHtml,
                                    categoryHtml);

          insertHtml("#main-content", categoriesViewHtml);
        },
        false);
    },
    false);
}

function buildCategoriesViewHtml(categories,
                                 categoriesTitleHtml,
                                 categoryHtml) {

  var finalHtml = categoriesTitleHtml;
  finalHtml += "<section class='row'>";

  for (var i = 0; i < categories.length; i++) {
    var html = categoryHtml;
    html = insertProperty(html, "name", categories[i].name);
    html = insertProperty(html, "short_name", categories[i].short_name);
    finalHtml += html;
  }

  finalHtml += "</section>";
  return finalHtml;
}

// ===============================
// MENU ITEMS
// ===============================
dc.loadMenuItems = function (categoryShort) {
  showLoading("#main-content");
  $ajaxUtils.sendGetRequest(
    menuItemsUrl + categoryShort + ".json",
    buildAndShowMenuItemsHTML);
};

function buildAndShowMenuItemsHTML (categoryMenuItems) {

  $ajaxUtils.sendGetRequest(
    menuItemsTitleHtml,
    function (menuItemsTitleHtml) {

      $ajaxUtils.sendGetRequest(
        menuItemHtml,
        function (menuItemHtml) {

          switchMenuToActive();

          var menuItemsViewHtml =
            buildMenuItemsViewHtml(categoryMenuItems,
                                   menuItemsTitleHtml,
                                   menuItemHtml);

          insertHtml("#main-content", menuItemsViewHtml);
        },
        false);
    },
    false);
}

function buildMenuItemsViewHtml(categoryMenuItems,
                                menuItemsTitleHtml,
                                menuItemHtml) {

  menuItemsTitleHtml =
    insertProperty(menuItemsTitleHtml,
                   "name",
                   categoryMenuItems.category.name);

  var finalHtml = menuItemsTitleHtml;
  finalHtml += "<section class='row'>";

  var menuItems = categoryMenuItems.menu_items;
  var catShortName = categoryMenuItems.category.short_name;

  for (var i = 0; i < menuItems.length; i++) {

    var html = menuItemHtml;

    html = insertProperty(html, "short_name", menuItems[i].short_name);
    html = insertProperty(html, "catShortName", catShortName);
    html = insertProperty(html, "name", menuItems[i].name);
    html = insertProperty(html, "description", menuItems[i].description);

    finalHtml += html;
  }

  finalHtml += "</section>";
  return finalHtml;
}

global.$dc = dc;

})(window);
