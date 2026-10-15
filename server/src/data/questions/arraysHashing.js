export const arraysHashingQuestions = [
  {
    "id": "cq_21",
    "slug": "contains-duplicate",
    "title": "Contains Duplicate",
    "difficulty": "Easy",
    "topic": "Arrays",
    "tags": [
      "Array",
      "Hash Table",
      "Sorting"
    ],
    "inputFormat": "An integer array nums",
    "outputFormat": "Boolean true if any value appears at least twice, false otherwise",
    "referenceUrl": "https://leetcode.com/problems/contains-duplicate/",
    "attribution": "High-frequency service and product company campus screening problem.",
    "description": "Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.",
    "constraints": [
      "1 <= nums.length <= 10^5",
      "-10^9 <= nums[i] <= 10^9"
    ],
    "examples": [
      {
        "input": "nums = [1, 2, 3, 1]",
        "output": "true",
        "explanation": "The value 1 appears at index 0 and index 3."
      },
      {
        "input": "nums = [1, 2, 3, 4]",
        "output": "false",
        "explanation": "All elements in the array are distinct."
      }
    ],
    "testCases": [
      {
        "input": "[1, 2, 3, 1]",
        "expectedOutput": "true",
        "hidden": false
      },
      {
        "input": "[1, 2, 3, 4]",
        "expectedOutput": "false",
        "hidden": false
      },
      {
        "input": "[1, 1, 1, 3, 3, 4, 3, 2, 4, 2]",
        "expectedOutput": "true",
        "hidden": true
      },
      {
        "input": "[0]",
        "expectedOutput": "false",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    bool containsDuplicate(vector<int>& nums) {\n        // Write your solution here\n        return false;\n    }\n};",
      "java": "class Solution {\n    public boolean containsDuplicate(int[] nums) {\n        // Write your solution here\n        return false;\n    }\n}",
      "python": "class Solution:\n    def containsDuplicate(self, nums: list[int]) -> bool:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {number[]} nums\n * @return {boolean}\n */\nfunction containsDuplicate(nums) {\n    // Write your solution here\n    return false;\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  },
  {
    "id": "cq_22",
    "slug": "majority-element",
    "title": "Majority Element",
    "difficulty": "Easy",
    "topic": "Arrays",
    "tags": [
      "Array",
      "Hash Table",
      "Divide and Conquer",
      "Boyer-Moore Voting"
    ],
    "inputFormat": "An array nums of size n",
    "outputFormat": "The majority element integer",
    "referenceUrl": "https://leetcode.com/problems/majority-element/",
    "attribution": "Classic Boyer-Moore Voting Algorithm interview benchmark.",
    "description": "Given an array nums of size n, return the majority element. The majority element is the element that appears more than ⌊n / 2⌋ times. You may assume that the majority element always exists in the array.",
    "constraints": [
      "n == nums.length",
      "1 <= n <= 5 * 10^4",
      "-10^9 <= nums[i] <= 10^9"
    ],
    "examples": [
      {
        "input": "nums = [3, 2, 3]",
        "output": "3",
        "explanation": "3 appears 2 times out of 3 elements, which is > 1.5."
      },
      {
        "input": "nums = [2, 2, 1, 1, 1, 2, 2]",
        "output": "2",
        "explanation": "2 appears 4 times out of 7 elements, which is > 3.5."
      }
    ],
    "testCases": [
      {
        "input": "[3, 2, 3]",
        "expectedOutput": "3",
        "hidden": false
      },
      {
        "input": "[2, 2, 1, 1, 1, 2, 2]",
        "expectedOutput": "2",
        "hidden": false
      },
      {
        "input": "[1]",
        "expectedOutput": "1",
        "hidden": true
      },
      {
        "input": "[6, 5, 5]",
        "expectedOutput": "5",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    int majorityElement(vector<int>& nums) {\n        // Write your solution here\n        return 0;\n    }\n};",
      "java": "class Solution {\n    public int majorityElement(int[] nums) {\n        // Write your solution here\n        return 0;\n    }\n}",
      "python": "class Solution:\n    def majorityElement(self, nums: list[int]) -> int:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction majorityElement(nums) {\n    // Write your solution here\n    return 0;\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  },
  {
    "id": "cq_23",
    "slug": "product-of-array-except-self",
    "title": "Product of Array Except Self",
    "difficulty": "Medium",
    "topic": "Arrays",
    "tags": [
      "Array",
      "Prefix Sum"
    ],
    "inputFormat": "An integer array nums",
    "outputFormat": "An integer array output such that output[i] is equal to product of all elements of nums except nums[i]",
    "referenceUrl": "https://leetcode.com/problems/product-of-array-except-self/",
    "attribution": "Top product company interview standard (Amazon, Microsoft, Meta).",
    "description": "Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i]. The product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer. You must write an algorithm that runs in O(n) time and without using the division operation.",
    "constraints": [
      "2 <= nums.length <= 10^5",
      "-30 <= nums[i] <= 30",
      "The product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer."
    ],
    "examples": [
      {
        "input": "nums = [1, 2, 3, 4]",
        "output": "[24, 12, 8, 6]",
        "explanation": "answer[0] = 2*3*4 = 24, answer[1] = 1*3*4 = 12, etc."
      },
      {
        "input": "nums = [-1, 1, 0, -3, 3]",
        "output": "[0, 0, 9, 0, 0]",
        "explanation": "Zero causes all other elements except index 2 to be 0."
      }
    ],
    "testCases": [
      {
        "input": "[1, 2, 3, 4]",
        "expectedOutput": "[24, 12, 8, 6]",
        "hidden": false
      },
      {
        "input": "[-1, 1, 0, -3, 3]",
        "expectedOutput": "[0, 0, 9, 0, 0]",
        "hidden": false
      },
      {
        "input": "[2, 3]",
        "expectedOutput": "[3, 2]",
        "hidden": true
      },
      {
        "input": "[0, 0]",
        "expectedOutput": "[0, 0]",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    vector<int> productExceptSelf(vector<int>& nums) {\n        // Write your solution here\n        return {};\n    }\n};",
      "java": "class Solution {\n    public int[] productExceptSelf(int[] nums) {\n        // Write your solution here\n        return new int[]{};\n    }\n}",
      "python": "class Solution:\n    def productExceptSelf(self, nums: list[int]) -> list[int]:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {number[]} nums\n * @return {number[]}\n */\nfunction productExceptSelf(nums) {\n    // Write your solution here\n    return [];\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  },
  {
    "id": "cq_24",
    "slug": "longest-consecutive-sequence",
    "title": "Longest Consecutive Sequence",
    "difficulty": "Medium",
    "topic": "Arrays",
    "tags": [
      "Array",
      "Hash Table",
      "Union Find"
    ],
    "inputFormat": "An unsorted array of integers nums",
    "outputFormat": "Length of the longest consecutive elements sequence",
    "referenceUrl": "https://leetcode.com/problems/longest-consecutive-sequence/",
    "attribution": "Classic O(n) hash set pattern featured across Tier-1 tech interviews.",
    "description": "Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence. You must write an algorithm that runs in O(n) time.",
    "constraints": [
      "0 <= nums.length <= 10^5",
      "-10^9 <= nums[i] <= 10^9"
    ],
    "examples": [
      {
        "input": "nums = [100, 4, 200, 1, 3, 2]",
        "output": "4",
        "explanation": "The longest consecutive elements sequence is [1, 2, 3, 4]. Its length is 4."
      },
      {
        "input": "nums = [0, 3, 7, 2, 5, 8, 4, 6, 0, 1]",
        "output": "9",
        "explanation": "The consecutive sequence from 0 through 8 has length 9."
      }
    ],
    "testCases": [
      {
        "input": "[100, 4, 200, 1, 3, 2]",
        "expectedOutput": "4",
        "hidden": false
      },
      {
        "input": "[0, 3, 7, 2, 5, 8, 4, 6, 0, 1]",
        "expectedOutput": "9",
        "hidden": false
      },
      {
        "input": "[]",
        "expectedOutput": "0",
        "hidden": true
      },
      {
        "input": "[9, 1, 4, 7, 3, -1, 0, 5, 8, -1, 6]",
        "expectedOutput": "7",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    int longestConsecutive(vector<int>& nums) {\n        // Write your solution here\n        return 0;\n    }\n};",
      "java": "class Solution {\n    public int longestConsecutive(int[] nums) {\n        // Write your solution here\n        return 0;\n    }\n}",
      "python": "class Solution:\n    def longestConsecutive(self, nums: list[int]) -> int:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction longestConsecutive(nums) {\n    // Write your solution here\n    return 0;\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  },
  {
    "id": "cq_25",
    "slug": "subarray-sum-equals-k",
    "title": "Subarray Sum Equals K",
    "difficulty": "Medium",
    "topic": "Arrays",
    "tags": [
      "Array",
      "Hash Table",
      "Prefix Sum"
    ],
    "inputFormat": "An array of integers nums and an integer k",
    "outputFormat": "Total number of subarrays whose sum equals to k",
    "referenceUrl": "https://leetcode.com/problems/subarray-sum-equals-k/",
    "attribution": "Prefix sum + hash map frequency pattern prominent in placement tests.",
    "description": "Given an array of integers nums and an integer k, return the total number of subarrays whose sum equals to k. A subarray is a contiguous non-empty sequence of elements within an array.",
    "constraints": [
      "1 <= nums.length <= 2 * 10^4",
      "-1000 <= nums[i] <= 1000",
      "-10^7 <= k <= 10^7"
    ],
    "examples": [
      {
        "input": "nums = [1, 1, 1], k = 2",
        "output": "2",
        "explanation": "Subarrays [1, 1] at indices [0, 1] and [1, 2] sum to 2."
      },
      {
        "input": "nums = [1, 2, 3], k = 3",
        "output": "2",
        "explanation": "[1, 2] and [3] both sum to 3."
      }
    ],
    "testCases": [
      {
        "input": "[1, 1, 1], 2",
        "expectedOutput": "2",
        "hidden": false
      },
      {
        "input": "[1, 2, 3], 3",
        "expectedOutput": "2",
        "hidden": false
      },
      {
        "input": "[1, -1, 0], 0",
        "expectedOutput": "3",
        "hidden": true
      },
      {
        "input": "[3], 3",
        "expectedOutput": "1",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    int subarraySum(vector<int>& nums, int k) {\n        // Write your solution here\n        return 0;\n    }\n};",
      "java": "class Solution {\n    public int subarraySum(int[] nums, int k) {\n        // Write your solution here\n        return 0;\n    }\n}",
      "python": "class Solution:\n    def subarraySum(self, nums: list[int], k: int) -> int:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {number[]} nums\n * @param {number} k\n * @return {number}\n */\nfunction subarraySum(nums, k) {\n    // Write your solution here\n    return 0;\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  },
  {
    "id": "cq_26",
    "slug": "find-the-duplicate-number",
    "title": "Find the Duplicate Number",
    "difficulty": "Medium",
    "topic": "Arrays",
    "tags": [
      "Array",
      "Two Pointers",
      "Binary Search",
      "Bit Manipulation",
      "Floyd Cycle"
    ],
    "inputFormat": "An array of integers nums containing n + 1 integers where each integer is in range [1, n]",
    "outputFormat": "The duplicate integer",
    "referenceUrl": "https://leetcode.com/problems/find-the-duplicate-number/",
    "attribution": "Floyds Tortoise and Hare cycle detection applied to array indices.",
    "description": "Given an array of integers nums containing n + 1 integers where each integer is in the range [1, n] inclusive. There is only one repeated number in nums, return this repeated number. You must solve the problem without modifying the array nums and uses only constant extra space.",
    "constraints": [
      "1 <= n <= 10^5",
      "nums.length == n + 1",
      "1 <= nums[i] <= n",
      "All integers in nums appear only once except for precisely one integer which appears two or more times."
    ],
    "examples": [
      {
        "input": "nums = [1, 3, 4, 2, 2]",
        "output": "2",
        "explanation": "2 is repeated."
      },
      {
        "input": "nums = [3, 1, 3, 4, 2]",
        "output": "3",
        "explanation": "3 is repeated."
      }
    ],
    "testCases": [
      {
        "input": "[1, 3, 4, 2, 2]",
        "expectedOutput": "2",
        "hidden": false
      },
      {
        "input": "[3, 1, 3, 4, 2]",
        "expectedOutput": "3",
        "hidden": false
      },
      {
        "input": "[3, 3, 3, 3, 3]",
        "expectedOutput": "3",
        "hidden": true
      },
      {
        "input": "[2, 5, 9, 6, 9, 3, 8, 9, 7, 1]",
        "expectedOutput": "9",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    int findDuplicate(vector<int>& nums) {\n        // Write your solution here\n        return 0;\n    }\n};",
      "java": "class Solution {\n    public int findDuplicate(int[] nums) {\n        // Write your solution here\n        return 0;\n    }\n}",
      "python": "class Solution:\n    def findDuplicate(self, nums: list[int]) -> int:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction findDuplicate(nums) {\n    // Write your solution here\n    return 0;\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  },
  {
    "id": "cq_27",
    "slug": "next-permutation",
    "title": "Next Permutation",
    "difficulty": "Medium",
    "topic": "Arrays",
    "tags": [
      "Array",
      "Two Pointers"
    ],
    "inputFormat": "An array of integers nums",
    "outputFormat": "The array rearranged in-place into lexicographically next greater permutation",
    "referenceUrl": "https://leetcode.com/problems/next-permutation/",
    "attribution": "Standard lexicographical permutation problem asked in Amazon and Adobe.",
    "description": "A permutation of an array of integers is an arrangement of its members into a sequence or linear order. Given an array of integers nums, rearrange numbers into the lexicographically next greater permutation of numbers. If such an arrangement is not possible, the array must be rearranged as the lowest possible order (i.e., sorted in ascending order). The replacement must be in place.",
    "constraints": [
      "1 <= nums.length <= 100",
      "0 <= nums[i] <= 100"
    ],
    "examples": [
      {
        "input": "nums = [1, 2, 3]",
        "output": "[1, 3, 2]",
        "explanation": "Next lexicographical order after 123 is 132."
      },
      {
        "input": "nums = [3, 2, 1]",
        "output": "[1, 2, 3]",
        "explanation": "Descending order rearranges to lowest ascending permutation."
      }
    ],
    "testCases": [
      {
        "input": "[1, 2, 3]",
        "expectedOutput": "[1, 3, 2]",
        "hidden": false
      },
      {
        "input": "[3, 2, 1]",
        "expectedOutput": "[1, 2, 3]",
        "hidden": false
      },
      {
        "input": "[1, 1, 5]",
        "expectedOutput": "[1, 5, 1]",
        "hidden": true
      },
      {
        "input": "[1, 3, 2]",
        "expectedOutput": "[2, 1, 3]",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    void nextPermutation(vector<int>& nums) {\n        // Write your solution here\n    }\n};",
      "java": "class Solution {\n    public void nextPermutation(int[] nums) {\n        // Write your solution here\n    }\n}",
      "python": "class Solution:\n    def nextPermutation(self, nums: list[int]) -> None:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {number[]} nums\n * @return {void} Do not return anything, modify nums in-place instead.\n */\nfunction nextPermutation(nums) {\n    // Write your solution here\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  },
  {
    "id": "cq_28",
    "slug": "merge-intervals",
    "title": "Merge Intervals",
    "difficulty": "Medium",
    "topic": "Arrays",
    "tags": [
      "Array",
      "Sorting"
    ],
    "inputFormat": "An array of intervals where intervals[i] = [starti, endi]",
    "outputFormat": "An array of non-overlapping intervals covering all input intervals",
    "referenceUrl": "https://leetcode.com/problems/merge-intervals/",
    "attribution": "Interval sorting pattern ubiquitous in tech interview rounds.",
    "description": "Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.",
    "constraints": [
      "1 <= intervals.length <= 10^4",
      "intervals[i].length == 2",
      "0 <= starti <= endi <= 10^4"
    ],
    "examples": [
      {
        "input": "intervals = [[1, 3], [2, 6], [8, 10], [15, 18]]",
        "output": "[[1, 6], [8, 10], [15, 18]]",
        "explanation": "Intervals [1, 3] and [2, 6] overlap, merging into [1, 6]."
      },
      {
        "input": "intervals = [[1, 4], [4, 5]]",
        "output": "[[1, 5]]",
        "explanation": "Intervals [1, 4] and [4, 5] touch at 4, merging into [1, 5]."
      }
    ],
    "testCases": [
      {
        "input": "[[1, 3], [2, 6], [8, 10], [15, 18]]",
        "expectedOutput": "[[1, 6], [8, 10], [15, 18]]",
        "hidden": false
      },
      {
        "input": "[[1, 4], [4, 5]]",
        "expectedOutput": "[[1, 5]]",
        "hidden": false
      },
      {
        "input": "[[1, 4], [2, 3]]",
        "expectedOutput": "[[1, 4]]",
        "hidden": true
      },
      {
        "input": "[[1, 4]]",
        "expectedOutput": "[[1, 4]]",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    vector<vector<int>> merge(vector<vector<int>>& intervals) {\n        // Write your solution here\n        return {};\n    }\n};",
      "java": "class Solution {\n    public int[][] merge(int[][] intervals) {\n        // Write your solution here\n        return new int[][]{};\n    }\n}",
      "python": "class Solution:\n    def merge(self, intervals: list[list[int]]) -> list[list[int]]:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {number[][]} intervals\n * @return {number[][]}\n */\nfunction merge(intervals) {\n    // Write your solution here\n    return [];\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  },
  {
    "id": "cq_29",
    "slug": "first-missing-positive",
    "title": "First Missing Positive",
    "difficulty": "Hard",
    "topic": "Arrays",
    "tags": [
      "Array",
      "Hash Table"
    ],
    "inputFormat": "An unsorted integer array nums",
    "outputFormat": "The smallest missing positive integer",
    "referenceUrl": "https://leetcode.com/problems/first-missing-positive/",
    "attribution": "In-place index hashing problem frequently tested by top product firms.",
    "description": "Given an unsorted integer array nums. Return the smallest positive integer that is not present in nums. You must implement an algorithm that runs in O(n) time and uses O(1) auxiliary space.",
    "constraints": [
      "1 <= nums.length <= 10^5",
      "-2^31 <= nums[i] <= 2^31 - 1"
    ],
    "examples": [
      {
        "input": "nums = [1, 2, 0]",
        "output": "3",
        "explanation": "Numbers in range [1, 2] are all in the array."
      },
      {
        "input": "nums = [3, 4, -1, 1]",
        "output": "2",
        "explanation": "1 is in the array but 2 is missing."
      }
    ],
    "testCases": [
      {
        "input": "[1, 2, 0]",
        "expectedOutput": "3",
        "hidden": false
      },
      {
        "input": "[3, 4, -1, 1]",
        "expectedOutput": "2",
        "hidden": false
      },
      {
        "input": "[7, 8, 9, 11, 12]",
        "expectedOutput": "1",
        "hidden": true
      },
      {
        "input": "[1]",
        "expectedOutput": "2",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    int firstMissingPositive(vector<int>& nums) {\n        // Write your solution here\n        return 1;\n    }\n};",
      "java": "class Solution {\n    public int firstMissingPositive(int[] nums) {\n        // Write your solution here\n        return 1;\n    }\n}",
      "python": "class Solution:\n    def firstMissingPositive(self, nums: list[int]) -> int:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction firstMissingPositive(nums) {\n    // Write your solution here\n    return 1;\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  }
];
export default arraysHashingQuestions;
