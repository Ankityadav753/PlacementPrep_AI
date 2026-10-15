/**
 * Curated PlacementPrep_AI Coding Question Bank
 * Contains exactly 100 high-priority placement coding problems covering all core DSA topics:
 * - Arrays & Hashing
 * - Strings & String Manipulation
 * - Two Pointers & Sliding Window
 * - Sorting & Binary Search
 * - Linked Lists
 * - Stacks & Queues
 * - Recursion & Backtracking
 * - Trees & Binary Search Trees
 * - Heaps & Priority Queues
 * - Graphs, BFS & DFS
 * - Greedy Algorithms
 * - Dynamic Programming
 * - Basic Mathematics & Bit Manipulation
 */

import { existing20Questions } from './questions/existing20.js';
import { arraysHashingQuestions } from './questions/arraysHashing.js';
import { stringsQuestions } from './questions/strings.js';
import { twoPointersSlidingWindowQuestions } from './questions/twoPointersSlidingWindow.js';
import { sortingBinarySearchQuestions } from './questions/sortingBinarySearch.js';
import { linkedListsQuestions } from './questions/linkedLists.js';
import { stacksQueuesQuestions } from './questions/stacksQueues.js';
import { recursionBacktrackingQuestions } from './questions/recursionBacktracking.js';
import { treesBstQuestions } from './questions/treesBst.js';
import { heapsPriorityQueuesQuestions } from './questions/heapsPriorityQueues.js';
import { graphsBfsDfsQuestions } from './questions/graphsBfsDfs.js';
import { greedyQuestions } from './questions/greedy.js';
import { dynamicProgrammingQuestions } from './questions/dynamicProgramming.js';
import { mathBitManipulationQuestions } from './questions/mathBitManipulation.js';

export const codingQuestionsData = [
  ...existing20Questions,
  ...arraysHashingQuestions,
  ...stringsQuestions,
  ...twoPointersSlidingWindowQuestions,
  ...sortingBinarySearchQuestions,
  ...linkedListsQuestions,
  ...stacksQueuesQuestions,
  ...recursionBacktrackingQuestions,
  ...treesBstQuestions,
  ...heapsPriorityQueuesQuestions,
  ...graphsBfsDfsQuestions,
  ...greedyQuestions,
  ...dynamicProgrammingQuestions,
  ...mathBitManipulationQuestions,
];

export default codingQuestionsData;
