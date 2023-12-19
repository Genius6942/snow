export interface SnowOptions {
  count: number;
  size:
    | {
        min: number;
        max: number;
      }
    | number;
  fallSpeed:
    | {
        min: number;
        max: number;
      }
    | number;
  wind:
    | {
        min: number;
        max: number;
      }
    | number;
  opacity:
    | {
        min: number;
        max: number;
      }
    | number;

  accumulate: boolean;
  initiateTime: number;
}

export interface Snowflake {
  x: number;
  y: number;
  size: number;
  fallSpeed: number;
  wind: number;
  opacity: number;
}

export class Snow {
  count: number;
  size: { min: number; max: number };
  fallSpeed: { min: number; max: number };
  wind: { min: number; max: number };
  accumulate: boolean;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  particles: Snowflake[];
  initiateTime: number;
  startTime: number;
  opactiy: { min: number; max: number };
  lastBlur: number;
  stall: number;

  constructor(options: SnowOptions) {
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
    this.canvas.style.cssText = `
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			pointer-events: none;
			z-index: 999999;
		`;

    this.autoResize();

    window.addEventListener("resize", () => this.autoResize());

    document.body.appendChild(this.canvas);

    // get context
    this.ctx = this.canvas.getContext("2d")!;

    requestAnimationFrame(this.loop.bind(this));

    this.particles = [];
    this.lastBlur = performance.now();
    this.stall = 0;

    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        this.lastBlur = performance.now();
      } else {
        this.stall += performance.now() - this.lastBlur;
      }
    });
  }

  autoResize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  randomParticle(): Snowflake {
    const maxMovement =
      (Math.abs(this.wind.min) > Math.abs(this.wind.max)
        ? this.wind.min
        : this.wind.max) *
      (this.canvas.height / this.fallSpeed.min);
    let x: number;
    if (maxMovement < 0) {
      x = Math.random() * (this.canvas.width + -maxMovement);
    } else {
      x = Math.random() * (this.canvas.width + maxMovement) - maxMovement;
    }

    return {
      x,
      y: -this.size.max,
      size: Math.random() * (this.size.max - this.size.min) + this.size.min,
      fallSpeed:
        Math.random() * (this.fallSpeed.max - this.fallSpeed.min) + this.fallSpeed.min,
      wind: Math.random() * (this.wind.max - this.wind.min) + this.wind.min,
      opacity: Math.random() * (this.opactiy.max - this.opactiy.min) + this.opactiy.min,
    };
  }

  loop() {
    this.update();
    this.render();
    requestAnimationFrame(this.loop.bind(this));
  }

  update() {
    this.particles.forEach((particle) => {
      particle.x += particle.wind;
      particle.y += particle.fallSpeed;
    });

    this.particles = this.particles.filter((particle) => {
      // if (particle.x - particle.size > this.canvas.width) {
      //   return false;
      // }
      // if (particle.x + particle.size < 0) {
      //   return false;
      // }
      if (particle.y - particle.size > this.canvas.height) {
        return false;
      }
      return true;
    });

    const targetCount =
      performance.now() - this.startTime >= this.initiateTime
        ? this.count
        : (Math.max(0, performance.now() - this.startTime - this.stall) /
            this.initiateTime) *
          this.count;
    while (this.particles.length < targetCount) {
      this.particles.push(this.randomParticle());
    }
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles.forEach((particle) => {
      if (
        particle.x - particle.size > this.canvas.width ||
        particle.x + particle.size < 0
      ) {
        return;
      }

      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.globalAlpha = particle.opacity;
      this.ctx.fillStyle = "white";
      this.ctx.fill();
      this.ctx.closePath();
    });
  }
}
