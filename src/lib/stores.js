import { writable } from 'svelte/store';

// 用户拥有的支持点数
export const userPoints = writable(5);

// 上次添加每日点数的日期
export const lastDayPointsAdded = writable('');

// 活跃的任务列表
export const tasks = writable([]);

// 已完成的任务列表
export const completedTasks = writable([]);

// 已取消的任务列表
export const cancelledTasks = writable([]);
