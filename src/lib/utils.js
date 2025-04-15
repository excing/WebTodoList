
// utils.js

import { tasks } from "./stores";

// 增加任务值的函数
export function incrementTaskValues() {
  const now = new Date();
  tasks.update(tasklist => {
    return tasklist.map(task => {
      // 每分钟值增加 n 点，n 为当前支持点数
      const valueIncrease = task.supports;
      const updated = task.updated ? new Date(task.updated) : new Date(task.created);
      let d = Math.abs(now.getTime() - updated.getTime()) / 1000 / 60;
      console.log(`空白时间段：${d}`);

      if (d < 0.5) return task;
      if (d < 1) d = 1;
      else d = Math.floor(d);
      task.value += valueIncrease * d;
      task.updated = new Date().toISOString();
      return task;
    })

  });
}

export function saveData(tasks, completedTasks, cancelledTasks, userPoints) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
  localStorage.setItem('cancelledTasks', JSON.stringify(cancelledTasks));
  localStorage.setItem('userPoints', userPoints.toString());
}