import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import AWSXRay from 'aws-xray-sdk-core'
import { createLogger } from '../utils/logger.mjs'

const logger = createLogger('TodosAccess')

export class TodosAccess {
    constructor() {
      this.docClient = AWSXRay.captureAWSv3Client(new DynamoDB()),
      this.dynamoDbClient = DynamoDBDocument.from(this.docClient)
      this.todosTable = process.env.TODOS_TABLE
      this.todosIndex = process.env.TODOS_CREATED_AT_INDEX
    }

    async getTodos(userId) {
        logger.info(
            `Get all todos by: ${userId}`)

        const result = await this.dynamoDbClient
            .query({
                TableName: this.todosTable,
                IndexName: this.todosIndex,
                KeyConditionExpression: 'userId = :userId',
                ExpressionAttributeValues: {
                    ':userId': userId
                }
            })

        return result.Items
    }

    async createTodo(todoItem) {
        logger.info(`Create todo with data: ${todoItem}`)

        await this.dynamoDbClient
            .put({
                TableName: this.todosTable,
                Item: todoItem
            })

        return todoItem
    }

    async updateTodo(userId, todoId, updatedTodo) {
        logger.info(`Update todo with ID: ${todoId}`)

        await this.dynamoDbClient
            .update({
                TableName: this.todosTable,
                Key: {
                    todoId,
                    userId
                },
                UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
                ExpressionAttributeValues: {
                    ':name': updatedTodo.name,
                    ':dueDate': updatedTodo.dueDate,
                    ':done': updatedTodo.done
                },
                ExpressionAttributeNames: {
                    '#name': 'name'
                },
                ReturnValues: 'UPDATED_NEW'
            })

            return updatedTodo
    }

    async deleteTodo(todoId, userId) {
        logger.info(`Delete todo with ID: ${todoId}`)

        const result = await this.dynamoDbClient
            .delete({
                TableName: this.todosTable,
                Key: {
                    todoId,
                    userId
                },
            })

            return result
    }
}