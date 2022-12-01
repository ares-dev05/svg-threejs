import { IDBroker } from "../utils/export";

const RULER_LENGTH = 1000;
const SCENE_WIDTH = 10000;
const SCENE_HEIGHT = 10000;
const WALL_HEIGHT = 259;
const WALL_THICKNESS = 10;
const WINDOWS_HEIGHT = 150;

export function loadProjectFromFile(data) {
  try {
    var parser = new DOMParser();
    var doc = parser.parseFromString(data, "image/svg+xml");

    var rulerObj = doc.querySelectorAll("#ruler line")[0];

    const rulerPixel =
      RULER_LENGTH /
      Math.sqrt(
        Math.pow(rulerObj.getAttribute("x1") - rulerObj.getAttribute("x2"), 2) +
          Math.pow(rulerObj.getAttribute("y1") - rulerObj.getAttribute("y2"), 2)
      );

    var facadeDomObj = Array.prototype.slice.call(
      doc.querySelectorAll("#facade_x5F_sagamore line.st1")
    );

    var internalDomObj = Array.prototype.slice.call(
      doc.querySelectorAll("#internals_x5F_sagamore line.st11")
    );

    var internalYellowDomObj = Array.prototype.slice.call(
      doc.querySelectorAll("#internals_x5F_sagamore line.st15")
    );

    let facadeParsingData = getParsingData(rulerPixel, facadeDomObj);
    let internalParsingData = getParsingData(rulerPixel, internalDomObj);
    let internalYellowParsingData = getParsingData(
      rulerPixel,
      internalYellowDomObj
    );

    // Remove the break lines
    facadeParsingData = combineBreakLines(facadeParsingData);
    internalParsingData = combineBreakLines(internalParsingData);
    internalYellowParsingData = combineBreakLines(internalYellowParsingData);
    // //

    // Move facade to internal walls
    facadeParsingData = moveToInternalWalls(
      facadeParsingData,
      internalParsingData
    );
    // // // //

    // Get the windows and doors position and remove the intern unnessary walls.
    const windowsPos = getWindowsPos(
      facadeParsingData,
      internalParsingData,
      internalYellowParsingData
    );
    // //

    //// Add the hole data to facade.
    let facadeLines = facadeParsingData.lines;

    for (let i = 0; i < facadeLines.length; i++) {
      for (let j = 0; j < windowsPos.holesArr.length; j++) {
        if (windowsPos.holesArr[j].line == facadeLines[i].id) {
          let holes = facadeLines[i].holes;
          holes.push(windowsPos.holesArr[j].id);
          facadeLines[i] = {
            id: facadeLines[i].id,
            type: "internalwall",
            prototype: "lines",
            name: "internalwall",
            misc: {},
            selected: false,
            properties: {
              height: {
                length: WALL_HEIGHT,
              },
              thickness: {
                length: WALL_THICKNESS,
              },
              textureA: "bricks",
              textureB: "bricks",
            },
            visible: true,
            vertices: facadeLines[i].vertices,
            holes: holes,
          };
        }
      }
    }
    ////

    let vertices = facadeParsingData.vertices.concat(
      internalParsingData.vertices
    );
    let lines = facadeLines.concat(windowsPos.internalLines);

    let verticesJson = {};
    for (let i = 0; i < vertices.length; i++) {
      verticesJson[vertices[i].id] = vertices[i];
    }
    lines = arrangeLines(lines, verticesJson);
    let linesJson = {};
    for (let i = 0; i < lines.length; i++) {
      linesJson[lines[i].id] = lines[i];
    }

    const jsonData = {
      unit: "cm",
      layers: {
        "layer-1": {
          id: "layer-1",
          altitude: 0,
          order: 0,
          opacity: 1,
          name: "default",
          visible: true,
          vertices: verticesJson,
          lines: linesJson,
          holes: windowsPos.holes,
          areas: {},
          items: {},
          selected: {
            vertices: [],
            lines: [],
            holes: [],
            areas: [],
            items: [],
          },
        },
      },
      grids: {
        h1: {
          id: "h1",
          type: "horizontal-streak",
          properties: {
            step: 20,
            colors: ["#F6F6F6", "#F6F6F6", "#F6F6F6", "#F6F6F6", "#F6F6F6"],
          },
        },
        v1: {
          id: "v1",
          type: "vertical-streak",
          properties: {
            step: 20,
            colors: ["#F6F6F6", "#F6F6F6", "#F6F6F6", "#F6F6F6", "#F6F6F6"],
          },
        },
      },
      selectedLayer: "layer-1",
      groups: {},
      width: SCENE_WIDTH,
      height: SCENE_HEIGHT,
      meta: {},
      guides: { horizontal: {}, vertical: {}, circular: {} },
    };

    return jsonData;
  } catch (e) {
    console.log("e", e);
    return {};
  }
}

