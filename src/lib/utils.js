
// utils.js
// 增加任务值的函数
export function incrementTaskValues(tasksList) {
  return tasksList.map(task => {
    // 每分钟值增加 n 点，n 为当前支持点数
    const valueIncrease = task.supports;
    task.value += valueIncrease;
    return task;
  });
}