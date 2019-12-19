const A = 0;
const B = 1;
const C = 2;
const D = 3;

indices = {
    0: [0, 1, 4],
    1: [0, 4, 2],
    2: [1, 4, 3],
    3: [4, 2, 3]
}

function intp(a, b) {
    return (a + b) / 2
}



class Node {
    constructor(parent, level, childId) {
        this.level = level;
        this.parent = parent;
        this.childId = childId;

        this.corners = [];

        let valueCounter = 0;
        for (let i = 0; i < 4; i++) {
            if (i == childId) {
                this.corners.push(this.parent.corners[i]);
            } else {
                this.corners.push(this.parent.values[indices[childId][valueCounter]]);
                valueCounter++;
            }
        }

        this.values = [
            intp(this.corners[0], this.corners[1]),
            intp(this.corners[0], this.corners[2]),
            intp(this.corners[1], this.corners[3]),
            intp(this.corners[2], this.corners[3]),
            undefined,
        ];
        this.values[4] = intp(intp(this.values[0], this.values[3]), intp(this.values[1], this.values[2]));

        this.children = [];
    }

    createChildren() {
        this.children = [];
        for (let i = 0; i < 4; i++) {
            this.children.push(new Node(this, this.level + 1, i));
        }
    }

    createChildrenRecursively(depth) {
        if (depth > 0) {
            this.createChildren();
            for (let child of this.children) {
                child.createChildrenRecursively(depth - 1);
            }
        }
    }

    createGeometry(group, path) {
        if (this.children.length != 0) {
            for (let child of this.children) {
                let newPath = path.slice(0);
                newPath.push(child.childId);
                child.createGeometry(group, newPath);
            }
        } else {
            let x = 0;
            let y = 0;
            let i = -1;
            for (let step of path) {
                let xmod = step % 2;
                let ymod = Math.floor(step / 2);
                x += xmod * 2 ** i;
                y += ymod * 2 ** i;
                i--;
            }

            var g = new THREE.PlaneGeometry( 2 ** (-path.length), 2 ** (-path.length), 2, 2);
            g.rotateX(Math.PI / 2);
            g.translate(2 ** (-path.length - 1), 0, 2 ** (-path.length - 1));

            g.vertices[6].y = this.corners[0];
            g.vertices[7].y = this.values[0]
            g.vertices[8].y = this.corners[1];

            g.vertices[3].y = this.values[1]
            g.vertices[4].y = this.values[4]
            g.vertices[5].y = this.values[2]

            g.vertices[0].y = this.corners[2];
            g.vertices[1].y = this.values[3]
            g.vertices[2].y = this.corners[3];


            // g.rotateY(Math.PI);

            var material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide, wireframe: true} );
            var plane = new THREE.Mesh( g, material );
            plane.position.set(x-0.5, 0, y-0.5);
            group.add( plane );
            console.log(path, x, y, 0);
        }
    }

    print() {
        console.log(
            `${this.corners[0].toFixed(5)} ${this.values[0].toFixed(5)} ${this.corners[1].toFixed(5)}\n` +
            `${this.values[1].toFixed(5)} ${this.values[4].toFixed(5)} ${this.values[2].toFixed(5)}\n` +
            `${this.corners[2].toFixed(5)} ${this.values[3].toFixed(5)} ${this.corners[3].toFixed(5)}`
        );
    }
}

class Root extends Node {
    constructor() {
        super({corners: [0, 0, 0, 0], values: [1, 1, 1, 1, 1]}, 0, 0);
        // this.corners = [0, 0, 0.2, 0.2];
        // this.values = [0, 0.1, 0.1, 0.2, 0.1];
        this.corners = [0, 0, 0, 0.3];
        this.values = [0.1, 0.1, 0.24, 0.2, 0.2];
        this.children = [];
    }

    geometry() {
        var geometry = new THREE.Geometry();
        for (let i = 0; i < 4; i++) {
            this.children[i].geometry(geometry, [i]);
        }
    }
}

// class Node {
//     constructor() {
//
//     }
// }
