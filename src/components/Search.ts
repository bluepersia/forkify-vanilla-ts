import { IRecipe } from "../models/recipe";
import { IStateBase } from "../models/state";
import { apiKey, baseURL } from "../utility";
import ErrorDisplay from "./ErrorDisplay";
import RecipePreview from "./RecipePreview";
import Spinner from "./Spinner";

interface IState extends IStateBase
{
    results: IRecipe[]
}

export default class Search
 {
    state:IState = {
        isLoading: false,
        error: null,
        results: []
    }

    searchForm = document.querySelector<HTMLFormElement> ('.search')!;
    resultsUl = document.querySelector <HTMLUListElement> ('.results')!;

    constructor ()
    {
        this.searchForm.addEventListener ('submit', this.submit.bind(this));
    }

    submit (e:SubmitEvent)
    {
        e.preventDefault ();

        const formData = new FormData (e.target as HTMLFormElement);

        this.search (formData.get('name') as string);
    }

    async search (name:string) : Promise<void>
    {
        try 
        {
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

        this.resultsUl.innerHTML = this.state.results.map (recipe => RecipePreview (recipe)).join ('');
    }
 }

