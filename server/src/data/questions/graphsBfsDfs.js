export const graphsBfsDfsQuestions = [
  {
    "id": "cq_80",
    "slug": "number-of-islands",
    "title": "Number of Islands",
    "difficulty": "Medium",
    "topic": "Graphs",
    "tags": [
      "Array",
      "Depth-First Search",
      "Breadth-First Search",
      "Union Find",
      "Matrix"
    ],
    "inputFormat": "An m x n 2D binary grid grid representing a map of '1's (land) and '0's (water)",
    "outputFormat": "The number of islands integer",
    "referenceUrl": "https://leetcode.com/problems/number-of-islands/",
    "attribution": "Connected components grid DFS/BFS standard in all tech interviews.",
    "description": "Given an m x n 2D binary grid grid which represents a map of '1's (land) and '0's (water), return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.",
    "constraints": [
      "m == grid.length",
      "n == grid[i].length",
      "1 <= m, n <= 300",
      "grid[i][j] is '0' or '1'."
    ],
    "examples": [
      {
        "input": "grid = [[\"1\",\"1\",\"1\",\"1\",\"0\"],[\"1\",\"1\",\"0\",\"1\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"0\",\"0\"]]",
        "output": "1",
        "explanation": "All connected 1s form one large island."
      },
      {
        "input": "grid = [[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"1\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"1\",\"1\"]]",
        "output": "3",
        "explanation": "Three separated clusters of 1s."
      }
    ],
    "testCases": [
      {
        "input": "[[\"1\",\"1\",\"1\",\"1\",\"0\"],[\"1\",\"1\",\"0\",\"1\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"0\",\"0\"]]",
        "expectedOutput": "1",
        "hidden": false
      },
      {
        "input": "[[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"1\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"1\",\"1\"]]",
        "expectedOutput": "3",
        "hidden": false
      },
      {
        "input": "[[\"0\"]]",
        "expectedOutput": "0",
        "hidden": true
      },
      {
        "input": "[[\"1\"]]",
        "expectedOutput": "1",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    int numIslands(vector<vector<char>>& grid) {\n        // Write your solution here\n        return 0;\n    }\n};",
      "java": "class Solution {\n    public int numIslands(char[][] grid) {\n        // Write your solution here\n        return 0;\n    }\n}",
      "python": "class Solution:\n    def numIslands(self, grid: list[list[str]]) -> int:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {character[][]} grid\n * @return {number}\n */\nfunction numIslands(grid) {\n    // Write your solution here\n    return 0;\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  },
  {
    "id": "cq_81",
    "slug": "clone-graph",
    "title": "Clone Graph",
    "difficulty": "Medium",
    "topic": "Graphs",
    "tags": [
      "Hash Table",
      "Depth-First Search",
      "Breadth-First Search",
      "Graph"
    ],
    "inputFormat": "A reference of a node in a connected undirected graph",
    "outputFormat": "A deep copy (clone) of the graph",
    "referenceUrl": "https://leetcode.com/problems/clone-graph/",
    "attribution": "Deep copy with visited hash map graph traversal problem.",
    "description": "Given a reference of a node in a connected undirected graph. Return a deep copy (clone) of the graph. Each node in the graph contains a value (int) and a list (List[Node]) of its neighbors.",
    "constraints": [
      "The number of nodes in the graph is in the range [0, 100].",
      "1 <= Node.val <= 100",
      "Node.val is unique for each node.",
      "There are no repeated edges and no self-loops in the graph.",
      "The Graph is connected and all nodes can be visited starting from the given node."
    ],
    "examples": [
      {
        "input": "adjList = [[2,4],[1,3],[2,4],[1,3]]",
        "output": "[[2,4],[1,3],[2,4],[1,3]]",
        "explanation": "There are 4 nodes in the graph. 1st node (val = 1)'s neighbors are 2nd node (val = 2) and 4th node (val = 4)."
      },
      {
        "input": "adjList = [[]]",
        "output": "[[]]",
        "explanation": "Graph has one node with no neighbors."
      }
    ],
    "testCases": [
      {
        "input": "[[2,4],[1,3],[2,4],[1,3]]",
        "expectedOutput": "[[2,4],[1,3],[2,4],[1,3]]",
        "hidden": false
      },
      {
        "input": "[[]]",
        "expectedOutput": "[[]]",
        "hidden": false
      },
      {
        "input": "[]",
        "expectedOutput": "[]",
        "hidden": true
      },
      {
        "input": "[[2],[1]]",
        "expectedOutput": "[[2],[1]]",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "/*\n// Definition for a Node.\nclass Node {\npublic:\n    int val;\n    vector<Node*> neighbors;\n    Node() { val = 0; neighbors = vector<Node*>(); }\n    Node(int _val) { val = _val; neighbors = vector<Node*>(); }\n};\n*/\nclass Solution {\npublic:\n    Node* cloneGraph(Node* node) {\n        // Write your solution here\n        return nullptr;\n    }\n};",
      "java": "/*\n// Definition for a Node.\nclass Node {\n    public int val;\n    public List<Node> neighbors;\n    public Node() { val = 0; neighbors = new ArrayList<Node>(); }\n    public Node(int _val) { val = _val; neighbors = new ArrayList<Node>(); }\n};\n*/\nclass Solution {\n    public Node cloneGraph(Node node) {\n        // Write your solution here\n        return null;\n    }\n}",
      "python": "\"\"\"\n# Definition for a Node.\nclass Node:\n    def __init__(self, val = 0, neighbors = None):\n        self.val = val\n        self.neighbors = neighbors if neighbors is not None else []\n\"\"\"\nclass Solution:\n    def cloneGraph(self, node: Optional['Node']) -> Optional['Node']:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * // Definition for a _Node.\n * function _Node(val, neighbors) {\n *    this.val = val === undefined ? 0 : val;\n *    this.neighbors = neighbors === undefined ? [] : neighbors;\n * };\n */\n/**\n * @param {_Node} node\n * @return {_Node}\n */\nfunction cloneGraph(node) {\n    // Write your solution here\n    return null;\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  },
  {
    "id": "cq_82",
    "slug": "course-schedule",
    "title": "Course Schedule",
    "difficulty": "Medium",
    "topic": "Graphs",
    "tags": [
      "Depth-First Search",
      "Breadth-First Search",
      "Graph",
      "Topological Sort"
    ],
    "inputFormat": "An integer numCourses and an array prerequisites where prerequisites[i] = [ai, bi]",
    "outputFormat": "Boolean true if you can finish all courses, false otherwise",
    "referenceUrl": "https://leetcode.com/problems/course-schedule/",
    "attribution": "Topological sorting / directed cycle detection (Kahns Algorithm).",
    "description": "There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi first if you want to take course ai. Return true if you can finish all courses. Otherwise, return false.",
    "constraints": [
      "1 <= numCourses <= 2000",
      "0 <= prerequisites.length <= 5000",
      "prerequisites[i].length == 2",
      "0 <= ai, bi < numCourses",
      "All the pairs prerequisites[i] are unique."
    ],
    "examples": [
      {
        "input": "numCourses = 2, prerequisites = [[1, 0]]",
        "output": "true",
        "explanation": "There are a total of 2 courses. To take course 1 you should finish course 0. So it is possible."
      },
      {
        "input": "numCourses = 2, prerequisites = [[1, 0], [0, 1]]",
        "output": "false",
        "explanation": "To take course 1 you should finish course 0, and to take course 0 you should also finish course 1. Circular dependency."
      }
    ],
    "testCases": [
      {
        "input": "2, [[1, 0]]",
        "expectedOutput": "true",
        "hidden": false
      },
      {
        "input": "2, [[1, 0], [0, 1]]",
        "expectedOutput": "false",
        "hidden": false
      },
      {
        "input": "1, []",
        "expectedOutput": "true",
        "hidden": true
      },
      {
        "input": "3, [[0, 1], [0, 2], [1, 2]]",
        "expectedOutput": "true",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {\n        // Write your solution here\n        return false;\n    }\n};",
      "java": "class Solution {\n    public boolean canFinish(int numCourses, int[][] prerequisites) {\n        // Write your solution here\n        return false;\n    }\n}",
      "python": "class Solution:\n    def canFinish(self, numCourses: int, prerequisites: list[list[int]]) -> bool:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {number} numCourses\n * @param {number[][]} prerequisites\n * @return {boolean}\n */\nfunction canFinish(numCourses, prerequisites) {\n    // Write your solution here\n    return false;\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  },
  {
    "id": "cq_83",
    "slug": "pacific-atlantic-water-flow",
    "title": "Pacific Atlantic Water Flow",
    "difficulty": "Medium",
    "topic": "Graphs",
    "tags": [
      "Array",
      "Depth-First Search",
      "Breadth-First Search",
      "Matrix"
    ],
    "inputFormat": "An m x n integer matrix heights representing elevation",
    "outputFormat": "A 2D list of grid coordinates [r, c] where water can flow to both Pacific and Atlantic oceans",
    "referenceUrl": "https://leetcode.com/problems/pacific-atlantic-water-flow/",
    "attribution": "Reverse boundary multi-source DFS graph exploration problem.",
    "description": "There is an m x n rectangular island that borders both the Pacific Ocean and Atlantic Ocean. The Pacific Ocean touches the island's left and top edges, and the Atlantic Ocean touches the island's right and bottom edges. Rain water can flow to neighboring cells directly north, south, east, and west if the neighboring cell's height is less than or equal to the current cell's height. Water can also flow into the ocean from any cell directly adjacent to the ocean. Return a 2D list of grid coordinates result where result[i] = [ri, ci] denotes that rain water can flow from cell (ri, ci) to both oceans.",
    "constraints": [
      "m == heights.length",
      "n == heights[r].length",
      "1 <= m, n <= 200",
      "0 <= heights[r][c] <= 10^5"
    ],
    "examples": [
      {
        "input": "heights = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]",
        "output": "[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]",
        "explanation": "Cells from which water drains into both boundaries."
      },
      {
        "input": "heights = [[1]]",
        "output": "[[0,0]]",
        "explanation": "Single cell touches both oceans."
      }
    ],
    "testCases": [
      {
        "input": "[[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]",
        "expectedOutput": "[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]",
        "hidden": false
      },
      {
        "input": "[[1]]",
        "expectedOutput": "[[0,0]]",
        "hidden": false
      },
      {
        "input": "[[2,1],[1,2]]",
        "expectedOutput": "[[0,0],[0,1],[1,0],[1,1]]",
        "hidden": true
      },
      {
        "input": "[[1,2],[2,1]]",
        "expectedOutput": "[[0,0],[0,1],[1,0],[1,1]]",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    vector<vector<int>> pacificAtlantic(vector<vector<int>>& heights) {\n        // Write your solution here\n        return {};\n    }\n};",
      "java": "class Solution {\n    public List<List<Integer>> pacificAtlantic(int[][] heights) {\n        // Write your solution here\n        return new ArrayList<>();\n    }\n}",
      "python": "class Solution:\n    def pacificAtlantic(self, heights: list[list[int]]) -> list[list[int]]:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {number[][]} heights\n * @return {number[][]}\n */\nfunction pacificAtlantic(heights) {\n    // Write your solution here\n    return [];\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  },
  {
    "id": "cq_84",
    "slug": "rotting-oranges",
    "title": "Rotting Oranges",
    "difficulty": "Medium",
    "topic": "Graphs",
    "tags": [
      "Array",
      "Breadth-First Search",
      "Matrix"
    ],
    "inputFormat": "An m x n grid where each cell has values 0 (empty), 1 (fresh), or 2 (rotten)",
    "outputFormat": "The minimum number of minutes that must elapse until no cell has a fresh orange, or -1",
    "referenceUrl": "https://leetcode.com/problems/rotting-oranges/",
    "attribution": "Multi-source BFS wave propagation high-frequency interview question.",
    "description": "You are given an m x n grid where each cell can have one of three values: 0 representing an empty cell, 1 representing a fresh orange, or 2 representing a rotten orange. Every minute, any fresh orange that is 4-directionally adjacent to a rotten orange becomes rotten. Return the minimum number of minutes that must elapse until no cell has a fresh orange. If this is impossible, return -1.",
    "constraints": [
      "m == grid.length",
      "n == grid[i].length",
      "1 <= m, n <= 10",
      "grid[i][j] is 0, 1, or 2."
    ],
    "examples": [
      {
        "input": "grid = [[2,1,1],[1,1,0],[0,1,1]]",
        "output": "4",
        "explanation": "At minute 4, all fresh oranges have rotted."
      },
      {
        "input": "grid = [[2,1,1],[0,1,1],[1,0,1]]",
        "output": "-1",
        "explanation": "The orange in the bottom left corner (row 2, column 0) is never rotten, because rotting only happens 4-directionally."
      }
    ],
    "testCases": [
      {
        "input": "[[2,1,1],[1,1,0],[0,1,1]]",
        "expectedOutput": "4",
        "hidden": false
      },
      {
        "input": "[[2,1,1],[0,1,1],[1,0,1]]",
        "expectedOutput": "-1",
        "hidden": false
      },
      {
        "input": "[[0,2]]",
        "expectedOutput": "0",
        "hidden": true
      },
      {
        "input": "[[1]]",
        "expectedOutput": "-1",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    int orangesRotting(vector<vector<int>>& grid) {\n        // Write your solution here\n        return 0;\n    }\n};",
      "java": "class Solution {\n    public int orangesRotting(int[][] grid) {\n        // Write your solution here\n        return 0;\n    }\n}",
      "python": "class Solution:\n    def orangesRotting(self, grid: list[list[int]]) -> int:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {number[][]} grid\n * @return {number}\n */\nfunction orangesRotting(grid) {\n    // Write your solution here\n    return 0;\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  },
  {
    "id": "cq_85",
    "slug": "word-ladder",
    "title": "Word Ladder",
    "difficulty": "Hard",
    "topic": "Graphs",
    "tags": [
      "Hash Table",
      "String",
      "Breadth-First Search"
    ],
    "inputFormat": "Two words beginWord and endWord, and a dictionary wordList",
    "outputFormat": "The number of words in the shortest transformation sequence, or 0",
    "referenceUrl": "https://leetcode.com/problems/word-ladder/",
    "attribution": "Shortest path BFS over implicit string graph (Amazon, Google).",
    "description": "A transformation sequence from word beginWord to word endWord using a dictionary wordList is a sequence of words beginWord -> s1 -> s2 -> ... -> sk such that: Every adjacent pair of words differs by a single letter, and each si is in wordList. Return the number of words in the shortest transformation sequence from beginWord to endWord, or 0 if no such sequence exists.",
    "constraints": [
      "1 <= beginWord.length <= 10",
      "endWord.length == beginWord.length",
      "1 <= wordList.length <= 5000",
      "wordList[i].length == beginWord.length",
      "beginWord, endWord, and wordList[i] consist of lowercase English letters.",
      "beginWord != endWord",
      "All the words in wordList are unique."
    ],
    "examples": [
      {
        "input": "beginWord = \"hit\", endWord = \"cog\", wordList = [\"hot\",\"dot\",\"dog\",\"lot\",\"log\",\"cog\"]",
        "output": "5",
        "explanation": "One shortest transformation is \"hit\" -> \"hot\" -> \"dot\" -> \"dog\" -> \"cog\" with 5 words."
      },
      {
        "input": "beginWord = \"hit\", endWord = \"cog\", wordList = [\"hot\",\"dot\",\"dog\",\"lot\",\"log\"]",
        "output": "0",
        "explanation": "The endWord \"cog\" is not in wordList, therefore there is no valid transformation sequence."
      }
    ],
    "testCases": [
      {
        "input": "\"hit\", \"cog\", [\"hot\",\"dot\",\"dog\",\"lot\",\"log\",\"cog\"]",
        "expectedOutput": "5",
        "hidden": false
      },
      {
        "input": "\"hit\", \"cog\", [\"hot\",\"dot\",\"dog\",\"lot\",\"log\"]",
        "expectedOutput": "0",
        "hidden": false
      },
      {
        "input": "\"a\", \"c\", [\"a\",\"b\",\"c\"]",
        "expectedOutput": "2",
        "hidden": true
      },
      {
        "input": "\"hot\", \"dog\", [\"hot\",\"dog\"]",
        "expectedOutput": "0",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    int ladderLength(string beginWord, string endWord, vector<string>& wordList) {\n        // Write your solution here\n        return 0;\n    }\n};",
      "java": "class Solution {\n    public int ladderLength(String beginWord, String endWord, List<String> wordList) {\n        // Write your solution here\n        return 0;\n    }\n}",
      "python": "class Solution:\n    def ladderLength(self, beginWord: str, endWord: str, wordList: list[str]) -> int:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {string} beginWord\n * @param {string} endWord\n * @param {string[]} wordList\n * @return {number}\n */\nfunction ladderLength(beginWord, endWord, wordList) {\n    // Write your solution here\n    return 0;\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  },
  {
    "id": "cq_86",
    "slug": "flood-fill",
    "title": "Flood Fill",
    "difficulty": "Easy",
    "topic": "Graphs",
    "tags": [
      "Array",
      "Depth-First Search",
      "Breadth-First Search",
      "Matrix"
    ],
    "inputFormat": "An image represented by an m x n integer grid image, starting row sr, starting col sc, and integer color",
    "outputFormat": "The modified image grid after flood fill",
    "referenceUrl": "https://leetcode.com/problems/flood-fill/",
    "attribution": "Classic graphics DFS/BFS bucket fill algorithm.",
    "description": "An image is represented by an m x n integer grid image where image[i][j] represents the pixel value of the image. You are also given three integers sr, sc, and color. You should perform a flood fill on the image starting from the pixel image[sr][sc]. Return the modified image after performing the flood fill.",
    "constraints": [
      "m == image.length",
      "n == image[i].length",
      "1 <= m, n <= 50",
      "0 <= image[i][j], color < 2^16",
      "0 <= sr < m",
      "0 <= sc < n"
    ],
    "examples": [
      {
        "input": "image = [[1,1,1],[1,1,0],[1,0,1]], sr = 1, sc = 1, color = 2",
        "output": "[[2,2,2],[2,2,0],[2,0,1]]",
        "explanation": "From the center of the image with value 1, all pixels connected by path of same color are colored with 2."
      },
      {
        "input": "image = [[0,0,0],[0,0,0]], sr = 0, sc = 0, color = 0",
        "output": "[[0,0,0],[0,0,0]]",
        "explanation": "The starting pixel is already colored with 0, so no changes."
      }
    ],
    "testCases": [
      {
        "input": "[[1,1,1],[1,1,0],[1,0,1]], 1, 1, 2",
        "expectedOutput": "[[2,2,2],[2,2,0],[2,0,1]]",
        "hidden": false
      },
      {
        "input": "[[0,0,0],[0,0,0]], 0, 0, 0",
        "expectedOutput": "[[0,0,0],[0,0,0]]",
        "hidden": false
      },
      {
        "input": "[[0,0,0],[0,1,1]], 1, 1, 1",
        "expectedOutput": "[[0,0,0],[0,1,1]]",
        "hidden": true
      },
      {
        "input": "[[7]], 0, 0, 3",
        "expectedOutput": "[[3]]",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    vector<vector<int>> floodFill(vector<vector<int>>& image, int sr, int sc, int color) {\n        // Write your solution here\n        return {};\n    }\n};",
      "java": "class Solution {\n    public int[][] floodFill(int[][] image, int sr, int sc, int color) {\n        // Write your solution here\n        return new int[][]{};\n    }\n}",
      "python": "class Solution:\n    def floodFill(self, image: list[list[int]], sr: int, sc: int, color: int) -> list[list[int]]:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {number[][]} image\n * @param {number} sr\n * @param {number} sc\n * @param {number} color\n * @return {number[][]}\n */\nfunction floodFill(image, sr, sc, color) {\n    // Write your solution here\n    return [];\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  }
];
export default graphsBfsDfsQuestions;
