export const recursionBacktrackingQuestions = [
  {
    "id": "cq_60",
    "slug": "permutations",
    "title": "Permutations",
    "difficulty": "Medium",
    "topic": "Recursion",
    "tags": [
      "Array",
      "Backtracking"
    ],
    "inputFormat": "An array nums of distinct integers",
    "outputFormat": "All possible permutations in any order",
    "referenceUrl": "https://leetcode.com/problems/permutations/",
    "attribution": "Classic state-space tree traversal backtracking benchmark.",
    "description": "Given an array nums of distinct integers, return all the possible permutations. You can return the answer in any order.",
    "constraints": [
      "1 <= nums.length <= 6",
      "-10 <= nums[i] <= 10",
      "All the integers of nums are unique."
    ],
    "examples": [
      {
        "input": "nums = [1, 2, 3]",
        "output": "[[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]",
        "explanation": "All 3! = 6 permutations."
      },
      {
        "input": "nums = [0, 1]",
        "output": "[[0, 1], [1, 0]]",
        "explanation": "All 2! = 2 permutations."
      }
    ],
    "testCases": [
      {
        "input": "[1, 2, 3]",
        "expectedOutput": "[[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]",
        "hidden": false
      },
      {
        "input": "[0, 1]",
        "expectedOutput": "[[0, 1], [1, 0]]",
        "hidden": false
      },
      {
        "input": "[1]",
        "expectedOutput": "[[1]]",
        "hidden": true
      },
      {
        "input": "[2, 3]",
        "expectedOutput": "[[2, 3], [3, 2]]",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    vector<vector<int>> permute(vector<int>& nums) {\n        // Write your solution here\n        return {};\n    }\n};",
      "java": "class Solution {\n    public List<List<Integer>> permute(int[] nums) {\n        // Write your solution here\n        return new ArrayList<>();\n    }\n}",
      "python": "class Solution:\n    def permute(self, nums: list[int]) -> list[list[int]]:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {number[]} nums\n * @return {number[][]}\n */\nfunction permute(nums) {\n    // Write your solution here\n    return [];\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  },
  {
    "id": "cq_61",
    "slug": "combination-sum",
    "title": "Combination Sum",
    "difficulty": "Medium",
    "topic": "Recursion",
    "tags": [
      "Array",
      "Backtracking"
    ],
    "inputFormat": "An array of distinct integers candidates and a target integer target",
    "outputFormat": "A list of all unique combinations of candidates where the chosen numbers sum to target",
    "referenceUrl": "https://leetcode.com/problems/combination-sum/",
    "attribution": "Unbounded knapsack decision-tree backtracking pattern.",
    "description": "Given an array of distinct integers candidates and a target integer target, return a list of all unique combinations of candidates where the chosen numbers sum to target. You may return the combinations in any order. The same number may be chosen from candidates an unlimited number of times.",
    "constraints": [
      "1 <= candidates.length <= 30",
      "2 <= candidates[i] <= 40",
      "All elements of candidates are distinct.",
      "1 <= target <= 40"
    ],
    "examples": [
      {
        "input": "candidates = [2, 3, 6, 7], target = 7",
        "output": "[[2, 2, 3], [7]]",
        "explanation": "2 and 3 can be combined: 2 + 2 + 3 = 7. 7 is a candidate: 7 = 7."
      },
      {
        "input": "candidates = [2, 3, 5], target = 8",
        "output": "[[2, 2, 2, 2], [2, 3, 3], [3, 5]]",
        "explanation": "Three combinations sum to 8."
      }
    ],
    "testCases": [
      {
        "input": "[2, 3, 6, 7], 7",
        "expectedOutput": "[[2, 2, 3], [7]]",
        "hidden": false
      },
      {
        "input": "[2, 3, 5], 8",
        "expectedOutput": "[[2, 2, 2, 2], [2, 3, 3], [3, 5]]",
        "hidden": false
      },
      {
        "input": "[2], 1",
        "expectedOutput": "[]",
        "hidden": true
      },
      {
        "input": "[3, 5], 7",
        "expectedOutput": "[]",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    vector<vector<int>> combinationSum(vector<int>& candidates, int target) {\n        // Write your solution here\n        return {};\n    }\n};",
      "java": "class Solution {\n    public List<List<Integer>> combinationSum(int[] candidates, int target) {\n        // Write your solution here\n        return new ArrayList<>();\n    }\n}",
      "python": "class Solution:\n    def combinationSum(self, candidates: list[int], target: int) -> list[list[int]]:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {number[]} candidates\n * @param {number} target\n * @return {number[][]}\n */\nfunction combinationSum(candidates, target) {\n    // Write your solution here\n    return [];\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  },
  {
    "id": "cq_62",
    "slug": "generate-parentheses",
    "title": "Generate Parentheses",
    "difficulty": "Medium",
    "topic": "Recursion",
    "tags": [
      "String",
      "Dynamic Programming",
      "Backtracking"
    ],
    "inputFormat": "An integer n pairs of parentheses",
    "outputFormat": "All combinations of well-formed parentheses",
    "referenceUrl": "https://leetcode.com/problems/generate-parentheses/",
    "attribution": "Catalan number combinatorial backtracking standard.",
    "description": "Given n pairs of parentheses, write a function to generate all combinations of well-formed parentheses.",
    "constraints": [
      "1 <= n <= 8"
    ],
    "examples": [
      {
        "input": "n = 3",
        "output": "[\"((()))\", \"(()())\", \"(())()\", \"()(())\", \"()()()\"]",
        "explanation": "5 valid combinations for n = 3."
      },
      {
        "input": "n = 1",
        "output": "[\"()\"]",
        "explanation": "Only 1 valid combination."
      }
    ],
    "testCases": [
      {
        "input": "3",
        "expectedOutput": "[\"((()))\", \"(()())\", \"(())()\", \"()(())\", \"()()()\"]",
        "hidden": false
      },
      {
        "input": "1",
        "expectedOutput": "[\"()\"]",
        "hidden": false
      },
      {
        "input": "2",
        "expectedOutput": "[\"(())\", \"()()\"]",
        "hidden": true
      },
      {
        "input": "4",
        "expectedOutput": "[\"(((())))\", \"((()()))\", \"((())())\", \"((()))()\", \"(()(()))\", \"(()()())\", \"(()())()\", \"(())(())\", \"(())()()\", \"()((()))\", \"()(()())\", \"()(())()\", \"()()(())\", \"()()()()\"]",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    vector<string> generateParenthesis(int n) {\n        // Write your solution here\n        return {};\n    }\n};",
      "java": "class Solution {\n    public List<String> generateParenthesis(int n) {\n        // Write your solution here\n        return new ArrayList<>();\n    }\n}",
      "python": "class Solution:\n    def generateParenthesis(self, n: int) -> list[str]:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {number} n\n * @return {string[]}\n */\nfunction generateParenthesis(n) {\n    // Write your solution here\n    return [];\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  },
  {
    "id": "cq_63",
    "slug": "letter-combinations-of-a-phone-number",
    "title": "Letter Combinations of a Phone Number",
    "difficulty": "Medium",
    "topic": "Recursion",
    "tags": [
      "Hash Table",
      "String",
      "Backtracking"
    ],
    "inputFormat": "A string digits containing digits from 2-9 inclusive",
    "outputFormat": "All possible letter combinations that the number could represent",
    "referenceUrl": "https://leetcode.com/problems/letter-combinations-of-a-phone-number/",
    "attribution": "Classic phone keypad cartesian product backtracking question.",
    "description": "Given a string containing digits from 2-9 inclusive, return all possible letter combinations that the number could represent. Return the answer in any order. Mapping of digits to letters (just like on telephone buttons): 2: abc, 3: def, 4: ghi, 5: jkl, 6: mno, 7: pqrs, 8: tuv, 9: wxyz.",
    "constraints": [
      "0 <= digits.length <= 4",
      "digits[i] is a digit in the range ['2', '9']."
    ],
    "examples": [
      {
        "input": "digits = \"23\"",
        "output": "[\"ad\", \"ae\", \"af\", \"bd\", \"be\", \"bf\", \"cd\", \"ce\", \"cf\"]",
        "explanation": "3 * 3 = 9 combinations."
      },
      {
        "input": "digits = \"\"",
        "output": "[]",
        "explanation": "Empty input produces no combinations."
      }
    ],
    "testCases": [
      {
        "input": "\"23\"",
        "expectedOutput": "[\"ad\", \"ae\", \"af\", \"bd\", \"be\", \"bf\", \"cd\", \"ce\", \"cf\"]",
        "hidden": false
      },
      {
        "input": "\"\"",
        "expectedOutput": "[]",
        "hidden": false
      },
      {
        "input": "\"2\"",
        "expectedOutput": "[\"a\", \"b\", \"c\"]",
        "hidden": true
      },
      {
        "input": "\"7\"",
        "expectedOutput": "[\"p\", \"q\", \"r\", \"s\"]",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    vector<string> letterCombinations(string digits) {\n        // Write your solution here\n        return {};\n    }\n};",
      "java": "class Solution {\n    public List<String> letterCombinations(String digits) {\n        // Write your solution here\n        return new ArrayList<>();\n    }\n}",
      "python": "class Solution:\n    def letterCombinations(self, digits: str) -> list[str]:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {string} digits\n * @return {string[]}\n */\nfunction letterCombinations(digits) {\n    // Write your solution here\n    return [];\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  },
  {
    "id": "cq_64",
    "slug": "word-search",
    "title": "Word Search",
    "difficulty": "Medium",
    "topic": "Recursion",
    "tags": [
      "Array",
      "String",
      "Backtracking",
      "Matrix"
    ],
    "inputFormat": "An m x n grid of characters board and a string word",
    "outputFormat": "Boolean true if word exists in the grid, false otherwise",
    "referenceUrl": "https://leetcode.com/problems/word-search/",
    "attribution": "Grid DFS with cell state backtracking featured in placement coding rounds.",
    "description": "Given an m x n grid of characters board and a string word, return true if word exists in the grid. The word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once.",
    "constraints": [
      "m == board.length",
      "n = board[i].length",
      "1 <= m, n <= 6",
      "1 <= word.length <= 15",
      "board and word consists of only lowercase and uppercase English letters."
    ],
    "examples": [
      {
        "input": "board = [[\"A\", \"B\", \"C\", \"E\"], [\"S\", \"F\", \"C\", \"S\"], [\"A\", \"D\", \"E\", \"E\"]], word = \"ABCCED\"",
        "output": "true",
        "explanation": "Path traverses (0,0) -> (0,1) -> (0,2) -> (1,2) -> (2,2) -> (2,1)."
      },
      {
        "input": "board = [[\"A\", \"B\", \"C\", \"E\"], [\"S\", \"F\", \"C\", \"S\"], [\"A\", \"D\", \"E\", \"E\"]], word = \"SEE\"",
        "output": "true",
        "explanation": "Path traverses (1,3) -> (2,3) -> (2,2)."
      }
    ],
    "testCases": [
      {
        "input": "[[\"A\", \"B\", \"C\", \"E\"], [\"S\", \"F\", \"C\", \"S\"], [\"A\", \"D\", \"E\", \"E\"]], \"ABCCED\"",
        "expectedOutput": "true",
        "hidden": false
      },
      {
        "input": "[[\"A\", \"B\", \"C\", \"E\"], [\"S\", \"F\", \"C\", \"S\"], [\"A\", \"D\", \"E\", \"E\"]], \"SEE\"",
        "expectedOutput": "true",
        "hidden": false
      },
      {
        "input": "[[\"A\", \"B\", \"C\", \"E\"], [\"S\", \"F\", \"C\", \"S\"], [\"A\", \"D\", \"E\", \"E\"]], \"ABCB\"",
        "expectedOutput": "false",
        "hidden": true
      },
      {
        "input": "[[\"a\"]], \"a\"",
        "expectedOutput": "true",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    bool exist(vector<vector<char>>& board, string word) {\n        // Write your solution here\n        return false;\n    }\n};",
      "java": "class Solution {\n    public boolean exist(char[][] board, String word) {\n        // Write your solution here\n        return false;\n    }\n}",
      "python": "class Solution:\n    def exist(self, board: list[list[str]], word: str) -> bool:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {character[][]} board\n * @param {string} word\n * @return {boolean}\n */\nfunction exist(board, word) {\n    // Write your solution here\n    return false;\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  },
  {
    "id": "cq_65",
    "slug": "n-queens",
    "title": "N-Queens",
    "difficulty": "Hard",
    "topic": "Recursion",
    "tags": [
      "Array",
      "Backtracking"
    ],
    "inputFormat": "An integer n representing chessboard dimensions",
    "outputFormat": "All distinct solutions to the n-queens puzzle",
    "referenceUrl": "https://leetcode.com/problems/n-queens/",
    "attribution": "Classic textbook backtracking problem (Amazon, Microsoft, Google).",
    "description": "The n-queens puzzle is the problem of placing n queens on an n x n chessboard such that no two queens attack each other. Given an integer n, return all distinct solutions to the n-queens puzzle. You may return the answer in any order. Each solution contains a distinct board configuration of the n-queens' placement, where 'Q' and '.' indicate a queen and an empty space, respectively.",
    "constraints": [
      "1 <= n <= 9"
    ],
    "examples": [
      {
        "input": "n = 4",
        "output": "[[\".Q..\", \"...Q\", \"Q...\", \"..Q.\"], [\"..Q.\", \"Q...\", \"...Q\", \".Q..\"]]",
        "explanation": "There exist two distinct solutions to the 4-queens puzzle."
      },
      {
        "input": "n = 1",
        "output": "[[\"Q\"]]",
        "explanation": "Only one solution on 1x1 board."
      }
    ],
    "testCases": [
      {
        "input": "4",
        "expectedOutput": "[[\".Q..\", \"...Q\", \"Q...\", \"..Q.\"], [\"..Q.\", \"Q...\", \"...Q\", \".Q..\"]]",
        "hidden": false
      },
      {
        "input": "1",
        "expectedOutput": "[[\"Q\"]]",
        "hidden": false
      },
      {
        "input": "2",
        "expectedOutput": "[]",
        "hidden": true
      },
      {
        "input": "3",
        "expectedOutput": "[]",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    vector<vector<string>> solveNQueens(int n) {\n        // Write your solution here\n        return {};\n    }\n};",
      "java": "class Solution {\n    public List<List<String>> solveNQueens(int n) {\n        // Write your solution here\n        return new ArrayList<>();\n    }\n}",
      "python": "class Solution:\n    def solveNQueens(self, n: int) -> list[list[str]]:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {number} n\n * @return {string[][]}\n */\nfunction solveNQueens(n) {\n    // Write your solution here\n    return [];\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  }
];
export default recursionBacktrackingQuestions;
