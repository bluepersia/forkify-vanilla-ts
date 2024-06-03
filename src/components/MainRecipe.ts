import { AppContext } from "../app";
import { IRecipe } from "../models/recipe";
import { IStateBase } from "../models/state";
import { baseURL } from "../utility";
import ErrorDisplay from "./ErrorDisplay";
import Spinner from "./Spinner";

interface IState extends IStateBase
{
    recipe: IRecipe | null
}

export default class MainRecipe
 {
    state:IState = 
    {
        isLoading: false,
        error: null,
        recipe: null
    }

    get servings () : number {
        return this.state.recipe?.servings || 0;
    }

    set servings (val:number)
    {
        if (val > 8 || val < 1)
            return;

        if (this.state.recipe)
        {
            const mult = val / this.state.recipe.servings;

            this.state.recipe.servings = val;
            this.state.recipe.cooking_time *= mult;
            this.state.recipe.ingredients.forEach (ing => ing.quantity *= mult);

            this.render ();
        }

    }

    recipeDiv = document.querySelector<HTMLDivElement> ('.recipe')!;
    

    constructor ()
    {
        this.recipeDiv.addEventListener ('click', this.click.bind(this));

        AppContext.onChange.push ((id:string):void =>
        {
            if (id === 'ACTIVE_ID')
                this.fetchRecipe ();
        });
    }

    click (e:MouseEvent): void 
    {
        const target = e.target as HTMLElement;

        if (target.closest ('.recipe__btn-bookmark'))
            AppContext.bookmark (this.state.recipe!);

        if (target.closest ('.btn--decrease-servings'))
            this.servings--;
        else if (target.closest ('.btn--increase-servings'))
            this.servings++;
    }

    async fetchRecipe () : Promise<void>
    {
        try 
        {
            this.state.error = null;
            this.state.isLoading = false;
            this.render ();

            const res = await fetch (`${baseURL}/${AppContext.activeId}`);

            if (!res.ok)
                throw new Error ((await res.json()).message);

            this.state.recipe = (await res.json()).data.recipe;
        }
        catch (err)
        {
            this.state.error = err as Error;
        }
        finally 
        {
            this.state.isLoading = false;
            this.render ();
        }
    }

    render () : void 
    {
        if (this.state.isLoading)
        {
            this.recipeDiv.innerHTML = Spinner ();
            return;
        }

        if (this.state.error)
        {
            this.recipeDiv.innerHTML = ErrorDisplay (this.state.error);
            return;
        }

        if (this.state.recipe)
        {
            const {title, publisher, image_url, source_url, servings, cooking_time, ingredients} = this.state.recipe;

            this.recipeDiv.innerHTML = `<figure class="recipe__fig">
            <img src="${image_url}" alt="${title}" class="recipe__img" />
            <h1 class="recipe__title">
              <span>${title}</span>
            </h1>
          </figure>
  
          <div class="recipe__details">
            <div class="recipe__info">
              <svg class="recipe__info-icon">
                <use href="src/img/icons.svg#icon-clock"></use>
              </svg>
              <span class="recipe__info-data recipe__info-data--minutes">${cooking_time}</span>
              <span class="recipe__info-text">minutes</span>
            </div>
            <div class="recipe__info">
              <svg class="recipe__info-icon">
                <use href="src/img/icons.svg#icon-users"></use>
              </svg>
              <span class="recipe__info-data recipe__info-data--people">${servings}</span>
              <span class="recipe__info-text">servings</span>
  
              <div class="recipe__info-buttons">
                <button class="btn--tiny btn--decrease-servings">
                  <svg>
                    <use href="src/img/icons.svg#icon-minus-circle"></use>
                  </svg>
                </button>
                <button class="btn--tiny btn--increase-servings">
                  <svg>
                    <use href="src/img/icons.svg#icon-plus-circle"></use>
                  </svg>
                </button>
              </div>
            </div>
  
            <div class="recipe__user-generated">
              <svg>
                <use href="src/img/icons.svg#icon-user"></use>
              </svg>
            </div>
            <button class="btn--round recipe__btn-bookmark">
              <svg class="">
                <use href="src/img/icons.svg#icon-bookmark-fill"></use>
              </svg>
            </button>
          </div>
  
          <div class="recipe__ingredients">
            <h2 class="heading--2">Recipe ingredients</h2>
            <ul class="recipe__ingredient-list">
              ${ingredients.map (ing => ` <li class="recipe__ingredient">
              <svg class="recipe__icon">
                <use href="src/img/icons.svg#icon-check"></use>
              </svg>
              <div class="recipe__quantity">${ing.quantity || ''}</div>
              <div class="recipe__description">
                <span class="recipe__unit">${ing.unit || ''}</span>
                ${ing.description || ''}
              </div>
            </li>`).join ('')}
  
             
            </ul>
          </div>
  
          <div class="recipe__directions">
            <h2 class="heading--2">How to cook it</h2>
            <p class="recipe__directions-text">
              This recipe was carefully designed and tested by
              <span class="recipe__publisher">${publisher}</span>. Please check out
              directions at their website.
            </p>
            <a
              class="btn--small recipe__btn"
              href="${source_url}"
              target="_blank"
            >
              <span>Directions</span>
              <svg class="search__icon">
                <use href="src/img/icons.svg#icon-arrow-right"></use>
              </svg>
            </a>
          </div>`;
        }
    }
 }