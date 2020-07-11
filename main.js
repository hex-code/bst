class CanvasTreeDrawer {
	constructor(canvas) {
		this.canvas = canvas;
		this.context = this.canvas.getContext('2d');
		this.defaultX = this.canvas.width / 2;
		this.defaultY = 30;
		this.defaultRadius = 20;
		this.defaultNodeDistanceX = 50;
		this.defaultNodeDistanceY = 60;
		// keys for shapes properties
		this.defaultKeys = {
			lineWidth: 2,
			fillStyle: '#FFF',
			strokeStyle: '#E0E0E0',
			labelStroke: "#FFF",
			labelFillStyle: "#000"
		}
	}

	renderSubtree(node, centerX, centerY, isRight, isRoot, defaultKeys) {
		let x = centerX;
		let	y = centerY;

		if (!isRoot) {
			// calculate the x,y for left subtree
			const spacing = 800;
			x = centerX - (spacing / Math.pow(2, node.depth));
			y = centerY + this.defaultNodeDistanceY;

			// if current node direction is right then calculate the x,y for right subtree
			if (isRight === true) {
					x = centerX + (spacing / Math.pow(2, node.depth));
					y = centerY + this.defaultNodeDistanceY;
			}
			
			this.connect(node, x, y, centerX, centerY, "#E0E0E0");
			this.renderNode(node, x, y, defaultKeys)
		}


		if (node.left !== null) {
			this.renderSubtree(node.left, x, y, false, false, defaultKeys)
		}

		if (node.right !== null) {
			this.renderSubtree(node.right, x, y, true, false, defaultKeys)
		}
	}

	connect(node, x, y, centerX, centerY, color) {
		this.context.globalCompositeOperation = 'destination-over';
		this.context.beginPath();
		this.context.moveTo(x, y);
		this.context.lineTo(centerX, centerY);
		this.context.strokeStyle = color;
		this.context.stroke();
	}

	renderNode(node, pX, pY, defaultKeys) {
		this.context.globalCompositeOperation = 'source-over';
		this.context.beginPath();
		this.context.arc(pX, pY, this.defaultRadius, 0, 2 * Math.PI, false);
		this.context.fillStyle = defaultKeys.fillStyle;
		this.context.fill();
		this.context.lineWidth = defaultKeys.lineWidth;
		this.context.strokeStyle = defaultKeys.strokeStyle;
		this.context.stroke();
		this.context.closePath();
		// now fill the text
		this.context.font = "14px arial";
		this.context.textBaseline  = "middle";
		this.context.fillStyle = defaultKeys.labelFillStyle;
		this.context.strokeStyle = defaultKeys.labelStroke;
		this.context.textAlign = 'center';
		this.context.fillText(node.value, pX, pY);
	}

	clearTree() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
}

class Node { 
	constructor(data, id) { 
		this.left = null;
		this.right = null;
		this.value = data;
		this.depth = 0;
	} 
}

class BinaryTree {
	constructor() {
		this.root = null;
		this.arrayOfNumbers = [];
		this.allNodes = [];
		this.binaryLength = 52;
	}

	initBinaryVisualization() {
		// Init the Canvas 
		const canvas = document.getElementById("treeCanvas");
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		// object responsible to draw item on tree
		this.treeDrawer = new CanvasTreeDrawer(canvas);
	}

	insert(value) {
		let newNode = new Node(value);
		
		if (!this.root) {
			this.root = newNode;
		} else {
			this.insertNode(this.root, newNode);
		}

		this.allNodes.push(newNode);
		return newNode;
	}

	insertNode(root, node) {
		if (node.value < root.value) {
			node.depth += 1;
			if (!root.left) {
				root.left = node;
			} else {
				this.insertNode(root.left, node);
			}
		} else {
			node.depth += 1;
			if (!root.right) {
				root.right = node;
			} else {
				this.insertNode(root.right, node);
			}
		}
	}

	sortedArrayToBST(nums) {
		//base cases
		if (nums.length === 1) return this.insert(nums[0]);
		if (nums.length === 0) return null;
		
		//create a new Node(center)
		let centerIdx = Math.floor(nums.length/2);    
		let root = this.insert(nums[centerIdx]);
		
		//set left node to center of left subtree
		let leftSubtree = nums.slice(0,centerIdx);
		root.left = this.sortedArrayToBST(leftSubtree);
		
		//set right node to center of right subtree
		let rightSubtree = nums.slice(centerIdx+1,nums.length);
		root.right = this.sortedArrayToBST(rightSubtree);
		
		return root;
	}

	generateNumbers() {
		while(this.arrayOfNumbers.length < this.binaryLength) {
			const newNumber = Math.round(Math.random() * 99 + 1);
			if (!this.arrayOfNumbers.includes(newNumber)) {
				this.arrayOfNumbers.push(newNumber);
			}
		}
		
	}

	draw() {
		const sortedArray = this.arrayOfNumbers.sort((a, b) => a - b);
		const root = this.sortedArrayToBST(sortedArray);

		// clear canvas
		this.treeDrawer.clearTree();
		// render root node
		this.treeDrawer.renderNode(root, this.treeDrawer.defaultX, this.treeDrawer.defaultY, this.treeDrawer.defaultKeys);
		// now render the subtree
		this.treeDrawer.renderSubtree(root, this.treeDrawer.defaultX, this.treeDrawer.defaultY, false, true, this.treeDrawer.defaultKeys);
	}	
}

const binaryTree = new BinaryTree();
binaryTree.initBinaryVisualization();
binaryTree.generateNumbers();
binaryTree.draw();
console.log(binaryTree);