import Search from "./components/Search";

type AppContextType = 
{
    activeId:string,
    setActiveId: (id:string) => void,
    onChange: ((id:string) => void)[]
};

export const AppContext : AppContextType = 
{
    activeId: '',
    setActiveId: function (id:string) : void 
    {
        this.activeId = id;

        this.onChange.forEach (el => el('ACTIVE_ID'));
    },
    onChange: []
}

class App 
{

    search = new Search ();

    constructor ()
    {
        document.addEventListener ('click', this.click);
    }

    click (e:MouseEvent ): void 
    {
        const target = e.target as HTMLElement;

        const preview = target.closest<HTMLLIElement>('.preview')!;

        if (preview)
            AppContext.setActiveId (preview.dataset.id!);
    }
}

new App ();