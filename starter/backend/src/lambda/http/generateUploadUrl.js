import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { getUserId } from '../utils.mjs'
import { createAttachmentUrl } from '../../businessLogic/todos.mjs'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('generateUploadUrlLambda')

export const handler = middy()
  .use(httpErrorHandler())
  .use(cors({
    credentials: true
  }))

  .handler(async (event) => {
    const todoId = event.pathParameters.todoId
    logger.info(`
    Generate upload URL:
      Todo ID: ${todoId}
    `)

    const userId = getUserId(event)
    const url = await createAttachmentUrl(todoId, userId)

    return {
      statusCode: 201,
      body: JSON.stringify({
        upload: url
      })
    }
  })