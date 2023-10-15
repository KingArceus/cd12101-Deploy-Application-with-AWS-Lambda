import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { getUserId } from '../utils.mjs'
import { updateTodo } from '../../businessLogic/todos.mjs'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('updateTodos')

export const handler = middy()
  .use(httpErrorHandler())
  .use(cors({
    credentials: true
  }))

  .handler(async (event) => {
    const todoId = event.pathParameters.todoId
    const updatedTodo = JSON.parse(event.body)
    const userId = getUserId(event)
    logger.info(`
    Update todo:
      Todo ID: ${todoId}
      User ID: ${userId}
      New todo: ${updatedTodo}
    `)

    const todos = await updateTodo(todoId, userId, updatedTodo)

    return {
      statusCode: 200,
      body: ''
    }
  })