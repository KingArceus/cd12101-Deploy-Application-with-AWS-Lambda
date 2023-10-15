import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { getUserId } from '../utils.mjs'
import { getTodosForUserID } from '../../businessLogic/todos.mjs'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('getTodos')

export const handler = middy()
  .use(httpErrorHandler())
  .use(cors({
    credentials: true
  }))

  .handler(async (event) => {
    const userId = getUserId(event)
    logger.info(`
    Get todo:
      User ID: ${userId}
    `)

    const todos = await getTodosForUserID(userId)

    return {
      statusCode: 200,
      body: JSON.stringify ({
        items: todos
      })
    }
  })