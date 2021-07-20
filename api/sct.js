import request from '@/utils/request'
// task任务begin
export function findTaskList(data) { // 任务列表(已执行历史和待执行任务都有)
  return request({
    url: '/sct/findTaskList',
    method: 'post',
    data: data
  })
}
export function loadTaskInfo(data) { // 任务详情
  return request({
    url: '/sct/loadTaskInfo',
    method: 'post',
    data: data
  })
}
export function updateTask(data) { // 修改任务详情
  return request({
    url: '/sct/updateTask',
    method: 'post',
    data: data
  })
}
export function saveTask(data) { // 新增任务
  return request({
    url: '/sct/saveTask',
    method: 'post',
    data: data
  })
}
export function updateTaskRecordState(data) { // 删除或启用任务
  return request({
    url: '/sct/updateTaskRecordState',
    method: 'post',
    data: data
  })
}
export function updateTaskState(data) { // 开始运行任务(或者更改任务为其他状态)
  return request({
    url: '/sct/updateTaskState',
    method: 'post',
    data: data
  })
}
export function confirmTaskOnly(data) { // 确认检查结果
  return request({
    url: '/sct/confirmTaskOnly',
    method: 'post',
    data: data
  })
}
export function confirmStep(data) { // 确认任务下步骤的执行结果
  return request({
    url: '/sct/confirmStep',
    method: 'post',
    data: data
  })
}
export function remarkTaskOnly(data) { // 标记任务说明
  return request({
    url: '/sct/remarkTaskOnly',
    method: 'post',
    data: data
  })
}
export function remarkStep(data) { // 标记任务下步骤说明
  return request({
    url: '/sct/remarkTaskOnly',
    method: 'post',
    data: data
  })
}
// task任务end
// template模板begin
export function findTemplateList(data) {
  return request({
    url: '/sct/findTemplateList',
    method: 'post',
    data: data
  })
}
export function findTemplateListSimpleAll(data) {//查询模板列表:不分页、不关联步骤列表
  return request({
    url: '/sct/findTemplateListSimpleAll',
    method: 'post',
    data:data
  })
}
export function loadTemplateInfo(data) {
  return request({
    url: '/sct/loadTemplateInfo',
    method: 'post',
    data: data
  })
}
export function updateTemplate(data) {
  return request({
    url: `/sct/updateTemplate`,
    method: 'put',
    data: data
  })
}
export function saveTemplate(data) {
  return request({
    url: '/sct/saveTemplate',
    method: 'post',
    data: data
  })
}
export function updateTemplateRecordState(data) {
  return request({
    url: '/sct/updateTemplateRecordState',
    method: 'post',
    data: data
  })
}
// template模板end
// step步骤begin
export function findStepList(data) {
  return request({
    url: '/sct/findStepList',
    method: 'post',
    data: data
  })
}
export function loadStepInfo(data) {
  return request({
    url: '/sct/loadStepInfo',
    method: 'post',
    data: data
  })
}
export function updateStep(oldStepId, data) {
  return request({
    url: `/sct/updateStep`,
    method: 'post',
    data: data
  })
}
export function saveStep(data) {
  return request({
    url: '/sct/saveStep',
    method: 'post',
    data: data
  })
}
export function updateStepRecordState(data) {
  return request({
    url: '/sct/updateStepRecordState',
    method: 'post',
    data: data
  })
}
// step步骤begin
