import * as uuid from 'uuid'
import { TodosAccess } from '../dataLayer/todosAccess.mjs'
import {getUploadUrl, generateAttachmentUrl} from '../fileStorage/attachmentStorage.mjs'
import { createLogger } from '../utils/logger.mjs'

const logger = createLogger('BussinessLogic')
const todosAccess = new TodosAccess()

export async function getTodosForUserID(userId) {
    logger.info('Get Todos')
    return todosAccess.getTodos(userId)
}

export async function createTodo(newTodo, userId) {
    logger.info('Create Todo')

    const todoId = uuid.v4()
    const createdAt = new Date().toISOString()
    const attachmentUrl = generateAttachmentUrl(todoId)
    
    const response = await todosAccess.createTodo({
        userId,
        todoId,
        createdAt,
        done: false,
        attachmentUrl: attachmentUrl,
        ...newTodo
    })
    logger.info(response)
    return response
}

export async function updateTodo(userId, todoId, updatedTodo) {
    logger.info('Update Todo')
    return todosAccess.updateTodo(todoId, userId, updatedTodo)
}

export async function deleteTodo(todoId, userId) {
    logger.info('Delete Todo')
    return todosAccess.deleteTodo(todoId, userId)
}

export async function createAttachmentUrl(todoId) {
    logger.info('Create Attachment Presigned URL')
    return await getUploadUrl(todoId)
}