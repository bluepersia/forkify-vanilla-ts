import { AppContext } from "../app";
import RecipePreview from "./RecipePreview";


export default class Bookmarks 
{
    
    list = document.querySelector<HTMLUListElement>('.bookmarks__list')!;

    constructor ()
    {
        AppContext.onChange.push ((id:string):void =>
        {
            if (id === 'ACTIVE_ID' || id === 'BOOKMARKS')
                this.render ();
        });
    }

    render () : void 
    {
        if (AppContext.bookmarks.length === 0)
            this.list.innerHTML = `<div class="message">
        <div>
          <svg>
            <use href="src/img/icons.svg#icon-smile"></use>
          </svg>
        </div>
        <p>
          No bookmarks yet. Find a nice recipe and bookmark it :)
        </p>
      </div>`;
      else 
        this.list.innerHTML = AppContext.bookmarks.map (bm => RecipePreview(bm)).join ('');
    }
}