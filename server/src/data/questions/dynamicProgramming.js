export const dynamicProgrammingQuestions = [
  {
    "id": "cq_93",
    "slug": "house-robber",
    "title": "House Robber",
    "difficulty": "Medium",
    "topic": "Dynamic Programming",
    "tags": [
      "Array",
      "Dynamic Programming"
    ],
    "inputFormat": "An integer array nums representing amount of money of each house",
    "outputFormat": "The maximum amount of money you can rob tonight without alerting the police",
    "referenceUrl": "https://leetcode.com/problems/house-robber/",
    "attribution": "Non-consecutive selection 1D dynamic programming classic.",
    "description": "You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you from robbing each of them is that adjacent houses have security systems connected and it will automatically contact the police if two adjacent houses were broken into on the same night. Given an integer array nums representing the amount of money of each house, return the maximum amount of money you can rob tonight without alerting the police.",
    "constraints": [
      "1 <= nums.length <= 100",
      "0 <= nums[i] <= 400"
    ],
    "examples": [
      {
        "input": "nums = [1, 2, 3, 1]",
        "output": "4",
        "explanation": "Rob house 1 (money = 1) and house 3 (money = 3). Total = 1 + 3 = 4."
      },
      {
        "input": "nums = [2, 7, 9, 3, 1]",
        "output": "12",
        "explanation": "Rob house 1 (2) + house 3 (9) + house 5 (1) = 12."
      }
    ],
    "testCases": [
      {
        "input": "[1, 2, 3, 1]",
        "expectedOutput": "4",
        "hidden": false
      },
      {
        "input": "[2, 7, 9, 3, 1]",
        "expectedOutput": "12",
        "hidden": false
      },
      {
        "input": "[0]",
        "expectedOutput": "0",
        "hidden": true
      },
      {
        "input": "[2, 1, 1, 2]",
        "expectedOutput": "4",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    int rob(vector<int>& nums) {\n        // Write your solution here\n        return 0;\n    }\n};",
      "java": "class Solution {\n    public int rob(int[] nums) {\n        // Write your solution here\n        return 0;\n    }\n}",
      "python": "class Solution:\n    def rob(self, nums: list[int]) -> int:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction rob(nums) {\n    // Write your solution here\n    return 0;\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  },
  {
    "id": "cq_94",
    "slug": "house-robber-ii",
    "title": "House Robber II",
    "difficulty": "Medium",
    "topic": "Dynamic Programming",
    "tags": [
      "Array",
      "Dynamic Programming"
    ],
    "inputFormat": "An integer array nums representing amount of money of each house arranged in a circle",
    "outputFormat": "The maximum amount of money you can rob tonight without alerting the police",
    "referenceUrl": "https://leetcode.com/problems/house-robber-ii/",
    "attribution": "Circular array partition dynamic programming pattern.",
    "description": "You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed. All houses at this place are arranged in a circle. That means the first house is the neighbor of the last one. Meanwhile, adjacent houses have a security system connected, and it will contact police if two adjacent houses are robbed on same night. Given an integer array nums representing amount of money of each house, return max money robable.",
    "constraints": [
      "1 <= nums.length <= 100",
      "0 <= nums[i] <= 1000"
    ],
    "examples": [
      {
        "input": "nums = [2, 3, 2]",
        "output": "3",
        "explanation": "You cannot rob house 1 (2) and house 3 (2), because they are adjacent houses in a circle."
      },
      {
        "input": "nums = [1, 2, 3, 1]",
        "output": "4",
        "explanation": "Rob house 1 (1) and house 3 (3) = 4."
      }
    ],
    "testCases": [
      {
        "input": "[2, 3, 2]",
        "expectedOutput": "3",
        "hidden": false
      },
      {
        "input": "[1, 2, 3, 1]",
        "expectedOutput": "4",
        "hidden": false
      },
      {
        "input": "[1, 2, 3]",
        "expectedOutput": "3",
        "hidden": true
      },
      {
        "input": "[5]",
        "expectedOutput": "5",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    int rob(vector<int>& nums) {\n        // Write your solution here\n        return 0;\n    }\n};",
      "java": "class Solution {\n    public int rob(int[] nums) {\n        // Write your solution here\n        return 0;\n    }\n}",
      "python": "class Solution:\n    def rob(self, nums: list[int]) -> int:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction rob(nums) {\n    // Write your solution here\n    return 0;\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  },
  {
    "id": "cq_95",
    "slug": "longest-increasing-subsequence",
    "title": "Longest Increasing Subsequence",
    "difficulty": "Medium",
    "topic": "Dynamic Programming",
    "tags": [
      "Array",
      "Binary Search",
      "Dynamic Programming"
    ],
    "inputFormat": "An integer array nums",
    "outputFormat": "The length of the longest strictly increasing subsequence",
    "referenceUrl": "https://leetcode.com/problems/longest-increasing-subsequence/",
    "attribution": "Patience sorting / binary search DP optimization standard.",
    "description": "Given an integer array nums, return the length of the longest strictly increasing subsequence.",
    "constraints": [
      "1 <= nums.length <= 2500",
      "-10^4 <= nums[i] <= 10^4"
    ],
    "examples": [
      {
        "input": "nums = [10, 9, 2, 5, 3, 7, 101, 18]",
        "output": "4",
        "explanation": "The longest increasing subsequence is [2, 3, 7, 101], therefore the length is 4."
      },
      {
        "input": "nums = [0, 1, 0, 3, 2, 3]",
        "output": "4",
        "explanation": "Subsequence [0, 1, 2, 3] has length 4."
      }
    ],
    "testCases": [
      {
        "input": "[10, 9, 2, 5, 3, 7, 101, 18]",
        "expectedOutput": "4",
        "hidden": false
      },
      {
        "input": "[0, 1, 0, 3, 2, 3]",
        "expectedOutput": "4",
        "hidden": false
      },
      {
        "input": "[7, 7, 7, 7, 7, 7, 7]",
        "expectedOutput": "1",
        "hidden": true
      },
      {
        "input": "[1, 3, 6, 7, 9, 4, 10, 5, 6]",
        "expectedOutput": "6",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    int lengthOfLIS(vector<int>& nums) {\n        // Write your solution here\n        return 0;\n    }\n};",
      "java": "class Solution {\n    public int lengthOfLIS(int[] nums) {\n        // Write your solution here\n        return 0;\n    }\n}",
      "python": "class Solution:\n    def lengthOfLIS(self, nums: list[int]) -> int:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction lengthOfLIS(nums) {\n    // Write your solution here\n    return 0;\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  },
  {
    "id": "cq_96",
    "slug": "unique-paths",
    "title": "Unique Paths",
    "difficulty": "Medium",
    "topic": "Dynamic Programming",
    "tags": [
      "Math",
      "Dynamic Programming",
      "Combinatorics"
    ],
    "inputFormat": "Two integers m and n representing grid dimensions",
    "outputFormat": "The number of possible unique paths to reach the bottom-right corner",
    "referenceUrl": "https://leetcode.com/problems/unique-paths/",
    "attribution": "2D grid dynamic programming path counting benchmark.",
    "description": "There is a robot on an m x n grid. The robot is initially located at the top-left corner (i.e., grid[0][0]). The robot tries to move to the bottom-right corner (i.e., grid[m - 1][n - 1]). The robot can only move either down or right at any point in time. Given the two integers m and n, return the number of possible unique paths that the robot can take to reach the bottom-right corner.",
    "constraints": [
      "1 <= m, n <= 100"
    ],
    "examples": [
      {
        "input": "m = 3, n = 7",
        "output": "28",
        "explanation": "There are 28 unique paths on a 3x7 grid."
      },
      {
        "input": "m = 3, n = 2",
        "output": "3",
        "explanation": "From the top-left corner, there are a total of 3 ways to reach the bottom-right corner: 1. Right -> Down -> Down, 2. Down -> Down -> Right, 3. Down -> Right -> Down."
      }
    ],
    "testCases": [
      {
        "input": "3, 7",
        "expectedOutput": "28",
        "hidden": false
      },
      {
        "input": "3, 2",
        "expectedOutput": "3",
        "hidden": false
      },
      {
        "input": "1, 1",
        "expectedOutput": "1",
        "hidden": true
      },
      {
        "input": "3, 3",
        "expectedOutput": "6",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    int uniquePaths(int m, int n) {\n        // Write your solution here\n        return 0;\n    }\n};",
      "java": "class Solution {\n    public int uniquePaths(int m, int n) {\n        // Write your solution here\n        return 0;\n    }\n}",
      "python": "class Solution:\n    def uniquePaths(self, m: int, n: int) -> int:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {number} m\n * @param {number} n\n * @return {number}\n */\nfunction uniquePaths(m, n) {\n    // Write your solution here\n    return 0;\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  }
];
export default dynamicProgrammingQuestions;
