import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { getUserId } from '../utils.mjs'
import { createTodo } from '../../businessLogic/todos.mjs'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('createTodo')

export const handler = middy () 
  .use(httpErrorHandler())
  .use(cors({
    credentials: true
  }))

  .handler(async (event) => {
    const newTodo = JSON.parse(event.body)

    const userId = getUserId(event)
    logger.info(`
    Create TODO: with context: 
      Data: ${newTodo}
      ID: ${userId}`)
    const newItem = await createTodo(newTodo, userId)
    logger.info(newItem)
    return {
      statusCode: 201,
      body: JSON.stringify({
        item: newItem
      })
    }
  })