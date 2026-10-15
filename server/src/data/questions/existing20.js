export const existing20Questions = [
  {
    "id": "cq_1",
    "slug": "two-sum",
    "title": "Two Sum",
    "difficulty": "Easy",
    "topic": "Arrays",
    "tags": [
      "Array",
      "Hash Table"
    ],
    "inputFormat": "First line: array nums; Second line: integer target",
    "outputFormat": "Array of two integer indices [index1, index2]",
    "referenceUrl": "https://leetcode.com/problems/two-sum/",
    "attribution": "Standard interview problem frequently featured in Amazon, Google, Microsoft, and service-based drives.",
    "description": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input has exactly one solution, and you may not use the same element twice.",
    "constraints": [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists."
    ],
    "examples": [
      {
        "input": "nums = [2, 7, 11, 15], target = 9",
        "output": "[0, 1]",
        "explanation": "Because nums[0] + nums[1] == 9, we return [0, 1]."
      },
      {
        "input": "nums = [3, 2, 4], target = 6",
        "output": "[1, 2]",
        "explanation": "nums[1] + nums[2] == 6, so we return [1, 2]."
      }
    ],
    "testCases": [
      {
        "input": "[2, 7, 11, 15], 9",
        "expectedOutput": "[0, 1]",
        "hidden": false
      },
      {
        "input": "[3, 2, 4], 6",
        "expectedOutput": "[1, 2]",
        "hidden": false
      },
      {
        "input": "[3, 3], 6",
        "expectedOutput": "[0, 1]",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Write your solution here\n        return {};\n    }\n};",
      "java": "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your solution here\n        return new int[]{};\n    }\n}",
      "python": "class Solution:\n    def twoSum(self, nums: list[int], target: int) -> list[int]:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction twoSum(nums, target) {\n    // Write your solution here\n    return [];\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  },
  {
    "id": "cq_2",
    "slug": "valid-palindrome",
    "title": "Valid Palindrome",
    "difficulty": "Easy",
    "topic": "Strings",
    "tags": [
      "Two Pointers",
      "String"
    ],
    "inputFormat": "A string s containing ASCII characters",
    "outputFormat": "Boolean true if palindrome, false otherwise",
    "referenceUrl": "https://leetcode.com/problems/valid-palindrome/",
    "attribution": "Standard interview problem frequently featured in TCS, Infosys, and Cognizant assessments.",
    "description": "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Given a string s, return true if it is a palindrome, or false otherwise.",
    "constraints": [
      "1 <= s.length <= 2 * 10^5",
      "s consists only of printable ASCII characters."
    ],
    "examples": [
      {
        "input": "s = \"A man, a plan, a canal: Panama\"",
        "output": "true",
        "explanation": "\"amanaplanacanalpanama\" is a palindrome."
      },
      {
        "input": "s = \"race a car\"",
        "output": "false",
        "explanation": "\"raceacar\" is not a palindrome."
      }
    ],
    "testCases": [
      {
        "input": "\"A man, a plan, a canal: Panama\"",
        "expectedOutput": "true",
        "hidden": false
      },
      {
        "input": "\"race a car\"",
        "expectedOutput": "false",
        "hidden": false
      },
      {
        "input": "\" \"",
        "expectedOutput": "true",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    bool isPalindrome(string s) {\n        // Write your solution here\n        return false;\n    }\n};",
      "java": "class Solution {\n    public boolean isPalindrome(String s) {\n        // Write your solution here\n        return false;\n    }\n}",
      "python": "class Solution:\n    def isPalindrome(self, s: str) -> bool:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {string} s\n * @return {boolean}\n */\nfunction isPalindrome(s) {\n    // Write your solution here\n    return false;\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  },
  {
    "id": "cq_3",
    "slug": "valid-parentheses",
    "title": "Valid Parentheses",
    "difficulty": "Easy",
    "topic": "Stack",
    "tags": [
      "Stack",
      "String"
    ],
    "inputFormat": "A string s containing parentheses characters",
    "outputFormat": "Boolean true if valid, false otherwise",
    "referenceUrl": "https://leetcode.com/problems/valid-parentheses/",
    "attribution": "Classic stack evaluation pattern documented on GeeksforGeeks and LeetCode.",
    "description": "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if open brackets are closed by the same type of brackets, and brackets are closed in the correct order.",
    "constraints": [
      "1 <= s.length <= 10^4",
      "s consists of parentheses only '()[]{}'."
    ],
    "examples": [
      {
        "input": "s = \"()\"",
        "output": "true",
        "explanation": "Simple matched round brackets."
      },
      {
        "input": "s = \"()[]{}\"",
        "output": "true",
        "explanation": "Sequentially paired brackets."
      },
      {
        "input": "s = \"(]\"",
        "output": "false",
        "explanation": "Mismatched closing bracket type."
      }
    ],
    "testCases": [
      {
        "input": "\"()\"",
        "expectedOutput": "true",
        "hidden": false
      },
      {
        "input": "\"()[]{}\"",
        "expectedOutput": "true",
        "hidden": false
      },
      {
        "input": "\"([)]\"",
        "expectedOutput": "false",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    bool isValid(string s) {\n        // Write your solution here\n        return false;\n    }\n};",
      "java": "class Solution {\n    public boolean isValid(String s) {\n        // Write your solution here\n        return false;\n    }\n}",
      "python": "class Solution:\n    def isValid(self, s: str) -> bool:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {string} s\n * @return {boolean}\n */\nfunction isValid(s) {\n    // Write your solution here\n    return false;\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  },
  {
    "id": "cq_4",
    "slug": "best-time-to-buy-and-sell-stock",
    "title": "Best Time to Buy and Sell Stock",
    "difficulty": "Easy",
    "topic": "Arrays",
    "tags": [
      "Array",
      "Dynamic Programming",
      "Greedy"
    ],
    "inputFormat": "Array of integer stock prices",
    "outputFormat": "Maximum integer profit obtainable",
    "referenceUrl": "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
    "attribution": "Classic single-pass interview problem common in campus recruitment drives.",
    "description": "You are given an array prices where prices[i] is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock. Return the maximum profit you can achieve. If no profit can be made, return 0.",
    "constraints": [
      "1 <= prices.length <= 10^5",
      "0 <= prices[i] <= 10^4"
    ],
    "examples": [
      {
        "input": "prices = [7, 1, 5, 3, 6, 4]",
        "output": "5",
        "explanation": "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6 - 1 = 5."
      },
      {
        "input": "prices = [7, 6, 4, 3, 1]",
        "output": "0",
        "explanation": "In this case, no transactions are done and max profit = 0."
      }
    ],
    "testCases": [
      {
        "input": "[7, 1, 5, 3, 6, 4]",
        "expectedOutput": "5",
        "hidden": false
      },
      {
        "input": "[7, 6, 4, 3, 1]",
        "expectedOutput": "0",
        "hidden": false
      },
      {
        "input": "[2, 4, 1]",
        "expectedOutput": "2",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    int maxProfit(vector<int>& prices) {\n        // Write your solution here\n        return 0;\n    }\n};",
      "java": "class Solution {\n    public int maxProfit(int[] prices) {\n        // Write your solution here\n        return 0;\n    }\n}",
      "python": "class Solution:\n    def maxProfit(self, prices: list[int]) -> int:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {number[]} prices\n * @return {number}\n */\nfunction maxProfit(prices) {\n    // Write your solution here\n    return 0;\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  },
  {
    "id": "cq_5",
    "slug": "binary-search",
    "title": "Binary Search",
    "difficulty": "Easy",
    "topic": "Binary Search",
    "tags": [
      "Array",
      "Binary Search"
    ],
    "inputFormat": "Sorted array nums and target value",
    "outputFormat": "Integer index of target or -1 if not found",
    "referenceUrl": "https://leetcode.com/problems/binary-search/",
    "attribution": "Foundational algorithmic search pattern referenced in GeeksforGeeks and NeetCode.",
    "description": "Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1. You must write an algorithm with O(log n) runtime complexity.",
    "constraints": [
      "1 <= nums.length <= 10^4",
      "-10^4 < nums[i], target < 10^4",
      "All elements in nums are unique and sorted in ascending order."
    ],
    "examples": [
      {
        "input": "nums = [-1, 0, 3, 5, 9, 12], target = 9",
        "output": "4",
        "explanation": "9 exists in nums and its index is 4."
      },
      {
        "input": "nums = [-1, 0, 3, 5, 9, 12], target = 2",
        "output": "-1",
        "explanation": "2 does not exist in nums so return -1."
      }
    ],
    "testCases": [
      {
        "input": "[-1, 0, 3, 5, 9, 12], 9",
        "expectedOutput": "4",
        "hidden": false
      },
      {
        "input": "[-1, 0, 3, 5, 9, 12], 2",
        "expectedOutput": "-1",
        "hidden": false
      },
      {
        "input": "[5], 5",
        "expectedOutput": "0",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        // Write your solution here\n        return -1;\n    }\n};",
      "java": "class Solution {\n    public int search(int[] nums, int target) {\n        // Write your solution here\n        return -1;\n    }\n}",
      "python": "class Solution:\n    def search(self, nums: list[int], target: int) -> int:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number}\n */\nfunction search(nums, target) {\n    // Write your solution here\n    return -1;\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  },
  {
    "id": "cq_6",
    "slug": "reverse-linked-list",
    "title": "Reverse Linked List",
    "difficulty": "Easy",
    "topic": "Linked List",
    "tags": [
      "Linked List",
      "Recursion"
    ],
    "inputFormat": "Head node of a singly linked list",
    "outputFormat": "Head node of the reversed singly linked list",
    "referenceUrl": "https://leetcode.com/problems/reverse-linked-list/",
    "attribution": "Essential pointer manipulation question asked in virtually every technical interview.",
    "description": "Given the head of a singly linked list, reverse the list, and return the reversed list.",
    "constraints": [
      "The number of nodes in the list is the range [0, 5000].",
      "-5000 <= Node.val <= 5000"
    ],
    "examples": [
      {
        "input": "head = [1, 2, 3, 4, 5]",
        "output": "[5, 4, 3, 2, 1]",
        "explanation": "The linked list nodes are reversed in order."
      },
      {
        "input": "head = [1, 2]",
        "output": "[2, 1]",
        "explanation": "Two node linked list reversal."
      }
    ],
    "testCases": [
      {
        "input": "[1, 2, 3, 4, 5]",
        "expectedOutput": "[5, 4, 3, 2, 1]",
        "hidden": false
      },
      {
        "input": "[1, 2]",
        "expectedOutput": "[2, 1]",
        "hidden": false
      },
      {
        "input": "[]",
        "expectedOutput": "[]",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "/**\n * Definition for singly-linked list.\n * struct ListNode {\n *     int val;\n *     ListNode *next;\n *     ListNode(int x) : val(x), next(NULL) {}\n * };\n */\nclass Solution {\npublic:\n    ListNode* reverseList(ListNode* head) {\n        // Write your solution here\n        return nullptr;\n    }\n};",
      "java": "/**\n * Definition for singly-linked list.\n * public class ListNode {\n *     int val;\n *     ListNode next;\n *     ListNode(int x) { val = x; }\n * }\n */\nclass Solution {\n    public ListNode reverseList(ListNode head) {\n        // Write your solution here\n        return null;\n    }\n}",
      "python": "class Solution:\n    def reverseList(self, head):\n        # Write your solution here\n        pass",
      "javascript": "/**\n * Definition for singly-linked list.\n * function ListNode(val, next) {\n *     this.val = (val===undefined ? 0 : val)\n *     this.next = (next===undefined ? null : next)\n * }\n */\nfunction reverseList(head) {\n    // Write your solution here\n    return null;\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  },
  {
    "id": "cq_7",
    "slug": "climbing-stairs",
    "title": "Climbing Stairs",
    "difficulty": "Easy",
    "topic": "Dynamic Programming",
    "tags": [
      "Math",
      "Dynamic Programming",
      "Memoization"
    ],
    "inputFormat": "Integer n representing number of steps",
    "outputFormat": "Integer representing distinct ways to reach top",
    "referenceUrl": "https://leetcode.com/problems/climbing-stairs/",
    "attribution": "Introductory 1D dynamic programming problem referenced on GeeksforGeeks.",
    "description": "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    "constraints": [
      "1 <= n <= 45"
    ],
    "examples": [
      {
        "input": "n = 2",
        "output": "2",
        "explanation": "There are two ways: 1 step + 1 step, or 2 steps."
      },
      {
        "input": "n = 3",
        "output": "3",
        "explanation": "Three ways: 1+1+1, 1+2, or 2+1."
      }
    ],
    "testCases": [
      {
        "input": "2",
        "expectedOutput": "2",
        "hidden": false
      },
      {
        "input": "3",
        "expectedOutput": "3",
        "hidden": false
      },
      {
        "input": "5",
        "expectedOutput": "8",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    int climbStairs(int n) {\n        // Write your solution here\n        return 0;\n    }\n};",
      "java": "class Solution {\n    public int climbStairs(int n) {\n        // Write your solution here\n        return 0;\n    }\n}",
      "python": "class Solution:\n    def climbStairs(self, n: int) -> int:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {number} n\n * @return {number}\n */\nfunction climbStairs(n) {\n    // Write your solution here\n    return 0;\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  },
  {
    "id": "cq_8",
    "slug": "implement-queue-using-stacks",
    "title": "Implement Queue using Stacks",
    "difficulty": "Easy",
    "topic": "Queue",
    "tags": [
      "Stack",
      "Design",
      "Queue"
    ],
    "inputFormat": "Sequence of push, pop, peek, and empty operations",
    "outputFormat": "Outputs corresponding to each queue operation",
    "referenceUrl": "https://leetcode.com/problems/implement-queue-using-stacks/",
    "attribution": "Fundamental data structure design problem common in product company rounds.",
    "description": "Implement a first in first out (FIFO) queue using only two stacks. The implemented queue should support all the functions of a normal queue (push, peek, pop, and empty).",
    "constraints": [
      "1 <= x <= 9",
      "At most 100 calls will be made to push, pop, peek, and empty.",
      "All the calls to pop and peek are valid."
    ],
    "examples": [
      {
        "input": "[\"MyQueue\", \"push\", \"push\", \"peek\", \"pop\", \"empty\"]\n[[], [1], [2], [], [], []]",
        "output": "[null, null, null, 1, 1, false]",
        "explanation": "MyQueue myQueue = new MyQueue(); myQueue.push(1); myQueue.push(2); myQueue.peek(); // return 1"
      }
    ],
    "testCases": [
      {
        "input": "push(1), push(2), peek()",
        "expectedOutput": "1",
        "hidden": false
      },
      {
        "input": "push(1), pop()",
        "expectedOutput": "1",
        "hidden": false
      },
      {
        "input": "empty()",
        "expectedOutput": "true",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class MyQueue {\npublic:\n    MyQueue() {}\n    void push(int x) {}\n    int pop() { return 0; }\n    int peek() { return 0; }\n    bool empty() { return true; }\n};",
      "java": "class MyQueue {\n    public MyQueue() {}\n    public void push(int x) {}\n    public int pop() { return 0; }\n    public int peek() { return 0; }\n    public boolean empty() { return true; }\n}",
      "python": "class MyQueue:\n    def __init__(self):\n        pass\n    def push(self, x: int) -> None:\n        pass\n    def pop(self) -> int:\n        pass\n    def peek(self) -> int:\n        pass\n    def empty(self) -> bool:\n        pass",
      "javascript": "class MyQueue {\n    constructor() {}\n    push(x) {}\n    pop() { return 0; }\n    peek() { return 0; }\n    empty() { return true; }\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  },
  {
    "id": "cq_9",
    "slug": "maximum-subarray",
    "title": "Maximum Subarray",
    "difficulty": "Medium",
    "topic": "Arrays",
    "tags": [
      "Array",
      "Divide and Conquer",
      "Dynamic Programming",
      "Kadanes Algorithm"
    ],
    "inputFormat": "Array of integers nums",
    "outputFormat": "Integer representing maximum contiguous subarray sum",
    "referenceUrl": "https://leetcode.com/problems/maximum-subarray/",
    "attribution": "Kadane algorithm benchmark asked across product and service-based recruitment.",
    "description": "Given an integer array nums, find the subarray with the largest sum, and return its sum. A subarray is a contiguous non-empty sequence of elements within an array.",
    "constraints": [
      "1 <= nums.length <= 10^5",
      "-10^4 <= nums[i] <= 10^4"
    ],
    "examples": [
      {
        "input": "nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]",
        "output": "6",
        "explanation": "The subarray [4, -1, 2, 1] has the largest sum 6."
      },
      {
        "input": "nums = [1]",
        "output": "1",
        "explanation": "The subarray [1] has the largest sum 1."
      },
      {
        "input": "nums = [5, 4, -1, 7, 8]",
        "output": "23",
        "explanation": "The subarray [5, 4, -1, 7, 8] has the largest sum 23."
      }
    ],
    "testCases": [
      {
        "input": "[-2, 1, -3, 4, -1, 2, 1, -5, 4]",
        "expectedOutput": "6",
        "hidden": false
      },
      {
        "input": "[1]",
        "expectedOutput": "1",
        "hidden": false
      },
      {
        "input": "[5, 4, -1, 7, 8]",
        "expectedOutput": "23",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    int maxSubArray(vector<int>& nums) {\n        // Write your solution here\n        return 0;\n    }\n};",
      "java": "class Solution {\n    public int maxSubArray(int[] nums) {\n        // Write your solution here\n        return 0;\n    }\n}",
      "python": "class Solution:\n    def maxSubArray(self, nums: list[int]) -> int:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction maxSubArray(nums) {\n    // Write your solution here\n    return 0;\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  },
  {
    "id": "cq_10",
    "slug": "longest-substring-without-repeating-characters",
    "title": "Longest Substring Without Repeating Characters",
    "difficulty": "Medium",
    "topic": "Strings",
    "tags": [
      "Hash Table",
      "String",
      "Sliding Window"
    ],
    "inputFormat": "A string s",
    "outputFormat": "Integer length of longest substring without duplicates",
    "referenceUrl": "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
    "attribution": "Core sliding window pattern question featured in top tech company evaluations.",
    "description": "Given a string s, find the length of the longest substring without repeating characters.",
    "constraints": [
      "0 <= s.length <= 5 * 10^4",
      "s consists of English letters, digits, symbols and spaces."
    ],
    "examples": [
      {
        "input": "s = \"abcabcbb\"",
        "output": "3",
        "explanation": "The answer is \"abc\", with the length of 3."
      },
      {
        "input": "s = \"bbbbb\"",
        "output": "1",
        "explanation": "The answer is \"b\", with the length of 1."
      },
      {
        "input": "s = \"pwwkew\"",
        "output": "3",
        "explanation": "The answer is \"wke\", with the length of 3."
      }
    ],
    "testCases": [
      {
        "input": "\"abcabcbb\"",
        "expectedOutput": "3",
        "hidden": false
      },
      {
        "input": "\"bbbbb\"",
        "expectedOutput": "1",
        "hidden": false
      },
      {
        "input": "\"pwwkew\"",
        "expectedOutput": "3",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        // Write your solution here\n        return 0;\n    }\n};",
      "java": "class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        // Write your solution here\n        return 0;\n    }\n}",
      "python": "class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {string} s\n * @return {number}\n */\nfunction lengthOfLongestSubstring(s) {\n    // Write your solution here\n    return 0;\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  },
  {
    "id": "cq_11",
    "slug": "container-with-most-water",
    "title": "Container With Most Water",
    "difficulty": "Medium",
    "topic": "Two Pointers",
    "tags": [
      "Array",
      "Two Pointers",
      "Greedy"
    ],
    "inputFormat": "Array of non-negative integer heights",
    "outputFormat": "Maximum integer water area",
    "referenceUrl": "https://leetcode.com/problems/container-with-most-water/",
    "attribution": "Classic two-pointer optimization problem documented on LeetCode and NeetCode.",
    "description": "You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]). Find two lines that together with the x-axis form a container, such that the container contains the most water. Return the maximum amount of water a container can store.",
    "constraints": [
      "n == height.length",
      "2 <= n <= 10^5",
      "0 <= height[i] <= 10^4"
    ],
    "examples": [
      {
        "input": "height = [1, 8, 6, 2, 5, 4, 8, 3, 7]",
        "output": "49",
        "explanation": "The max area is formed between line at index 1 and index 8."
      },
      {
        "input": "height = [1, 1]",
        "output": "1",
        "explanation": "Max area is 1 * 1 = 1."
      }
    ],
    "testCases": [
      {
        "input": "[1, 8, 6, 2, 5, 4, 8, 3, 7]",
        "expectedOutput": "49",
        "hidden": false
      },
      {
        "input": "[1, 1]",
        "expectedOutput": "1",
        "hidden": false
      },
      {
        "input": "[4, 3, 2, 1, 4]",
        "expectedOutput": "16",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    int maxArea(vector<int>& height) {\n        // Write your solution here\n        return 0;\n    }\n};",
      "java": "class Solution {\n    public int maxArea(int[] height) {\n        // Write your solution here\n        return 0;\n    }\n}",
      "python": "class Solution:\n    def maxArea(self, height: list[int]) -> int:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {number[]} height\n * @return {number}\n */\nfunction maxArea(height) {\n    // Write your solution here\n    return 0;\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  },
  {
    "id": "cq_12",
    "slug": "3sum",
    "title": "3Sum",
    "difficulty": "Medium",
    "topic": "Two Pointers",
    "tags": [
      "Array",
      "Two Pointers",
      "Sorting"
    ],
    "inputFormat": "Array of integers nums",
    "outputFormat": "List of all unique triplets [nums[i], nums[j], nums[k]] summing to 0",
    "referenceUrl": "https://leetcode.com/problems/3sum/",
    "attribution": "High-frequency interview question testing sorting and two-pointer traversal.",
    "description": "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0. Notice that the solution set must not contain duplicate triplets.",
    "constraints": [
      "3 <= nums.length <= 3000",
      "-10^5 <= nums[i] <= 10^5"
    ],
    "examples": [
      {
        "input": "nums = [-1, 0, 1, 2, -1, -4]",
        "output": "[[-1, -1, 2], [-1, 0, 1]]",
        "explanation": "The distinct triplets that sum to 0 are [-1, 0, 1] and [-1, -1, 2]."
      },
      {
        "input": "nums = [0, 1, 1]",
        "output": "[]",
        "explanation": "No triplets sum up to 0."
      }
    ],
    "testCases": [
      {
        "input": "[-1, 0, 1, 2, -1, -4]",
        "expectedOutput": "[[-1, -1, 2], [-1, 0, 1]]",
        "hidden": false
      },
      {
        "input": "[0, 1, 1]",
        "expectedOutput": "[]",
        "hidden": false
      },
      {
        "input": "[0, 0, 0]",
        "expectedOutput": "[[0, 0, 0]]",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    vector<vector<int>> threeSum(vector<int>& nums) {\n        // Write your solution here\n        return {};\n    }\n};",
      "java": "class Solution {\n    public List<List<Integer>> threeSum(int[] nums) {\n        // Write your solution here\n        return new ArrayList<>();\n    }\n}",
      "python": "class Solution:\n    def threeSum(self, nums: list[int]) -> list[list[int]]:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {number[]} nums\n * @return {number[][]}\n */\nfunction threeSum(nums) {\n    // Write your solution here\n    return [];\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  },
  {
    "id": "cq_13",
    "slug": "search-in-rotated-sorted-array",
    "title": "Search in Rotated Sorted Array",
    "difficulty": "Medium",
    "topic": "Binary Search",
    "tags": [
      "Array",
      "Binary Search"
    ],
    "inputFormat": "Rotated sorted array nums and target integer",
    "outputFormat": "Integer index of target or -1 if not found",
    "referenceUrl": "https://leetcode.com/problems/search-in-rotated-sorted-array/",
    "attribution": "Modified binary search problem frequently tested in product company assessments.",
    "description": "There is an integer array nums sorted in ascending order (with distinct values). Prior to being passed to your function, nums is possibly rotated at an unknown pivot index k. Given the array nums after the possible rotation and an integer target, return the index of target if it is in nums, or -1 if it is not in nums. You must write an algorithm with O(log n) runtime complexity.",
    "constraints": [
      "1 <= nums.length <= 5000",
      "-10^4 <= nums[i] <= 10^4",
      "All values of nums are unique.",
      "-10^4 <= target <= 10^4"
    ],
    "examples": [
      {
        "input": "nums = [4, 5, 6, 7, 0, 1, 2], target = 0",
        "output": "4",
        "explanation": "0 is at index 4."
      },
      {
        "input": "nums = [4, 5, 6, 7, 0, 1, 2], target = 3",
        "output": "-1",
        "explanation": "3 is not in nums."
      }
    ],
    "testCases": [
      {
        "input": "[4, 5, 6, 7, 0, 1, 2], 0",
        "expectedOutput": "4",
        "hidden": false
      },
      {
        "input": "[4, 5, 6, 7, 0, 1, 2], 3",
        "expectedOutput": "-1",
        "hidden": false
      },
      {
        "input": "[1], 0",
        "expectedOutput": "-1",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        // Write your solution here\n        return -1;\n    }\n};",
      "java": "class Solution {\n    public int search(int[] nums, int target) {\n        // Write your solution here\n        return -1;\n    }\n}",
      "python": "class Solution:\n    def search(self, nums: list[int], target: int) -> int:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number}\n */\nfunction search(nums, target) {\n    // Write your solution here\n    return -1;\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  },
  {
    "id": "cq_14",
    "slug": "min-stack",
    "title": "Min Stack",
    "difficulty": "Medium",
    "topic": "Stack",
    "tags": [
      "Stack",
      "Design"
    ],
    "inputFormat": "Sequence of push, pop, top, and getMin method calls",
    "outputFormat": "Return values of respective method calls",
    "referenceUrl": "https://leetcode.com/problems/min-stack/",
    "attribution": "Auxiliary stack tracking pattern frequently asked in system design and DSA rounds.",
    "description": "Design a stack that supports push, pop, top, and retrieving the minimum element in constant time O(1). Implement the MinStack class with push(val), pop(), top(), and getMin() methods.",
    "constraints": [
      "-2^31 <= val <= 2^31 - 1",
      "Methods pop, top and getMin operations will always be called on non-empty stacks.",
      "At most 3 * 10^4 calls will be made to push, pop, top, and getMin."
    ],
    "examples": [
      {
        "input": "[\"MinStack\",\"push\",\"push\",\"push\",\"getMin\",\"pop\",\"top\",\"getMin\"]\n[[],[-2],[0],[-3],[],[],[],[]]",
        "output": "[null,null,null,null,-3,null,0,-2]",
        "explanation": "MinStack minStack = new MinStack(); minStack.push(-2); minStack.push(0); minStack.push(-3); minStack.getMin(); // return -3"
      }
    ],
    "testCases": [
      {
        "input": "push(-2), push(0), push(-3), getMin()",
        "expectedOutput": "-3",
        "hidden": false
      },
      {
        "input": "push(1), top()",
        "expectedOutput": "1",
        "hidden": false
      },
      {
        "input": "push(-1), push(2), pop(), getMin()",
        "expectedOutput": "-1",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class MinStack {\npublic:\n    MinStack() {}\n    void push(int val) {}\n    void pop() {}\n    int top() { return 0; }\n    int getMin() { return 0; }\n};",
      "java": "class MinStack {\n    public MinStack() {}\n    public void push(int val) {}\n    public void pop() {}\n    public int top() { return 0; }\n    public int getMin() { return 0; }\n}",
      "python": "class MinStack:\n    def __init__(self):\n        pass\n    def push(self, val: int) -> None:\n        pass\n    def pop(self) -> None:\n        pass\n    def top() -> int:\n        pass\n    def getMin() -> int:\n        pass",
      "javascript": "class MinStack {\n    constructor() {}\n    push(val) {}\n    pop() {}\n    top() { return 0; }\n    getMin() { return 0; }\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  },
  {
    "id": "cq_15",
    "slug": "top-k-frequent-elements",
    "title": "Top K Frequent Elements",
    "difficulty": "Medium",
    "topic": "Hashing",
    "tags": [
      "Array",
      "Hash Table",
      "Heap",
      "Sorting"
    ],
    "inputFormat": "Array nums and integer k",
    "outputFormat": "Array of k most frequent elements",
    "referenceUrl": "https://leetcode.com/problems/top-k-frequent-elements/",
    "attribution": "Heap and frequency mapping pattern frequent in placement drives.",
    "description": "Given an integer array nums and an integer k, return the k most frequent elements. You may return the answer in any order.",
    "constraints": [
      "1 <= nums.length <= 10^5",
      "-10^4 <= nums[i] <= 10^4",
      "k is in the range [1, the number of unique elements in the array].",
      "It is guaranteed that the answer is unique."
    ],
    "examples": [
      {
        "input": "nums = [1, 1, 1, 2, 2, 3], k = 2",
        "output": "[1, 2]",
        "explanation": "1 occurs 3 times and 2 occurs 2 times."
      },
      {
        "input": "nums = [1], k = 1",
        "output": "[1]",
        "explanation": "Only element 1 appears once."
      }
    ],
    "testCases": [
      {
        "input": "[1, 1, 1, 2, 2, 3], 2",
        "expectedOutput": "[1, 2]",
        "hidden": false
      },
      {
        "input": "[1], 1",
        "expectedOutput": "[1]",
        "hidden": false
      },
      {
        "input": "[4, 1, -1, 2, -1, 2, 3], 2",
        "expectedOutput": "[-1, 2]",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    vector<int> topKFrequent(vector<int>& nums, int k) {\n        // Write your solution here\n        return {};\n    }\n};",
      "java": "class Solution {\n    public int[] topKFrequent(int[] nums, int k) {\n        // Write your solution here\n        return new int[]{};\n    }\n}",
      "python": "class Solution:\n    def topKFrequent(self, nums: list[int], k: int) -> list[int]:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {number[]} nums\n * @param {number} k\n * @return {number[]}\n */\nfunction topKFrequent(nums, k) {\n    // Write your solution here\n    return [];\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  },
  {
    "id": "cq_16",
    "slug": "group-anagrams",
    "title": "Group Anagrams",
    "difficulty": "Medium",
    "topic": "Hashing",
    "tags": [
      "Array",
      "Hash Table",
      "String",
      "Sorting"
    ],
    "inputFormat": "Array of strings strs",
    "outputFormat": "2D array of grouped anagram strings",
    "referenceUrl": "https://leetcode.com/problems/group-anagrams/",
    "attribution": "Hashing and canonical string representation pattern on LeetCode and NeetCode.",
    "description": "Given an array of strings strs, group the anagrams together. You can return the answer in any order. An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.",
    "constraints": [
      "1 <= strs.length <= 10^4",
      "0 <= strs[i].length <= 100",
      "strs[i] consists of lowercase English letters."
    ],
    "examples": [
      {
        "input": "strs = [\"eat\", \"tea\", \"tan\", \"ate\", \"nat\", \"bat\"]",
        "output": "[[\"bat\"], [\"nat\", \"tan\"], [\"ate\", \"eat\", \"tea\"]]",
        "explanation": "Words with identical character frequencies are grouped."
      },
      {
        "input": "strs = [\"\"]",
        "output": "[[\"\"]]",
        "explanation": "Single empty string is an anagram of itself."
      }
    ],
    "testCases": [
      {
        "input": "[\"eat\", \"tea\", \"tan\", \"ate\", \"nat\", \"bat\"]",
        "expectedOutput": "[[\"bat\"], [\"nat\", \"tan\"], [\"ate\", \"eat\", \"tea\"]]",
        "hidden": false
      },
      {
        "input": "[\"\"]",
        "expectedOutput": "[[\"\"]]",
        "hidden": false
      },
      {
        "input": "[\"a\"]",
        "expectedOutput": "[[\"a\"]]",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    vector<vector<string>> groupAnagrams(vector<string>& strs) {\n        // Write your solution here\n        return {};\n    }\n};",
      "java": "class Solution {\n    public List<List<String>> groupAnagrams(String[] strs) {\n        // Write your solution here\n        return new ArrayList<>();\n    }\n}",
      "python": "class Solution:\n    def groupAnagrams(self, strs: list[str]) -> list[list[str]]:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {string[]} strs\n * @return {string[][]}\n */\nfunction groupAnagrams(strs) {\n    // Write your solution here\n    return [];\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  },
  {
    "id": "cq_17",
    "slug": "coin-change",
    "title": "Coin Change",
    "difficulty": "Medium",
    "topic": "Dynamic Programming",
    "tags": [
      "Array",
      "Dynamic Programming",
      "Breadth-First Search"
    ],
    "inputFormat": "Array of coin denominations and total integer amount",
    "outputFormat": "Fewest number of coins needed, or -1 if impossible",
    "referenceUrl": "https://leetcode.com/problems/coin-change/",
    "attribution": "Unbounded knapsack dynamic programming problem popular in interview rounds.",
    "description": "You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money. Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1. You may assume that you have an infinite number of each kind of coin.",
    "constraints": [
      "1 <= coins.length <= 12",
      "1 <= coins[i] <= 2^31 - 1",
      "0 <= amount <= 10^4"
    ],
    "examples": [
      {
        "input": "coins = [1, 2, 5], amount = 11",
        "output": "3",
        "explanation": "11 = 5 + 5 + 1 (3 coins)"
      },
      {
        "input": "coins = [2], amount = 3",
        "output": "-1",
        "explanation": "Amount 3 cannot be formed using denomination 2."
      },
      {
        "input": "coins = [1], amount = 0",
        "output": "0",
        "explanation": "0 amount requires 0 coins."
      }
    ],
    "testCases": [
      {
        "input": "[1, 2, 5], 11",
        "expectedOutput": "3",
        "hidden": false
      },
      {
        "input": "[2], 3",
        "expectedOutput": "-1",
        "hidden": false
      },
      {
        "input": "[1], 0",
        "expectedOutput": "0",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    int coinChange(vector<int>& coins, int amount) {\n        // Write your solution here\n        return -1;\n    }\n};",
      "java": "class Solution {\n    public int coinChange(int[] coins, int amount) {\n        // Write your solution here\n        return -1;\n    }\n}",
      "python": "class Solution:\n    def coinChange(self, coins: list[int], amount: int) -> int:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {number[]} coins\n * @param {number} amount\n * @return {number}\n */\nfunction coinChange(coins, amount) {\n    // Write your solution here\n    return -1;\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  },
  {
    "id": "cq_18",
    "slug": "subsets",
    "title": "Subsets",
    "difficulty": "Medium",
    "topic": "Recursion",
    "tags": [
      "Array",
      "Backtracking",
      "Bit Manipulation"
    ],
    "inputFormat": "Array of unique integers nums",
    "outputFormat": "List of all possible subsets (the power set)",
    "referenceUrl": "https://leetcode.com/problems/subsets/",
    "attribution": "Essential backtracking and combinatorial exploration pattern.",
    "description": "Given an integer array nums of unique elements, return all possible subsets (the power set). The solution set must not contain duplicate subsets. Return the solution in any order.",
    "constraints": [
      "1 <= nums.length <= 10",
      "-10 <= nums[i] <= 10",
      "All the numbers of nums are unique."
    ],
    "examples": [
      {
        "input": "nums = [1, 2, 3]",
        "output": "[[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]]",
        "explanation": "All combinations of elements are returned."
      },
      {
        "input": "nums = [0]",
        "output": "[[], [0]]",
        "explanation": "Two subsets for a single element."
      }
    ],
    "testCases": [
      {
        "input": "[1, 2, 3]",
        "expectedOutput": "[[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]]",
        "hidden": false
      },
      {
        "input": "[0]",
        "expectedOutput": "[[], [0]]",
        "hidden": false
      },
      {
        "input": "[1, 2]",
        "expectedOutput": "[[], [1], [2], [1, 2]]",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    vector<vector<int>> subsets(vector<int>& nums) {\n        // Write your solution here\n        return {};\n    }\n};",
      "java": "class Solution {\n    public List<List<Integer>> subsets(int[] nums) {\n        // Write your solution here\n        return new ArrayList<>();\n    }\n}",
      "python": "class Solution:\n    def subsets(self, nums: list[int]) -> list[list[int]]:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {number[]} nums\n * @return {number[][]}\n */\nfunction subsets(nums) {\n    // Write your solution here\n    return [];\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  },
  {
    "id": "cq_19",
    "slug": "trapping-rain-water",
    "title": "Trapping Rain Water",
    "difficulty": "Hard",
    "topic": "Two Pointers",
    "tags": [
      "Array",
      "Two Pointers",
      "Dynamic Programming",
      "Stack",
      "Monotonic Stack"
    ],
    "inputFormat": "Array of non-negative integers representing elevation map",
    "outputFormat": "Total integer units of trapped water",
    "referenceUrl": "https://leetcode.com/problems/trapping-rain-water/",
    "attribution": "Hard-level algorithmic classic frequently tested by Google, Amazon, and Microsoft.",
    "description": "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
    "constraints": [
      "n == height.length",
      "1 <= n <= 2 * 10^4",
      "0 <= height[i] <= 10^5"
    ],
    "examples": [
      {
        "input": "height = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]",
        "output": "6",
        "explanation": "The above elevation map is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water are being trapped."
      },
      {
        "input": "height = [4, 2, 0, 3, 2, 5]",
        "output": "9",
        "explanation": "Water trapped across elevations sum up to 9."
      }
    ],
    "testCases": [
      {
        "input": "[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]",
        "expectedOutput": "6",
        "hidden": false
      },
      {
        "input": "[4, 2, 0, 3, 2, 5]",
        "expectedOutput": "9",
        "hidden": false
      },
      {
        "input": "[3, 0, 2, 0, 4]",
        "expectedOutput": "7",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    int trap(vector<int>& height) {\n        // Write your solution here\n        return 0;\n    }\n};",
      "java": "class Solution {\n    public int trap(int[] height) {\n        // Write your solution here\n        return 0;\n    }\n}",
      "python": "class Solution:\n    def trap(self, height: list[int]) -> int:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {number[]} height\n * @return {number}\n */\nfunction trap(height) {\n    // Write your solution here\n    return 0;\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  },
  {
    "id": "cq_20",
    "slug": "merge-k-sorted-lists",
    "title": "Merge k Sorted Lists",
    "difficulty": "Hard",
    "topic": "Linked List",
    "tags": [
      "Linked List",
      "Divide and Conquer",
      "Heap",
      "Merge Sort"
    ],
    "inputFormat": "Array of k linked lists, each sorted in ascending order",
    "outputFormat": "Head node of one consolidated sorted linked list",
    "referenceUrl": "https://leetcode.com/problems/merge-k-sorted-lists/",
    "attribution": "Hard-level priority-queue / divide-and-conquer classic across top engineering hiring.",
    "description": "You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.",
    "constraints": [
      "k == lists.length",
      "0 <= k <= 10^4",
      "0 <= lists[i].length <= 500",
      "-10^4 <= lists[i][j] <= 10^4",
      "lists[i] is sorted in ascending order."
    ],
    "examples": [
      {
        "input": "lists = [[1, 4, 5], [1, 3, 4], [2, 6]]",
        "output": "[1, 1, 2, 3, 4, 4, 5, 6]",
        "explanation": "The linked-lists are merged into one sorted list."
      },
      {
        "input": "lists = []",
        "output": "[]",
        "explanation": "No lists provided."
      }
    ],
    "testCases": [
      {
        "input": "[[1, 4, 5], [1, 3, 4], [2, 6]]",
        "expectedOutput": "[1, 1, 2, 3, 4, 4, 5, 6]",
        "hidden": false
      },
      {
        "input": "[]",
        "expectedOutput": "[]",
        "hidden": false
      },
      {
        "input": "[[]]",
        "expectedOutput": "[]",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    ListNode* mergeKLists(vector<ListNode*>& lists) {\n        // Write your solution here\n        return nullptr;\n    }\n};",
      "java": "class Solution {\n    public ListNode mergeKLists(ListNode[] lists) {\n        // Write your solution here\n        return null;\n    }\n}",
      "python": "class Solution:\n    def mergeKLists(self, lists):\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {ListNode[]} lists\n * @return {ListNode}\n */\nfunction mergeKLists(lists) {\n    // Write your solution here\n    return null;\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  }
];
export default existing20Questions;
