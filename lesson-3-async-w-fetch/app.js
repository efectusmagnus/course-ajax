(function () {
  const form = document.querySelector('#search-form');
  const searchField = document.querySelector('#search-keyword');
  let searchedForText;
  const responseContainer = document.querySelector('#response-container');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    responseContainer.innerHTML = '';
    searchedForText = searchField.value;
    fetch(`https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`, {
      headers: {
        Authorization: 'Client-ID 59af6bdaab7d846c1115e37a4ead4fe5ed0f9c8af72e3fffb16f3c9cfff21989'
      }
    })
    //Convert the response to json
    .then(response => response.json())
    .then(addImage)
    //If there is a problem with the image
    .catch(err => requestError(err, 'image'));

    fetch(`http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}`)
    .then(response => response.json())
    .then(addArticles)
    .catch(err => requestError(err, 'articles'));
  });

  function addImage(data) {
    let htmlContent = '';

    if (data && data.results && data.results.length > 1) {
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

  function addArticles(data) {
    let htmlContent = '';

    if(data.response && data.response.docs && data.response.docs.length > 1) {
      const articles = data.response.docs;
      htmlContent = '<ul>' + articles.map(article => `<li class="article">
          <h2><a href="${article.web_url}">${article.headline.main}</a></h2>
          <p>${article.snippet}</p>
        </li>`
      ).join('') + '</ul>';
    } else {
      htmlContent = '<div class="error-no-articles">No articles available>/div>';
    }
    responseContainer.insertAdjacentHTML('beforeend', htmlContent);
  }

  function requestError(e, part) {
    console.log(e);

  }
})();