const arrangeLines = (lines, verticesJson) => {
  let resLines = [];
  for (let i = 0; i < lines.length; i++) {
    let vertise1 = verticesJson[lines[i].vertices[0]];
    let vertise2 = verticesJson[lines[i].vertices[1]];

    if (vertise1.x == vertise2.x && vertise1.y > vertise2.y) {
      const temp = vertise1;
      vertise1 = vertise2;
      vertise2 = temp;
    } else if (vertise1.y == vertise2.y && vertise1.x > vertise2.x) {
      const temp = vertise1;
      vertise1 = vertise2;
      vertise2 = temp;
    }

    resLines.push({
      id: lines[i].id,
      type: lines[i].type,
      prototype: lines[i].prototype,
      name: lines[i].name,
      misc: {},
      selected: false,
      properties: {
        height: {
          length: WALL_HEIGHT,
        },
        thickness: {
          length: WALL_THICKNESS,
        },
        textureA: "bricks",
        textureB: "bricks",
      },
      visible: true,
      vertices: [vertise1.id, vertise2.id],
      holes: lines[i].holes,
    });
  }

  return resLines;
};

const checkDoor = (vertise1, vertise2, parsingData) => {
  let verticesJson = [];
  for (let i = 0; i < parsingData.vertices.length; i++) {
    verticesJson[parsingData.vertices[i].id] = parsingData.vertices[i];
  }

  for (let i = 0; i < parsingData.lines.length; i++) {
    const parseVer1 = verticesJson[parsingData.lines[i].vertices[0]];
    const parseVer2 = verticesJson[parsingData.lines[i].vertices[1]];
    const distance11 = Math.sqrt(
      Math.pow(parseVer1.x - vertise1.x, 2) +
        Math.pow(parseVer1.y - vertise1.y, 2)
    );
    const distance12 = Math.sqrt(
      Math.pow(parseVer1.x - vertise2.x, 2) +
        Math.pow(parseVer1.y - vertise2.y, 2)
    );
    const distance21 = Math.sqrt(
      Math.pow(parseVer2.x - vertise1.x, 2) +
        Math.pow(parseVer2.y - vertise1.y, 2)
    );
    const distance22 = Math.sqrt(
      Math.pow(parseVer2.x - vertise2.x, 2) +
        Math.pow(parseVer2.y - vertise2.y, 2)
    );

    if (
      distance11 <= 15 ||
      distance12 <= 15 ||
      distance21 <= 15 ||
      distance22 <= 15
    ) {
      return 1;
    }
  }

  return 0;
};

const checkDupliVertices = (vertices, x, y) => {
  for (let i = 0; i < vertices.length; i++) {
    if (x == vertices[i].x && y == vertices[i].y) {
      return i;
    }
  }
  return -1;
};

const checkDupliLines = (lineArr, verID1, verID2) => {
  for (let i = 0; i < lineArr.length; i++) {
    if (
      lineArr[i].vertices[0] + lineArr[i].vertices[1] == verID1 + verID2 ||
      lineArr[i].vertices[1] + lineArr[i].vertices[0] == verID1 + verID2
    ) {
      return 1;
    }
  }
  return -1;
};

