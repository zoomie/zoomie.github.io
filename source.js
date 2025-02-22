console.log("Hello World");
var Example = Example || {};

// Import Matter.js components
const {
  Engine,
  Render,
  Runner,
  Composites,
  MouseConstraint,
  Mouse,
  Composite,
  Constraint,
  Bodies,
} = Matter;

// Initialize the wrecking ball simulation
function initWreckingBall() {
  // create engine
  const engine = Engine.create();
  const world = engine.world;

  // create renderer
  const render = Render.create({
    element: document.getElementById("canvas-container"),
    engine: engine,
    options: {
      width: window.innerWidth,
      height: window.innerHeight,
      wireframes: false,
      background: "#f0f0f0",
      showAngleIndicator: true,
    },
  });

  Render.run(render);

  // create runner
  const runner = Runner.create();
  Runner.run(runner, engine);

  // add bodies
  const rows = 10;
  const yy = render.canvas.height - 25 - 40 * rows;

  const stack = Composites.stack(
    render.canvas.width / 2,
    yy,
    5,
    rows,
    0,
    0,
    (x, y) => {
      return Bodies.rectangle(x, y, 40, 40, {
        render: {
          fillStyle: "#800000",
        },
      });
    }
  );

  // Create a grouping of stack (blocks) that will fall down from the top
  const fallingStack = Composites.stack(
    render.canvas.width / 3, // x position
    0, // start above the canvas
    3, // columns
    4, // rows
    20, // column gap
    20, // row gap
    (x, y) => {
      return Bodies.rectangle(x, y, 40, 40, {
        render: {
          fillStyle: "#4a4a4a", // darker color to distinguish from other blocks
        },
      });
    }
  );

  // Add walls and ground
  const walls = [
    Bodies.rectangle(render.canvas.width / 2, 0, render.canvas.width, 50, {
      isStatic: true,
    }),
    Bodies.rectangle(
      render.canvas.width / 2,
      render.canvas.height,
      render.canvas.width,
      50,
      { isStatic: true }
    ),
    Bodies.rectangle(
      render.canvas.width,
      render.canvas.height / 2,
      50,
      render.canvas.height,
      { isStatic: true }
    ),
    Bodies.rectangle(0, render.canvas.height / 2, 50, render.canvas.height, {
      isStatic: true,
    }),
  ];

  // Create wrecking ball
  const ball = Bodies.circle(0, 400, 50, {
    density: 0.04,
    frictionAir: 0.005,
    render: {
      fillStyle: "#444",
    },
  });

  // Add ball constraint
  const ballConstraint = Constraint.create({
    pointA: { x: 500, y: 300 },
    bodyB: ball,
    stiffness: 0.01,
    render: {
      visible: true,
      lineWidth: 2,
      strokeStyle: "#666",
    },
  });

  // Create a grouping of stack (blocks) that will fall down from the top
  // of the page.

  // Add all bodies to the world
  Composite.add(world, [stack, fallingStack, ...walls, ball, ballConstraint]);

  // Add mouse control
  const mouse = Mouse.create(render.canvas);
  const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      render: {
        visible: false,
      },
    },
  });

  Composite.add(world, mouseConstraint);
  render.mouse = mouse;

  // Handle window resize
  window.addEventListener("resize", () => {
    render.canvas.width = window.innerWidth;
    render.canvas.height = window.innerHeight;
    Render.lookAt(render, {
      min: { x: 0, y: 0 },
      max: { x: window.innerWidth, y: window.innerHeight },
    });
  });

  // Initial viewport setup
  Render.lookAt(render, {
    min: { x: 0, y: 0 },
    max: { x: window.innerWidth, y: window.innerHeight },
  });

  return {
    engine,
    runner,
    render,
    canvas: render.canvas,
    stop: () => {
      Render.stop(render);
      Runner.stop(runner);
    },
  };
}

// Start the simulation when the page loads
window.addEventListener("load", () => {
  initWreckingBall();
});

Example.wreckingBall = initWreckingBall;
Example.wreckingBall.title = "Wrecking Ball";
Example.wreckingBall.for = ">=0.14.2";

if (typeof module !== "undefined") {
  module.exports = Example.wreckingBall;
}
