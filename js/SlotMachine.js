import ItemReel from "./ItemReel";
import Reel from "./Reel";

export default class SlotMachine {
    constructor(DOMElement) {
        this.container = DOMElement;
        this.spinButton = document.getElementById('spin');
        this.balanceText = document.getElementById('balance');
        this.debug = document.getElementById('debug');
        this.slotLine = document.getElementsByClassName('slot-indicator');
        this.payTable = document.getElementsByTagName('li');
        this.spinButton.addEventListener('click', () => this.runReels());
        this.balanceText.addEventListener('focusout', () => this.updateBalance());
        this.balance = 50;
        this.balanceText.value = this.balance;
        this.feelReels(this.createRandomMatrix(), false);
    }

    updateBalance(){
        this.balance = this.balanceText.value;
    }

    runReels() {
        this.spinButton.disabled = true;
        this.balance -= 1;
        this.balanceText.value = this.balance;

        
        this.itemMatrix = this.createRandomMatrix();

        if(this.debug.checked){
            var debugValues = Array.from(document.getElementsByClassName("debug-area")[0]
            .getElementsByTagName("select")).reduce((rows, key, index) =>
                (index % 3 == 0 ? rows.push([new ItemReel(key.value)]) : rows[rows.length - 1].push(new ItemReel(key.value)))
                && rows, []);
            this.itemMatrix = this.transpose(debugValues);
        }
        
        this.removeOldNodes();
        this.feelReels(this.itemMatrix);
        window.setTimeout(() => {
            this.checkPot();
            console.log(this.itemMatrix);
            if(this.balance > 0) {
                this.spinButton.disabled = false;
            }
        }, 3000);
    }

    feelReels(itemMatrix, animate = true){
        Array.from(this.container.getElementsByClassName('reel')).map(
            (reelContainer, idx) => {
                new Reel(reelContainer, idx, itemMatrix[idx], animate);
            }
        );
    }

    createRandomMatrix() {
        var item00 = new ItemReel(); 
        var item01 = new ItemReel("", [item00.name]); 
        var item02 = new ItemReel("", [item00.name, item01.name]); 

        var item10 = new ItemReel(); 
        var item11 = new ItemReel("", [item10.name]); 
        var item12 = new ItemReel("", [item10.name, item11.name]); 

        var item20 = new ItemReel(); 
        var item21 = new ItemReel("", [item20.name]); 
        var item22 = new ItemReel("", [item20.name, item21.name]); 

        return [
            [item00, item01, item02],
            [item10, item11, item12],
            [item20, item21, item22],
        ];
    }

    transpose(matrix) {
        return Object.keys(matrix[0])
            .map(colNumber => matrix.map(rowNumber => rowNumber[colNumber]));
    }

    removeOldNodes() {
        Array.from(this.slotLine).map(item => item.className = "slot-indicator ");
        Array.from(this.payTable).map(item => item.style.backgroundColor = "");
        var items = document.getElementsByClassName('icons');
        if (items.length > 0) {
            Array.from(items).map(i => i.parentNode.removeChild(i));
        }
    }

    /*  Pay-table

        3 CHERRY symbols on top line 2000
        3 CHERRY symbols on center line 1000
        3 CHERRY symbols on bottom line 4000
        3 7 symbols on any line 150
        Any combination of CHERRY and 7 on any line 75
        3 3xBAR symbols on any line 50
        3 2xBAR symbols on any line 20
        3 BAR symbols on any line 10
        Combination of any BAR symbols on any line 5
     */

    checkPot() {
        [{ item: "Cherry", pay: 1000 },
        { item: "7", pay: 150 },
        { item: "3xBAR", pay: 50 },
        { item: "2xBAR", pay: 20 },
        { item: "BAR", pay: 10 }].map(pot => {
            //3x same item
            [0, 1, 2].map(j => {
                if (this.itemMatrix[0][j].name == pot.item &&
                    this.itemMatrix[1][j].name == pot.item &&
                    this.itemMatrix[2][j].name == pot.item) {
                    if (pot.item == "Cherry" && j == 0) {
                        this.balance += pot.pay + 1000;
                    } else if (pot.item == "Cherry" && j == 2) {
                        this.balance += pot.pay + 3000
                    } else {
                        this.balance += pot.pay;
                    }
                    this.slotLine[j].className += "win-indicator";
                    this.showWiningIndicationInPayTable(this.itemMatrix[0][j].name, j);
                }
            });
        });

        [0, 1, 2].map(j => {

            //Any combination of CHERRY and 7 on any line
            if ((this.itemMatrix[0][j].name == "Cherry" || this.itemMatrix[0][j].name == "7") &&
            (this.itemMatrix[1][j].name == "Cherry" || this.itemMatrix[1][j].name == "7") &&
            (this.itemMatrix[2][j].name == "Cherry" || this.itemMatrix[2][j].name == "7") &&
                !(this.itemMatrix[0][j].name == "Cherry" && this.itemMatrix[1][j].name == "Cherry" && this.itemMatrix[2][j].name == "Cherry") &&
                !(this.itemMatrix[0][j].name == "7" && this.itemMatrix[1][j].name == "7" && this.itemMatrix[2][j].name == "7")) {
                this.balance += 75;
                this.slotLine[j].className += "win-indicator";
                this.payTable[4].style.backgroundColor = "#ff7c7c";
            }

            //Combination of any BAR symbols on any line
            if ((this.itemMatrix[0][j].name == "BAR" || this.itemMatrix[0][j].name == "2xBAR" || this.itemMatrix[0][j].name == "3xBAR") &&
                (this.itemMatrix[1][j].name == "BAR" || this.itemMatrix[1][j].name == "2xBAR" || this.itemMatrix[1][j].name == "3xBAR") &&
                (this.itemMatrix[2][j].name == "BAR" || this.itemMatrix[2][j].name == "2xBAR" || this.itemMatrix[2][j].name == "3xBAR") &&
                !(this.itemMatrix[0][j].name == "BAR" && this.itemMatrix[1][j].name == "BAR" && this.itemMatrix[2][j].name == "BAR") &&
                !(this.itemMatrix[0][j].name == "2xBAR" && this.itemMatrix[1][j].name == "2xBAR" && this.itemMatrix[2][j].name == "2xBAR") &&
                !(this.itemMatrix[0][j].name == "3xBAR" && this.itemMatrix[1][j].name == "3xBAR" && this.itemMatrix[2][j].name == "3xBAR")) {
                this.balance += 5;
                this.slotLine[j].className += "win-indicator";
                this.payTable[8].style.backgroundColor = "#ff7c7c";
            }
        }
        );
        this.balanceText.value = this.balance;
    }

    showWiningIndicationInPayTable(name, lineIndex) {
                switch(name) {
            case "BAR":
                this.payTable[7].style.backgroundColor = "#ff7c7c";
                break;
                case "2xBAR":
                this.payTable[6].style.backgroundColor = "#ff7c7c";
                break;
                case "3xBAR":
                this.payTable[5].style.backgroundColor = "#ff7c7c";
                break;
                case "7":
                this.payTable[3].style.backgroundColor = "#ff7c7c";
                break;
                case "Cherry":
                this.payTable[lineIndex].style.backgroundColor = "#ff7c7c";
                break;
                default:
                break;
            }

    }
}
