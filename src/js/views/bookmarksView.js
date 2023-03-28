
import View from "./View.js";
import previewView from "./previewView.js";
import icons from 'url:../../img/icons.svg';



class BookmarksView extends View {
    _parentElement = document.querySelector('.bookmarks__list');
    _errMsgRsltView = `No booskmarks yet. Find nice recipe and bookmak it!`;
    _message = '';
    
    addHandlerRender(handler) {
        window.addEventListener('load', handler);
    }

    _generateMarkup() {
        return this._data.map(bookmark => previewView.render(bookmark, false)).join('');
    };
};
export default new BookmarksView();
