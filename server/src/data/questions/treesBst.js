export const treesBstQuestions = [
  {
    "id": "cq_66",
    "slug": "maximum-depth-of-binary-tree",
    "title": "Maximum Depth of Binary Tree",
    "difficulty": "Easy",
    "topic": "Trees",
    "tags": [
      "Tree",
      "Depth-First Search",
      "Breadth-First Search",
      "Binary Tree"
    ],
    "inputFormat": "The root of a binary tree",
    "outputFormat": "The maximum depth integer",
    "referenceUrl": "https://leetcode.com/problems/maximum-depth-of-binary-tree/",
    "attribution": "Fundamental recursive tree height calculation benchmark.",
    "description": "Given the root of a binary tree, return its maximum depth. A binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.",
    "constraints": [
      "The number of nodes in the tree is in the range [0, 10^4].",
      "-100 <= Node.val <= 100"
    ],
    "examples": [
      {
        "input": "root = [3, 9, 20, null, null, 15, 7]",
        "output": "3",
        "explanation": "Path 3 -> 20 -> 15 gives max depth 3."
      },
      {
        "input": "root = [1, null, 2]",
        "output": "2",
        "explanation": "Path 1 -> 2 gives max depth 2."
      }
    ],
    "testCases": [
      {
        "input": "[3, 9, 20, null, null, 15, 7]",
        "expectedOutput": "3",
        "hidden": false
      },
      {
        "input": "[1, null, 2]",
        "expectedOutput": "2",
        "hidden": false
      },
      {
        "input": "[]",
        "expectedOutput": "0",
        "hidden": true
      },
      {
        "input": "[0]",
        "expectedOutput": "1",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "/**\n * Definition for a binary tree node.\n * struct TreeNode {\n *     int val;\n *     TreeNode *left;\n *     TreeNode *right;\n *     TreeNode(int x) : val(x), left(NULL), right(NULL) {}\n * };\n */\nclass Solution {\npublic:\n    int maxDepth(TreeNode* root) {\n        // Write your solution here\n        return 0;\n    }\n};",
      "java": "/**\n * Definition for a binary tree node.\n * public class TreeNode {\n *     int val;\n *     TreeNode left;\n *     TreeNode right;\n *     TreeNode(int x) { val = x; }\n * }\n */\nclass Solution {\n    public int maxDepth(TreeNode root) {\n        // Write your solution here\n        return 0;\n    }\n}",
      "python": "# Definition for a binary tree node.\n# class TreeNode:\n#     def __init__(self, val=0, left=None, right=None):\n#         self.val = val\n#         self.left = left\n#         self.right = right\nclass Solution:\n    def maxDepth(self, root: Optional[TreeNode]) -> int:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * Definition for a binary tree node.\n * function TreeNode(val, left, right) {\n *     this.val = (val===undefined ? 0 : val)\n *     this.left = (left===undefined ? null : left)\n *     this.right = (right===undefined ? null : right)\n * }\n */\n/**\n * @param {TreeNode} root\n * @return {number}\n */\nfunction maxDepth(root) {\n    // Write your solution here\n    return 0;\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  },
  {
    "id": "cq_67",
    "slug": "invert-binary-tree",
    "title": "Invert Binary Tree",
    "difficulty": "Easy",
    "topic": "Trees",
    "tags": [
      "Tree",
      "Depth-First Search",
      "Breadth-First Search",
      "Binary Tree"
    ],
    "inputFormat": "The root of a binary tree",
    "outputFormat": "The root of the inverted binary tree",
    "referenceUrl": "https://leetcode.com/problems/invert-binary-tree/",
    "attribution": "Tree pointer swap mirroring interview classic.",
    "description": "Given the root of a binary tree, invert the tree, and return its root.",
    "constraints": [
      "The number of nodes in the tree is in the range [0, 100].",
      "-100 <= Node.val <= 100"
    ],
    "examples": [
      {
        "input": "root = [4, 2, 7, 1, 3, 6, 9]",
        "output": "[4, 7, 2, 9, 6, 3, 1]",
        "explanation": "Every left and right child is swapped."
      },
      {
        "input": "root = [2, 1, 3]",
        "output": "[2, 3, 1]",
        "explanation": "Children 1 and 3 are swapped."
      }
    ],
    "testCases": [
      {
        "input": "[4, 2, 7, 1, 3, 6, 9]",
        "expectedOutput": "[4, 7, 2, 9, 6, 3, 1]",
        "hidden": false
      },
      {
        "input": "[2, 1, 3]",
        "expectedOutput": "[2, 3, 1]",
        "hidden": false
      },
      {
        "input": "[]",
        "expectedOutput": "[]",
        "hidden": true
      },
      {
        "input": "[1]",
        "expectedOutput": "[1]",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    TreeNode* invertTree(TreeNode* root) {\n        // Write your solution here\n        return nullptr;\n    }\n};",
      "java": "class Solution {\n    public TreeNode invertTree(TreeNode root) {\n        // Write your solution here\n        return null;\n    }\n}",
      "python": "class Solution:\n    def invertTree(self, root: Optional[TreeNode]) -> Optional[TreeNode]:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {TreeNode} root\n * @return {TreeNode}\n */\nfunction invertTree(root) {\n    // Write your solution here\n    return null;\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  },
  {
    "id": "cq_68",
    "slug": "same-tree",
    "title": "Same Tree",
    "difficulty": "Easy",
    "topic": "Trees",
    "tags": [
      "Tree",
      "Depth-First Search",
      "Breadth-First Search",
      "Binary Tree"
    ],
    "inputFormat": "The roots of two binary trees p and q",
    "outputFormat": "Boolean true if they are structurally identical with equal values, false otherwise",
    "referenceUrl": "https://leetcode.com/problems/same-tree/",
    "attribution": "Dual tree traversal structural isomorphism check.",
    "description": "Given the roots of two binary trees p and q, write a function to check if they are the same or not. Two binary trees are considered the same if they are structurally identical, and the nodes have the same value.",
    "constraints": [
      "The number of nodes in both trees is in the range [0, 100].",
      "-10^4 <= Node.val <= 10^4"
    ],
    "examples": [
      {
        "input": "p = [1, 2, 3], q = [1, 2, 3]",
        "output": "true",
        "explanation": "Both trees have identical values and topology."
      },
      {
        "input": "p = [1, 2], q = [1, null, 2]",
        "output": "false",
        "explanation": "Structure is distinct."
      }
    ],
    "testCases": [
      {
        "input": "[1, 2, 3], [1, 2, 3]",
        "expectedOutput": "true",
        "hidden": false
      },
      {
        "input": "[1, 2], [1, null, 2]",
        "expectedOutput": "false",
        "hidden": false
      },
      {
        "input": "[1, 2, 1], [1, 1, 2]",
        "expectedOutput": "false",
        "hidden": true
      },
      {
        "input": "[], []",
        "expectedOutput": "true",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    bool isSameTree(TreeNode* p, TreeNode* q) {\n        // Write your solution here\n        return false;\n    }\n};",
      "java": "class Solution {\n    public boolean isSameTree(TreeNode p, TreeNode q) {\n        // Write your solution here\n        return false;\n    }\n}",
      "python": "class Solution:\n    def isSameTree(self, p: Optional[TreeNode], q: Optional[TreeNode]) -> bool:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {TreeNode} p\n * @param {TreeNode} q\n * @return {boolean}\n */\nfunction isSameTree(p, q) {\n    // Write your solution here\n    return false;\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  },
  {
    "id": "cq_69",
    "slug": "symmetric-tree",
    "title": "Symmetric Tree",
    "difficulty": "Easy",
    "topic": "Trees",
    "tags": [
      "Tree",
      "Depth-First Search",
      "Breadth-First Search",
      "Binary Tree"
    ],
    "inputFormat": "The root of a binary tree",
    "outputFormat": "Boolean true if the tree is symmetric around its center, false otherwise",
    "referenceUrl": "https://leetcode.com/problems/symmetric-tree/",
    "attribution": "Tree reflection mirror comparison interview standard.",
    "description": "Given the root of a binary tree, check whether it is a mirror of itself (i.e., symmetric around its center).",
    "constraints": [
      "The number of nodes in the tree is in the range [1, 1000].",
      "-100 <= Node.val <= 100"
    ],
    "examples": [
      {
        "input": "root = [1, 2, 2, 3, 4, 4, 3]",
        "output": "true",
        "explanation": "Left and right subtrees mirror each other."
      },
      {
        "input": "root = [1, 2, 2, null, 3, null, 3]",
        "output": "false",
        "explanation": "Not symmetric."
      }
    ],
    "testCases": [
      {
        "input": "[1, 2, 2, 3, 4, 4, 3]",
        "expectedOutput": "true",
        "hidden": false
      },
      {
        "input": "[1, 2, 2, null, 3, null, 3]",
        "expectedOutput": "false",
        "hidden": false
      },
      {
        "input": "[1]",
        "expectedOutput": "true",
        "hidden": true
      },
      {
        "input": "[1, 2, 3]",
        "expectedOutput": "false",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    bool isSymmetric(TreeNode* root) {\n        // Write your solution here\n        return false;\n    }\n};",
      "java": "class Solution {\n    public boolean isSymmetric(TreeNode root) {\n        // Write your solution here\n        return false;\n    }\n}",
      "python": "class Solution:\n    def isSymmetric(self, root: Optional[TreeNode]) -> bool:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {TreeNode} root\n * @return {boolean}\n */\nfunction isSymmetric(root) {\n    // Write your solution here\n    return false;\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  },
  {
    "id": "cq_70",
    "slug": "diameter-of-binary-tree",
    "title": "Diameter of Binary Tree",
    "difficulty": "Easy",
    "topic": "Trees",
    "tags": [
      "Tree",
      "Depth-First Search",
      "Binary Tree"
    ],
    "inputFormat": "The root of a binary tree",
    "outputFormat": "The length of the diameter of the tree",
    "referenceUrl": "https://leetcode.com/problems/diameter-of-binary-tree/",
    "attribution": "Bottom-up DFS longest path calculation problem.",
    "description": "Given the root of a binary tree, return the length of the diameter of the tree. The diameter of a binary tree is the length of the longest path between any two nodes in a tree. This path may or may not pass through the root. The length of a path between two nodes is represented by the number of edges between them.",
    "constraints": [
      "The number of nodes in the tree is in the range [1, 10^4].",
      "-100 <= Node.val <= 100"
    ],
    "examples": [
      {
        "input": "root = [1, 2, 3, 4, 5]",
        "output": "3",
        "explanation": "Path 4 -> 2 -> 1 -> 3 or 5 -> 2 -> 1 -> 3 has length 3 edges."
      },
      {
        "input": "root = [1, 2]",
        "output": "1",
        "explanation": "Path 2 -> 1 has length 1."
      }
    ],
    "testCases": [
      {
        "input": "[1, 2, 3, 4, 5]",
        "expectedOutput": "3",
        "hidden": false
      },
      {
        "input": "[1, 2]",
        "expectedOutput": "1",
        "hidden": false
      },
      {
        "input": "[1]",
        "expectedOutput": "0",
        "hidden": true
      },
      {
        "input": "[2, 3, null, 1]",
        "expectedOutput": "2",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    int diameterOfBinaryTree(TreeNode* root) {\n        // Write your solution here\n        return 0;\n    }\n};",
      "java": "class Solution {\n    public int diameterOfBinaryTree(TreeNode root) {\n        // Write your solution here\n        return 0;\n    }\n}",
      "python": "class Solution:\n    def diameterOfBinaryTree(self, root: Optional[TreeNode]) -> int:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {TreeNode} root\n * @return {number}\n */\nfunction diameterOfBinaryTree(root) {\n    // Write your solution here\n    return 0;\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  },
  {
    "id": "cq_71",
    "slug": "balanced-binary-tree",
    "title": "Balanced Binary Tree",
    "difficulty": "Easy",
    "topic": "Trees",
    "tags": [
      "Tree",
      "Depth-First Search",
      "Binary Tree"
    ],
    "inputFormat": "The root of a binary tree",
    "outputFormat": "Boolean true if it is height-balanced, false otherwise",
    "referenceUrl": "https://leetcode.com/problems/balanced-binary-tree/",
    "attribution": "Subtree height differential check in technical screening.",
    "description": "Given a binary tree, determine if it is height-balanced. A height-balanced binary tree is a binary tree in which the depth of the two subtrees of every node never differs by more than one.",
    "constraints": [
      "The number of nodes in the tree is in the range [0, 5000].",
      "-10^4 <= Node.val <= 10^4"
    ],
    "examples": [
      {
        "input": "root = [3, 9, 20, null, null, 15, 7]",
        "output": "true",
        "explanation": "Subtree height differences across all nodes <= 1."
      },
      {
        "input": "root = [1, 2, 2, 3, 3, null, null, 4, 4]",
        "output": "false",
        "explanation": "Height imbalance occurs at depth 1."
      }
    ],
    "testCases": [
      {
        "input": "[3, 9, 20, null, null, 15, 7]",
        "expectedOutput": "true",
        "hidden": false
      },
      {
        "input": "[1, 2, 2, 3, 3, null, null, 4, 4]",
        "expectedOutput": "false",
        "hidden": false
      },
      {
        "input": "[]",
        "expectedOutput": "true",
        "hidden": true
      },
      {
        "input": "[1, null, 2, null, 3]",
        "expectedOutput": "false",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    bool isBalanced(TreeNode* root) {\n        // Write your solution here\n        return false;\n    }\n};",
      "java": "class Solution {\n    public boolean isBalanced(TreeNode root) {\n        // Write your solution here\n        return false;\n    }\n}",
      "python": "class Solution:\n    def isBalanced(self, root: Optional[TreeNode]) -> bool:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {TreeNode} root\n * @return {boolean}\n */\nfunction isBalanced(root) {\n    // Write your solution here\n    return false;\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  },
  {
    "id": "cq_72",
    "slug": "lowest-common-ancestor-of-a-binary-search-tree",
    "title": "Lowest Common Ancestor of a Binary Search Tree",
    "difficulty": "Medium",
    "topic": "Trees",
    "tags": [
      "Tree",
      "Design",
      "Binary Search Tree",
      "Binary Tree"
    ],
    "inputFormat": "The root of a BST and two nodes p and q",
    "outputFormat": "The lowest common ancestor (LCA) node of p and q",
    "referenceUrl": "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/",
    "attribution": "BST ordering exploitation LCA property interview problem.",
    "description": "Given a binary search tree (BST), find the lowest common ancestor (LCA) node of two given nodes in the BST. According to the definition of LCA on Wikipedia: “The lowest common ancestor is defined between two nodes p and q as the lowest node in T that has both p and q as descendants (where we allow a node to be a descendant of itself).”",
    "constraints": [
      "The number of nodes in the tree is in the range [2, 10^5].",
      "-10^9 <= Node.val <= 10^9",
      "All Node.val are unique.",
      "p != q",
      "p and q will exist in the BST."
    ],
    "examples": [
      {
        "input": "root = [6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], p = 2, q = 8",
        "output": "6",
        "explanation": "The LCA of nodes 2 and 8 is 6."
      },
      {
        "input": "root = [6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], p = 2, q = 4",
        "output": "2",
        "explanation": "The LCA of nodes 2 and 4 is 2, since a node can be a descendant of itself."
      }
    ],
    "testCases": [
      {
        "input": "[6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], 2, 8",
        "expectedOutput": "6",
        "hidden": false
      },
      {
        "input": "[6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], 2, 4",
        "expectedOutput": "2",
        "hidden": false
      },
      {
        "input": "[2, 1], 2, 1",
        "expectedOutput": "2",
        "hidden": true
      },
      {
        "input": "[5, 3, 6, 2, 4, null, null, 1], 1, 4",
        "expectedOutput": "3",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {\n        // Write your solution here\n        return nullptr;\n    }\n};",
      "java": "class Solution {\n    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {\n        // Write your solution here\n        return null;\n    }\n}",
      "python": "class Solution:\n    def lowestCommonAncestor(self, root: 'TreeNode', p: 'TreeNode', q: 'TreeNode') -> 'TreeNode':\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {TreeNode} root\n * @param {TreeNode} p\n * @param {TreeNode} q\n * @return {TreeNode}\n */\nfunction lowestCommonAncestor(root, p, q) {\n    // Write your solution here\n    return null;\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  },
  {
    "id": "cq_73",
    "slug": "binary-tree-level-order-traversal",
    "title": "Binary Tree Level Order Traversal",
    "difficulty": "Medium",
    "topic": "Trees",
    "tags": [
      "Tree",
      "Breadth-First Search",
      "Binary Tree"
    ],
    "inputFormat": "The root of a binary tree",
    "outputFormat": "The level order traversal of its nodes' values as a 2D array",
    "referenceUrl": "https://leetcode.com/problems/binary-tree-level-order-traversal/",
    "attribution": "Classic queue-based BFS level-by-level traversal.",
    "description": "Given the root of a binary tree, return the level order traversal of its nodes' values. (i.e., from left to right, level by level).",
    "constraints": [
      "The number of nodes in the tree is in the range [0, 2000].",
      "-1000 <= Node.val <= 1000"
    ],
    "examples": [
      {
        "input": "root = [3, 9, 20, null, null, 15, 7]",
        "output": "[[3], [9, 20], [15, 7]]",
        "explanation": "Level 0: [3]; Level 1: [9, 20]; Level 2: [15, 7]."
      },
      {
        "input": "root = [1]",
        "output": "[[1]]",
        "explanation": "Single root node."
      }
    ],
    "testCases": [
      {
        "input": "[3, 9, 20, null, null, 15, 7]",
        "expectedOutput": "[[3], [9, 20], [15, 7]]",
        "hidden": false
      },
      {
        "input": "[1]",
        "expectedOutput": "[[1]]",
        "hidden": false
      },
      {
        "input": "[]",
        "expectedOutput": "[]",
        "hidden": true
      },
      {
        "input": "[1, 2, null, 3, null, 4]",
        "expectedOutput": "[[1], [2], [3], [4]]",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    vector<vector<int>> levelOrder(TreeNode* root) {\n        // Write your solution here\n        return {};\n    }\n};",
      "java": "class Solution {\n    public List<List<Integer>> levelOrder(TreeNode root) {\n        // Write your solution here\n        return new ArrayList<>();\n    }\n}",
      "python": "class Solution:\n    def levelOrder(self, root: Optional[TreeNode]) -> list[list[int]]:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {TreeNode} root\n * @return {number[][]}\n */\nfunction levelOrder(root) {\n    // Write your solution here\n    return [];\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  },
  {
    "id": "cq_74",
    "slug": "validate-binary-search-tree",
    "title": "Validate Binary Search Tree",
    "difficulty": "Medium",
    "topic": "Trees",
    "tags": [
      "Tree",
      "Depth-First Search",
      "Binary Search Tree",
      "Binary Tree"
    ],
    "inputFormat": "The root of a binary tree",
    "outputFormat": "Boolean true if valid BST, false otherwise",
    "referenceUrl": "https://leetcode.com/problems/validate-binary-search-tree/",
    "attribution": "Strict range bounding (min, max) recursion benchmark.",
    "description": "Given the root of a binary tree, determine if it is a valid binary search tree (BST). A valid BST is defined as follows: The left subtree of a node contains only nodes with keys strictly less than the node's key. The right subtree of a node contains only nodes with keys strictly greater than the node's key. Both the left and right subtrees must also be binary search trees.",
    "constraints": [
      "The number of nodes in the tree is in the range [1, 10^4].",
      "-2^31 <= Node.val <= 2^31 - 1"
    ],
    "examples": [
      {
        "input": "root = [2, 1, 3]",
        "output": "true",
        "explanation": "1 < 2 < 3. Valid BST."
      },
      {
        "input": "root = [5, 1, 4, null, null, 3, 6]",
        "output": "false",
        "explanation": "The root node's value is 5 but its right child's value is 4."
      }
    ],
    "testCases": [
      {
        "input": "[2, 1, 3]",
        "expectedOutput": "true",
        "hidden": false
      },
      {
        "input": "[5, 1, 4, null, null, 3, 6]",
        "expectedOutput": "false",
        "hidden": false
      },
      {
        "input": "[2147483647]",
        "expectedOutput": "true",
        "hidden": true
      },
      {
        "input": "[5, 4, 6, null, null, 3, 7]",
        "expectedOutput": "false",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    bool isValidBST(TreeNode* root) {\n        // Write your solution here\n        return false;\n    }\n};",
      "java": "class Solution {\n    public boolean isValidBST(TreeNode root) {\n        // Write your solution here\n        return false;\n    }\n}",
      "python": "class Solution:\n    def isValidBST(self, root: Optional[TreeNode]) -> bool:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {TreeNode} root\n * @return {boolean}\n */\nfunction isValidBST(root) {\n    // Write your solution here\n    return false;\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  },
  {
    "id": "cq_75",
    "slug": "kth-smallest-element-in-a-bst",
    "title": "Kth Smallest Element in a BST",
    "difficulty": "Medium",
    "topic": "Trees",
    "tags": [
      "Tree",
      "Depth-First Search",
      "Binary Search Tree",
      "Binary Tree"
    ],
    "inputFormat": "The root of a BST and an integer k",
    "outputFormat": "The kth smallest value (1-indexed) in the tree",
    "referenceUrl": "https://leetcode.com/problems/kth-smallest-element-in-a-bst/",
    "attribution": "In-order traversal sorted ordering property in BST.",
    "description": "Given the root of a binary search tree, and an integer k, return the kth smallest value (1-indexed) of all the values of the nodes in the tree.",
    "constraints": [
      "The number of nodes in the tree is n.",
      "1 <= k <= n <= 10^4",
      "0 <= Node.val <= 10^4"
    ],
    "examples": [
      {
        "input": "root = [3, 1, 4, null, 2], k = 1",
        "output": "1",
        "explanation": "Smallest element is 1."
      },
      {
        "input": "root = [5, 3, 6, 2, 4, null, null, 1], k = 3",
        "output": "3",
        "explanation": "In-order traversal: 1, 2, 3, 4, 5, 6. The 3rd smallest is 3."
      }
    ],
    "testCases": [
      {
        "input": "[3, 1, 4, null, 2], 1",
        "expectedOutput": "1",
        "hidden": false
      },
      {
        "input": "[5, 3, 6, 2, 4, null, null, 1], 3",
        "expectedOutput": "3",
        "hidden": false
      },
      {
        "input": "[2, 1, 3], 2",
        "expectedOutput": "2",
        "hidden": true
      },
      {
        "input": "[1], 1",
        "expectedOutput": "1",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    int kthSmallest(TreeNode* root, int k) {\n        // Write your solution here\n        return 0;\n    }\n};",
      "java": "class Solution {\n    public int kthSmallest(TreeNode root, int k) {\n        // Write your solution here\n        return 0;\n    }\n}",
      "python": "class Solution:\n    def kthSmallest(self, root: Optional[TreeNode], k: int) -> int:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {TreeNode} root\n * @param {number} k\n * @return {number}\n */\nfunction kthSmallest(root, k) {\n    // Write your solution here\n    return 0;\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  }
];
export default treesBstQuestions;
