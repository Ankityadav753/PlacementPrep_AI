export const twoPointersSlidingWindowQuestions = [
  {
    "id": "cq_39",
    "slug": "two-sum-ii-input-array-is-sorted",
    "title": "Two Sum II - Input Array Is Sorted",
    "difficulty": "Medium",
    "topic": "Two Pointers",
    "tags": [
      "Array",
      "Two Pointers",
      "Binary Search"
    ],
    "inputFormat": "A 1-indexed array of integers numbers that is already sorted in non-decreasing order, and an integer target",
    "outputFormat": "The indices of the two numbers, index1 and index2, added by one as an integer array [index1, index2] of length 2",
    "referenceUrl": "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/",
    "attribution": "Classic two-pointer convergence pattern on sorted arrays.",
    "description": "Given a 1-indexed array of integers numbers that is already sorted in non-decreasing order, find two numbers such that they add up to a specific target number. Return the indices of the two numbers, index1 and index2, added by one as an integer array [index1, index2] of length 2. You may not use the same element twice. Your solution must use only constant extra space.",
    "constraints": [
      "2 <= numbers.length <= 3 * 10^4",
      "-1000 <= numbers[i] <= 1000",
      "numbers is sorted in non-decreasing order.",
      "-1000 <= target <= 1000",
      "The tests are generated such that there is exactly one solution."
    ],
    "examples": [
      {
        "input": "numbers = [2, 7, 11, 15], target = 9",
        "output": "[1, 2]",
        "explanation": "The sum of 2 and 7 is 9. Therefore, index1 = 1, index2 = 2. We return [1, 2]."
      },
      {
        "input": "numbers = [2, 3, 4], target = 6",
        "output": "[1, 3]",
        "explanation": "The sum of 2 and 4 is 6. Therefore index1 = 1, index2 = 3. We return [1, 3]."
      }
    ],
    "testCases": [
      {
        "input": "[2, 7, 11, 15], 9",
        "expectedOutput": "[1, 2]",
        "hidden": false
      },
      {
        "input": "[2, 3, 4], 6",
        "expectedOutput": "[1, 3]",
        "hidden": false
      },
      {
        "input": "[-1, 0], -1",
        "expectedOutput": "[1, 2]",
        "hidden": true
      },
      {
        "input": "[5, 25, 75], 100",
        "expectedOutput": "[2, 3]",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    vector<int> twoSum(vector<int>& numbers, int target) {\n        // Write your solution here\n        return {};\n    }\n};",
      "java": "class Solution {\n    public int[] twoSum(int[] numbers, int target) {\n        // Write your solution here\n        return new int[]{};\n    }\n}",
      "python": "class Solution:\n    def twoSum(self, numbers: list[int], target: int) -> list[int]:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {number[]} numbers\n * @param {number} target\n * @return {number[]}\n */\nfunction twoSum(numbers, target) {\n    // Write your solution here\n    return [];\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  },
  {
    "id": "cq_40",
    "slug": "remove-duplicates-from-sorted-array",
    "title": "Remove Duplicates from Sorted Array",
    "difficulty": "Easy",
    "topic": "Two Pointers",
    "tags": [
      "Array",
      "Two Pointers"
    ],
    "inputFormat": "An integer array nums sorted in non-decreasing order",
    "outputFormat": "The number of unique elements k",
    "referenceUrl": "https://leetcode.com/problems/remove-duplicates-from-sorted-array/",
    "attribution": "In-place two-pointer array compaction benchmark across all campus placements.",
    "description": "Given an integer array nums sorted in non-decreasing order, remove the duplicates in-place such that each unique element appears only once. The relative order of the elements should be kept the same. Then return the number of unique elements in nums.",
    "constraints": [
      "1 <= nums.length <= 3 * 10^4",
      "-100 <= nums[i] <= 100",
      "nums is sorted in non-decreasing order."
    ],
    "examples": [
      {
        "input": "nums = [1, 1, 2]",
        "output": "2",
        "explanation": "Your function should return k = 2, with the first two elements of nums being 1 and 2."
      },
      {
        "input": "nums = [0, 0, 1, 1, 1, 2, 2, 3, 3, 4]",
        "output": "5",
        "explanation": "Your function should return k = 5, with the first five elements being 0, 1, 2, 3, and 4."
      }
    ],
    "testCases": [
      {
        "input": "[1, 1, 2]",
        "expectedOutput": "2",
        "hidden": false
      },
      {
        "input": "[0, 0, 1, 1, 1, 2, 2, 3, 3, 4]",
        "expectedOutput": "5",
        "hidden": false
      },
      {
        "input": "[1]",
        "expectedOutput": "1",
        "hidden": true
      },
      {
        "input": "[1, 2, 3, 4, 5]",
        "expectedOutput": "5",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    int removeDuplicates(vector<int>& nums) {\n        // Write your solution here\n        return 0;\n    }\n};",
      "java": "class Solution {\n    public int removeDuplicates(int[] nums) {\n        // Write your solution here\n        return 0;\n    }\n}",
      "python": "class Solution:\n    def removeDuplicates(self, nums: list[int]) -> int:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction removeDuplicates(nums) {\n    // Write your solution here\n    return 0;\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  },
  {
    "id": "cq_41",
    "slug": "minimum-size-subarray-sum",
    "title": "Minimum Size Subarray Sum",
    "difficulty": "Medium",
    "topic": "Sliding Window",
    "tags": [
      "Array",
      "Binary Search",
      "Sliding Window",
      "Prefix Sum"
    ],
    "inputFormat": "An array of positive integers nums and a positive integer target",
    "outputFormat": "The minimal length of a contiguous subarray whose sum is >= target, or 0 if none exists",
    "referenceUrl": "https://leetcode.com/problems/minimum-size-subarray-sum/",
    "attribution": "Dynamic sliding window size contraction problem popular in technical interviews.",
    "description": "Given an array of positive integers nums and a positive integer target, return the minimal length of a subarray whose sum is greater than or equal to target. If there is no such subarray, return 0 instead.",
    "constraints": [
      "1 <= target <= 10^9",
      "1 <= nums.length <= 10^5",
      "1 <= nums[i] <= 10^4"
    ],
    "examples": [
      {
        "input": "target = 7, nums = [2, 3, 1, 2, 4, 3]",
        "output": "2",
        "explanation": "The subarray [4, 3] has the minimal length under the problem constraint."
      },
      {
        "input": "target = 4, nums = [1, 4, 4]",
        "output": "1",
        "explanation": "Subarray [4] has length 1."
      }
    ],
    "testCases": [
      {
        "input": "7, [2, 3, 1, 2, 4, 3]",
        "expectedOutput": "2",
        "hidden": false
      },
      {
        "input": "4, [1, 4, 4]",
        "expectedOutput": "1",
        "hidden": false
      },
      {
        "input": "11, [1, 1, 1, 1, 1, 1, 1, 1]",
        "expectedOutput": "0",
        "hidden": true
      },
      {
        "input": "15, [1, 2, 3, 4, 5]",
        "expectedOutput": "5",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    int minSubArrayLen(int target, vector<int>& nums) {\n        // Write your solution here\n        return 0;\n    }\n};",
      "java": "class Solution {\n    public int minSubArrayLen(int target, int[] nums) {\n        // Write your solution here\n        return 0;\n    }\n}",
      "python": "class Solution:\n    def minSubArrayLen(self, target: int, nums: list[int]) -> int:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {number} target\n * @param {number[]} nums\n * @return {number}\n */\nfunction minSubArrayLen(target, nums) {\n    // Write your solution here\n    return 0;\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  },
  {
    "id": "cq_42",
    "slug": "sliding-window-maximum",
    "title": "Sliding Window Maximum",
    "difficulty": "Hard",
    "topic": "Sliding Window",
    "tags": [
      "Array",
      "Queue",
      "Sliding Window",
      "Monotonic Queue"
    ],
    "inputFormat": "An array of integers nums and sliding window size k",
    "outputFormat": "The max sliding window values array",
    "referenceUrl": "https://leetcode.com/problems/sliding-window-maximum/",
    "attribution": "Monotonic double-ended queue (deque) pattern featured in top product hiring.",
    "description": "You are given an array of integers nums, there is a sliding window of size k which is moving from the very left of the array to the very right. You can only see the k numbers in the window. Each time the sliding window moves right by one position. Return the max sliding window.",
    "constraints": [
      "1 <= nums.length <= 10^5",
      "-10^4 <= nums[i] <= 10^4",
      "1 <= k <= nums.length"
    ],
    "examples": [
      {
        "input": "nums = [1, 3, -1, -3, 5, 3, 6, 7], k = 3",
        "output": "[3, 3, 5, 5, 6, 7]",
        "explanation": "Max in [1, 3, -1] is 3; in [3, -1, -3] is 3; in [-1, -3, 5] is 5, etc."
      },
      {
        "input": "nums = [1], k = 1",
        "output": "[1]",
        "explanation": "Single element window returns [1]."
      }
    ],
    "testCases": [
      {
        "input": "[1, 3, -1, -3, 5, 3, 6, 7], 3",
        "expectedOutput": "[3, 3, 5, 5, 6, 7]",
        "hidden": false
      },
      {
        "input": "[1], 1",
        "expectedOutput": "[1]",
        "hidden": false
      },
      {
        "input": "[9, 11], 2",
        "expectedOutput": "[11]",
        "hidden": true
      },
      {
        "input": "[4, -2]",
        "expectedOutput": "[4, -2]",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    vector<int> maxSlidingWindow(vector<int>& nums, int k) {\n        // Write your solution here\n        return {};\n    }\n};",
      "java": "class Solution {\n    public int[] maxSlidingWindow(int[] nums, int k) {\n        // Write your solution here\n        return new int[]{};\n    }\n}",
      "python": "class Solution:\n    def maxSlidingWindow(self, nums: list[int], k: int) -> list[int]:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {number[]} nums\n * @param {number} k\n * @return {number[]}\n */\nfunction maxSlidingWindow(nums, k) {\n    // Write your solution here\n    return [];\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  }
];
export default twoPointersSlidingWindowQuestions;
