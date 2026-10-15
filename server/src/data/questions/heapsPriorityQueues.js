export const heapsPriorityQueuesQuestions = [
  {
    "id": "cq_76",
    "slug": "kth-largest-element-in-an-array",
    "title": "Kth Largest Element in an Array",
    "difficulty": "Medium",
    "topic": "Heaps",
    "tags": [
      "Array",
      "Divide and Conquer",
      "Sorting",
      "Heap",
      "Quickselect"
    ],
    "inputFormat": "An integer array nums and an integer k",
    "outputFormat": "The kth largest element in the array",
    "referenceUrl": "https://leetcode.com/problems/kth-largest-element-in-an-array/",
    "attribution": "Min-heap / quickselect order statistic algorithm standard.",
    "description": "Given an integer array nums and an integer k, return the kth largest element in the array. Note that it is the kth largest element in the sorted order, not the kth distinct element. Can you solve it without sorting?",
    "constraints": [
      "1 <= k <= nums.length <= 10^5",
      "-10^4 <= nums[i] <= 10^4"
    ],
    "examples": [
      {
        "input": "nums = [3, 2, 1, 5, 6, 4], k = 2",
        "output": "5",
        "explanation": "Sorted order is [1, 2, 3, 4, 5, 6]; 2nd largest is 5."
      },
      {
        "input": "nums = [3, 2, 3, 1, 2, 4, 5, 5, 6], k = 4",
        "output": "4",
        "explanation": "Sorted order is [1, 2, 2, 3, 3, 4, 5, 5, 6]; 4th largest is 4."
      }
    ],
    "testCases": [
      {
        "input": "[3, 2, 1, 5, 6, 4], 2",
        "expectedOutput": "5",
        "hidden": false
      },
      {
        "input": "[3, 2, 3, 1, 2, 4, 5, 5, 6], 4",
        "expectedOutput": "4",
        "hidden": false
      },
      {
        "input": "[1], 1",
        "expectedOutput": "1",
        "hidden": true
      },
      {
        "input": "[7, 10, 4, 3, 20, 15], 3",
        "expectedOutput": "10",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    int findKthLargest(vector<int>& nums, int k) {\n        // Write your solution here\n        return 0;\n    }\n};",
      "java": "class Solution {\n    public int findKthLargest(int[] nums, int k) {\n        // Write your solution here\n        return 0;\n    }\n}",
      "python": "class Solution:\n    def findKthLargest(self, nums: list[int], k: int) -> int:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {number[]} nums\n * @param {number} k\n * @return {number}\n */\nfunction findKthLargest(nums, k) {\n    // Write your solution here\n    return 0;\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  },
  {
    "id": "cq_77",
    "slug": "last-stone-weight",
    "title": "Last Stone Weight",
    "difficulty": "Easy",
    "topic": "Heaps",
    "tags": [
      "Array",
      "Heap"
    ],
    "inputFormat": "An array of integers stones",
    "outputFormat": "The weight of the last remaining stone, or 0 if none remain",
    "referenceUrl": "https://leetcode.com/problems/last-stone-weight/",
    "attribution": "Max-heap simulation problem common in campus recruitment.",
    "description": "You are given an array of integers stones where stones[i] is the weight of the ith stone. We are playing a game with the stones. On each turn, we choose the heaviest two stones and smash them together. Suppose the heaviest two stones have weights x and y with x <= y. If x == y, both stones are destroyed. If x != y, stone of weight x is destroyed, and stone of weight y has new weight y - x. Return the weight of the last remaining stone, or 0 if there are no stones left.",
    "constraints": [
      "1 <= stones.length <= 30",
      "1 <= stones[i] <= 1000"
    ],
    "examples": [
      {
        "input": "stones = [2, 7, 4, 1, 8, 1]",
        "output": "1",
        "explanation": "We combine 7 and 8 to get 1, array becomes [2, 4, 1, 1, 1], etc. Final stone is 1."
      },
      {
        "input": "stones = [1]",
        "output": "1",
        "explanation": "Only 1 stone exists."
      }
    ],
    "testCases": [
      {
        "input": "[2, 7, 4, 1, 8, 1]",
        "expectedOutput": "1",
        "hidden": false
      },
      {
        "input": "[1]",
        "expectedOutput": "1",
        "hidden": false
      },
      {
        "input": "[2, 2]",
        "expectedOutput": "0",
        "hidden": true
      },
      {
        "input": "[3, 7, 2]",
        "expectedOutput": "2",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    int lastStoneWeight(vector<int>& stones) {\n        // Write your solution here\n        return 0;\n    }\n};",
      "java": "class Solution {\n    public int lastStoneWeight(int[] stones) {\n        // Write your solution here\n        return 0;\n    }\n}",
      "python": "class Solution:\n    def lastStoneWeight(self, stones: list[int]) -> int:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {number[]} stones\n * @return {number}\n */\nfunction lastStoneWeight(stones) {\n    // Write your solution here\n    return 0;\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  },
  {
    "id": "cq_78",
    "slug": "task-scheduler",
    "title": "Task Scheduler",
    "difficulty": "Medium",
    "topic": "Heaps",
    "tags": [
      "Array",
      "Hash Table",
      "Greedy",
      "Sorting",
      "Heap",
      "Counting"
    ],
    "inputFormat": "An array of CPU tasks tasks and cooling interval n",
    "outputFormat": "The least number of CPU units of time that the machine will take to finish all tasks",
    "referenceUrl": "https://leetcode.com/problems/task-scheduler/",
    "attribution": "Priority queue / greedy frequency slot management benchmark.",
    "description": "You are given an array of CPU tasks, each represented by letters A to Z, and a cooling time, n. Each cycle or interval allows the completion of one task. Tasks can be completed in any order, but there's a constraint: identical tasks must be separated by at least n intervals due to cooling time. Return the minimum number of intervals required to complete all tasks.",
    "constraints": [
      "1 <= tasks.length <= 10^4",
      "tasks[i] is an uppercase English letter.",
      "0 <= n <= 100"
    ],
    "examples": [
      {
        "input": "tasks = [\"A\", \"A\", \"A\", \"B\", \"B\", \"B\"], n = 2",
        "output": "8",
        "explanation": "A -> B -> idle -> A -> B -> idle -> A -> B."
      },
      {
        "input": "tasks = [\"A\", \"C\", \"A\", \"B\", \"D\", \"B\"], n = 1",
        "output": "6",
        "explanation": "A -> B -> C -> D -> A -> B."
      }
    ],
    "testCases": [
      {
        "input": "[\"A\", \"A\", \"A\", \"B\", \"B\", \"B\"], 2",
        "expectedOutput": "8",
        "hidden": false
      },
      {
        "input": "[\"A\", \"C\", \"A\", \"B\", \"D\", \"B\"], 1",
        "expectedOutput": "6",
        "hidden": false
      },
      {
        "input": "[\"A\", \"A\", \"A\", \"B\", \"B\", \"B\"], 0",
        "expectedOutput": "6",
        "hidden": true
      },
      {
        "input": "[\"A\"], 2",
        "expectedOutput": "1",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    int leastInterval(vector<char>& tasks, int n) {\n        // Write your solution here\n        return 0;\n    }\n};",
      "java": "class Solution {\n    public int leastInterval(char[] tasks, int n) {\n        // Write your solution here\n        return 0;\n    }\n}",
      "python": "class Solution:\n    def leastInterval(self, tasks: list[str], n: int) -> int:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {character[]} tasks\n * @param {number} n\n * @return {number}\n */\nfunction leastInterval(tasks, n) {\n    // Write your solution here\n    return 0;\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  },
  {
    "id": "cq_79",
    "slug": "find-median-from-data-stream",
    "title": "Find Median from Data Stream",
    "difficulty": "Hard",
    "topic": "Heaps",
    "tags": [
      "Two Pointers",
      "Design",
      "Sorting",
      "Heap",
      "Data Stream"
    ],
    "inputFormat": "Calls to addNum(num) and findMedian()",
    "outputFormat": "The median of all elements so far as a double",
    "referenceUrl": "https://leetcode.com/problems/find-median-from-data-stream/",
    "attribution": "Dual max-heap and min-heap balancing pattern classic (Amazon, Google).",
    "description": "The median is the middle value in an ordered integer list. If the size of the list is even, there is no middle value, and the median is the mean of the two middle values. Implement the MedianFinder class: MedianFinder() initializes the object, void addNum(int num) adds the integer num from the data stream, double findMedian() returns the median of all elements so far.",
    "constraints": [
      "-10^5 <= num <= 10^5",
      "There will be at least one element in the data structure before calling findMedian.",
      "At most 5 * 10^4 calls will be made to addNum and findMedian."
    ],
    "examples": [
      {
        "input": "[\"MedianFinder\", \"addNum\", \"addNum\", \"findMedian\", \"addNum\", \"findMedian\"], [[], [1], [2], [], [3], []]",
        "output": "[null, null, null, 1.5, null, 2.0]",
        "explanation": "addNum(1), addNum(2), findMedian() -> 1.5, addNum(3), findMedian() -> 2.0."
      },
      {
        "input": "addNum(5), findMedian()",
        "output": "5.0",
        "explanation": "Single element median is the element itself."
      }
    ],
    "testCases": [
      {
        "input": "addNum(1), addNum(2), findMedian()",
        "expectedOutput": "1.5",
        "hidden": false
      },
      {
        "input": "addNum(1), addNum(2), addNum(3), findMedian()",
        "expectedOutput": "2.0",
        "hidden": false
      },
      {
        "input": "addNum(-1), findMedian()",
        "expectedOutput": "-1.0",
        "hidden": true
      },
      {
        "input": "addNum(-1), addNum(-2), addNum(-3), findMedian()",
        "expectedOutput": "-2.0",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class MedianFinder {\npublic:\n    MedianFinder() {}\n    void addNum(int num) {}\n    double findMedian() {\n        // Write your solution here\n        return 0.0;\n    }\n};",
      "java": "class MedianFinder {\n    public MedianFinder() {}\n    public void addNum(int num) {}\n    public double findMedian() {\n        // Write your solution here\n        return 0.0;\n    }\n}",
      "python": "class MedianFinder:\n    def __init__(self):\n        pass\n    def addNum(self, num: int) -> None:\n        pass\n    def findMedian(self) -> float:\n        # Write your solution here\n        pass",
      "javascript": "var MedianFinder = function() {};\nMedianFinder.prototype.addNum = function(num) {};\nMedianFinder.prototype.findMedian = function() {\n    // Write your solution here\n    return 0.0;\n};"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  }
];
export default heapsPriorityQueuesQuestions;
