module.exports = (function () {

    function View() {
        this.$viewPort = document.querySelector('.main');
        this.inListSelector = '.carpage-star';
        this.viewPortCarSelector = '.carpage-wrapper';
        this.sliderSmallImgSelector = '.carpage-slider-carousel-cars-item-link__img';
        this.sliderSelector = '.carpage-slider';
        this.sliderContainer = 'carpage-slider-container';
        this.sliderBigImgDiv = 'carpage-slider-bigimg';
        this.sliderBigImgClass = 'carpage-slider-bigimg__img';
        this.sliderArrowPreviousClass = 'carpage-slider-bigimg-previous__arrow';
        this.sliderArrowNextClass = 'carpage-slider-bigimg-next__arrow';

    }

    View.prototype.render = function (data) {
        this.$viewPort.innerHTML = data;
        this.$sliderContainer = document.querySelector('.' + this.sliderContainer);
        this.$sliderBigImg = document.querySelector('.'+this.sliderBigImgClass);
        document.querySelector(this.sliderSmallImgSelector).classList.add('active');
        this.$sliderBigImg.src = document.querySelector(this.sliderSmallImgSelector).src;
        document.querySelector(this.sliderSelector).addEventListener('click',(this.clickOnSlider).bind(this));
        this.available = true;
    };

    View.prototype.bind = function (event, handler) {

        var self = this;

        if (event === 'clickAddToWishListButton') {
            document.body.addEventListener('click', (function (evt) {
                this.$inList = this.$inList || document.querySelector(this.inListSelector);
                if (evt.target === this.$inList){
                    handler();
                }
            }).bind(this));
        }
    };

    View.prototype.toggleClass = function (carId, result){
        this.$viewPortCar = this.$viewPortCar || document.querySelector(this.viewPortCarSelector);
        this.$viewPortCar.classList.toggle('in-list', result);
    };
    
    View.prototype.toggleSliderBigImg = function ($nextImg, next) {
        this.available = false;
        document.querySelector('.active').classList.toggle('active');
        $nextImg.classList.toggle('active');

        var oldDiv = document.querySelector('.' + this.sliderBigImgDiv);
        var newDiv = document.createElement('div');
        newDiv.className = this.sliderBigImgDiv;
        var container = document.querySelector('.' + this.sliderContainer);
        var newImg = document.createElement('img');
        newImg.className = this.sliderBigImgClass;
        newImg.src = $nextImg.src;
        newDiv.appendChild(newImg);

        if (next){
            newDiv.classList.add('right');
            container.appendChild(newDiv);
            requestAnimationFrame(function(){
                newDiv.classList.remove('right');
                oldDiv.classList.add('left');
            });
        } else {
             newDiv.classList.add('left');
             container.insertBefore(newDiv, oldDiv);

             requestAnimationFrame(function(){
                newDiv.classList.remove('left');
                oldDiv.classList.add('right');
             });
        }

        setTimeout((function(){
            requestAnimationFrame((function(){
                container.removeChild(oldDiv);
                this.available = true;
            }).bind(this));
        }).bind(this), 800);

    };

    View.prototype.clickOnSlider = function(event){
        var nextImg;

            if (event.target.classList.contains(this.sliderSmallImgSelector.slice(1))&&this.available) {
                this.toggleSliderBigImg(event.target, true);
            } else
                if (this.available&&(event.target.classList.contains(this.sliderArrowNextClass)||
                    event.target.classList.contains(this.sliderBigImgClass))){
                    nextImg = document.querySelector('.active').parentElement.parentElement;
                    nextImg = nextImg.nextElementSibling ? nextImg.nextElementSibling.firstElementChild
                        .firstElementChild : nextImg.parentElement.firstElementChild.firstElementChild.firstElementChild;
                    this.toggleSliderBigImg(nextImg, true);
                } else
                    if (this.available&&event.target.classList.contains(this.sliderArrowPreviousClass)){
                        nextImg = document.querySelector('.active').parentElement.parentElement;
                        nextImg = nextImg.previousElementSibling ? nextImg.previousElementSibling.firstElementChild
                            .firstElementChild : nextImg.parentElement.lastElementChild.firstElementChild.firstElementChild;
                        this.toggleSliderBigImg(nextImg, false);
                    }

            event.preventDefault();
        };
    return View;

})();