const getParsingData = (rulerPixel, domObj) => {
  var vertices = [];
  var lines = {};
  var lineArr = [];
  // var room = "";

  for (var i = 0; i < domObj.length; i++) {
    let verticesID = IDBroker.acquireID();
    let verticesIndex = checkDupliVertices(
      vertices,
      Math.floor(SCENE_WIDTH / 2 + domObj[i].getAttribute("x1") * rulerPixel),
      Math.floor(SCENE_HEIGHT / 2 - domObj[i].getAttribute("y1") * rulerPixel)
    );

    let vertice1, vertice2;
    if (verticesIndex != -1) {
      // duplicated
      vertice1 = vertices[verticesIndex];
    } else {
      // not duplicated
      vertice1 = {
        id: verticesID,
        type: "",
        prototype: "vertices",
        name: "Vertex",
        misc: {},
        selected: false,
        properties: {},
        visible: true,
        x: Math.floor(
          SCENE_WIDTH / 2 + domObj[i].getAttribute("x1") * rulerPixel
        ),
        y: Math.floor(
          SCENE_HEIGHT / 2 - domObj[i].getAttribute("y1") * rulerPixel
        ),
        lines: ["maIUMKnv7l", "nhQAdYl8q"],
        areas: [],
      };
      vertices.push(vertice1);
    }

    verticesID = IDBroker.acquireID();
    verticesIndex = checkDupliVertices(
      vertices,
      Math.floor(SCENE_WIDTH / 2 + domObj[i].getAttribute("x2") * rulerPixel),
      Math.floor(SCENE_HEIGHT / 2 - domObj[i].getAttribute("y2") * rulerPixel)
    );
    if (verticesIndex != -1) {
      // duplicated
      vertice2 = vertices[verticesIndex];
    } else {
      vertice2 = {
        id: verticesID,
        type: "",
        prototype: "vertices",
        name: "Vertex",
        misc: {},
        selected: false,
        properties: {},
        visible: true,
        x: Math.floor(
          SCENE_WIDTH / 2 + domObj[i].getAttribute("x2") * rulerPixel
        ),
        y: Math.floor(
          SCENE_HEIGHT / 2 - domObj[i].getAttribute("y2") * rulerPixel
        ),
        lines: ["maIUMKnv7l", "nhQAdYl8q"],
        areas: [],
      };
      vertices.push(vertice2);
    }

    const checkLine = checkDupliLines(lineArr, vertice1.id, vertice2.id);

    if (checkLine == -1) {
      const lineID = IDBroker.acquireID();

      lineArr.push({
        id: lineID,
        type: "internalwall",
        prototype: "lines",
        name: "internalwall",
        misc: {},
        selected: false,
        properties: {
          height: { length: WALL_HEIGHT },
          thickness: { length: WALL_THICKNESS },
          textureA: "bricks",
          textureB: "bricks",
        },
        visible: true,
        vertices: [vertice1.id, vertice2.id],
        holes: [],
      });
    }
  }

  return {
    vertices: vertices,
    lines: lineArr,
  };
};

const getMoveSize = (line, externalData, internalData) => {
  let externalVerticesJson = [];
  for (let i = 0; i < externalData.vertices.length; i++) {
    externalVerticesJson[externalData.vertices[i].id] =
      externalData.vertices[i];
  }
  const vertice1 = externalVerticesJson[line.vertices[0]];
  const vertice2 = externalVerticesJson[line.vertices[1]];

  let distance = 99999999;
  let result = { direction: -1, position: -1 };
  for (let i = 0; i < internalData.vertices.length; i++) {
    if (vertice1.x == vertice2.x) {
      // x move
      let rest = Math.abs(internalData.vertices[i].y - vertice1.y);
      if (
        Math.abs(internalData.vertices[i].y - vertice1.y) >=
        Math.abs(internalData.vertices[i].y - vertice2.y)
      ) {
        rest = Math.abs(internalData.vertices[i].y - vertice2.y);
      }
      if (
        Math.abs(internalData.vertices[i].x - vertice1.x) + rest < distance &&
        vertice1.x != internalData.vertices[i].x &&
        checkWindowWall(internalData, internalData.vertices[i].x, 0)
      ) {
        distance = Math.abs(internalData.vertices[i].x - vertice1.x) + rest;
        result = {
          direction: 0,
          position: internalData.vertices[i].x,
        };
      }
    } else if (vertice1.y == vertice2.y) {
      // y move
      let rest = Math.abs(internalData.vertices[i].x - vertice1.x);
      if (
        Math.abs(internalData.vertices[i].x - vertice1.x) >=
        Math.abs(internalData.vertices[i].x - vertice2.x)
      ) {
        rest = Math.abs(internalData.vertices[i].x - vertice2.x);
      }
      if (
        Math.abs(internalData.vertices[i].y - vertice1.y) + rest < distance &&
        vertice1.y != internalData.vertices[i].y &&
        checkWindowWall(internalData, internalData.vertices[i].y, 1)
      ) {
        distance = Math.abs(internalData.vertices[i].y - vertice1.y) + rest;
        result = {
          direction: 1,
          position: internalData.vertices[i].y,
        };
      }
    }
  }

  return result;
};

