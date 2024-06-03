import { AppContext } from "../app";
import { IRecipe } from "../models/recipe";
import { IStateBase } from "../models/state";
import { apiKey, baseURL } from "../utility";
import ErrorDisplay from "./ErrorDisplay";
import RecipePreview from "./RecipePreview";
import Spinner from "./Spinner";

const RES_PER_PAGE = 10;

interface IState extends IStateBase
{
    results: IRecipe[],
    page: number
}

export default class Search
 {
    state:IState = {
        isLoading: false,
        error: null,
        results: [],
        page: 1
    }

    get totalPages () : number 
    {
        return Math.ceil (this.state.results.length / RES_PER_PAGE);
    }

    get currentPage () : IRecipe[] 
    {
        const endIndex = this.state.page * RES_PER_PAGE;
        const startIndex = endIndex - RES_PER_PAGE;
        return this.state.results.slice (startIndex, endIndex);
    }

    get page () : number 
    {
        return this.state.page;
    }

    set page (val:number) 
    {
        this.state.page = val;
        this.render ();
    }

    searchForm = document.querySelector<HTMLFormElement> ('.search')!;
    resultsUl = document.querySelector <HTMLUListElement> ('.results')!;
    paginationDiv = document.querySelector<HTMLDivElement>('.pagination')!;

    constructor ()
    {
        this.searchForm.addEventListener ('submit', this.submit.bind(this));
        this.paginationDiv.addEventListener ('click', this.paginationClick.bind(this));

        AppContext.onChange.push ((id:string):void=> 
        {
            if (id === 'ACTIVE_ID')
                this.render ();
        });
    }


    paginationClick (e:MouseEvent) : void 
    {
        const target = e.target as HTMLElement;

        if (target.closest ('.pagination__btn--prev'))
            this.page--;
        else if (target.closest ('.pagination__btn--next'))
            this.page++;
    }

    submit (e:SubmitEvent) : void
    {
        e.preventDefault ();

        const formData = new FormData (e.target as HTMLFormElement);

        this.search (formData.get('name') as string);
    }

    async search (name:string) : Promise<void>
    {
        try 
        {
            this.state.error = null;
            this.state.isLoading = true;
            this.render ();

            const res = await fetch (`${baseURL}?search=${name}&key=${apiKey}`);

            if (!res.ok)
                throw new Error ((await res.json()).message);

            this.state.results = (await res.json()).data.recipes;
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


    render ()
    {
        if (this.state.isLoading)
        {
            this.resultsUl.innerHTML = Spinner ();
            return;
        }

        if (this.state.error)
        {
            this.resultsUl.innerHTML = ErrorDisplay (this.state.error);
            return;
        }

        this.resultsUl.innerHTML = this.currentPage.map (recipe => RecipePreview (recipe)).join ('');

        this.paginationDiv.innerHTML = `${this.page > 1 ? `<button class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="src/img/icons.svg#icon-arrow-left"></use>
        </svg>
        <span>Page 1</span>
      </button>` : ''}
      ${this.page < this.totalPages ? `<button class="btn--inline pagination__btn--next">
        <span>Page 3</span>
        <svg class="search__icon">
          <use href="src/img/icons.svg#icon-arrow-right"></use>
        </svg>
      </button>` : ''}`
    }
 }

