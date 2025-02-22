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

  // Add text body for the name
  const nameText = Bodies.rectangle(render.canvas.width / 2, 400, 420, 80, {
    isStatic: true,
    angle: Math.PI * 0.15,
    render: {
      fillStyle: "transparent",
      text: {
        content: "ANDREW ARDERNE",
        color: "#333333",
        size: 48,
        family: "Arial",
      },
    },
  });

  // Create a grouping of stack (blocks) that will fall down from the top
  // of the page.

  // Add all bodies to the world
  Composite.add(world, [
    stack,
    fallingStack,
    ...walls,
    ball,
    ballConstraint,
    nameText,
  ]);

  // Add these constants at the start of the function
  const LINKEDIN_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>`;

  const GITHUB_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-4.466 19.59c-.405.078-.534-.171-.534-.384v-2.195c0-.747-.262-1.233-.55-1.481 1.782-.198 3.654-.875 3.654-3.947 0-.874-.312-1.588-.823-2.147.082-.202.356-1.016-.079-2.117 0 0-.671-.215-2.198.82-.64-.18-1.324-.267-2.004-.271-.68.003-1.364.091-2.003.269-1.528-1.035-2.2-.82-2.2-.82-.434 1.102-.16 1.915-.077 2.118-.512.56-.824 1.273-.824 2.147 0 3.064 1.867 3.751 3.645 3.954-.229.2-.436.552-.508 1.07-.457.204-1.614.557-2.328-.666 0 0-.423-.768-1.227-.825 0 0-.78-.01-.055.487 0 0 .525.246.889 1.17 0 0 .463 1.428 2.688.944v1.489c0 .211-.129.459-.528.385-3.18-1.057-5.472-4.056-5.472-7.59 0-4.419 3.582-8 8-8s8 3.581 8 8c0 3.533-2.289 6.531-5.466 7.59z"/></svg>`;

  // Add these before the mouseConstraint setup
  const linkedInBody = Bodies.circle(100, 100, 20, {
    render: {
      sprite: {
        texture: `data:image/svg+xml,${encodeURIComponent(LINKEDIN_SVG)}`,
        xScale: 1.5,
        yScale: 1.5,
      },
    },
    url: "https://www.linkedin.com/in/andrew-arderne/",
    isClickable: true,
  });

  const githubBody = Bodies.circle(150, 100, 20, {
    render: {
      sprite: {
        texture: `data:image/svg+xml,${encodeURIComponent(GITHUB_SVG)}`,
        xScale: 1.5,
        yScale: 1.5,
      },
    },
    url: "https://github.com/zoomie",
    isClickable: true,
  });

  // Add the social media bodies to the world
  Composite.add(world, [linkedInBody, githubBody]);

  // Modify the mouseConstraint creation to handle clicks
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

  // Add click handler for the social media icons
  render.canvas.addEventListener("mouseup", (event) => {
    const bodies = Composite.allBodies(engine.world);
    const clickedBody = bodies.find((body) => {
      if (!body.isClickable) return false;
      const bounds = body.bounds;
      const canvasRect = render.canvas.getBoundingClientRect();
      const scaledX =
        (event.clientX - canvasRect.left) *
        (render.canvas.width / canvasRect.width);
      const scaledY =
        (event.clientY - canvasRect.top) *
        (render.canvas.height / canvasRect.height);
      return (
        scaledX >= bounds.min.x &&
        scaledX <= bounds.max.x &&
        scaledY >= bounds.min.y &&
        scaledY <= bounds.max.y
      );
    });

    if (clickedBody?.url) {
      window.open(clickedBody.url, "_blank");
    }
  });

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
