export default class ItemReel {
    constructor(name = "", notIn = []){
      
        this.itemsAlreadyInTheReel = notIn;
        this.name = name == "" ? this.random() : name;
        this.img = new Image();
        this.img.src = require(`../assets/${this.name}.png`);  
    }

    get items() {
        return [
          'BAR',
          '2xBAR',
          '3xBAR',
          'Cherry',
          '7',
        ];
      }
    
      random() {
        var item;
        while(item == undefined || this.itemsAlreadyInTheReel.indexOf(item) != -1){
          item = this.items[Math.floor(Math.random() * this.items.length)];
        }
        return item;
      }
}