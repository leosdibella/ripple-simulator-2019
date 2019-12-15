(function() {
    'use strict';

    const ripples = [];
    const numberOfCrests = 10;
    const dyingFrame = 750;
    const rippleDelay = 10;
    let animationFrame = -1;

    function generateRandomInteger(lowerBound = 0, upperBound = 1) {
        return Math.round(((upperBound - lowerBound) * Math.random()) + lowerBound);
    }

    function generateRandomColor() {
        return [
            generateRandomInteger(0, 256),
            generateRandomInteger(0, 256),
            generateRandomInteger(0, 256)
        ];
    }

    function generateElements() {
        const elements = [];

        for (let i = 0; i < numberOfCrests; ++i) {
            elements.push(document.createElement('div'));

            elements[i].style.position = 'absolute';
            elements[i].style.backgroundColor = 'transparent';
            elements[i].style.borderRadius = '100%';
            elements[i].style.pointerEvents = 'none';
        }

        return elements;
    }

    function Ripple(x, y, color, frame) {
        this.elements = generateElements();
        this.frame = frame;

        this.advance = function () {
            if (this.frame === frame) {
                for (let i = 0; i < numberOfCrests; ++i) {
                    document.body.appendChild(this.elements[i]);
                }
            }

            if (this.frame === dyingFrame) {
                for (let i = 0; i < numberOfCrests; ++i) {
                    document.body.removeChild(this.elements[i]);
                }

                this.elements.splice(0, numberOfCrests);
            } else {
                for (let i = 0; i < numberOfCrests; ++i) {
                    const modifier =  (((i + this.frame) % numberOfCrests) + 1);
                    const dimension =  modifier + this.frame + ((i % numberOfCrests) * (numberOfCrests * Math.random()));
                    const positionCorrection = dimension / 2;

                    this.elements[i].style.top = (y - positionCorrection) + 'px';
                    this.elements[i].style.left = (x - positionCorrection) + 'px';
                    this.elements[i].style.width = dimension + 'px';
                    this.elements[i].style.height = dimension + 'px';
                    this.elements[i].style.border = modifier + 'px rgb(' + color.join() + ') double';
                }
            }

            this.frame += 10;
        }

        this.isTerminal = function () {
            return this.elements.length === 0;
        }

        this.advance();
    }

    function draw() {
        for (let i = ripples.length - 1; i >= 0; --i) {
            if (ripples[i].isTerminal()) {
                ripples.splice(i, 1);
            } else {
                ripples[i].advance();
            }
        }
        
        animationFrame = ripples.length > 0 ? requestAnimationFrame(draw) : -1;
    }

    function generateRipple(event) {
        const random = generateRandomInteger(2, 5);
        const color = generateRandomColor();

        for (let i = 0; i < random; ++i){
            ripples.push(new Ripple(event.offsetX, event.offsetY, color, i * rippleDelay));
        }

        if (animationFrame === -1) {
            animationFrame = requestAnimationFrame(draw);
        }
    }

    document.body.addEventListener('click', generateRipple);
})(); 