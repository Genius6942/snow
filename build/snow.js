"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Snow = void 0;
var Snow = /** @class */ (function () {
    function Snow(options) {
        var _this = this;
        this.count = options.count;
        this.size =
            typeof options.size === "number"
                ? { min: options.size, max: options.size }
                : options.size;
        this.fallSpeed =
            typeof options.fallSpeed === "number"
                ? { min: options.fallSpeed, max: options.fallSpeed }
                : options.fallSpeed;
        this.wind =
            typeof options.wind === "number"
                ? { min: options.wind, max: options.wind }
                : options.wind;
        this.opactiy =
            typeof options.opacity === "number"
                ? { min: options.opacity, max: options.opacity }
                : options.opacity;
        this.accumulate = options.accumulate;
        this.initiateTime = options.initiateTime;
        this.startTime = performance.now();
        // make the renderer and stuf idk
        this.canvas = document.createElement("canvas");
        this.canvas.style.cssText = "\n\t\t\tposition: fixed;\n\t\t\ttop: 0;\n\t\t\tleft: 0;\n\t\t\twidth: 100%;\n\t\t\theight: 100%;\n\t\t\tpointer-events: none;\n\t\t\tz-index: 999999;\n\t\t";
        this.autoResize();
        window.addEventListener("resize", function () { return _this.autoResize(); });
        document.body.appendChild(this.canvas);
        // get context
        this.ctx = this.canvas.getContext("2d");
        requestAnimationFrame(this.loop.bind(this));
        this.particles = [];
        this.lastBlur = performance.now();
        this.stall = 0;
        document.addEventListener("visibilitychange", function () {
            if (document.visibilityState === "hidden") {
                _this.lastBlur = performance.now();
            }
            else {
                _this.stall += performance.now() - _this.lastBlur;
            }
        });
    }
    Snow.prototype.autoResize = function () {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    };
    Snow.prototype.randomParticle = function () {
        var maxMovement = (Math.abs(this.wind.min) > Math.abs(this.wind.max)
            ? this.wind.min
            : this.wind.max) *
            (this.canvas.height / this.fallSpeed.min);
        var x;
        if (maxMovement < 0) {
            x = Math.random() * (this.canvas.width + -maxMovement);
        }
        else {
            x = Math.random() * (this.canvas.width + maxMovement) - maxMovement;
        }
        return {
            x: x,
            y: -this.size.max,
            size: Math.random() * (this.size.max - this.size.min) + this.size.min,
            fallSpeed: Math.random() * (this.fallSpeed.max - this.fallSpeed.min) + this.fallSpeed.min,
            wind: Math.random() * (this.wind.max - this.wind.min) + this.wind.min,
            opacity: Math.random() * (this.opactiy.max - this.opactiy.min) + this.opactiy.min,
        };
    };
    Snow.prototype.loop = function () {
        this.update();
        this.render();
        requestAnimationFrame(this.loop.bind(this));
    };
    Snow.prototype.update = function () {
        var _this = this;
        this.particles.forEach(function (particle) {
            particle.x += particle.wind;
            particle.y += particle.fallSpeed;
        });
        this.particles = this.particles.filter(function (particle) {
            // if (particle.x - particle.size > this.canvas.width) {
            //   return false;
            // }
            // if (particle.x + particle.size < 0) {
            //   return false;
            // }
            if (particle.y - particle.size > _this.canvas.height) {
                return false;
            }
            return true;
        });
        var targetCount = performance.now() - this.startTime >= this.initiateTime
            ? this.count
            : (Math.max(0, performance.now() - this.startTime - this.stall) /
                this.initiateTime) *
                this.count;
        while (this.particles.length < targetCount) {
            this.particles.push(this.randomParticle());
        }
    };
    Snow.prototype.render = function () {
        var _this = this;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.particles.forEach(function (particle) {
            if (particle.x - particle.size > _this.canvas.width ||
                particle.x + particle.size < 0) {
                return;
            }
            _this.ctx.beginPath();
            _this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            _this.ctx.globalAlpha = particle.opacity;
            _this.ctx.fillStyle = "white";
            _this.ctx.fill();
            _this.ctx.closePath();
        });
    };
    return Snow;
}());
exports.Snow = Snow;

window.Snow = Snow;