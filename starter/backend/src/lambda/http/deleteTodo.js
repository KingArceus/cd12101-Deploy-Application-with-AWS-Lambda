import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { getUserId } from '../utils.mjs'
import { deleteTodo } from '../../businessLogic/todos.mjs'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('deleteTodo')

export const handler = middy ()
  .use(httpErrorHandler())
  .use(cors({
    credentials: true
  }))


  .handler(async(event) => {
    const todoId = event.pathParameters.todoId
    const userId = getUserId(event)
    logger.info(`
    Delete TODO:
      Todo ID: ${todoId}
      User ID: ${userId}
    `)

    await deleteTodo(todoId, userId)
    return {
      statusCode: 200,
      body: ''
    }
  }) 