const checkWindowWall = (internalData, position, direction) => {
  let count = 0;
  for (let i = 0; i < internalData.vertices.length; i++) {
    if (direction == 0) {
      // x axios
      if (internalData.vertices[i].x == position) {
        count++;
      }
    } else {
      // y axios
      if (internalData.vertices[i].y == position) {
        count++;
      }
    }
  }
  return count > 1 ? 1 : 0;
};

const getIndexVertice = (parseData, id) => {
  for (let i = 0; i < parseData.vertices.length; i++) {
    if (parseData.vertices[i].id == id) {
      return i;
    }
  }
  return -1;
};

const checkBreakLine = (externalLines, externalVertices, line) => {
  let verticesJson = {};
  for (let i = 0; i < externalVertices.length; i++) {
    verticesJson[externalVertices[i].id] = externalVertices[i];
  }

  let count = 0;
  for (let i = 0; i < externalLines.length; i++) {
    if (
      externalLines[i].vertices[0] == line.vertices[0] &&
      externalLines[i].id != line.id
    ) {
      if (
        verticesJson[externalLines[i].vertices[1]].y ==
          verticesJson[line.vertices[1]].y ||
        verticesJson[externalLines[i].vertices[1]].x ==
          verticesJson[line.vertices[1]].x
      ) {
        return {
          externalNo: i,
          externalOrder: 0,
          lineOrder: 0,
        };
      }
    } else if (
      externalLines[i].vertices[0] == line.vertices[1] &&
      externalLines[i].id != line.id
    ) {
      if (
        verticesJson[externalLines[i].vertices[1]].y ==
          verticesJson[line.vertices[0]].y ||
        verticesJson[externalLines[i].vertices[1]].x ==
          verticesJson[line.vertices[0]].x
      ) {
        return {
          externalNo: i,
          externalOrder: 0,
          lineOrder: 1,
        };
      }
    } else if (
      externalLines[i].vertices[1] == line.vertices[0] &&
      externalLines[i].id != line.id
    ) {
      if (
        verticesJson[externalLines[i].vertices[0]].y ==
          verticesJson[line.vertices[1]].y ||
        verticesJson[externalLines[i].vertices[0]].x ==
          verticesJson[line.vertices[1]].x
      ) {
        return {
          externalNo: i,
          externalOrder: 1,
          lineOrder: 0,
        };
      }
    } else if (
      externalLines[i].vertices[1] == line.vertices[1] &&
      externalLines[i].id != line.id
    ) {
      if (
        verticesJson[externalLines[i].vertices[0]].y ==
          verticesJson[line.vertices[0]].y ||
        verticesJson[externalLines[i].vertices[0]].x ==
          verticesJson[line.vertices[0]].x
      ) {
        return {
          externalNo: i,
          externalOrder: 1,
          lineOrder: 1,
        };
      }
    }
  }

  return {
    externalNo: -1,
    externalOrder: -1,
    lineOrder: -1,
  };
};

