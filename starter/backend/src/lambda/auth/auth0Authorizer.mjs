import Axios from 'axios'
import jsonwebtoken from 'jsonwebtoken'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('auth')

const jwksUrl = 'https://dev-y2is82fdiby7ew1v.us.auth0.com/.well-known/jwks.json'

export async function handler(event) {
  try {
    const jwtToken = await verifyToken(event.authorizationToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader) {
  logger.info('Token :', authHeader)
  const token = getToken(authHeader)
  const jwt = jsonwebtoken.decode(token, { complete: true })

  const tokenResponse = await Axios.get(jwksUrl)
  const keys = tokenResponse.data.keys
  const kid = keys.find(key => key.kid === jwt.header.kid)
  logger.info('Signning Keys', kid)

  if (!kid) {
    throw new Error('The JWKS endpoints did not contain any keys')
  }
  const encodeCert = kid.x5c
  const cert = `-----BEGIN CERTIFICATE-----\n${encodeCert}\n-----END CERTIFICATE-----`

  const veridToken = jsonwebtoken.verify(token, cert, { algorithms: ['RS256'] })
  return veridToken;
}

function getToken(authHeader) {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
