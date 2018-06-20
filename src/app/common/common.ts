module app{

    export class Common{
    
        static setButtonsReferences(price: number){
            var btnGames = this.getElementById('btnPartidos');
            btnGames.setAttribute("href","#gameList/" + price);
            var btnStats = this.getElementById('btnEstadsticas');
            btnStats.setAttribute("href","#teamList/" + price);

        }

        static getElementById(id: string): HTMLElement{
            return document.getElementById(id);
        }
        
        static getCanvasContext(elementId: string): CanvasRenderingContext2D{
            var canvas = <HTMLCanvasElement> Common.getElementById(elementId);
            var ctx = canvas.getContext("2d");
            return ctx;
        }
    }
}