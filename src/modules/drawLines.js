const vectorUp = new org.bukkit.util.Vector(0, 1, 0);
const vectorDown = new org.bukkit.util.Vector(0, -1, 0);
let changedBlocks = 0;

export function draw(lines, setBlock) {
  const y = player.getLocation().getY();
  for (let i = 0; i < lines.length; i++) {
    const [x1, z1, x2, z2] = lines[i];
    drawLine(x1, y, z1, x2, y, z2, setBlock);
  }
}

function drawLine(x1, y1, z1, x2, y2, z2, setBlock) {
  const lenX = x2 - x1;
  const lenY = y2 - y1;
  const lenZ = z2 - z1;

  const max = Math.max(Math.abs(lenX), Math.abs(lenY), Math.abs(lenZ));

  const incrX = lenX / max;
  const incrY = lenY / max;
  const incrZ = lenZ / max;

  const incrMax = Math.max(Math.abs(incrX), Math.abs(incrY), Math.abs(incrZ));

  for (let i = 0; i < max; i += incrMax) {
    const pos = new org.bukkit.util.Vector(x1 + incrX * i | 0, y1 + incrY * i | 0, z1 + incrZ * i | 0);
    setBlock(pos);
  }
}

export function insideRegion(options) {
  if (options.region) {
    const y = options.region.center.getY();
    return (pos) => options.region.contains(new org.bukkit.util.Vector(pos.getX(), y, pos.getZ()));
  }
  return (pos) => true;
}

export function findGround(options) {
  if (options.onGround) {
    const blocks = context.remember();
    if (!options.ignoreVegetation) {
      options.ignoredBlocks = [blocks.getBlock(org.bukkit.Material.AIR).getBlockType()];
    }
    return (pos) => {
      while (!options.ignoredBlocks.includes(blocks.getBlock(pos.add(vectorUp)).getBlockType())) {
        pos = pos.add(vectorUp);
      }
      while (options.ignoredBlocks.includes(blocks.getBlock(pos).getBlockType())) {
        pos = pos.add(vectorDown);
      }
      return pos;
    };
  }
  return (pos) => pos;
}

export function ignoreBuildings(options) {
  if (options.ignoreBuildings) {
    const blocks = context.remember();
    return (pos) => options.allowedBlocks.includes(blocks.getBlock(pos).getBlockType());
  }
  return (pos) => true;
}

export function setOffset(options) {
  if (options.offset) {
    const up = vectorUp.multiply(options.offset);
    return (pos) => pos.add(up);
  }
  return (pos) => pos;
}

export function setWall(options) {
  const blocks = context.remember();
  const block = options.block;
  if (options.height) {
    const height = Number.parseInt(options.height);
    return (pos) => {
      for (let i = 0; i < height; i++) {
        blocks.setBlock(pos, block);
        pos = pos.add(vectorUp);
        changedBlocks++;
      }
    };
  }
  return (pos) => {
    blocks.setBlock(pos, block);
    changedBlocks++;
  };
}

export function setBlock(options) {
  const blocks = context.remember();
  const block = options.block;
  return (pos) => {
    blocks.setBlock(pos, block);
    changedBlocks++;
  };
}

export function printBlocks() {
  player.print(`Operation completed (${changedBlocks} blocks affected).`);
}
