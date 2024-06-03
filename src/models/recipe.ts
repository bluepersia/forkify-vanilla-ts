export interface IRecipe 
{
    title:string,
    publisher:string,
    image_url:string,
    source_url:string,
    servings:number,
    cooking_time:number,
    ingredients: IIngredient[]
}

export interface IIngredient 
{
    description:string,
    unit:string,
    quantity:number
}