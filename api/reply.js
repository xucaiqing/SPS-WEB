import request from '@/utils/request'
// reply关键字自动回复begin
export function findReplyList(data) { // 自动回复关键字列表(已执行历史和待执行自动回复关键字都有)
  return request({
    url: '/reply/findReplyList',
    method: 'post',
    data: data
  })
}
export function loadReplyInfo(data) { // 自动回复关键字详情
  return request({
    url: '/reply/loadReplyInfo',
    method: 'post',
    data: data
  })
}
export function updateReply(data) { // 修改自动回复关键字详情
  return request({
    url: '/reply/updateReply',
    method: 'post',
    data: data
  })
}
export function saveReply(data) { // 新增自动回复关键字
  return request({
    url: '/reply/saveReply',
    method: 'post',
    data: data
  })
}
export function updateReplyRecordState(data) { // 删除或启用自动回复关键字
  return request({
    url: '/reply/updateReplyRecordState',
    method: 'post',
    data: data
  })
}
export function loadReplyClick(data) { // 点击自动回复关键字跳转过来查询
  return request({
    url: '/reply/loadReplyClick',
    method: 'post',
    data: data
  })
}
export function refreshRedisReply() { // 刷新自动回复关键字缓存
  return request({
    url: '/reply/refreshRedisReply',
    method: 'get',
  })
}

/**
 * 获取发起申请时的参数
 * @param applyCode
 * @param templateId
 * @returns {AxiosPromise}
 */
export function loadApplyParamByApplyCode({applyCode,templateId}) {
  return request({
    url: `/reply/loadApplyParamByApplyCode?applyCode=${applyCode}&templateId=${templateId}`,
    method: 'get',
  })
}

/**
 * 不同意
 * @param applyCode
 * @param templateId
 * @returns {AxiosPromise}
 */
export function cancelApplyCode({applyCode,templateId}) {
  return request({
    url: `/reply/cancelApplyCode?applyCode=${applyCode}&templateId=${templateId}`,
    method: 'get',
  })
}

/**
 * 已有关键字列表
 * @returns {AxiosPromise}
 */
export function findKeywordList() {
  return request({
    url: `/reply/findKeywordList`,
    method: 'get',
  })
}

/**
 * 预览已有关键字列表
 * @returns {AxiosPromise}
 */
export function findKeywordListPreview() {
  return request({
    url: `/reply/findKeywordListPreview`,
    method: 'get',
  })
}
// reply关键字自动回复end
// template模板begin
export function findTemplateList(data) {
  return request({
    url: '/reply/findTemplateList',
    method: 'post',
    data: data
  })
}
export function findTemplateListSimpleAll(data) { // 查询模板列表:不分页、不关联步骤列表
  return request({
    url: '/reply/findTemplateListSimpleAll',
    method: 'post',
    data: data
  })
}
export function loadTemplate(data) {
  return request({
    url: '/reply/loadTemplate',
    method: 'post',
    data: data
  })
}
export function updateTemplate(data) {
  return request({
    url: `/reply/updateTemplate`,
    method: 'post',
    data: data
  })
}
export function saveTemplate(data) {
  return request({
    url: '/reply/saveTemplate',
    method: 'post',
    data: data
  })
}
export function updateTemplateRecordState(data) {
  return request({
    url: '/reply/updateTemplateRecordState',
    method: 'post',
    data: data
  })
}
export function executeTemplate(data) {
  return request({
    url: '/reply/executeTemplate',
    method: 'post',
    data: data
  })
}
// template模板end

/**
 * 菜单跳转关键字列表
 * @param data
 * @returns {AxiosPromise}
 */
export function msg(data) {
  return request({
    url: '/gateway/msg',
    method: 'post',
    data: data
  })
}
