export const stacksQueuesQuestions = [
  {
    "id": "cq_55",
    "slug": "daily-temperatures",
    "title": "Daily Temperatures",
    "difficulty": "Medium",
    "topic": "Stack",
    "tags": [
      "Array",
      "Stack",
      "Monotonic Stack"
    ],
    "inputFormat": "An array of integers temperatures represents daily temperatures",
    "outputFormat": "An array answer such that answer[i] is the number of days you have to wait after the ith day to get a warmer temperature",
    "referenceUrl": "https://leetcode.com/problems/daily-temperatures/",
    "attribution": "Core monotonic stack pattern asked in product hiring.",
    "description": "Given an array of integers temperatures represents the daily temperatures, return an array answer such that answer[i] is the number of days you have to wait after the ith day to get a warmer temperature. If there is no future day for which this is possible, keep answer[i] == 0 instead.",
    "constraints": [
      "1 <= temperatures.length <= 10^5",
      "30 <= temperatures[i] <= 100"
    ],
    "examples": [
      {
        "input": "temperatures = [73, 74, 75, 71, 69, 72, 76, 73]",
        "output": "[1, 1, 4, 2, 1, 1, 0, 0]",
        "explanation": "On day 0 (73), day 1 (74) is warmer: wait 1 day."
      },
      {
        "input": "temperatures = [30, 40, 50, 60]",
        "output": "[1, 1, 1, 0]",
        "explanation": "Each consecutive day is warmer except the last."
      }
    ],
    "testCases": [
      {
        "input": "[73, 74, 75, 71, 69, 72, 76, 73]",
        "expectedOutput": "[1, 1, 4, 2, 1, 1, 0, 0]",
        "hidden": false
      },
      {
        "input": "[30, 40, 50, 60]",
        "expectedOutput": "[1, 1, 1, 0]",
        "hidden": false
      },
      {
        "input": "[30, 60, 90]",
        "expectedOutput": "[1, 1, 0]",
        "hidden": true
      },
      {
        "input": "[90, 80, 70]",
        "expectedOutput": "[0, 0, 0]",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    vector<int> dailyTemperatures(vector<int>& temperatures) {\n        // Write your solution here\n        return {};\n    }\n};",
      "java": "class Solution {\n    public int[] dailyTemperatures(int[] temperatures) {\n        // Write your solution here\n        return new int[]{};\n    }\n}",
      "python": "class Solution:\n    def dailyTemperatures(self, temperatures: list[int]) -> list[int]:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {number[]} temperatures\n * @return {number[]}\n */\nfunction dailyTemperatures(temperatures) {\n    // Write your solution here\n    return [];\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  },
  {
    "id": "cq_56",
    "slug": "evaluate-reverse-polish-notation",
    "title": "Evaluate Reverse Polish Notation",
    "difficulty": "Medium",
    "topic": "Stack",
    "tags": [
      "Array",
      "Math",
      "Stack"
    ],
    "inputFormat": "An array of strings tokens representing an arithmetic expression in Reverse Polish Notation",
    "outputFormat": "An integer that represents the value of the expression",
    "referenceUrl": "https://leetcode.com/problems/evaluate-reverse-polish-notation/",
    "attribution": "Postfix operand stack evaluation standard across CS placement tests.",
    "description": "You are given an array of strings tokens that represents an arithmetic expression in a Reverse Polish Notation. Evaluate the expression. Return an integer that represents the value of the expression. Valid operators are '+', '-', '*', and '/'. Each operand may be an integer or another expression. Division truncates toward zero.",
    "constraints": [
      "1 <= tokens.length <= 10^4",
      "tokens[i] is either an operator: \"+\", \"-\", \"*\", or \"/\", or an integer in the range [-200, 200]."
    ],
    "examples": [
      {
        "input": "tokens = [\"2\", \"1\", \"+\", \"3\", \"*\"]",
        "output": "9",
        "explanation": "((2 + 1) * 3) = 9."
      },
      {
        "input": "tokens = [\"4\", \"13\", \"5\", \"/\", \"+\"]",
        "output": "6",
        "explanation": "(4 + (13 / 5)) = 6."
      }
    ],
    "testCases": [
      {
        "input": "[\"2\", \"1\", \"+\", \"3\", \"*\"]",
        "expectedOutput": "9",
        "hidden": false
      },
      {
        "input": "[\"4\", \"13\", \"5\", \"/\", \"+\"]",
        "expectedOutput": "6",
        "hidden": false
      },
      {
        "input": "[\"10\", \"6\", \"9\", \"3\", \"+\", \"-11\", \"*\", \"/\", \"*\", \"17\", \"+\", \"5\", \"+\"]",
        "expectedOutput": "22",
        "hidden": true
      },
      {
        "input": "[\"18\"]",
        "expectedOutput": "18",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    int evalRPN(vector<string>& tokens) {\n        // Write your solution here\n        return 0;\n    }\n};",
      "java": "class Solution {\n    public int evalRPN(String[] tokens) {\n        // Write your solution here\n        return 0;\n    }\n}",
      "python": "class Solution:\n    def evalRPN(self, tokens: list[str]) -> int:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {string[]} tokens\n * @return {number}\n */\nfunction evalRPN(tokens) {\n    // Write your solution here\n    return 0;\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  },
  {
    "id": "cq_57",
    "slug": "asteroid-collision",
    "title": "Asteroid Collision",
    "difficulty": "Medium",
    "topic": "Stack",
    "tags": [
      "Array",
      "Stack",
      "Simulation"
    ],
    "inputFormat": "An array asteroids of integers representing asteroids in a row",
    "outputFormat": "The state of the asteroids after all collisions",
    "referenceUrl": "https://leetcode.com/problems/asteroid-collision/",
    "attribution": "Stack collision simulation problem tested at top software companies.",
    "description": "We are given an array asteroids of integers representing asteroids in a row. For each asteroid, the absolute value represents its size, and the sign represents its direction (positive meaning right, negative meaning left). Each asteroid moves at the same speed. Find out the state of the asteroids after all collisions. If two asteroids meet, the smaller one explodes. If both are the same size, both explode.",
    "constraints": [
      "2 <= asteroids.length <= 10^4",
      "-1000 <= asteroids[i] <= 1000",
      "asteroids[i] != 0"
    ],
    "examples": [
      {
        "input": "asteroids = [5, 10, -5]",
        "output": "[5, 10]",
        "explanation": "10 and -5 collide resulting in 10. 5 and 10 never collide."
      },
      {
        "input": "asteroids = [8, -8]",
        "output": "[]",
        "explanation": "8 and -8 collide and explode each other."
      }
    ],
    "testCases": [
      {
        "input": "[5, 10, -5]",
        "expectedOutput": "[5, 10]",
        "hidden": false
      },
      {
        "input": "[8, -8]",
        "expectedOutput": "[]",
        "hidden": false
      },
      {
        "input": "[10, 2, -5]",
        "expectedOutput": "[10]",
        "hidden": true
      },
      {
        "input": "[-2, -1, 1, 2]",
        "expectedOutput": "[-2, -1, 1, 2]",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    vector<int> asteroidCollision(vector<int>& asteroids) {\n        // Write your solution here\n        return {};\n    }\n};",
      "java": "class Solution {\n    public int[] asteroidCollision(int[] asteroids) {\n        // Write your solution here\n        return new int[]{};\n    }\n}",
      "python": "class Solution:\n    def asteroidCollision(self, asteroids: list[int]) -> list[int]:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {number[]} asteroids\n * @return {number[]}\n */\nfunction asteroidCollision(asteroids) {\n    // Write your solution here\n    return [];\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  },
  {
    "id": "cq_58",
    "slug": "next-greater-element-i",
    "title": "Next Greater Element I",
    "difficulty": "Easy",
    "topic": "Stack",
    "tags": [
      "Array",
      "Hash Table",
      "Stack",
      "Monotonic Stack"
    ],
    "inputFormat": "Two distinct 0-indexed integer arrays nums1 and nums2, where nums1 is a subset of nums2",
    "outputFormat": "An array ans of length nums1.length such that ans[i] is the next greater element",
    "referenceUrl": "https://leetcode.com/problems/next-greater-element-i/",
    "attribution": "Introductory monotonic stack + hash lookup pattern.",
    "description": "The next greater element of some element x in an array is the first greater element that is to the right of x in the same array. You are given two distinct 0-indexed integer arrays nums1 and nums2, where nums1 is a subset of nums2. Return an array ans of length nums1.length such that ans[i] is the next greater element as described above. If there is no next greater element, then ans[i] = -1.",
    "constraints": [
      "1 <= nums1.length <= nums2.length <= 1000",
      "0 <= nums1[i], nums2[i] <= 10^4",
      "All integers in nums1 and nums2 are unique.",
      "All the integers of nums1 also appear in nums2."
    ],
    "examples": [
      {
        "input": "nums1 = [4, 1, 2], nums2 = [1, 3, 4, 2]",
        "output": "[-1, 3, -1]",
        "explanation": "For 4, no greater element. For 1, next greater is 3. For 2, no greater element."
      },
      {
        "input": "nums1 = [2, 4], nums2 = [1, 2, 3, 4]",
        "output": "[3, -1]",
        "explanation": "For 2, next greater is 3. For 4, there is none."
      }
    ],
    "testCases": [
      {
        "input": "[4, 1, 2], [1, 3, 4, 2]",
        "expectedOutput": "[-1, 3, -1]",
        "hidden": false
      },
      {
        "input": "[2, 4], [1, 2, 3, 4]",
        "expectedOutput": "[3, -1]",
        "hidden": false
      },
      {
        "input": "[1, 3, 5, 2, 4], [6, 5, 4, 3, 2, 1, 7]",
        "expectedOutput": "[7, 7, 7, 7, 7]",
        "hidden": true
      },
      {
        "input": "[1], [1]",
        "expectedOutput": "[-1]",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    vector<int> nextGreaterElement(vector<int>& nums1, vector<int>& nums2) {\n        // Write your solution here\n        return {};\n    }\n};",
      "java": "class Solution {\n    public int[] nextGreaterElement(int[] nums1, int[] nums2) {\n        // Write your solution here\n        return new int[]{};\n    }\n}",
      "python": "class Solution:\n    def nextGreaterElement(self, nums1: list[int], nums2: list[int]) -> list[int]:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {number[]} nums1\n * @param {number[]} nums2\n * @return {number[]}\n */\nfunction nextGreaterElement(nums1, nums2) {\n    // Write your solution here\n    return [];\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  },
  {
    "id": "cq_59",
    "slug": "online-stock-span",
    "title": "Online Stock Span",
    "difficulty": "Medium",
    "topic": "Stack",
    "tags": [
      "Stack",
      "Design",
      "Monotonic Stack",
      "Data Stream"
    ],
    "inputFormat": "A stream of daily stock price calls to next(price)",
    "outputFormat": "The span of that stock's price for the current day",
    "referenceUrl": "https://leetcode.com/problems/online-stock-span/",
    "attribution": "Online stream processing with monotonic stack question in product interviews.",
    "description": "Design an algorithm that collects daily price quotes for some stock and returns the span of that stock's price for the current day. The span of the stock's price in one day is the maximum number of consecutive days (starting from that day and going backward) for which the stock price was less than or equal to the price of that day.",
    "constraints": [
      "1 <= price <= 10^5",
      "At most 10^4 calls will be made to next."
    ],
    "examples": [
      {
        "input": "[\"StockSpanner\", \"next\", \"next\", \"next\", \"next\", \"next\", \"next\", \"next\"], [[], [100], [80], [60], [70], [60], [75], [85]]",
        "output": "[null, 1, 1, 1, 2, 1, 4, 6]",
        "explanation": "Consecutive days prices were <= current price."
      },
      {
        "input": "prices = [31, 41, 48, 59, 79]",
        "output": "[1, 2, 3, 4, 5]",
        "explanation": "Monotonically increasing series produces consecutive increasing spans."
      }
    ],
    "testCases": [
      {
        "input": "[100, 80, 60, 70, 60, 75, 85]",
        "expectedOutput": "[1, 1, 1, 2, 1, 4, 6]",
        "hidden": false
      },
      {
        "input": "[31, 41, 48, 59, 79]",
        "expectedOutput": "[1, 2, 3, 4, 5]",
        "hidden": false
      },
      {
        "input": "[50]",
        "expectedOutput": "[1]",
        "hidden": true
      },
      {
        "input": "[90, 80, 70, 60]",
        "expectedOutput": "[1, 1, 1, 1]",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class StockSpanner {\npublic:\n    StockSpanner() {}\n    int next(int price) {\n        // Write your solution here\n        return 1;\n    }\n};",
      "java": "class StockSpanner {\n    public StockSpanner() {}\n    public int next(int price) {\n        // Write your solution here\n        return 1;\n    }\n}",
      "python": "class StockSpanner:\n    def __init__(self):\n        pass\n    def next(self, price: int) -> int:\n        # Write your solution here\n        pass",
      "javascript": "var StockSpanner = function() {};\nStockSpanner.prototype.next = function(price) {\n    // Write your solution here\n    return 1;\n};"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  }
];
export default stacksQueuesQuestions;
