import request from '@/utils/request'
// 排班begin
export function findScheduleList(data) { // 排班列表
  return request({
    url: '/hss/findScheduleList',
    method: 'post',
    data: data
  })
}
export function loadScheduleInfo(data) { // 排班详情
  return request({
    url: '/hss/loadScheduleInfo',
    method: 'post',
    data: data
  })
}
export function updateSchedule(data) { // 修改排班详情
  return request({
    url: '/hss/updateSchedule',
    method: 'post',
    data: data
  })
}
export function saveSchedule(data) { // 新增排班
  return request({
    url: '/hss/saveSchedule',
    method: 'post',
    data: data
  })
}
export function deleteSchedule(data) { // 删除排班
  return request({
    url: '/hss/deleteSchedule',
    method: 'post',
    data: data
  })
}

export function findScheduleBigAreaList(data) { // 按大区日期分组查询
  return request({
    url: '/hss/findScheduleBigAreaList',
    method: 'post',
    data: data
  })
}
export function saveScheduleBatch(data) { // 批量保存
  return request({
    url: '/hss/saveScheduleBatch',
    method: 'post',
    data: data
  })
}
export function checkScheduleBatch(data) { // 审核
  return request({
    url: '/hss/checkScheduleBatch',
    method: 'post',
    data: data
  })
}

// 排班end

// 工作安排begin
export function findPlanList(data) { // 工作安排列表
  return request({
    url: '/plan/findPlanList',
    method: 'post',
    data: data
  })
}
export function loadPlanInfo(data) { // 工作安排详情
  return request({
    url: '/plan/loadPlanInfo',
    method: 'post',
    data: data
  })
}
export function updatePlan(data) { // 工作安排修改排班详情
  return request({
    url: '/plan/updatePlan',
    method: 'post',
    data: data
  })
}
export function savePlan(data) { // 工作安排新增排班
  return request({
    url: '/plan/savePlan',
    method: 'post',
    data: data
  })
}
export function deletePlan(data) { // 工作安排删除排班
  return request({
    url: '/plan/deletePlan',
    method: 'post',
    data: data
  })
}
// 工作安排end