const combineBreakLines = (parsingData) => {
  let facadeVertices = parsingData.vertices;
  let facadeLines = parsingData.lines;

  let tempLines = [];

  for (let i = 0; i < facadeLines.length; i++) {
    const res = checkBreakLine(facadeLines, facadeVertices, facadeLines[i]);
    if (res.externalNo != -1) {
      if (
        checkDupliLines(
          tempLines,
          res.lineOrder == 0
            ? facadeLines[i].vertices[1]
            : facadeLines[i].vertices[0],
          res.externalOrder == 0
            ? facadeLines[res.externalNo].vertices[1]
            : facadeLines[res.externalNo].vertices[0]
        ) == -1
      ) {
        tempLines.push({
          id: facadeLines[i].id,
          type: "internalwall",
          prototype: "lines",
          name: "internalwall",
          misc: {},
          selected: false,
          properties: {
            height: { length: WALL_HEIGHT },
            thickness: { length: WALL_THICKNESS },
            textureA: "bricks",
            textureB: "bricks",
          },
          visible: true,
          vertices: [
            res.lineOrder == 0
              ? facadeLines[i].vertices[1]
              : facadeLines[i].vertices[0],
            res.externalOrder == 0
              ? facadeLines[res.externalNo].vertices[1]
              : facadeLines[res.externalNo].vertices[0],
          ],
          holes: [],
        });
      }
    } else {
      tempLines.push(facadeLines[i]);
    }
  }

  facadeLines = tempLines;
  return {
    vertices: facadeVertices,
    lines: facadeLines,
  };
};

const moveToInternalWalls = (facadeParsingData, internalParsingData) => {
  let facadeVertices = facadeParsingData.vertices;
  for (let i = 0; i < facadeParsingData.lines.length; i++) {
    const moveSize = getMoveSize(
      facadeParsingData.lines[i],
      facadeParsingData,
      internalParsingData
    );

    const inx1 = getIndexVertice(
      facadeParsingData,
      facadeParsingData.lines[i].vertices[0]
    );
    const inx2 = getIndexVertice(
      facadeParsingData,
      facadeParsingData.lines[i].vertices[1]
    );

    facadeVertices[inx1] = {
      id: facadeVertices[inx1].id,
      type: "",
      prototype: "vertices",
      name: "Vertex",
      misc: {},
      selected: false,
      properties: {},
      visible: true,
      x: moveSize.direction == 0 ? moveSize.position : facadeVertices[inx1].x,
      y: moveSize.direction == 1 ? moveSize.position : facadeVertices[inx1].y,
      lines: facadeVertices[inx1].lines,
      areas: [],
    };
    facadeVertices[inx2] = {
      id: facadeVertices[inx2].id,
      type: "",
      prototype: "vertices",
      name: "Vertex",
      misc: {},
      selected: false,
      properties: {},
      visible: true,
      x: moveSize.direction == 0 ? moveSize.position : facadeVertices[inx2].x,
      y: moveSize.direction == 1 ? moveSize.position : facadeVertices[inx2].y,
      lines: facadeVertices[inx2].lines,
      areas: [],
    };
  }

  return {
    vertices: facadeVertices,
    lines: facadeParsingData.lines,
  };
};

const getRightPos = (vertices1, vertices2) => {
  if (vertices1.x == vertices2.x) {
    // X axios
    if (vertices1.y <= vertices2.y) {
      return {
        vertices1: vertices1,
        vertices2: vertices2,
      };
    }
    return {
      vertices1: vertices2,
      vertices2: vertices1,
    };
  } else if (vertices1.y == vertices2.y) {
    // Y axios
    if (vertices1.x <= vertices2.x) {
      return {
        vertices1: vertices1,
        vertices2: vertices2,
      };
    }
    return {
      vertices1: vertices2,
      vertices2: vertices1,
    };
  }
};

