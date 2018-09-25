(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;
        //here should go the `async request`
        //Adding the image
        //`Unsplash`
        const imgRequest = new XMLHttpRequest();
        imgRequest.onload = addImage;
        imgRequest.onerror = function(err) {
          requestError(err, 'image');
        };
        imgRequest.open('GET', `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`);
        imgRequest.setRequestHeader('Authorization', 'Client-ID 59af6bdaab7d846c1115e37a4ead4fe5ed0f9c8af72e3fffb16f3c9cfff21989');
        imgRequest.send();

        //`New York Times`
        const articleRequest = new XMLHttpRequest();
        articleRequest.onload = addArticles;
        articleRequest.onerror = function(err) {
          requestError(err, 'articles');
        };
        articleRequest.open('GET', `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}`);
        //This request does not work for NYTimes at the moment
        imgRequest.setRequestHeader('Authorization', 'Client-ID ada69d4ca05f447db02f342a7b80130f');
        articleRequest.send();
    });
    function addImage(images) {
      const firstImage = images.results[0];

      responseContainer.insertAdjacentHTML('afterbegin', `<figure>
              <img src="${firstImage.urls.small}" alt="${searchedForText}">
              <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
          </figure>`
      );
    }
    function addArticles(articles) {
      const firstArticle = articles.results[0];

      responseContainer.insertAdjacentHTML('afterbegin', `<figure>
              <img src="${firstArticle.urls.small}" alt="${searchedForText}">
              <figcaption>${searchedForText} by ${firstArticle.user.name}</figcaption>
          </figure>`
      );
    }
})();

/*fetch(https://api.unsplash.com/search/photos?page=1&query={searchedForText}
, {
  headers: {
    Authorization:'Client-ID abcc123'
  }
});

const requestHeaders = new Headers();
requestHeaders.append('Authorization', 'Client-ID abc123');
fetch(https://api.unsplash.com/search/photos?page=1&query={searchedForText}
, {
  headers: requestHeaders
});*/

/*fetch(`https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`, {
    method: 'POST'
});*/
