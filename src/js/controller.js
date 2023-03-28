import * as model from './model.js';
import  {MODAL_CLOSE_SEC}  from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime/runtime';

///////////////////////////////////////

// if ( module.hot) {
//   module.hot.accept();
// };

const controlRecipes = async function() {
  try{
    const id = window.location.hash.slice(1);
    // console.log(id);
    if(!id) return;

    recipeView.renderSpinner()

    // update reasults view to mark selectetd search result
    resultsView.update(model.getSearchResultsPage());

    // updating bookmarks view
    bookmarksView.update(model.state.bookmarks);

    // loading recipe
    await model.loadRecipe(id)

    //rendering recipe
    recipeView.render(model.state.recipe);

  }catch(err) {
    recipeView.renderError();
    console.error(err);
  };
};


const controlSearchResults = async function () {
  try {
    const query = searchView.getQuery();
    if (!query) return;
    resultsView.renderSpinner();

    // 1) Get search query
    

    // 2) Load search results
    await model.loadSearchReasults(query);

    // 3) Render results
    resultsView.render(model.getSearchResultsPage());

    // 4) render the initial pagination buttons 
    paginationView.render(model.state.search) 

  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function(goToPage) {
  // 1) Render new results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2) render new pagination buttons 
  paginationView.render(model.state.search);
};

const controlServings = function(newServings) {
  // update the recipe servings
  model.updateServings(newServings);

  // update the recipe view

  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
}

const controlAddBookmark = function() {
  // add or remove bookmark
  if(!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // update recipe view
  recipeView.update(model.state.recipe);

  // render bookmarks
  bookmarksView.render(model.state.bookmarks)
};

const controlBookmarks = function() {
  bookmarksView.render(model.state.bookmarks)
};

const controlAddRecipe = async function(newRecipe) {
  try {
  console.log(model.state.recipe);
  // show loading recipe data
  addRecipeView.renderSpinner();

  // uload new recipe data
  await model.uploadRecipe(newRecipe)
  
  // render recipe
  recipeView.render(model.state.recipe);

  //succsess message
  addRecipeView.renderMessage();

  // render bookmark view
  bookmarksView.render(model.state.bookmarks);

  //change id in the url
  window.history.pushState(null, '', `#${model.state.recipe.id}`);
    // window.history.back()

  // close form window
  setTimeout(function() {
    addRecipeView.toggleWindow();
  
  }, MODAL_CLOSE_SEC * 1000);
}catch(error) {
    console.log(`my error ${error}`);
    addRecipeView.renderError(error.message);
  }
}

 
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);                            
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  // addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
