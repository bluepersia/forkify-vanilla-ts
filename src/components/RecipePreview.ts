import { AppContext } from "../app";
import { IRecipe } from "../models/recipe";

export default function RecipePreview ({id, title, publisher, image_url, source_url}:IRecipe) : string 
{

    return `<li class="preview" data-id="${id}">
    <a class="preview__link ${id === AppContext.activeId && 'preview__link--active'}" href="#23456">
      <figure class="preview__fig">
        <img src="${image_url}" alt="${title}" />
      </figure>
      <div class="preview__data">
        <h4 class="preview__title">${title}</h4>
        <p class="preview__publisher">${publisher}</p>
        <div class="preview__user-generated">
          <svg>
            <use href="src/img/icons.svg#icon-user"></use>
          </svg>
        </div>
      </div>
    </a>
  </li>`
}