const getWindowsPos = (
  facadeParsingData,
  internalParsingData,
  internalYellowParsingData
) => {
  internalYellowParsingData;
  let verticesfacaceTempJson = {};
  for (let i = 0; i < facadeParsingData.vertices.length; i++) {
    verticesfacaceTempJson[facadeParsingData.vertices[i].id] =
      facadeParsingData.vertices[i];
  }
  let verticesInternTempJson = {};
  for (let i = 0; i < internalParsingData.vertices.length; i++) {
    verticesInternTempJson[internalParsingData.vertices[i].id] =
      internalParsingData.vertices[i];
  }
  let internTempLines = internalParsingData.lines;

  let result = [];
  let unnecessayLines = [];

  for (let i = 0; i < facadeParsingData.lines.length; i++) {
    let tempLines = [];
    let direction = 0; // X axio
    for (let j = 0; j < internTempLines.length; j++) {
      if (
        verticesfacaceTempJson[facadeParsingData.lines[i].vertices[0]].x ==
        verticesfacaceTempJson[facadeParsingData.lines[i].vertices[1]].x
      ) {
        // X axio
        direction = 0;
        if (
          verticesfacaceTempJson[facadeParsingData.lines[i].vertices[0]].x ==
            verticesInternTempJson[internTempLines[j].vertices[0]].x &&
          verticesInternTempJson[internTempLines[j].vertices[0]].x ==
            verticesInternTempJson[internTempLines[j].vertices[1]].x
        ) {
          const extern = getRightPos(
            verticesfacaceTempJson[facadeParsingData.lines[i].vertices[0]],
            verticesfacaceTempJson[facadeParsingData.lines[i].vertices[1]]
          );
          const intern = getRightPos(
            verticesInternTempJson[internTempLines[j].vertices[0]],
            verticesInternTempJson[internTempLines[j].vertices[1]]
          );
          if (
            intern.vertices1.y >= extern.vertices1.y ||
            intern.vertices2.y <= extern.vertices2.y
          ) {
            tempLines.push({
              vertices1: intern.vertices1,
              vertices2: intern.vertices2,
              id: facadeParsingData.lines[i].id,
              facade1: extern.vertices1,
              facade2: extern.vertices2,
            });
            if (
              intern.vertices1.y >= extern.vertices1.y &&
              intern.vertices2.y <= extern.vertices2.y
            )
              unnecessayLines.push(internTempLines[j].id);
          }
        }
      } else if (
        verticesfacaceTempJson[facadeParsingData.lines[i].vertices[0]].y ==
        verticesfacaceTempJson[facadeParsingData.lines[i].vertices[1]].y
      ) {
        // Y axio
        direction = 1;
        if (
          verticesfacaceTempJson[facadeParsingData.lines[i].vertices[0]].y ==
            verticesInternTempJson[internTempLines[j].vertices[0]].y &&
          verticesInternTempJson[internTempLines[j].vertices[0]].y ==
            verticesInternTempJson[internTempLines[j].vertices[1]].y
        ) {
          const extern = getRightPos(
            verticesfacaceTempJson[facadeParsingData.lines[i].vertices[0]],
            verticesfacaceTempJson[facadeParsingData.lines[i].vertices[1]]
          );
          const intern = getRightPos(
            verticesInternTempJson[internTempLines[j].vertices[0]],
            verticesInternTempJson[internTempLines[j].vertices[1]]
          );
          if (
            intern.vertices1.x >= extern.vertices1.x ||
            intern.vertices2.x <= extern.vertices2.x
          ) {
            tempLines.push({
              vertices1: intern.vertices1,
              vertices2: intern.vertices2,
              id: facadeParsingData.lines[i].id,
              facade1: extern.vertices1,
              facade2: extern.vertices2,
            });
            if (
              intern.vertices1.x >= extern.vertices1.x &&
              intern.vertices2.x <= extern.vertices2.x
            )
              unnecessayLines.push(internTempLines[j].id);
          }
        }
      }
    }
    if (tempLines.length > 1) {
      // sort tempLines
      tempLines = tempLines.sort((a, b) => {
        if (direction == 0) {
          // X axios
          return a.vertices1.y - b.vertices1.y;
        } else if (direction == 1) {
          // Y axios
          return a.vertices1.x - b.vertices1.x;
        }
      });
      // extract the windows or doors position
      for (let i = 0; i < tempLines.length - 1; i++) {
        if (tempLines[i].facade1.x == tempLines[i].facade2.x) {
          // X Axios
          let holeID = IDBroker.acquireID();

          const offset =
            ((tempLines[i].vertices2.y + tempLines[i + 1].vertices1.y) / 2 -
              tempLines[i].facade1.y) /
            (tempLines[i].facade2.y - tempLines[i].facade1.y);

          if (
            !Number.isNaN(offset) &&
            Math.abs(tempLines[i].vertices2.y - tempLines[i + 1].vertices1.y) <=
              Math.abs(tempLines[i].facade2.y - tempLines[i + 1].facade1.y)
          ) {
            const isDoor = checkDoor(
              tempLines[i].vertices2,
              tempLines[i + 1].vertices1,
              internalYellowParsingData
            );

            if (isDoor == 0) {
              result.push({
                id: holeID,
                type: "window",
                prototype: "holes",
                name: "Window",
                misc: {},
                selected: false,
                properties: {
                  width: {
                    length: Math.abs(
                      tempLines[i].vertices2.y - tempLines[i + 1].vertices1.y
                    ),
                  },
                  height: {
                    length: WINDOWS_HEIGHT,
                  },
                  altitude: {
                    length: 40,
                  },
                  thickness: {
                    length: 5,
                  },
                  flip: "false",
                },
                visible: true,
                offset: offset,
                line: tempLines[i].id,
              });
            } else if (isDoor == 1) {
              result.push({
                id: holeID,
                type: "door",
                prototype: "holes",
                name: "Door",
                misc: {},
                selected: false,
                properties: {
                  width: {
                    length: Math.abs(
                      tempLines[i].vertices2.y - tempLines[i + 1].vertices1.y
                    ),
                  },
                  height: {
                    length: WINDOWS_HEIGHT,
                  },
                  altitude: {
                    length: 40,
                  },
                  thickness: {
                    length: 5,
                  },
                  flip: "false",
                },
                visible: true,
                offset: offset,
                line: tempLines[i].id,
              });
            }
          }
        } else {
          // Y Axios
          let holeID = IDBroker.acquireID();

          const offset =
            ((tempLines[i].vertices2.x + tempLines[i + 1].vertices1.x) / 2 -
              tempLines[i].facade1.x) /
            (tempLines[i].facade2.x - tempLines[i].facade1.x);

          if (
            !Number.isNaN(offset) &&
            Math.abs(tempLines[i].vertices2.x - tempLines[i + 1].vertices1.x) <=
              Math.abs(tempLines[i].facade2.x - tempLines[i + 1].facade1.x)
          ) {
            const isDoor = checkDoor(
              tempLines[i].vertices2,
              tempLines[i + 1].vertices1,
              internalYellowParsingData
            );

            if (isDoor == 0) {
              result.push({
                id: holeID,
                type: "window",
                prototype: "holes",
                name: "Window",
                misc: {},
                selected: false,
                properties: {
                  width: {
                    length: Math.abs(
                      tempLines[i].vertices2.x - tempLines[i + 1].vertices1.x
                    ),
                  },
                  height: {
                    length: WINDOWS_HEIGHT,
                  },
                  altitude: {
                    length: 40,
                  },
                  thickness: {
                    length: 5,
                  },
                },
                visible: true,
                offset: offset,
                line: tempLines[i].id,
              });
            } else if (isDoor == 1) {
              sult.push({
                id: holeID,
                type: "door",
                prototype: "holes",
                name: "Door",
                misc: {},
                selected: false,
                properties: {
                  width: {
                    length: Math.abs(
                      tempLines[i].vertices2.x - tempLines[i + 1].vertices1.x
                    ),
                  },
                  height: {
                    length: WINDOWS_HEIGHT,
                  },
                  altitude: {
                    length: 40,
                  },
                  thickness: {
                    length: 5,
                  },
                },
                visible: true,
                offset: offset,
                line: tempLines[i].id,
              });
            }
          }
        }
      }
    }
  }

  let json = {};
  for (let i = 0; i < result.length; i++) {
    json[result[i].id] = result[i];
  }

  // remove the unnessary internal lines

  let internalLines = [];
  for (let i = 0; i < internTempLines.length; i++) {
    let passedObject = true;
    for (let j = 0; j < unnecessayLines.length; j++) {
      if (unnecessayLines[j] == internTempLines[i].id) {
        passedObject = false;
        break;
      }
    }
    if (passedObject) internalLines.push(internTempLines[i]);
  }

  return {
    holes: json,
    holesArr: result,
    internalLines: internalLines,
  };
};
