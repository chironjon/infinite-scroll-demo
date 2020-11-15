const imageContainer = document.getElementById('image-container');
const loader = document.getElementById('loader');

let readyToLoad = false;
let imagesLoaded = 0;
let totalImages = 0;
let photosArray = [];
let initialLoad = true;

// Unsplash API
let initialCount = 5;
const apiKey = 'FT0aoRGxANFUIEdOchHRp79evoHl29yZWHVkFhr_rG8';
let apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${initialCount}`;

// update api w/ new count
function updateApiUrlWithNewCount (imgCount) {
  apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${imgCount}`;
}

// check if all images were loaded
function imageLoaded() {
  imagesLoaded++;
  if (imagesLoaded === totalImages) {
    readyToLoad = true;
    loader.hidden = true;
  }
}

//helper function to set attributes on dom elements
function setAttributes(element, attributes) {
  for (const key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
}

// Create elements for links & photos, Add to DOM
function displayPhotos() {
  imagesLoaded = 0;
  totalImages = photosArray.length;
  // run function for each object in photosArray
  photosArray.forEach((photo) => {
    // create <a></a> to link to unsplash
    const item = document.createElement('a');
    setAttributes(item, {
      href: photo.links.html,
      target: '_blank'
    });
    // Create <img> for photo
    const img = document.createElement('img');
    setAttributes(img, {
      src: photo.urls.regular,
      alt: photo.alt_description,
      title: photo.alt_description
    })
    // event listener, check when each is finished loading
    img.addEventListener('load', imageLoaded);
    // put img inside a, then put both inside img container elmt
    item.appendChild(img);
    imageContainer.appendChild(item);
  });
}

// Get photos from unsplash api
async function getPhotos() {
  try {
    const response = await fetch(apiUrl);
    photosArray = await response.json();
    displayPhotos();
    if (initialLoad) {
      updateApiUrlWithNewCount(30);
      initialLoad = false;
    }
  } catch(error) {
    // Catch Error
  }
}

//check to see if scrolling near bottom of page, load more photos
window.addEventListener('scroll', () => {
  if(window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 && readyToLoad) {
    readyToLoad = false;
    getPhotos();
  }
})

// on load
getPhotos();