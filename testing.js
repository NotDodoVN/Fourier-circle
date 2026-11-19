

async function samplePointsFromXML(xmlFile, samplingStep = 10) {
  // 1. Parse the string into an XML/SVG DOM document
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(xmlFile, "image/svg+xml");

  // 2. Select all shape elements that support getPointAtLength
  // SVGGeometryElement covers paths, rects, circles, lines, polygons, etc.
  const shapes = svgDoc.querySelectorAll("path, rect, circle, ellipse, line, polyline, polygon");
  const allPoints = [];

  shapes.forEach((shape, index) => {
    try {
      // 3. Get the total length of the individual shape
      const totalLength = shape.getTotalLength();
      const shapeId = shape.id || `shape-${index}`;

      // 4. Loop through the length using your step size
      for (let distance = 0; distance <= totalLength; distance += samplingStep) {
        const point = shape.getPointAtLength(distance);
        allPoints.push({
          x: point.x,
          y: point.y
        });
      }
    } catch (error) {
      console.warn(`Could not calculate lengths for element:`, shape, error);
    }
  });

  return allPoints;
}

// READING TEXT FILE.

const fileInput = document.getElementById("file-input");
const fileContentDisplay = document.getElementById("file-content");
const messageDisplay = document.getElementById("message");
let drawing = [];


// pts = array of {x, y} sampled from the path (absolute, raw units)
function normalize(pts, boxW, boxH) {
  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;
  for (let p of pts) {
    minX = min(minX, p.x); maxX = max(maxX, p.x);
    minY = min(minY, p.y); maxY = max(maxY, p.y);
  }
  let s = min(boxW / (maxX - minX), boxH / (maxY - minY));
  let cx = (minX + maxX) / 2;
  let cy = (minY + maxY) / 2;
  // minus on y flips potrace's y-up to p5's y-down
  return pts.map(p => ({ x: (p.x - cx) * s, y: -(p.y - cy) * s }));
}


function handleFileSelection(event) {
  drawing = [];
  y = [];
  time = 0;
  path = [];

  const file = event.target.files[0];
  fileContentDisplay.textContent = ""; // Clear previous file content
  messageDisplay.textContent = ""; // Clear previous messages

  // Validate file existence and type
  if (!file) {
    showMessage("No file selected. Please choose a file.", "error");
    return;
  }

  // Read the file
  const reader = new FileReader();
  reader.onload = () => {
    const result = samplePointsFromXML(reader.result, 1);
    console.log(result)
    // Display XML
    let array = [];
    result.then(allPoints => {
        array = allPoints;
        
        let skip;
        if (array.length > 10000){
            skip = Math.floor(array.length / 100);
        }else if (array.length > 3000){
            skip = Math.floor(array.length / 350);
        } else {
            skip = 1;
        }
        
        let points = normalize(array, 300, 400);

        for (i = 0; i < array.length; i += skip){
            temp_x = points[i].x;
            temp_y = -points[i].y;
            // magnitude = sqrt(temp_x*temp_x + temp_y*temp_y);
            // drawing.push({"x":temp_x/magnitude, "y":temp_y/magnitude});
            drawing.push({"x":temp_x, "y":temp_y});
        }
        

        console.log("array",array);
        console.log("drawing",drawing);
        
        for (let i = 0; i < drawing.length; i += 1) {
            y.push(new Complex(drawing[i].x, drawing[i].y));
        } 

        fourierY = DFT(y);
        // fourierY.sort((a,b)=>b.radius - a.radius);      

        console.log("fourierY", fourierY);

        state = FOURIER;
        // const outputtext = `let drawing =  [${drawing.join(", ")}]`;
        // console.log(outputtext);
        // downloadJSFile(drawing);
    });
  };
  reader.onerror = () => {
    showMessage("Error reading the file. Please try again.", "error");
  };

  reader.readAsText(file);  
}
function showMessage(message, type) {
  messageDisplay.textContent = message;
  messageDisplay.style.color = type === "error" ? "red" : "green";
}