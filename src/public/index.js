function init() {
  let mouse = {
    click: false,
    move: false,
    pos: { x: 0, y: 0},
    pos_prev: false
  };

  // Canvas
  let canvas = document.getElementById('drawing');
  let context = canvas.getContext('2d');
  let width = window.innerWidth;
  let height = window.innerHeight;
  
  // Socket IO
  let socket = io();

  // Set the canvas width and height to the browser size
  canvas.width = width;
  canvas.height = height;

  canvas.addEventListener('mousedown', (e) => {
    mouse.click = true;
  });

  canvas.addEventListener('mouseup', (e) => {
    mouse.click = false;
  });

  canvas.addEventListener('mousemove', e => {
    mouse.pos.x = e.clientX / width;
    mouse.pos.y = e.clientY / height;
    mouse.move = true;
  });

  socket.on('draw_line', data => {
    let line = data.line;
    context.beginPath();
    context.lineWidth = 2;
    context.moveTo(line[0].x * width, line[0].y * height);
    context.lineTo(line[1].x * width, line[1].y * height);
    context.stroke();
  });

  function mainLoop() {
    if(mouse.click && mouse.move && mouse.pos_prev) {
      socket.emit('draw_line', { line: [mouse.pos, mouse.pos_prev] });
      mouse.move = false;
    }
    mouse.pos_prev = { x: mouse.pos.x, y: mouse.pos.y };
    setTimeout(mainLoop, 25);
  }

  mainLoop();
}

document.addEventListener('DOMContentLoaded', init);
