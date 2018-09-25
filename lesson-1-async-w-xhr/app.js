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


    /*function addImage(){}
    const searchedForText = 'hippos';
    const unsplashRequest = new XMLHttpRequest();

    unsplashRequest.open('GET', `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`);
    unsplashRequest.onload = addImage;
    //`setRequestHeader()` sets the value of an HTTP request header.
    //It must be called after `open() `but before `send()`
    unsplashRequest.setRequestHeader();
    unsplashRequest.send();*/

    function addImage() {
      let htmlContent = '';
      const data = JSON.parse(this.responseText);

      if(data && data.results && data.results[0]) {
        const firstImage = data.results[0];
        htmlContent = `<figure>
          <img src="${firstImage.urls.regular}" alt="${searchedForText}">
          <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
        </figure>`;
      } else {
        htmlContent = 'div class="error-no-image">No images available</div>';
      }

      responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
    }
    /*
    function addImage() {
      //debugger
      //Convert the response from `JSON` into a `JavaScript`object, then format the `data`
      const data = JSON.parse(this.responseText);
      const firstImage = data.results[0]; //get the first image
      //add the image to the page from unsplash and a caption of the person that took the photo
      //it will add this inside the response container as the first element
      //Check if there are results returned
      if(data && data.results && data.results[0]) {
        htmlContent = `<figure>
          <img src="${firstImage.urls.regular}" alt="${searchedForText}">
          <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
        </figure>`;
      } else { //if not, throw an message error
        htmlContent = `<div class="error-no-image">No images available</div>`;
      }

      responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
    }
*/
    function addArticles() {
      //debugger;
      let htmlContent = '';
      const data = JSON.parse(this.responseText);
      //if some articles have been resturned, then this section maps over each article
      //and returns a list item that contains the article's headline and a snippet of the article
      if (data.response && data.response.docs && data.response.docs.length > 1) {
        htmlContent = '<ul' + data.response.docs.map(article => `<li class="article">
        <h2><a href="${article.web_url}">${article.headline.main}</a></h2>
        <p>${article.snippet}</p>
        </li>`
      ).join('') + '</ul>';
    }else {
      htmlContent = '<div class="error-no-articles">No articles available</div>';
    }
      responseContainer.innerAdjacentHTML('beforeend', htmlContent);
    }

    function requestError(e, part) {
      console.log(e);
      responseContainer.insertAdjacentHTML('beforeend', `<p class="network-warning error-no-articles"`);
    }

})();
