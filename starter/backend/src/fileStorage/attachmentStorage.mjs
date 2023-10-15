import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const urlExpiration = 300
const s3Client = new S3Client()
const s3BucketName = process.env.ATTACHMENTS_S3_BUCKET

export function generateAttachmentUrl(todoId) {
    return `https://${s3BucketName}.s3.amazonaws.com/${todoId}`
}

export async function getUploadUrl(todoId) {
    const command = new PutObjectCommand({
        Bucket: s3BucketName,
        Key: todoId
    })

    const url = await getSignedUrl(s3Client, command, {
        expiresIn: urlExpiration
    })
    
    return url
}