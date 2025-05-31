// OneDollar.js - A JavaScript implementation of the $1 Unistroke Recognizer
// https://github.com/nok/onedollar-unistroke-coffee

class OneDollar {
  constructor(options = {}) {
    this.options = {
      score: options.score || 80,
      parts: options.parts || 64,
      step: options.step || 2,
      angle: options.angle || 45,
      size: options.size || 250
    };
    this.templates = [];
  }

  add(name, points) {
    this.templates.push({
      name: name,
      points: this.normalize(points)
    });
  }

  check(points) {
    let best = {
      name: null,
      score: 0,
      recognized: false,
      path: null,
      ranking: []
    };

    if (points.length < 2) {
      return best;
    }

    const normalized = this.normalize(points);
    const rankings = [];

    for (let i = 0; i < this.templates.length; i++) {
      const template = this.templates[i];
      const score = this.distanceAtBestAngle(normalized, template.points);
      rankings.push({
        name: template.name,
        score: score
      });
    }

    rankings.sort((a, b) => b.score - a.score);

    if (rankings[0].score > this.options.score) {
      best = {
        name: rankings[0].name,
        score: rankings[0].score,
        recognized: true,
        path: {
          start: points[0],
          end: points[points.length - 1],
          centroid: this.centroid(points)
        },
        ranking: rankings
      };
    }

    return best;
  }

  normalize(points) {
    const resampled = this.resample(points, this.options.parts);
    const rotated = this.rotateToZero(resampled);
    const scaled = this.scaleToSquare(rotated, this.options.size);
    return this.translateToOrigin(scaled);
  }

  resample(points, n) {
    const I = this.pathLength(points) / (n - 1);
    let D = 0;
    const newpoints = [points[0]];

    for (let i = 1; i < points.length; i++) {
      const d = this.distance(points[i - 1], points[i]);
      if (D + d >= I) {
        const qx = points[i - 1][0] + ((I - D) / d) * (points[i][0] - points[i - 1][0]);
        const qy = points[i - 1][1] + ((I - D) / d) * (points[i][1] - points[i - 1][1]);
        newpoints.push([qx, qy]);
        points.splice(i, 0, [qx, qy]);
        D = 0;
      } else {
        D += d;
      }
    }

    if (newpoints.length === n - 1) {
      newpoints.push(points[points.length - 1]);
    }

    return newpoints;
  }

  rotateToZero(points) {
    const c = this.centroid(points);
    const theta = Math.atan2(c[1] - points[0][1], c[0] - points[0][0]);
    return this.rotateBy(points, -theta);
  }

  rotateBy(points, theta) {
    const c = this.centroid(points);
    const cos = Math.cos(theta);
    const sin = Math.sin(theta);
    const newpoints = [];

    for (let i = 0; i < points.length; i++) {
      const qx = (points[i][0] - c[0]) * cos - (points[i][1] - c[1]) * sin + c[0];
      const qy = (points[i][0] - c[0]) * sin + (points[i][1] - c[1]) * cos + c[1];
      newpoints.push([qx, qy]);
    }

    return newpoints;
  }

  scaleToSquare(points, size) {
    const b = this.boundingBox(points);
    const newpoints = [];

    for (let i = 0; i < points.length; i++) {
      const qx = points[i][0] * (size / b.width);
      const qy = points[i][1] * (size / b.height);
      newpoints.push([qx, qy]);
    }

    return newpoints;
  }

  translateToOrigin(points) {
    const c = this.centroid(points);
    const newpoints = [];

    for (let i = 0; i < points.length; i++) {
      const qx = points[i][0] - c[0];
      const qy = points[i][1] - c[1];
      newpoints.push([qx, qy]);
    }

    return newpoints;
  }

  distanceAtBestAngle(points, template) {
    let a = -this.options.angle;
    let b = this.options.angle;
    let x1 = this.phi * a + (1 - this.phi) * b;
    let f1 = this.distanceAtAngle(points, template, x1);
    let x2 = (1 - this.phi) * a + this.phi * b;
    let f2 = this.distanceAtAngle(points, template, x2);

    while (Math.abs(b - a) > this.options.step) {
      if (f1 < f2) {
        b = x2;
        x2 = x1;
        f2 = f1;
        x1 = this.phi * a + (1 - this.phi) * b;
        f1 = this.distanceAtAngle(points, template, x1);
      } else {
        a = x1;
        x1 = x2;
        f1 = f2;
        x2 = (1 - this.phi) * a + this.phi * b;
        f2 = this.distanceAtAngle(points, template, x2);
      }
    }

    return Math.min(f1, f2);
  }

  distanceAtAngle(points, template, theta) {
    const newpoints = this.rotateBy(points, theta);
    return this.pathDistance(newpoints, template);
  }

  pathDistance(pts1, pts2) {
    let d = 0;
    for (let i = 0; i < pts1.length; i++) {
      d += this.distance(pts1[i], pts2[i]);
    }
    return d / pts1.length;
  }

  distance(p1, p2) {
    const dx = p2[0] - p1[0];
    const dy = p2[1] - p1[1];
    return Math.sqrt(dx * dx + dy * dy);
  }

  centroid(points) {
    let x = 0;
    let y = 0;
    for (let i = 0; i < points.length; i++) {
      x += points[i][0];
      y += points[i][1];
    }
    return [x / points.length, y / points.length];
  }

  boundingBox(points) {
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    for (let i = 0; i < points.length; i++) {
      minX = Math.min(minX, points[i][0]);
      maxX = Math.max(maxX, points[i][0]);
      minY = Math.min(minY, points[i][1]);
      maxY = Math.max(maxY, points[i][1]);
    }

    return {
      width: maxX - minX,
      height: maxY - minY
    };
  }

  pathLength(points) {
    let d = 0;
    for (let i = 1; i < points.length; i++) {
      d += this.distance(points[i - 1], points[i]);
    }
    return d;
  }

  get phi() {
    return 0.5 * (-1 + Math.sqrt(5));
  }
}

export default OneDollar; 