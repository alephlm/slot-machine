import ItemReel from "./ItemReel";

export default class Reel {
  constructor(DOMElement, idx, itemMatrix, animate = true) {
    this.reelContainer = DOMElement;

    var reelItemContainer = document.createElement('div');

    reelItemContainer.classList.add('icons');
    this.reelContainer.appendChild(reelItemContainer);

    reelItemContainer.appendChild(itemMatrix[0].img);
    reelItemContainer.appendChild(itemMatrix[1].img);
    reelItemContainer.appendChild(itemMatrix[2].img);

    //Added more items for reel animation effect
    for (var i = 0; i < 24; i++) {
      reelItemContainer.appendChild(new ItemReel(itemMatrix[0].name).img);
      reelItemContainer.appendChild(new ItemReel(itemMatrix[1].name).img);
      reelItemContainer.appendChild(new ItemReel(itemMatrix[2].name).img);
    }

    if (animate) {
      var animation = reelItemContainer.animate(
        [
          { transform: 'none', filter: 'blur(0)' },
          { filter: 'blur(2px)', offset: 0.5 },
          {
            transform: `translateY(-${((Math.floor(idx + 1) * 10) /
              (3 + Math.floor(idx + 1) * 10)) * 100}%)`,
            filter: 'blur(0)',
          },
        ],
        {
          duration: (idx + 1) * 1000,
          easing: 'ease-in-out',
        },
      );
      animation.play();
    }
  }
}