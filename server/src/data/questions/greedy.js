export const greedyQuestions = [
  {
    "id": "cq_87",
    "slug": "jump-game",
    "title": "Jump Game",
    "difficulty": "Medium",
    "topic": "Greedy",
    "tags": [
      "Array",
      "Dynamic Programming",
      "Greedy"
    ],
    "inputFormat": "An integer array nums",
    "outputFormat": "Boolean true if you can reach the last index, or false otherwise",
    "referenceUrl": "https://leetcode.com/problems/jump-game/",
    "attribution": "Greedy maximum reachable boundary tracking benchmark.",
    "description": "You are given an integer array nums. You are initially positioned at the array's first index, and each element in the array represents your maximum jump length at that position. Return true if you can reach the last index, or false otherwise.",
    "constraints": [
      "1 <= nums.length <= 10^4",
      "0 <= nums[i] <= 10^5"
    ],
    "examples": [
      {
        "input": "nums = [2, 3, 1, 1, 4]",
        "output": "true",
        "explanation": "Jump 1 step from index 0 to 1, then 3 steps to the last index."
      },
      {
        "input": "nums = [3, 2, 1, 0, 4]",
        "output": "false",
        "explanation": "You will always arrive at index 3 no matter what. Its maximum jump length is 0, which makes it impossible to reach the last index."
      }
    ],
    "testCases": [
      {
        "input": "[2, 3, 1, 1, 4]",
        "expectedOutput": "true",
        "hidden": false
      },
      {
        "input": "[3, 2, 1, 0, 4]",
        "expectedOutput": "false",
        "hidden": false
      },
      {
        "input": "[0]",
        "expectedOutput": "true",
        "hidden": true
      },
      {
        "input": "[2, 0, 0]",
        "expectedOutput": "true",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    bool canJump(vector<int>& nums) {\n        // Write your solution here\n        return false;\n    }\n};",
      "java": "class Solution {\n    public boolean canJump(int[] nums) {\n        // Write your solution here\n        return false;\n    }\n}",
      "python": "class Solution:\n    def canJump(self, nums: list[int]) -> bool:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {number[]} nums\n * @return {boolean}\n */\nfunction canJump(nums) {\n    // Write your solution here\n    return false;\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  },
  {
    "id": "cq_88",
    "slug": "jump-game-ii",
    "title": "Jump Game II",
    "difficulty": "Medium",
    "topic": "Greedy",
    "tags": [
      "Array",
      "Dynamic Programming",
      "Greedy"
    ],
    "inputFormat": "A 0-indexed array of integers nums of length n",
    "outputFormat": "The minimum number of jumps to reach index n - 1",
    "referenceUrl": "https://leetcode.com/problems/jump-game-ii/",
    "attribution": "Breadth/interval jump BFS greedy optimization problem.",
    "description": "You are given a 0-indexed array of integers nums of length n. You are initially positioned at nums[0]. Each element nums[i] represents the maximum length of a forward jump from index i. Return the minimum number of jumps to reach nums[n - 1]. The test cases are generated such that you can reach nums[n - 1].",
    "constraints": [
      "1 <= nums.length <= 10^4",
      "0 <= nums[i] <= 1000",
      "It's guaranteed that you can reach nums[n - 1]."
    ],
    "examples": [
      {
        "input": "nums = [2, 3, 1, 1, 4]",
        "output": "2",
        "explanation": "Jump 1 step from index 0 to 1, then 3 steps to the last index."
      },
      {
        "input": "nums = [2, 3, 0, 1, 4]",
        "output": "2",
        "explanation": "Min jumps is 2."
      }
    ],
    "testCases": [
      {
        "input": "[2, 3, 1, 1, 4]",
        "expectedOutput": "2",
        "hidden": false
      },
      {
        "input": "[2, 3, 0, 1, 4]",
        "expectedOutput": "2",
        "hidden": false
      },
      {
        "input": "[0]",
        "expectedOutput": "0",
        "hidden": true
      },
      {
        "input": "[1, 2, 3]",
        "expectedOutput": "2",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    int jump(vector<int>& nums) {\n        // Write your solution here\n        return 0;\n    }\n};",
      "java": "class Solution {\n    public int jump(int[] nums) {\n        // Write your solution here\n        return 0;\n    }\n}",
      "python": "class Solution:\n    def jump(self, nums: list[int]) -> int:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction jump(nums) {\n    // Write your solution here\n    return 0;\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  },
  {
    "id": "cq_89",
    "slug": "gas-station",
    "title": "Gas Station",
    "difficulty": "Medium",
    "topic": "Greedy",
    "tags": [
      "Array",
      "Greedy"
    ],
    "inputFormat": "Two integer arrays gas and cost of length n",
    "outputFormat": "The starting gas station index, or -1 if circular travel is impossible",
    "referenceUrl": "https://leetcode.com/problems/gas-station/",
    "attribution": "Circular route fuel surplus greedy accumulator problem.",
    "description": "There are n gas stations along a circular route, where the amount of gas at the ith station is gas[i]. You have a car with an unlimited gas tank and it costs cost[i] of gas to travel from the ith station to its next (i + 1)th station. You begin the journey with an empty tank at one of the gas stations. Return the starting gas station's index if you can travel around the circuit once in the clockwise direction, otherwise return -1. If there exists a solution, it is guaranteed to be unique.",
    "constraints": [
      "n == gas.length == cost.length",
      "1 <= n <= 10^5",
      "0 <= gas[i], cost[i] <= 10^4"
    ],
    "examples": [
      {
        "input": "gas = [1, 2, 3, 4, 5], cost = [3, 4, 5, 1, 2]",
        "output": "3",
        "explanation": "Start at station 3 (index 3) and complete full circle."
      },
      {
        "input": "gas = [2, 3, 4], cost = [3, 4, 3]",
        "output": "-1",
        "explanation": "Total gas is 9, total cost is 10. Impossible."
      }
    ],
    "testCases": [
      {
        "input": "[1, 2, 3, 4, 5], [3, 4, 5, 1, 2]",
        "expectedOutput": "3",
        "hidden": false
      },
      {
        "input": "[2, 3, 4], [3, 4, 3]",
        "expectedOutput": "-1",
        "hidden": false
      },
      {
        "input": "[5, 1, 2, 3, 4], [4, 4, 1, 5, 1]",
        "expectedOutput": "4",
        "hidden": true
      },
      {
        "input": "[2], [2]",
        "expectedOutput": "0",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    int canCompleteCircuit(vector<int>& gas, vector<int>& cost) {\n        // Write your solution here\n        return -1;\n    }\n};",
      "java": "class Solution {\n    public int canCompleteCircuit(int[] gas, int[] cost) {\n        // Write your solution here\n        return -1;\n    }\n}",
      "python": "class Solution:\n    def canCompleteCircuit(self, gas: list[int], cost: list[int]) -> int:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {number[]} gas\n * @param {number[]} cost\n * @return {number}\n */\nfunction canCompleteCircuit(gas, cost) {\n    // Write your solution here\n    return -1;\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  },
  {
    "id": "cq_90",
    "slug": "assign-cookies",
    "title": "Assign Cookies",
    "difficulty": "Easy",
    "topic": "Greedy",
    "tags": [
      "Array",
      "Two Pointers",
      "Greedy",
      "Sorting"
    ],
    "inputFormat": "Two integer arrays g (children greed factors) and s (cookie sizes)",
    "outputFormat": "The maximum number of your content children",
    "referenceUrl": "https://leetcode.com/problems/assign-cookies/",
    "attribution": "Introductory greedy sorting and matching question.",
    "description": "Assume you are an awesome parent and want to give your children some cookies. But, you should give each child at most one cookie. Each child i has a greed factor g[i], which is the minimum size of a cookie that the child will be content with; and each cookie j has a size s[j]. If s[j] >= g[i], we can assign the cookie j to the child i, and the child i will be content. Your goal is to maximize the number of your content children and output the maximum number.",
    "constraints": [
      "1 <= g.length <= 3 * 10^4",
      "0 <= s.length <= 3 * 10^4",
      "1 <= g[i], s[j] <= 2^31 - 1"
    ],
    "examples": [
      {
        "input": "g = [1, 2, 3], s = [1, 1]",
        "output": "1",
        "explanation": "You have 3 children and 2 cookies. You can only make the child with greed factor 1 content."
      },
      {
        "input": "g = [1, 2], s = [1, 2, 3]",
        "output": "2",
        "explanation": "Both children can be contented."
      }
    ],
    "testCases": [
      {
        "input": "[1, 2, 3], [1, 1]",
        "expectedOutput": "1",
        "hidden": false
      },
      {
        "input": "[1, 2], [1, 2, 3]",
        "expectedOutput": "2",
        "hidden": false
      },
      {
        "input": "[1, 2, 3], []",
        "expectedOutput": "0",
        "hidden": true
      },
      {
        "input": "[10, 9, 8, 7], [5, 6, 7, 8]",
        "expectedOutput": "2",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    int findContentChildren(vector<int>& g, vector<int>& s) {\n        // Write your solution here\n        return 0;\n    }\n};",
      "java": "class Solution {\n    public int findContentChildren(int[] g, int[] s) {\n        // Write your solution here\n        return 0;\n    }\n}",
      "python": "class Solution:\n    def findContentChildren(self, g: list[int], s: list[int]) -> int:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {number[]} g\n * @param {number[]} s\n * @return {number}\n */\nfunction findContentChildren(g, s) {\n    // Write your solution here\n    return 0;\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  },
  {
    "id": "cq_91",
    "slug": "lemonade-change",
    "title": "Lemonade Change",
    "difficulty": "Easy",
    "topic": "Greedy",
    "tags": [
      "Array",
      "Greedy"
    ],
    "inputFormat": "An integer array bills where bills[i] is the bill the ith customer pays",
    "outputFormat": "Boolean true if you can provide every customer with correct change, or false otherwise",
    "referenceUrl": "https://leetcode.com/problems/lemonade-change/",
    "attribution": "Bill denomination greedy disbursement problem in recruitment.",
    "description": "At a lemonade stand, each lemonade costs $5. Customers are standing in a queue to buy from you and order one at a time (in the order specified by bills). Each customer will only buy one lemonade and pay with either a $5, $10, or $20 bill. You must provide the correct change to each customer so that the net transaction is that the customer pays $5. Return true if you can provide every customer with the correct change, or false otherwise.",
    "constraints": [
      "1 <= bills.length <= 10^5",
      "bills[i] is either 5, 10, or 20."
    ],
    "examples": [
      {
        "input": "bills = [5, 5, 5, 10, 20]",
        "output": "true",
        "explanation": "From the first 3 customers, we collect three $5 bills in order. For the 4th customer, we collect a $10 bill and give back a $5 bill. For the 5th customer, we give a $10 bill and a $5 bill."
      },
      {
        "input": "bills = [5, 5, 10, 10, 20]",
        "output": "false",
        "explanation": "For the last customer, we can't give $15 back because we only have two $10 bills."
      }
    ],
    "testCases": [
      {
        "input": "[5, 5, 5, 10, 20]",
        "expectedOutput": "true",
        "hidden": false
      },
      {
        "input": "[5, 5, 10, 10, 20]",
        "expectedOutput": "false",
        "hidden": false
      },
      {
        "input": "[5]",
        "expectedOutput": "true",
        "hidden": true
      },
      {
        "input": "[10]",
        "expectedOutput": "false",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    bool lemonadeChange(vector<int>& bills) {\n        // Write your solution here\n        return false;\n    }\n};",
      "java": "class Solution {\n    public boolean lemonadeChange(int[] bills) {\n        // Write your solution here\n        return false;\n    }\n}",
      "python": "class Solution:\n    def lemonadeChange(self, bills: list[int]) -> bool:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {number[]} bills\n * @return {boolean}\n */\nfunction lemonadeChange(bills) {\n    // Write your solution here\n    return false;\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  },
  {
    "id": "cq_92",
    "slug": "partition-labels",
    "title": "Partition Labels",
    "difficulty": "Medium",
    "topic": "Greedy",
    "tags": [
      "Hash Table",
      "Two Pointers",
      "String",
      "Greedy"
    ],
    "inputFormat": "A string s",
    "outputFormat": "A list of integers representing the size of each part",
    "referenceUrl": "https://leetcode.com/problems/partition-labels/",
    "attribution": "Last occurrence interval expansion greedy technique (Amazon, Adobe).",
    "description": "You are given a string s. We want to partition the string into as many parts as possible so that each letter appears in at most one part. Return a list of integers representing the size of these parts.",
    "constraints": [
      "1 <= s.length <= 500",
      "s consists of lowercase English letters."
    ],
    "examples": [
      {
        "input": "s = \"ababcbacadefegdehijhklij\"",
        "output": "[9, 7, 8]",
        "explanation": "Partitions are \"ababcbaca\", \"defegde\", \"hijhklij\"."
      },
      {
        "input": "s = \"eccbbbbdec\"",
        "output": "[10]",
        "explanation": "All characters overlap in one partition."
      }
    ],
    "testCases": [
      {
        "input": "\"ababcbacadefegdehijhklij\"",
        "expectedOutput": "[9, 7, 8]",
        "hidden": false
      },
      {
        "input": "\"eccbbbbdec\"",
        "expectedOutput": "[10]",
        "hidden": false
      },
      {
        "input": "\"a\"",
        "expectedOutput": "[1]",
        "hidden": true
      },
      {
        "input": "\"abc\"",
        "expectedOutput": "[1, 1, 1]",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    vector<int> partitionLabels(string s) {\n        // Write your solution here\n        return {};\n    }\n};",
      "java": "class Solution {\n    public List<Integer> partitionLabels(String s) {\n        // Write your solution here\n        return new ArrayList<>();\n    }\n}",
      "python": "class Solution:\n    def partitionLabels(self, s: str) -> list[int]:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {string} s\n * @return {number[]}\n */\nfunction partitionLabels(s) {\n    // Write your solution here\n    return [];\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  }
];
export default greedyQuestions;
